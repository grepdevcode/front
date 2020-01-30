import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/models/pedido';

@Component({
  selector: 'app-cocina',
  templateUrl: './cocina.component.html',
  styleUrls: ['./cocina.component.css']
})
export class CocinaComponent implements OnInit {
  listaPedidos : Pedido[]=[];

  constructor() { }

  ngOnInit() {

  }

}
