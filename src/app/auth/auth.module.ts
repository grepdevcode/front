import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AuthRoutingModule } from './auth-routing.module';
import { IngresoComponent } from './components/ingreso/ingreso.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RecuperarPasswordComponent } from './components/recuperar-password/recuperar-password.component';
import { UpdatePasswordComponent } from './components/update-password/update-password.component';


@NgModule({
  declarations: [IngresoComponent, RegistroComponent, RecuperarPasswordComponent, UpdatePasswordComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AuthModule { }
