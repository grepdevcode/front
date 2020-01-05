import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockComponent } from './components/stock/stock.component';
import { FacturacionComponent } from './components/facturacion/facturacion.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { AdminProductosComponent } from './components/admin-productos/admin-productos.component';

const routes: Routes = [
  {
    path:'stock', component: StockComponent
  },
  {
    path:'facturacion', component: FacturacionComponent
  },
  {
    path:'reportes', component: ReportesComponent
  },
  {
    path:'productos', component: AdminProductosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
