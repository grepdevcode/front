import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  contenidoCarrito = [];

  unidadcarrito= {
    nombre: 'Hamburguesa',
    precio: 150,
  }

  constructor() { }

  ngOnInit() {
    this.initCarrito();
  }

  initCarrito(){
    this.contenidoCarrito = JSON.parse( localStorage.getItem("carrito"));
  }

  getCantidad(event){
    console.log(event.target.value)
    this.unidadcarrito.cantidad = Number(event.target.value);
  }

  quitarProducto(nombre:string){
    if(this.contenidoCarrito !== null){
      this.contenidoCarrito.forEach((value,index,array)=>{
      if (value.nombre === nombre ){
        this.contenidoCarrito.splice(index,1);
        localStorage.setItem('carrito',JSON.stringify(this.contenidoCarrito));
        return;
      } 
      });
    }
    return;
  }

  precioTotal(){
    if(this.contenidoCarrito !== null){
      return  this.contenidoCarrito.reduce((acumulador,actual,index,array)=>{
        return acumulador + (actual.precio * actual.cantidad);
      });
    }
    return;
  }

}
