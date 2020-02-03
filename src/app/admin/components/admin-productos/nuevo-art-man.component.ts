import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-nuevo-art-man',
  template: `
  <div class="row p-3">
  <div class="col-sm-7 offset-sm-2 mx-auto px-3 my-2">
  <p class="h2 my-3"> Nuevo Articulo Manufacturado</p>
  <form   [formGroup]='nuevoArtManForm'  (ngSubmit)="onSubmit(nuevoArtManForm.value)">
  <div class="form-group">
    <label for="denominacion">Denominacion</label> 
    <div class="input-group">
      <div class="input-group-prepend">
        <div class="input-group-text"></div>
      </div> 
      <input formControlName="denominacion" id="denominacion" name="denominacion" type="text" required="required" class="form-control">
    </div>
  </div>
  <div class="form-group">
    <label for="tiempoEstimadoCocina">Tiempo en Cocina</label> 
    <input formControlName="tiempoEstimadoCocina" id="tiempoEstimadoCocina" name="tiempoEstimadoCocina" type="text" aria-describedby="tiempoEstimadoCocinaHelpBlock" required="required" class="form-control"> 
    <span id="tiempoEstimadoCocinaHelpBlock" class="form-text text-muted">ingrese el tiempo en minutos</span>
  </div>
  <div class="form-group">
    <label for="precioVenta">Precio de venta</label> 
    <input formControlName="precioVenta" id="precioVenta" name="precioVenta" type="text" aria-describedby="precioVentaHelpBlock" required="required" class="form-control"> 
    <span id="precioVentaHelpBlock" class="form-text text-muted">ingrese el precio sin el signo $</span>
  </div>
  <div class="form-group">
    <label for="ArticuloManufacturadoDetalle">Insumos</label> 
    <div>
      <select formControlName="ArticuloManufacturadoDetalle" multiple="multiple" id="ArticuloManufacturadoDetalle" name="ArticuloManufacturadoDetalle" aria-describedby="ArticuloManufacturadoDetalleHelpBlock" required="required" class="custom-select">
        <option value="rabbit">Rabbit</option>
        <option value="duck">Duck</option>
        <option value="fish">Fish</option>
      </select> 
      <span id="ArticuloManufacturadoDetalleHelpBlock" class="form-text text-muted">Elija los insumos necesarios</span>
    </div>
  </div> 
  <div class="form-group">
    <button name="submit" type="submit" class="btn btn-primary">Submit</button>
  </div>
</form>


</div>
</div>

  `,
  styles: []
})

export class NuevoArtManComponent implements OnInit {
  ngOnInit() {
  }

  nuevoArtManForm;

  constructor(private servicio: ProductoService,  private formBuilder:FormBuilder) {
    this.nuevoArtManForm = this.formBuilder.group({
      tiempoEstimadoCocina:'',
      denominacion:'',
      precioVenta:'',
      ArticuloManufacturadoDetalle:[]
    });
  }

  onSubmit(data){
    console.log(data)
    this.servicio.postData('/articulomanufacturado',data)
  }

}
