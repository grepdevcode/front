import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Articulo } from 'src/app/models/articulo';
import { ArticuloManufacturado } from 'src/app/models/articulo-manufacturado';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  @Input() unidad:Articulo|ArticuloManufacturado;
  @Output() carrito = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onCarrito(unidad){
    console.log(unidad);
    this.carrito.emit(unidad);
  }
}
