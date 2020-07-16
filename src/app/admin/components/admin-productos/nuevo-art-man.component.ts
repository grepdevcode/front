import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { ProductoService } from 'src/app/services/producto.service';
import { Articulo } from 'src/app/models/articulo';
import { ArticuloManufacturado } from 'src/app/models/articulo-manufacturado';
import { ArticuloManufacturadoDetalle } from 'src/app/models/articulo-manufacturado-detalle';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-art-man',
  template: `
  <div class="container-fluid">
    <div class="row p-3">
      <div class="col-sm-7 offset-sm-2 mx-auto px-3 my-2">
        <p class="h2 my-3"> Nuevo Articulo Manufacturado</p>
        <form   [formGroup]='nuevoArtManForm'  (ngSubmit)="onSubmit()">
          <!-- DENOMINACION -->
          <div class="form-group">
            <label for="denominacion">Denominacion</label> 
              <div class="input-group">
                <div class="input-group-prepend">
                  <div class="input-group-text"></div>
                </div> 
                <input formControlName="denominacion" id="denominacion" name="denominacion" type="text" required="required" class="form-control">
              </div>
          </div>
          <!-- LINKIMAGEN -->
          <div class="form-group">
            <label for="denominacion">Link a la Imagen</label> 
              <div class="input-group">
                <div class="input-group-prepend">
                  <div class="input-group-text"></div>
                </div> 
                <input formControlName="linkImagen" id="linkImagen" name="linkImagen" type="url" required="required" class="form-control">
              </div>
          </div>
          <!-- TIEMPO ESTIMADO COCINA -->
          <div class="form-group">
            <label for="tiempoEstimadoCocina">Tiempo en Cocina</label> 
            <input formControlName="tiempoEstimadoCocina" id="tiempoEstimadoCocina" name="tiempoEstimadoCocina" type="text" aria-describedby="tiempoEstimadoCocinaHelpBlock" required="required" class="form-control"> 
            <span id="tiempoEstimadoCocinaHelpBlock" class="form-text text-muted">ingrese el tiempo en minutos</span>
          </div>
          <!-- PRECIO VENTA -->
          <div class="form-group">
            <label for="precioVenta">Precio de venta</label> 
            <input formControlName="precioVenta" id="precioVenta" name="precioVenta" type="text" aria-describedby="precioVentaHelpBlock" required="required" class="form-control"> 
            <span id="precioVentaHelpBlock" class="form-text text-muted">ingrese el precio sin el signo $</span>
          </div>
          <!-- BOTON AGREGAR DETALLE -->
          <button type="button" (click)="addDetalle()" class="btn btn-sm btn-warning m-3"><small>agregar Insumo</small> </button>
          <!-- ARRAY DETALLES -->
          <div formArrayName="detalles">
            <div *ngFor="let grupo of nuevoArtManForm.controls.detalles.controls; let i=index">
              <!-- Boton remover detalle -->
              
              <!-- Form Group -->
              <div formGroupName="{{i}}">
              <button (click)="removeDetalle(i)" class="btn btn-sm btn-danger float-right"><small><i class="fas fa-minus"></i> </small></button>
                <div class="row" >
                  <!-- Select Articulo -->
                  <div class="col-sm-7">
                    <select class="browser-default custom-select" formControlName="articuloId" (change)="updateFromGroup()">
                      <option *ngFor="let item of ListaArticulos" value="{{item.id}}">{{item.denominacion}} ({{item.unidadMedida}})</option>
                    </select>
                  </div>
                  <div class="col-sm-1 mx-2">
                    <p><small>cantidad</small></p>
                  </div>
                  <!-- Input Cantidad -->
                  <div class="col-sm-3 mx-2">
                    <div class="form-group">
                      <input formControlName="cantidad" type="number" class="form-control" id="cantidad" aria-describedby="cantidadhelp" (change)="updateFromGroup()"> 
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
          <div class="form-group justify-content-end float-right mt-4">
            <button [disabled]="!nuevoArtManForm.valid" name="submit" type="submit" class="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  `,
  styles: []
})

export class NuevoArtManComponent implements OnInit {

  ListaArticulos:Articulo[]=[];
  nuevoArtManForm;
  articulosmanufacturadosLista:any[]=[];

  ngOnInit() {
    this.getArticulos().subscribe(res=>{
      this.ListaArticulos = res.filter(x => x.esInsumo)
   },
   error=>{
     console.log(error);
     
   })
  }

  constructor(private servicio: ProductoService,  private formBuilder:FormBuilder,private router:Router) {  
    this.nuevoArtManForm = this.formBuilder.group({
      tiempoEstimadoCocina:['',Validators.compose( [Validators.min(10), Validators.required])],
      denominacion:['', Validators.compose([Validators.required, Validators.minLength(3)])],
      precioVenta:['',Validators.compose([Validators.required,Validators.min(1)])],
      linkImagen:['', Validators.compose([Validators.required, Validators.maxLength(150)])],
      detalles : this.formBuilder.array([this.initDetalle()])
    });
    
  }
// Envia el Articulo Manufacturado y los detalles al backend.
  onSubmit(){
    this.nuevoArtManForm.updateValueAndValidity();
    const formdata = this.nuevoArtManForm.value;
    let detalles = formdata.detalles.map( row => {
      return new ArticuloManufacturadoDetalle(0,+row.articuloId,+row.cantidad);
      })
    if(this.nuevoArtManForm.valid){
      let postManufacturado ={
        articuloManufacturado:{
          denominacion: formdata.denominacion,
          tiempoEstimadoCocina: +formdata.tiempoEstimadoCocina,
          precioVenta:+formdata.precioVenta,
          linkImagen: formdata.linkImagen
        },
        ArticuloManufacturadoDetalle: detalles
      }
      
      console.log({...postManufacturado,detalles});
      
    this.servicio.postObservable("ArticuloManufacturado",{...postManufacturado})
    .subscribe(x => {
      alert(`Se ah agregado un nuevo producto: ${x.denominacion}` );
      this.router.navigate(["admin","productos"]);
    }, error=> console.log(error)
    )
      }

  }
  // Toma Articulos que sean insumos del Backend 
  getArticulos(){
    return this.servicio.getData('/Articulo/0/0');
  }
  // Acceder al FormArray  directamente.
  get detalles(): FormArray {
    return this.nuevoArtManForm.get('detalles') as FormArray;
  }
  // Crear un FormGroup con dos FormControl dentro para detalle articulo
  initDetalle() {
    return this.formBuilder.group({
      articuloId: [,Validators.required],
      cantidad: [,Validators.compose([Validators.required, Validators.min(1)])]
    });
  }
  // Agrega un FormGroup al FormArray
  addDetalle() {
    const detalles = this.nuevoArtManForm.get('detalles') as FormArray
    detalles.controls.push(this.initDetalle());
    detalles.updateValueAndValidity()
  }
  // Quita un formGroup del FormArray
  removeDetalle(i: number) { 
    this.detalles.removeAt(i);
  }
  // Actualiza los valores del FormArray 
  updateFromGroup(){
    const detalles = this.nuevoArtManForm.get('detalles') as FormArray
    detalles.updateValueAndValidity()
  }
}
