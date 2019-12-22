import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  productos=[];

  constructor(private servicio:ProductoService) { }

  ngOnInit() {
    this.loadProductos();
  }

  loadProductos(){
    this.servicio.getProductos().subscribe(data => this.productos = data);
  }

}
