import { Component, OnInit } from '@angular/core';
import { ArticuloManufacturado } from 'src/app/models/articulo-manufacturado';
import { Articulo } from 'src/app/models/articulo';

@Component({
  selector: 'app-admin-productos',
  templateUrl: './admin-productos.component.html',
  styleUrls: ['./admin-productos.component.css']
})
export class AdminProductosComponent implements OnInit {

  listaArtManufac: ArticuloManufacturado[]=[];
  listaArticulo:Articulo[]=[];

  constructor() { }

  ngOnInit() {
  }

  

}
