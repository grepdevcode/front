import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { map } from 'rxjs/operators';

import { data} from '../../../../assets/menu.js';
import { DetallePedido } from 'src/app/models/detalle-pedido';
import { ArticuloManufacturado } from 'src/app/models/articulo-manufacturado';
import { Articulo } from 'src/app/models/articulo';
import { ArticuloManufacturadoDetalle } from 'src/app/models/articulo-manufacturado-detalle';


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
    this.getArticulos();
    this.getArticulosManufacturados();
    this.loadCarrito();   
  }
  getArticulosManufacturados(){
    this.servicio.getProductos()
    .subscribe(data =>
      data.map(p =>{
        console.log(p);
        
        const nuevoProducto =new ArticuloManufacturado(p.id,p.tiempoEstimadoCocina,p.denominacion,p.precioVenta);
        nuevoProducto.linkImage= p.linkImage;
        this.productos.push( nuevoProducto);
        }
      )
    );
  }
  getArticulos(){
    this.servicio.getData("Articulo/0/0")
    .subscribe(data =>{
      data.filter(row => !row.esInsumo)
      .map(a =>{
        const nuevoArticulo =  new Articulo(
          a.id,
          a.denominacion,
          a.precioCompra,
          a.precioVenta,
          a.stockActual,
          a.unidadMedida,
          a.esInsumo,
          a.rubroArticuloId);
        nuevoArticulo.linkImage = a.linkImage;
        this.articulos.push(nuevoArticulo);
        }
        )
      }
      ) 
  }
  //agregar producto en el carrito
  addArticuloCarrito(articulo:Articulo){
    if(this.esRepetidoArticulo(articulo)){
      this.carrito.find(detalle => {if(detalle.articulo) { return detalle.articulo.id == articulo.id}}).cantidad += 1; 
    }else{
      let nuevoDetalle:DetallePedido = new DetallePedido( 1,articulo.precioVenta,articulo,null);
      this.carrito.push(nuevoDetalle);
    }
    this.getSubtotal();
    this.servicio.cambiarPedido(JSON.stringify(this.carrito));
  }
  addProductoCarrito(producto:ArticuloManufacturado){
    if(this.esRepetidoProducto(producto)){
      this.carrito.find(detalle =>{
        if(detalle.articuloManufacturado){
          return detalle.articuloManufacturado.id == producto.id
        }
      } ).cantidad += 1;
    }else{
    let nuevoDetalle:DetallePedido = new DetallePedido(1,producto.precioVenta,null,producto);
    this.carrito.push(nuevoDetalle);
    }
    this.getSubtotal()
    this.servicio.cambiarPedido(JSON.stringify(this.carrito));
  }
  esRepetidoArticulo(articulo:Articulo):boolean{
    return this.carrito.some(detalle =>{
      if(detalle.articulo){
        return detalle.articulo.id === articulo.id
      }
      return false
    } )
  }
  esRepetidoProducto(producto:ArticuloManufacturado):boolean{
    return this.carrito.some(detalle =>{
      if(detalle.articuloManufacturado){
        return detalle.articuloManufacturado.id === producto.id
      }
      return false
    });
  }
  getSubtotal(){
    this.carrito.forEach(detalle=>{
      if(detalle.articulo){
        detalle.subtotal= detalle.cantidad * detalle.articulo.precioVenta;
      }else if(detalle.articuloManufacturado) {
        detalle.subtotal= detalle.cantidad * detalle.articuloManufacturado.precioVenta;
      }
    })
    this.servicio.cambiarPedido(JSON.stringify(this.carrito));
  }
  loadCarrito(){
    this.servicio.currentPedido.subscribe(data => this.carrito = JSON.parse(data));
  }

}
