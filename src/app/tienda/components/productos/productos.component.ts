import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { map } from 'rxjs/operators';

import { data} from '../../../../assets/menu.js';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos=JSON.parse(JSON.stringify( data));
  carrito = [];
  constructor(private servicio:ProductoService) { }

  ngOnInit() {
    this.loadProductos();
    this.loadCarrito();
  }

  loadProductos(){
    this.servicio.getProductos().subscribe(data => this.productos = data);
  }

  //agregar producto en el carrito
  cargarCarrito(producto){
      this.carrito.push(producto);
      this.servicio.cambiarPedido(JSON.stringify(this.carrito));
      console.log('--> al tocar boton agregar al carrito', this.carrito);  
  }

  loadCarrito(){
    this.servicio.currentPedido.subscribe(data => this.carrito = JSON.parse(data));
  }
}
