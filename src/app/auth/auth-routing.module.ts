import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IngresoComponent } from './components/ingreso/ingreso.component';
import { RegistroComponent } from './components/registro/registro.component';
import { RecuperarPasswordComponent } from './components/recuperar-password/recuperar-password.component';
import { UpdatePasswordComponent } from './components/update-password/update-password.component';

const routes: Routes = [
{path:'',component:IngresoComponent,pathMatch:'full'},
{path:'registrarse',component:RegistroComponent},
{path:'login', component:IngresoComponent},
{path:'recuperarpassword', component:RecuperarPasswordComponent},
{path:'cambiarpassword', component:UpdatePasswordComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
