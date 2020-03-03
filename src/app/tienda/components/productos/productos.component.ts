import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { map } from 'rxjs/operators';

import { data} from '../../../../assets/menu.js';
import { DetallePedido } from 'src/app/models/detalle-pedido';
import { ArticuloManufacturado } from 'src/app/models/articulo-manufacturado';
import { Articulo } from 'src/app/models/articulo';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos:ArticuloManufacturado[]=[];
  articulos:Articulo[]=[];
  carrito:DetallePedido[] = [];
  
  constructor(private servicio:ProductoService) { }

  ngOnInit() {
    this.getArticulosManufacturados();
    this.getArticulos();
    this.loadCarrito();
  }
  getArticulosManufacturados(){
    this.servicio.getProductos().subscribe(data =>this.productos=data.map(p =>new ArticuloManufacturado(p.id,p.tiempoEstimadoCocina,p.denominacion,p.precioVenta)));
  }
  getArticulos(){
    this.servicio.getData("/articulos/")
    .subscribe(data =>this.articulos =  data.filter(x => !x.esInsumo).map(
      a => new Articulo(
        a.id,
        a.denominacion,
        a.precioCompra,
        a.precioVenta,
        a.stockActual,
        a.unidadMedida,
        a.esInsumo,
        a.rubroArticulo)))
  }
  //agregar producto en el carrito
  addArticuloCarrito(articulo:Articulo){
    if(this.esRepetidoArticulo(articulo)){
      this.carrito.map(detalle =>{
        if(detalle.articulo.id === articulo.id){
          detalle.cantidad+=1;
        }
      })
    }else{
    let nuevoDetalle:DetallePedido = new DetallePedido( 1,articulo.precioVenta,articulo,null);
    this.carrito.push(nuevoDetalle);
    }
    this.servicio.cambiarPedido(JSON.stringify(this.carrito));
  }
  addProductoCarrito(producto:ArticuloManufacturado){
    if(this.esRepetidoProducto(producto)){
      this.carrito.map(detalle => {
        if(detalle.articuloManufacturado.id === producto.id){
          detalle.cantidad+=1;
        }
      })
    }else{
    let nuevoDetalle:DetallePedido = new DetallePedido(1,producto.precioVenta,null,producto);
    this.carrito.push(nuevoDetalle);
    }
    this.servicio.cambiarPedido(JSON.stringify(this.carrito));
  }
  esRepetidoArticulo(articulo:Articulo):boolean{
    return this.carrito.some(detalle => detalle.articulo.id === articulo.id)
  }
  esRepetidoProducto(producto:ArticuloManufacturado):boolean{
    return this.carrito.some(detalle => detalle.articuloManufacturado.id === producto.id)
  }
  loadCarrito(){
    this.servicio.currentPedido.subscribe(data => this.carrito = JSON.parse(data));
  }
}
