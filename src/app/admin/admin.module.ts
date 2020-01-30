import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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

@NgModule({
  declarations: [StockComponent, FacturacionComponent, AdminProductosComponent, ReportesComponent, LinechartComponent, BarchartComponent, DashboardComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ChartsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
