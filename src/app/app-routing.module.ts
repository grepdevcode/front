import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthRoles } from './auth/auth-roles.enum';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path:'', component:HomeComponent
  },
  {
    path:'ingreso',
    loadChildren:'./auth/auth.module#AuthModule'
  },
  {
    path:'tienda',
    loadChildren:'./tienda/tienda.module#TiendaModule',
    canLoad:[AuthGuard]
  },
  {
    path:'cliente',
    loadChildren:'./cliente/cliente.module#ClienteModule',
    canLoad: [AuthGuard],
    data: { expectedRol: AuthRoles.rolCliente}
  },
  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule',
    canLoad: [AuthGuard],
    data: { expectedRol: AuthRoles.rolAdmin}
  },
  {
    path: "cocina",
    loadChildren: './cocina/cocina.module#CocinaModule',
    canLoad: [AuthGuard],
    data: { expectedRol: AuthRoles.rolCocina}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
