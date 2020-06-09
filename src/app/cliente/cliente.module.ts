import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClienteRoutingModule } from './cliente-routing.module';
import { PerfilComponent } from './components/perfil/perfil.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [PerfilComponent, PedidosComponent],
  imports: [
    CommonModule,
    ClienteRoutingModule,
    FormsModule,
    
  ]
})
export class ClienteModule { }
