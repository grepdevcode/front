import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerfilComponent } from './components/perfil/perfil.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';

const routes: Routes = [
  {
    path:'perfil', component:PerfilComponent
  },
  {
    path:'pedidos', component:PedidosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRoutingModule { }
