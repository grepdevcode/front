import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path:'ingreso',
    loadChildren:'./auth/auth.module#AuthModule'
  },
  {
    path:'tienda',
    loadChildren:'./tienda/tienda.module#TiendaModule'
  },
  {
    path:'cliente',
    loadChildren:'./cliente/cliente.module#ClienteModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule'
  },
  {
    path: 'cocina',
    loadChildren: './cocina/cocina.module#CocinaModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
