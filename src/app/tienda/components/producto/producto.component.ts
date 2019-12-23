import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  @Input() unidad;
  @Output() carrito = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onCarrito(unidad){
    console.log(unidad);
    this.carrito.emit(unidad);
  }
}
