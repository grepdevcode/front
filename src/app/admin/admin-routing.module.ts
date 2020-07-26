import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockComponent } from './components/stock/stock.component';
import { FacturacionComponent } from './components/facturacion/facturacion.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { AdminProductosComponent } from './components/admin-productos/admin-productos.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NuevoArticuloComponent } from './components/stock/nuevo-articulo.component';
import { NuevoArtManComponent } from './components/admin-productos/nuevo-art-man.component';
import { EditarArticuloComponent } from './components/stock/editar-articulo.component';
import { EditarComponent } from './components/admin-productos/editar.component';
import { RubroComponent } from './components/rubro.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { EditarClienteComponent } from './components/clientes/editar-cliente.component';
import { PedidosComponent } from './components/facturacion/pedidos.component';


const routes: Routes = [
      {
        path:'',
        component:DashboardComponent,
        children:[
          { 
            path:'stock',children:[
              {path: '', component: StockComponent,pathMatch:'full', outlet:'dashoutlet'}
            ] 
          },
          {
            path:'stock/nuevo', children:[
              {path:'', component: NuevoArticuloComponent,pathMatch:'full', outlet:'dashoutlet'}
            ]
          },
          {
            path:'stock/edit/:id', children:[
              {path:'',component:EditarArticuloComponent,pathMatch:'full', outlet:'dashoutlet'}
            ]
          },
          {
            path:'facturacion', children:[
             { path: '',component: FacturacionComponent,pathMatch:'full', outlet:'dashoutlet'}
            ] 
          },
          {
            path:'reportes', children:[
              { path: '',component: ReportesComponent,pathMatch:'full', outlet:'dashoutlet'}
            ]
          },
          {
            path:'productos', children:[
              {path:'', component: AdminProductosComponent,pathMatch:'full', outlet:'dashoutlet'}
            ]
          },
          {
            path:'productos/nuevo', children:[
              {path:'', component: NuevoArtManComponent,pathMatch:'full', outlet:'dashoutlet'}
            ]
          },
          {
            path:'productos/editmanufacturado/:id', children:[
              {path:'', component: EditarComponent,pathMatch:'full', outlet:'dashoutlet'}
            ]
          },
          {
            path:'rubro', children:[
              {path:'', component: RubroComponent,pathMatch:'full', outlet:'dashoutlet'}
            ]
          },
          {
            path:'cliente', children:[
              {path:'', component:ClientesComponent,pathMatch:'full', outlet:'dashoutlet'}
            ]
          },
          {
            path:'cliente/edit/:id', children:[
              {path:'', component:EditarClienteComponent,pathMatch:'full', outlet:'dashoutlet'}
            ]
          },
          {
            path:'pedidos', children:[
              {path:'', component:PedidosComponent,pathMatch:'full', outlet:'dashoutlet'}
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
