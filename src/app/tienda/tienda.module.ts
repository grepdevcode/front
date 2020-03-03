import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TiendaRoutingModule } from './tienda-routing.module';
import { ProductosComponent } from './components/productos/productos.component';
import { ProductoComponent } from './components/producto/producto.component';
import { HttpClientModule } from '@angular/common/http';
import { CarritoComponent } from './components/carrito/carrito.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProductosComponent, ProductoComponent, CarritoComponent],
  imports: [
    CommonModule,
    TiendaRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ]
})
export class TiendaModule { }
