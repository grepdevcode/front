import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import * as jsPDF from 'jspdf'
import { Pedido } from 'src/app/models/pedido';
import { Cliente } from 'src/app/models/cliente';
import { Factura } from 'src/app/models/factura';
import { DetallePedido } from 'src/app/models/detalle-pedido';
import { ArticuloManufacturado } from 'src/app/models/articulo-manufacturado';
import { Articulo } from 'src/app/models/articulo';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  arrayDetalles:DetallePedido[]= [] ;
  formCarrito:FormGroup;

  constructor(private servicio:ProductoService,private formBuilder:FormBuilder,private auth: AuthService) {
    this.formCarrito= this.formBuilder.group({
      detalles:this.formBuilder.array([]),
      radioDelivery: this.formBuilder.group({
        delivery:['1',Validators.required]
      })
    });
   }

  ngOnInit() {
    this.initCarrito();
    this.precioTotal();
    this.initForm();
  }
  initForm(){
    const array = this.formCarrito.get('detalles') as FormArray;
     this.arrayDetalles.forEach(x=>{
       array.controls.push(new FormControl(x.cantidad,[Validators.required,Validators.min(1)]))
     });
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
      if(detalle.articulo.toString().length > 0){
        detalle.subtotal= detalle.cantidad * detalle.articulo.precioVenta;
      }else if(detalle.articuloManufacturado.toString().length > 0) {
        detalle.subtotal= detalle.cantidad * detalle.articuloManufacturado.precioVenta;
      }
    })
    this.servicio.cambiarPedido(JSON.stringify(this.arrayDetalles));
  }
  quitarProducto(index){
    let array =this.formCarrito.get('detalles') as FormArray;
    array.removeAt(index);
  }
  precioTotal(){
    if(this.arrayDetalles !== null){
      return this.arrayDetalles.reduce(function (acc, obj) { return acc + obj.subtotal; }, 0); // 7
      /* console.log(this.precioFinal); */
    }
  }
  getHoraEstimada(){
  let tiempo = this.arrayDetalles
  .reduce((prev,curr)=>{
    return prev + curr.articuloManufacturado.tiempoEstimadoCocina
  },0);
  let fechafinal= new Date();
  fechafinal.setMinutes(fechafinal.getMinutes() + tiempo)
  return fechafinal;
  }
  getTipoEnvio(){
    return this.formCarrito.get('radioDelivery').value;
  }
  getDescuento(){
    return (this.getTipoEnvio()==1)? this.precioTotal() * 0.10 : 0;
  }
/// IGNORAR
  generarTexto(){
    let texto:string='';
    this.arrayDetalles.forEach((detalle,index)=> {
      if(detalle.articulo instanceof Articulo){
        texto+=`\n\t -${detalle.articulo.id}\t-${detalle.articulo.denominacion}\t-${detalle.cantidad}\t-${detalle.subtotal}`
      }else if(detalle.articuloManufacturado instanceof ArticuloManufacturado){
        texto+=`\n\t -${detalle.articuloManufacturado.id}\t-${detalle.articuloManufacturado.denominacion}\t-${detalle.cantidad}\t-${detalle.subtotal}`
      }
    });
    texto+='\n El total a pagar es:'+ this.precioTotal();
    return texto;
  }

  generarComprobantePedido(){
    var doc = new jsPDF();
    doc.text('Gracias por comprar en el Buen Sabor!', 10, 10);
    doc.text('El pedido --> id del pedido, ya esta siendo elaborado',10,20);
    doc.text(`Su comida estara lista a las -->${this.getHoraEstimada()}`,10,30);
    doc.text('Pedidos del cliente --> id del cliente',10,40);
    doc.text(this.generarTexto(),10,50);
    doc.output('dataurlnewwindow');
  }

  realizarPedido(){
    console.log('realizando pedido')
    console.log(this.formCarrito);
    //const pedido= new Pedido(new Date(),2,this.getHoraEstimada(),this.getTipoEnvio(),this.getCliente());
    //const factura = new Factura(new Date(),getNumeroFactura(),this.getDescuento(),this.precioTotal(),getIdPedido());

  }
}
