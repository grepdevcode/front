import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';

import { CocinaRoutingModule } from './cocina-routing.module';
import { CocinaComponent } from './components/cocina/cocina.component';
import { CrearComponent } from '../helpers/crud/crear/crear.component';
@NgModule({
  declarations: [CocinaComponent, CrearComponent],
  imports: [
    CommonModule,
    CocinaRoutingModule,
    ReactiveFormsModule,
    NgbDropdownModule

  ]
})
export class CocinaModule { }
