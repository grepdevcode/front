import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { map } from 'rxjs/operators';

import { data} from '../../../../assets/menu.js';
import { DetallePedido } from 'src/app/models/detalle-pedido';
import { ArticuloManufacturado } from 'src/app/models/articulo-manufacturado';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos=[];// JSON.parse(JSON.stringify( data));
  carrito = [];
  constructor(private servicio:ProductoService) { }

  ngOnInit() {
    this.loadProductos();
    this.loadCarrito();

  }

  loadProductos(){
    this.servicio.getProductos().subscribe(data => this.productos=data);
  }

  //agregar producto en el carrito
  cargarCarrito(producto){
    if(this.carrito.some(elem => elem.producto.denominacion == producto.denominacion)){
      console.log('repetido');
      this.carrito.map(elem => {
        if(elem.producto.denominacion === producto.denominacion){
          console.log(elem.cantidad);
          elem.cantidad+=1;
        }
    })
    }else{
      const detalle= new DetallePedido ()
      
        // detalle.cantidad:1,
        // detalle.subtotal: producto.precioVenta,
        // detalle.articuloManufacturado: new ArticuloManufacturado({producto})
     
      this.carrito.push(detalle);
    }
      this.servicio.cambiarPedido(JSON.stringify(this.carrito));
      console.log('--> al tocar boton agregar al carrito', this.carrito);  
  }

  loadCarrito(){
    this.servicio.currentPedido.subscribe(data => this.carrito = JSON.parse(data));
  }
}
