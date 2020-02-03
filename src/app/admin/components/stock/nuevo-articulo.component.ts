import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-nuevo-articulo',
  template: `
  <div class="col-sm-7 offset-sm-2">
  <p class="h2"> </p>
<div class="card">
  <div class="card-header">Nuevo articulo</div>
  <div class="card-body">
    <dynamic-form-builder [fields]="getFields()"></dynamic-form-builder>
  </div>
</div>
</div>
  `,
  styles: []
})
export class NuevoArticuloComponent implements OnInit {


  ngOnInit() {
  }


  public form: FormGroup;
  unsubcribe: any
  public fields: any[] = [
    
    {
      type: 'text',
      name: 'denominacion',
      label: 'Denominación',
      value: '',
      required: true,
    },
    {
      type: 'text',
      name: 'precioCompra',
      label: 'Precio de Compra',
      value: '',
      required: true,
    },
    {
      type: 'text',
      name: 'precioVenta',
      label: 'Precio de Venta',
      value: '',
      required: true,
    },
    {
      type: 'text',
      name: 'stockActual',
      label: 'Stock Actual',
      value: '',
      required: true,
    },
    {
      type: 'dropdown',
      name: 'unidadMedida',
      label: 'Unidad de Medida',
      value: '',
      required: true,
      options: [
        { key: 'L', label: 'Lt' },
        { key: 'K', label: 'Kg' },
        { key: 'U', label: 'Un' },
        { key: 'C', label: 'Cajas' },
        { key: 'P', label: 'Pqte' }
      ]
    },
    {
      type: 'radio',
      name: 'esInsumo',
      label: 'Es Insumo',
      value: 'in',
      required: true,
      options: [
        { key: 'true', label: 'Si' },
        { key: 'false', label: 'No' }
      ]
    }

  ];
  
  constructor() { 
    this.form = new FormGroup({
      fields: new FormControl(JSON.stringify(this.fields))
    })
    this.unsubcribe = this.form.valueChanges.subscribe((update) => {
      console.log(update);
      this.fields = JSON.parse(update.fields);
    });
  }


  onUpload(e) {
    console.log(e);

  }

  getFields() {
    return this.fields;
  }

  ngDistroy() {
    this.unsubcribe();
  }

}
