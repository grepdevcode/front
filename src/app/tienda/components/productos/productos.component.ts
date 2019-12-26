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
  }

  loadProductos(){
    this.servicio.getProductos().subscribe(data => this.productos = data);
  }

  //agregar producto en el carrito
  cargarCarrito(producto){
    console.log(producto)
    if (typeof(Storage) !== "undefined") {
      // LocalStorage disponible
      this.carrito.push(producto);
      localStorage.setItem("carrito", JSON.stringify(this.carrito));
      console.log(this.carrito);
    } else {
        // LocalStorage no soportado en este navegador
        console.log('intenta utilizar un navegador compatible o actualizar el actual');
    }
  
  }
}
