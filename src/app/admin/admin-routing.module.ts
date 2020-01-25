import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockComponent } from './components/stock/stock.component';
import { FacturacionComponent } from './components/facturacion/facturacion.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { AdminProductosComponent } from './components/admin-productos/admin-productos.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
      {
        path:'',
        component:DashboardComponent,
        children:[
          { 
            path:'stock',children:[
              {path: '', component: StockComponent, outlet:'dashoutlet'}
            ] 
          },
          {
            path:'facturacion', children:[
             { path: '',component: FacturacionComponent, outlet:'dashoutlet'}
            ] 
          },
          {
            path:'reportes', children:[
              { path: '',component: ReportesComponent, outlet:'dashoutlet'}
            ]
          },
          {
            path:'productos', children:[
              {path:'', component: AdminProductosComponent, outlet:'dashoutlet'}
            ]
          }

        ]
      },
      
    ]
  ;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
