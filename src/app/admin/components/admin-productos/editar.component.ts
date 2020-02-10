import { Component, OnInit, Input } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ArticuloManufacturado } from 'src/app/models/articulo-manufacturado';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ProductoService } from 'src/app/services/producto.service';
import { Articulo } from 'src/app/models/articulo';
import { ArticuloManufacturadoDetalle } from 'src/app/models/articulo-manufacturado-detalle';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar',
  template: `
  <div class="col-sm-7 offset-sm-2">
  <p class="h2"> </p>
<div class="card">
  <div class="card-header">Articulo Manufacturado N°{{this.id}}</div>
  <div class="card-body">

  <form   [formGroup]='nuevoArtManForm'  (ngSubmit)="onSubmit()">
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
        <div class="col-sm-5">
          <select class="browser-default custom-select" formControlName="articulo">
            <option (change)="unidadMedida()" *ngFor="let item of ListaArticulos;let i = index" value="{{item.id}}">{{item.denominacion}}</option>              
          </select>
        </div>
        <div class="col-sm-1 text-center">
          <p> <small> cant </small></p>
        </div>
        <div class="col-sm-3 ">
          <div class="form-group">
            <input formControlName="cantidad" type="number" class="form-control" id="cantidad" aria-describedby="cantidadhelp"> 
          </div>
        </div>
        <div class="col ">
          <p><small> {{getUnidadMedida(i)}} </small></p>
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
export class EditarComponent implements OnInit {
  id:number;
  producto:ArticuloManufacturado = new ArticuloManufacturado(13,15,"Tarta",150);
  ListaArticulos:Articulo[]=[];
  nuevoArtManForm:FormGroup;
  listaDetalles:ArticuloManufacturadoDetalle[] = [new ArticuloManufacturadoDetalle(1,2,5), new ArticuloManufacturadoDetalle(1,3,8)];

  constructor(private servicio: ProductoService,  private formBuilder:FormBuilder,private route:ActivatedRoute) {
    this.nuevoArtManForm = this.formBuilder.group({
      tiempoEstimadoCocina:['',Validators.min(10)],
      denominacion:['', Validators.required],
      precioVenta:['',Validators.min(1)],
      detalles: this.formBuilder.array([])
    });
   }
  ngOnInit() {
    this.id =Number( this.route.snapshot.paramMap.get('id'));
    this.getArtmanufacturado();                      
    this.getArticulos();
    this.getDetalles();
    this.initForm(); //ok
  }
//FROM ARTICULO MANUFACTURADO
  getArtmanufacturado(){
    this.servicio.getData(`/articulo_manufacturado/${this.id}`)
    .subscribe(art =>{
      let item = art.shift();
      this.producto = 
      new ArticuloManufacturado(
        item.id,
        item.tiempoEstimadoCocina,
        item.denominacion,
        item.precioVenta)
    })
  }//traer articulo de la base de datos
  initForm(){
    for(let prop in this.nuevoArtManForm.controls){
      console.log(prop);

      (prop !== 'detalles')?
        this.nuevoArtManForm.get(prop).setValue(this.producto[prop]):  
       this.initDetalle();
    }
  } // llenar formulario
  getFormManufacturado(){
    let manufacturado = new ArticuloManufacturado(
       this.id, this.nuevoArtManForm.get('tiempoEstimadoCocina').value,
       this.nuevoArtManForm.get('denominacion').value,
       this.nuevoArtManForm.get('precioVenta').value);
    return manufacturado;
  } // tomar valores del form
  getFromDetalles(){
    const control = this.nuevoArtManForm.get('detalles') as FormArray;
    let array =[];
    control.controls.forEach(x=>{
      array.push(new ArticuloManufacturadoDetalle(this.id,x.get('articulo').value, x.get('cantidad').value))
    })
    return array;
  }
// DETALLE COMPONENT
  getDetalles(){
    return  this.servicio.getData(`/articulo_manufacturado_detalle/${this.producto.id}`)
    .subscribe(x => this.listaDetalles = x);
  }
  initDetalle() {
    const control = this.nuevoArtManForm.get('detalles') as FormArray;
    this.listaDetalles.forEach(x=>{
      let grupo = new FormGroup({
        articulo: new FormControl(x.articulo),
        cantidad: new FormControl(x.cantidad)
      })
      control.push(grupo);
    })
  }
  crearDetalle(){
    return this.formBuilder.group({
      articulo:[null,Validators.required],
      cantidad:[1,Validators.min(1)]
    })
  }
  addDetalle() {
    const control = this.nuevoArtManForm.get('detalles') as FormArray;
    control.push(this.crearDetalle());
  }
  removeDetalle(i: number) {
    const control = this.nuevoArtManForm.get('detalles') as FormArray;
    control.removeAt(i);
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
  getUnidadMedida(id){
    const art = this.ListaArticulos.filter(x=> x.id = id) 
    return (art.shift())? art.shift().unidadMedida : '-' ;
  }
  onSubmit(){
    console.log(this.nuevoArtManForm.value);
    if(!this.nuevoArtManForm.invalid){

      this.servicio.putData(`/articulo_manufacturado/${this.id}`,this.nuevoArtManForm.value);
    }
  }

// PROPIOS



}
