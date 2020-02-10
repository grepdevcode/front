import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ProductoService } from 'src/app/services/producto.service';
import { Articulo } from 'src/app/models/articulo';
import { ArticuloManufacturado } from 'src/app/models/articulo-manufacturado';
import { ArticuloManufacturadoDetalle } from 'src/app/models/articulo-manufacturado-detalle';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-nuevo-art-man',
  template: `
  <div class="container-fluid">
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
 
  <button type="button" (click)="addDetalle()" class="btn btn-sm btn-warning m-3"><small>agregar Insumo</small> </button>

  <div formArrayName="detalles">

  <div *ngFor="let grupo of nuevoArtManForm.controls.detalles.controls; let i=index">
    <button (click)="removeDetalle(i)" class="btn btn-sm btn-danger float-right"><small><i class="fas fa-minus"></i> </small></button>
    <div formGroupName="{{i}}">
      <div class="row" >
        <div class="col-sm-4">
          <select class="browser-default custom-select" formControlName="articulo">
            <option (change)="unidadMedida()" *ngFor="let item of ListaArticulos;let i = index" value="{{item.id}}">{{item.denominacion}}</option>              
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
          <p>{{getUnidadMedida(i)}}</p>
        </div>
      </div>
    </div>


  </div>
  </div>

  <div class="form-group justify-content-end float-right mt-4">
    <button name="submit" type="submit" class="btn btn-primary">Submit</button>
  </div>
</form>


</div>
</div>
</div>
  `,
  styles: []
})

export class NuevoArtManComponent implements OnInit {

  ngOnInit() {

    this.getArticulos();
    this.addDetalle();

  }
  ListaArticulos:Articulo[]=[];
  nuevoArtManForm;
  articulosmanufacturadosLista:any[]=[];

  constructor(private servicio: ProductoService,  private formBuilder:FormBuilder) {
    
    this.nuevoArtManForm = this.formBuilder.group({
      tiempoEstimadoCocina:['',Validators.min(10)],
      denominacion:['', Validators.required],
      precioVenta:['',Validators.min(1)],
      detalles: this.formBuilder.array([])
    });
  }

getUnidadMedida(id){
  console.log('onchange unidadmedida');
  const art = this.ListaArticulos.filter(x=> x.id = id) 
  return (art.shift())? art.shift().unidadMedida : '-' ;
}

  onSubmit(){
    const data = this.getFormManufacturado();
    let datadetalles =[];
    this.postArticuloMan(data);
  }

  postArticuloMan(data){
    return this.servicio.postObservable("/articulo_manufacturado/",data).toPromise()
    .then(x=>{
      console.log(x);
      this.getFormDetalles(x.id).forEach(x=>{
        this.postDetalles(x);
      });
    })
  }

  postDetalles(data){
    return this.servicio.postObservable("/articulo_manufacturado_detalle/",data).subscribe(x=>console.log('post detalles',x));
  }

  getArticulos(){
    return this.servicio.getData('/articulo/')
    .subscribe(res=>{
       this.ListaArticulos = res
    },
    error=>{
      alert(error);
    })
  }

  getFormManufacturado(){
    const manufacturado = {
      denominacion: this.nuevoArtManForm.get('denominacion').value,
      precio_venta:this.nuevoArtManForm.get('precioVenta').value,
      tiempo_estimado_cocina: this.nuevoArtManForm.get('tiempoEstimadoCocina').value,
    }
    return manufacturado;
  }

  getFormDetalles(id){
    let listaArticuloManufacturadoDetalle=[];
    for(let item of this.nuevoArtManForm.get('detalles').controls ){
      listaArticuloManufacturadoDetalle.push(
        
          new ArticuloManufacturadoDetalle(id, item.value.articulo, item.value.cantidad)
          // articulo_manufacturado: id,
          // articulo: item.value.articulo,
          // cantidad: item.value.cantidad
        
      );
    }
    console.log(listaArticuloManufacturadoDetalle);
    return listaArticuloManufacturadoDetalle;
  }

  ///componente detalle articulo
  initDetalle() {
    return this.formBuilder.group({
      articulo: ['',Validators.required],
      cantidad: ['',Validators.min(1)]
    });
  }
  
  addDetalle() {
    const control = this.nuevoArtManForm.controls.detalles.controls;
    control.push(this.initDetalle());
  }

  removeDetalle(i: number) {
    const control = this.nuevoArtManForm.controls.detalles;
    control.removeAt(i);
  }
}
