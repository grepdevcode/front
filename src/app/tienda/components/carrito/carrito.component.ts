import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import * as jsPDF from 'jspdf'
import { Pedido } from 'src/app/interfaces/pedido';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  arrayDetalles= [] ;


  constructor(private servicio:ProductoService) { }

  ngOnInit() {
    this.initCarrito();
    this.precioTotal();
  }

  initCarrito(){
    this.servicio.currentPedido.subscribe(pedido => this.arrayDetalles = JSON.parse(pedido));
  }

  getCantidad(event,index){
    this.arrayDetalles[index].cantidad = Number(event.target.value);
    this.arrayDetalles[index].subtotal = Number(event.target.value) * this.arrayDetalles[index].producto.precioVenta;
    this.servicio.cambiarPedido(JSON.stringify(this.arrayDetalles));
    this.precioTotal();
    console.log('--> al cambiar la cantidad',this.arrayDetalles);
  }

  quitarProducto(nombre:string){
    if(this.arrayDetalles !== null){
      this.arrayDetalles.forEach((value,index,array)=>{
      if (value.producto.denominacion === nombre ){
        this.arrayDetalles.splice(index,1);
        this.servicio.cambiarPedido(JSON.stringify(this.arrayDetalles));
        this.precioTotal();
        return;
      } 
      });
    }
    return;
  }

  precioTotal(){
    if(this.arrayDetalles !== null){
      return this.arrayDetalles.reduce(function (acc, obj) { return acc + obj.subtotal; }, 0); // 7
      /* console.log(this.precioFinal); */
    }
  }

  generarTexto(){
    let texto:string='';
    this.arrayDetalles.forEach((item,index)=> {
      texto+=`\n\t -${item.producto.nombre}\t-${item.cantidad}\t-${item.producto.precio}`
    });
    texto+='\n El total a pagar es:'+ this.precioTotal();
    return texto;
  }

  generarComprobantePedido(){
    var doc = new jsPDF();
    doc.text('Gracias por comprar en el Buen Sabor!', 10, 10);
    doc.text('El pedido --> id del pedido, ya esta siendo elaborado',10,20);
    doc.text('Su comida sera enviada/retirada en --> tiempo estimado en minutos',10,30);
    doc.text('Pedidos del cliente --> id del cliente',10,40);
    doc.text(this.generarTexto(),10,50);
    
   
    doc.output('dataurlnewwindow');
  }

  DateNowtoInt(){
    let fecha = new Date(Date.now());
    let numero = fecha.getDay()+ '' + fecha.getMonth() + '' + fecha.getUTCFullYear();
    return Number(numero);
  }

  realizarPedido(){
    console.log('realizando pedido')
    const pedido:Pedido ={
      fecha: this.DateNowtoInt(),
      numero: 1,
      estado: 1,
      horaEstimadaFin: new Date(Date.now()),
      tipoEnvio: 1,
      detalles:this.arrayDetalles
      }
    this.servicio.postPedido(pedido);
  }
}
