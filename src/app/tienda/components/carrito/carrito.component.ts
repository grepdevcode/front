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
    if(!this.checkhorarioHabilitado){
      const time = this.TimeGroup.controls["timepicker"].value;
      let fecha = new Date();
      fecha.setHours(time.hours,time.minute);
      return fecha;
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
    console.log('realizando pedido')
    let listaDetalles= [];
    const fecha = new  Date();
    const pedido= new Pedido(fecha,1,this.getHoraEstimada(fecha),this.getTipoEnvio(),this.getIdCliente()); 
    // array detalles
    this.arrayDetalles.forEach(element => {
      if(element.articuloManufacturado){
        listaDetalles.push(
       {
         cantidad: element.cantidad,
         subtotal: element.subtotal,
         articuloManufacturadoId: element.articuloManufacturado.id,
        articuloId: 0,
      facturaId: 0})

      }else if(element.articulo){
        listaDetalles.push( {
          cantidad: element.cantidad,
          subtotal: element.subtotal,
          articuloManufacturadoId: 0,
         articuloId: element.articulo.id,
         facturaId:0
      })
    }});
    //objeto con pedido  y detalles
    const envio = { pedido:pedido, detallePedido: listaDetalles};
    // post de envio
    this.servicio.postObservable("Pedido",envio).subscribe(x => console.log(x));
    // El pedido va a la cocina y cuando está listo se informa al que lo tomó para que se
    //genere la factura correspondiente y se le entregue el pedido al cliente.
  }
  checkhorarioHabilitado(time:Date){
    const hora = time.getUTCHours();
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

}
