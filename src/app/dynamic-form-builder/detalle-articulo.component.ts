import { Component, OnInit, Input } from '@angular/core';
import { DetallePedido } from '../models/detalle-pedido';
import { ArticuloManufacturadoDetalle } from '../models/articulo-manufacturado-detalle';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-detalle-articulo',
  template: `
  <div [formGroup]="parentForm">
      
      <div class="row" >
        <div class="col-sm-4">
          <select class="browser-default custom-select" formControlName="articulo">
            <option *ngFor="let item of Lista" value="{{item}}">{{item}}</option>              
          </select>
        </div>

        <div class="col-sm-1 mx-2">
          <p>cantidad</p>
        </div>
        <div class="col-sm-2 mx-2">
          <div class="form-group">
            <input formControlName="cantidad" type="number" class="form-control" id="cantidad" aria-describedby="cantidadhelp"> 
          </div>
        </div>
        <div class="col-sm-2 mx-2">
        <p>gramos</p>
        </div>
      </div>
      
  </div>
  `,
  styles: []
})
export class DetalleArticuloComponent implements OnInit {

  @Input() Lista:string[]=[];
  @Input() parentForm;
  formgroup;


  constructor() {
    this.formgroup = new FormGroup({
      articulo: new FormControl('',Validators.required),
      cantidad: new FormControl('',Validators.min(1))
    });
   }

  ngOnInit() {
  }

}
