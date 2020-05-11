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
 
  <button type="button" (click)="addDetalle()" class="btn btn-sm btn-warning m-2"><small>agregar Insumo</small> </button>

  <div formArrayName="detalles">

  <div *ngFor="let grupo of nuevoArtManForm.controls.detalles.controls; let i=index">
    <button (click)="removeDetalle(i)" class="btn btn-sm btn-danger float-right"><small><i class="fas fa-minus"></i> </small></button>
    <div formGroupName="{{i}}">
      <div class="row" >
        <div class="col-sm-6">
        
          <select class="browser-default custom-select" formControlName="articuloId">
            <option (change)="updataFormArray()" *ngFor="let item of ListaArticulos;let j = index" value="{{item.id}}">{{item.denominacion}} <small> ({{item.unidadMedida}}) </small></option>              
          </select>

        </div>
        <div class="col-sm-1 ">
          <p> <small> cant </small></p>
        </div>
        <div class="col-sm-3 ">
          <div class="form-group">
            <input formControlName="cantidad" type="number" class="form-control" id="cantidad" aria-describedby="cantidadhelp" (change)="updataFormArray()"> 
          </div>
        </div>
      </div>
    </div>


  </div>
  </div>

  <div class="form-group justify-content-end float-right mt-4">
    <button name="submit" type="submit" class="btn btn-primary" [disabled]="!this.nuevoArtManForm.valid" >Submit</button>
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
  producto:ArticuloManufacturado;
  ListaArticulos:Articulo[]=[];
  nuevoArtManForm:FormGroup;
  listaDetalles:ArticuloManufacturadoDetalle[] =[];

  constructor(private servicio: ProductoService,  private formBuilder:FormBuilder,private route:ActivatedRoute,private router:Router) {
    this.nuevoArtManForm = this.formBuilder.group({
      tiempoEstimadoCocina:['',Validators.compose([Validators.required, Validators.min(10)])],
      denominacion:['', Validators.compose([ Validators.required, Validators.minLength(3)])],
      precioVenta:['',Validators.compose([Validators.required, Validators.min(1)])],
      detalles: this.formBuilder.array([],Validators.required)
    });
   }
  ngOnInit() {
    this.id =Number( this.route.snapshot.paramMap.get('id'));
    this.getArtmanufacturado(); 
    this.getArticulos();
    this.getDetalles();
                        
    setTimeout(() => {
      this.initForm()
    }, 1500);
     //ok
  }
// Tomar el articulo manufacturado del backend.
  getArtmanufacturado(){
    this.servicio.getSingleData(`/ArticuloManufacturado/${Number( this.route.snapshot.paramMap.get('id'))}`)
    .subscribe( data =>{
      this.producto =new ArticuloManufacturado(data["id"], data["tiempoEstimadoCocina"], data["denominacion"],data["precioVenta"]);
      console.log(this.producto);
    }); 
  }
  // Tomar detalles del backend.
  getDetalles(){
    return  this.servicio.getData("/ArticuloManufacturadoDetalle")
    .subscribe(x => this.listaDetalles = x.filter(z => z.articuloManufacturadoId == this.producto.id));
  }
  // Tomar Articulos del backend.
  getArticulos(){
    return this.servicio.getData('/Articulo')
    .subscribe(res=>{
       this.ListaArticulos = res.filter(row => row.esInsumo)
    },
    error=>{
      alert(error);
    })
  }
// Carga los valores del articulo manufacturado en el form.
  initForm(){
    for(let prop in this.nuevoArtManForm.controls){
      console.log(prop);

      (prop !== 'detalles')?
        this.nuevoArtManForm.get(prop).setValue(this.producto[prop]):  
        this.initDetalle();
    }
  }
  // Cargar los detalles en el FormArray
  initDetalle() {
    const control = this.nuevoArtManForm.get('detalles') as FormArray;
    this.listaDetalles.forEach(x=>{
      console.log("item in lista detalles",x);
      let grupo = new FormGroup({
        articuloId: new FormControl(x.articuloId),
        cantidad: new FormControl(x.cantidad)
      })
      control.push(grupo);
    })
    control.updateValueAndValidity();
  }
  // Crea un FormGroup con los controls articuloId y cantidad.
  crearDetalle(){
    return this.formBuilder.group({
      articuloId:[,Validators.compose([ Validators.required, Validators.min(1)])],
      cantidad:[,Validators.compose([ Validators.required, Validators.min(1)])]
    })
  }
  // Agrega un detalle vacio
  addDetalle() {
    const control = this.nuevoArtManForm.get('detalles') as FormArray;
    control.push(this.crearDetalle());
    control.updateValueAndValidity();
  }
  // Quita un detalle
  removeDetalle(i: number) {
    const control = this.nuevoArtManForm.get('detalles') as FormArray;
    control.removeAt(i);
    this.updataFormArray();
  }
  // Envia un Put request al backend
  onSubmit(){
    this.nuevoArtManForm.updateValueAndValidity();
    const formdata = this.nuevoArtManForm.value;
    let detalles = formdata.detalles.map( row => {
      return new ArticuloManufacturadoDetalle(this.producto.id,+row.articuloId,+row.cantidad);
      })
    if(this.nuevoArtManForm.valid){
      let postManufacturado ={
        articuloManufacturado:{
          id:this.producto.id,
          denominacion: formdata.denominacion,
          tiempoEstimadoCocina: +formdata.tiempoEstimadoCocina,
          precioVenta:+formdata.precioVenta
        },
        ArticuloManufacturadoDetalle:detalles
      }
      
      console.log({...postManufacturado});
      
      this.servicio.putData("ArticuloManufacturado",{...postManufacturado})
      .subscribe(x => {
        alert(`Se ha modificado el producto: ${this.producto.id}` );
        this.router.navigate(["admin","productos"]);
      }, error=> console.log(error)
      )
    }

  }
// actualia los valores del Form
  updataFormArray(){
    this.nuevoArtManForm.updateValueAndValidity();
  }
}
