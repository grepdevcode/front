import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TiendaRoutingModule } from './tienda-routing.module';
import { ProductosComponent } from './components/productos/productos.component';
import { ProductoComponent } from './components/producto/producto.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [ProductosComponent, ProductoComponent],
  imports: [
    CommonModule,
    TiendaRoutingModule,
    HttpClientModule
  ]
})
export class TiendaModule { }
