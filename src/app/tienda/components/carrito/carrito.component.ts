import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import * as jsPDF from 'jspdf'

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  contenidoCarrito = [] ;

  precioFinal = 0;
 

  constructor(private servicio:ProductoService) { }

  ngOnInit() {
    this.initCarrito();
    
  }

  initCarrito(){
    this.servicio.currentPedido.subscribe(pedido => this.contenidoCarrito = JSON.parse(pedido));
    this.precioTotal();
  }

  getCantidad(event,index){
    this.contenidoCarrito[index].cantidad = Number(event.target.value);
    this.servicio.cambiarPedido(JSON.stringify(this.contenidoCarrito));
    this.precioTotal();
    console.log('--> al cambiar la cantidad',this.contenidoCarrito);
  }

  quitarProducto(nombre:string){
    if(this.contenidoCarrito !== null){
      this.contenidoCarrito.forEach((value,index,array)=>{
      if (value.nombre === nombre ){
        this.contenidoCarrito.splice(index,1);
        this.servicio.cambiarPedido(JSON.stringify(this.contenidoCarrito));
        this.precioTotal();
        return;
      } 
      });
    }
    return;
  }

  precioTotal(){
    if(this.contenidoCarrito !== null){
      this.precioFinal = this.contenidoCarrito.reduce(function (acc, obj) { return acc + obj.precio*obj.cantidad; }, 0); // 7
      /* console.log(this.precioFinal); */
    }
  }

  generarTexto(){
    let texto:string='';
    this.contenidoCarrito.forEach((item,index)=> {
      texto+=`\n\t -${item.nombre}\t-${item.cantidad}\t-${item.precio}`
    });
    texto+='\n El total a pagar es:'+ this.precioFinal;
    return texto;
  }

  realizarPedido(){
    var doc = new jsPDF();
    doc.text('Gracias por comprar en el Buen Sabor!', 10, 10);
    doc.text('El pedido --> id del pedido, ya esta siendo elaborado',10,20);
    doc.text('Su comida sera enviada/retirada en --> tiempo estimado en minutos',10,30);
    doc.text('Pedidos del cliente --> id del cliente',10,40);
    doc.text(this.generarTexto(),10,50);
    
   
    doc.output('dataurlnewwindow');
  }

}
