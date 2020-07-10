import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';

import { Pedido } from 'src/app/models/pedido';
import { Cliente } from 'src/app/models/cliente';
import { Factura } from 'src/app/models/factura';
import { DetallePedido } from 'src/app/models/detalle-pedido';
import { ArticuloManufacturado } from 'src/app/models/articulo-manufacturado';
import { Articulo } from 'src/app/models/articulo';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { AuthService, IAuthStatus } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { ArticuloManufacturadoDetalle } from 'src/app/models/articulo-manufacturado-detalle';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  arrayDetalles:DetallePedido[]= [] ;
  formCarrito:FormGroup;
  TimeGroup:FormGroup; 
  HorarioHabilitado:boolean;
  protected currentAuthStatus:IAuthStatus;
  listaArticulos: Articulo[]=[];
  DetallesArtMan: ArticuloManufacturadoDetalle[]=[];

  constructor(private servicio:ProductoService,private formBuilder:FormBuilder,private auth: AuthService, private route:Router) {
    this.formCarrito= this.formBuilder.group({
      detalles:this.formBuilder.array([],Validators.required),
      radioDelivery: this.formBuilder.group({
        delivery:['1',Validators.required]
      })
    });
    this.TimeGroup = this.formBuilder.group({timepicker:this.formBuilder.control('',null)})
   }

  ngOnInit() {
    this.initCarrito();
    this.precioTotal();
    this.initForm();
    this.HorarioHabilitado = this.checkhorarioHabilitado(new Date())
    this.TimeGroup.controls["timepicker"].setValue({hour:22,minute:0})
    this.getArticulos();
    this.getDetallesArtMan();
  }

  initForm(){
    const array = this.formCarrito.get('detalles') as FormArray;
     this.arrayDetalles.forEach(x=>{
       array.controls.push(new FormControl(x.cantidad,[Validators.required,Validators.min(1)]))
     });
     console.log("array",array);
     
  }
  initCarrito(){
    this.servicio.currentPedido.subscribe(pedido => this.arrayDetalles = JSON.parse(pedido));
  }
  getDetallesArtMan(){
    this.servicio.getData("ArticuloManufacturadoDetalle").pipe(map(list =>{return this.DetallesArtMan = list}));
  }
  getArticulos(){
    this.servicio.getData("Articulo/0/0").pipe(map(list =>{return this.listaArticulos = list}));
  }
  getCantidad(event,index){
    this.arrayDetalles[index].cantidad = Number(event.target.value);
    this.getSubtotal();
    this.servicio.cambiarPedido(JSON.stringify(this.arrayDetalles));
    this.precioTotal();
    console.log('--> al cambiar la cantidad',this.arrayDetalles);
  }
  getSubtotal(){
    this.arrayDetalles.forEach(detalle=>{
      if(detalle.articulo){
        detalle.subtotal= detalle.cantidad * detalle.articulo.precioVenta;
      }else if(detalle.articuloManufacturado) {
        detalle.subtotal= detalle.cantidad * detalle.articuloManufacturado.precioVenta;
      }
    })
    this.servicio.cambiarPedido(JSON.stringify(this.arrayDetalles));
  }
  quitarProducto(index){
    let array =this.formCarrito.get('detalles') as FormArray;
    array.removeAt(index);
    this.arrayDetalles.splice(index,1);
    this.servicio.cambiarPedido(JSON.stringify(this.arrayDetalles));
  }
  precioTotal(){
    if(this.arrayDetalles !== null){
      return this.arrayDetalles.reduce(function (acc, obj) { return acc + obj.subtotal ; }, 0); // 7
    }
  }
  getDemora(valorInicial:number){
    this.arrayDetalles.forEach(element => {
      if(element.articuloManufacturado){
        valorInicial += element.articuloManufacturado.tiempoEstimadoCocina;
      }
    });
    return valorInicial;
  }
  getHoraEstimada(date:Date){
    if(!this.checkhorarioHabilitado(date)){
      const time = this.TimeGroup.controls["timepicker"].value;
      let fecha = new Date();
      fecha.setHours(time.hour,time.minute);
      const isoDate = `${fecha.getFullYear()}-${('0' + (fecha.getMonth()+1)).slice(-2) }-${('0'+fecha.getDate()).slice(-2)}T${('0'+time.hour).slice(-2)}:${('0'+time.minute).slice(-2)}:00`
      console.log(isoDate);
      "2020-06-10T12:10:48.000Z"
      return isoDate;
    }
    let fechafinal= new Date(date.getTime() + this.getDemora(0) * 60000);
    return fechafinal;
  }
  getTipoEnvio(){
    let c = this.formCarrito.get('radioDelivery').value;
    return Number(c.delivery);
  }
  getDescuento(){
    return (this.getTipoEnvio()==1)? this.precioTotal() * 0.10 : 0;
  }
  getIdCliente(){
    return this.auth.getIdUsuario()
  }
  realizarPedido(){
    
    if(this.getIdCliente() == null){
      alert("Debes ingresar para realizar el pedido");
      this.route.navigate(["ingreso"]);
      return false
    }
    this.arrayDetalles.forEach(item => {
      if(!this.checkStock(item)){
        alert("Por el momento no contamos con el stock suficiente para satisfacer este pedido.")
        return false
      }
    })

    let estadoTentativo=1;
    if(! this.tieneArticulosManufacturados()){
      estadoTentativo =3;
    }

    console.log('realizando pedido')
    let listaDetalles= [];
    const fecha = new  Date();
    const horaestimada =this.getHoraEstimada(fecha);
    const pedido= {fecha:fecha.toISOString(),estado:estadoTentativo,horaEstimadaFin:horaestimada, tipoEnvio:this.getTipoEnvio(),clienteId:this.getIdCliente()}; 
    // array detalles
  console.log('arraydetalles',this.arrayDetalles);
  
    this.arrayDetalles.forEach(element => {
      if(element.articuloManufacturado){
        listaDetalles.push(
       {
         cantidad: element.cantidad,
         subtotal: element.subtotal,
         articuloManufacturadoId: element.articuloManufacturado.id,
        articuloId: null,
      facturaId: null})

      }else if(element.articulo){
        listaDetalles.push( {
          cantidad: element.cantidad,
          subtotal: element.subtotal,
          articuloManufacturadoId: null,
         articuloId: element.articulo.id,
         facturaId:null
      })
    }});
    //objeto con pedido  y detalles
    const envio = { pedido:pedido, detallePedido: listaDetalles};
    console.log(envio);
    // post de envio
    
    this.servicio.postObservable("Pedido",envio).subscribe(x =>{
      console.log(x);
      envio.detallePedido.forEach(item =>{
        this.descontarStock(item);
      })
      this.arrayDetalles =[];
      this.servicio.cambiarPedido(JSON.stringify(this.arrayDetalles));
      this.route.navigate(["cliente","pedidos"])
    });
    
    // El pedido va a la cocina y cuando está listo se informa al que lo tomó para que se
    //genere la factura correspondiente y se le entregue el pedido al cliente.
  }
  checkhorarioHabilitado(time:Date){
    const hora = time.getHours();
    const dia = time.getDay();
    if(hora >= 20 && hora != 0 ){
      return true;
    }else if(dia > 5 && hora >= 11 && hora <=15){
      return true;
    }
    return false;
  }
  checkTimePicker(){
    const dia = new Date().getDay();
    const tiempo = this.TimeGroup.controls["timepicker"].value
    let tiempoDemora = this.formatoDemora(this.getDemora(0));
    const minimo = {hour:(11+ tiempoDemora["hour"]),minute:(0+tiempoDemora["minute"])};
    const maximo = {hour:(20+ tiempoDemora["hour"]),minute:(0+tiempoDemora["minute"])};
    if(dia > 5){
      if(tiempo.hour <  11){
        this.TimeGroup.controls["timepicker"].setValue( {hour:11,minute:0} )
      } else if(tiempo.hour < 20 && tiempo.hour > 15){
        this.TimeGroup.controls["timepicker"].setValue({hour:20,minute:0})
      }
    }else if(tiempo.hour < 20){
      this.TimeGroup.controls["timepicker"].setValue({hour:20,minute:0})
    }
  }
  formatoDemora(valorDemora){
    let tiempo={};
    if(valorDemora > 60){
      tiempo["hour"] = Math.floor( valorDemora / 60);
      tiempo["minute"] = valorDemora % 60;
      return tiempo
    }
    return {hour: 0,minute:valorDemora}
  }
  checkStockArticulo(detalle:DetallePedido){
    return detalle.articulo.stockActual >= detalle.cantidad
  }
  checkStockManufacturado(detalle:DetallePedido){
    const arrayDetalles = this.getDetallesPorArtMan(detalle.articuloManufacturado.id).sort((a,b)=> a.articuloId - b.articuloId);
    const arrayArticulos = this.getArticulosPorDetalles(arrayDetalles).sort((a,b)=> a.id - b.id);
    arrayArticulos.forEach((art,index)=>{
      let condicion = this.detalleEsValido(art, arrayDetalles[index].cantidad, detalle.cantidad);
      if(!condicion){
        return false;
      }
    });
    return true;
  }
  getDetallesPorArtMan(id){
    return this.DetallesArtMan.filter(item => item.articuloManufacturadoId == id);
  }
  getArticulosPorDetalles(arraydetalles: ArticuloManufacturadoDetalle[]){
    return arraydetalles.map(item=>{
     return this.listaArticulos.find(art=> art.id== item.articuloId)
    });
  }
  detalleEsValido(articulo:Articulo, cantManufacturado:number, cantDetalle:number){
    return (articulo.stockActual < cantManufacturado * cantDetalle)?false:true;
  }
  checkStock(detalle:DetallePedido){
    if(detalle.articulo){
      return this.checkStockArticulo(detalle);
    }else if(detalle.articuloManufacturado){
      return this.checkStockManufacturado(detalle);
    }
  }
  isLoaded(){
    const a = this.listaArticulos.length > 0;
    const b = this.DetallesArtMan.length > 0;
    const c = this.arrayDetalles.length > 0;
    return a && b && c;
  }
  descontarStockArticulo(detallePedido:DetallePedido){
    if(detallePedido.articulo){
      detallePedido.articulo.stockActual -= detallePedido.cantidad;
      this.servicio.putData("Articulo", detallePedido.articulo).subscribe(item => this.getArticulos());
    }
  }
  descontarStockArticuloManufacturado(detallePedido:DetallePedido){
    if(detallePedido.articuloManufacturado){
      const arrayDetalles = this.getDetallesPorArtMan(detallePedido.articuloManufacturado.id).sort((a,b)=> a.articuloId - b.articuloId);
      const arrayArticulos = this.getArticulosPorDetalles(arrayDetalles).sort((a,b)=>a.id -b.id);
      arrayArticulos.forEach((item,index)=>{
        item.stockActual -= arrayDetalles[index].cantidad * detallePedido.cantidad;
        this.servicio.putData("Articulo",item).pipe(map(item=> this.getArticulos()))
      })
    }
  }
  descontarStock(detallePedido:DetallePedido){
    if(detallePedido.articulo){
      this.descontarStockArticulo(detallePedido);
    }else if(detallePedido.articuloManufacturado){
      this.descontarStockArticuloManufacturado(detallePedido);
    }
  }
  tieneArticulosManufacturados(){
    const manufacturado = (element) => element.articuloManufacturado != null;
    return this.arrayDetalles.some(item => manufacturado(item));
  }
}
