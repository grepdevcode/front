import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  contenidoCarrito = [
    /* {
      nombre: 'Hamburguesa',
      precio: 150,
      cantidad: 1
    },
    {
      nombre: 'Pizza',
      precio: 350,
      cantidad: 1
    },
    {
      nombre: 'Lomo',
      precio: 170,
      cantidad: 1
    } */
  ] ;

  precioFinal = 0;
 

  constructor() { }

  ngOnInit() {
    this.initCarrito();
    
  }

  initCarrito(){
    this.contenidoCarrito = JSON.parse( localStorage.getItem("carrito"));
    this.precioTotal();
  }

  getCantidad(event,index){
    /* console.log(event.target.value)
    console.log('index'+ index) */
    this.contenidoCarrito[index].cantidad = Number(event.target.value);
    localStorage.setItem("carrito", JSON.stringify(this.contenidoCarrito));
    this.precioTotal();
  }

  quitarProducto(nombre:string){
    if(this.contenidoCarrito !== null){
      this.contenidoCarrito.forEach((value,index,array)=>{
      if (value.nombre === nombre ){
        this.contenidoCarrito.splice(index,1);
        localStorage.setItem('carrito',JSON.stringify(this.contenidoCarrito));
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
