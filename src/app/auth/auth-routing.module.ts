import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IngresoComponent } from './components/ingreso/ingreso.component';
import { RegistroComponent } from './components/registro/registro.component';

const routes: Routes = [
{path:'',component:IngresoComponent},
{path:'registrarse',component:RegistroComponent},
{path:'login', component:IngresoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
