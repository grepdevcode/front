import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';

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



}
