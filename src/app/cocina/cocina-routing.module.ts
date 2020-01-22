import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CocinaComponent } from './components/cocina/cocina.component';

const routes: Routes = [
  {
    path: 'pedidos',
    component: CocinaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CocinaRoutingModule { }
