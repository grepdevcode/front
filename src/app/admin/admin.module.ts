import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { AdminRoutingModule } from './admin-routing.module';
import { StockComponent } from './components/stock/stock.component';
import { FacturacionComponent } from './components/facturacion/facturacion.component';
import { AdminProductosComponent } from './components/admin-productos/admin-productos.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { LinechartComponent } from './components/charts/linechart/linechart.component';
import { BarchartComponent } from './components/charts/barchart/barchart.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { ReactiveFormsModule } from '@angular/forms';

import { DynamicFormBuilderModule } from '../dynamic-form-builder/dynamic-form-builder.module';
import { NuevoArticuloComponent } from './components/stock/nuevo-articulo.component';
import { NuevoArtManComponent } from './components/admin-productos/nuevo-art-man.component';

@NgModule({
  declarations:
   [StockComponent,
     FacturacionComponent,
      AdminProductosComponent,
       ReportesComponent,
        LinechartComponent,
         BarchartComponent,
          DashboardComponent,
           NuevoArticuloComponent,
           NuevoArtManComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ChartsModule,
    ReactiveFormsModule,
    DynamicFormBuilderModule
  ]
})
export class AdminModule { }
