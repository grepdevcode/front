import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  
  cantidad: number = 4;
  constructor() { }

  ngOnInit() {
  }

  modificarStock(){
    let nuevaCantidad = Number(window.prompt('Ingrese la cantidad: '));
    this.cantidad = nuevaCantidad;
  }

}
