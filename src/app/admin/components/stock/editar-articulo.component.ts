import { Component, OnInit } from '@angular/core';
import { RubroArticulo } from 'src/app/models/rubro-articulo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductoService } from 'src/app/services/producto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Articulo } from 'src/app/models/articulo';

@Component({
  selector: 'app-editar-articulo',
  template:`
  <div class="col-sm-7 offset-sm-2">
  <p class="h2"> </p>
<div class="card">
  <div class="card-header">Articulo N°{{this.route.snapshot.paramMap.get("id")}}</div>
  <div class="card-body">
    

  <form [formGroup]="form" (ngSubmit)="onSubmit()" >
  <div class="form-group">
    <label for="denominacion">Denominación</label> 
    <div class="input-group">
      <div class="input-group-prepend">
        <div class="input-group-text">
          <i class="fa fa-address-card"></i>
        </div>
      </div> 
      <input [formControlName]="'denominacion'" id="denominacion" name="denominacion" placeholder="ingrese el nombre del  articulo" type="text" class="form-control" required="required">
    </div>
  </div>
  <div class="form-group">
    <label for="precioCompra">Precio de Compra</label> 
    <input [formControlName]="'precioCompra'" id="precioCompra" name="precioCompra" placeholder="ej. 12.50" type="number" class="form-control" aria-describedby="precioCompraHelpBlock" required="required"> 
    <span id="precioCompraHelpBlock" class="form-text text-muted">ingrese el precio sin el signo $</span>
  </div>
  <div class="form-group">
    <label for="precioVenta">Precio de Venta</label> 
    <input [formControlName]="'precioVenta'" id="precioVenta" name="precioVenta" placeholder="ej.12.50" type="number" class="form-control" aria-describedby="precioVentaHelpBlock" required="required"> 
    <span id="precioVentaHelpBlock" class="form-text text-muted">ingrese el precio sin el signo $</span>
  </div>
  <div class="form-group">
    <label for="stockActual">Stock Actual</label> 
    <input [formControlName]="'stockActual'" id="stockActual" name="stockActual" type="number" class="form-control" required="required">
  </div>
  <div class="form-group">
    <label>Es Insumo?</label> 
    <div>
      <div class="custom-control custom-checkbox custom-control-inline">
        <input [formControlName]="'esInsumo'" name="esInsumo" id="esInsumo" type="checkbox" class="custom-control-input" value="true" checked="checked" aria-describedby="esInsumoHelpBlock" > 
        <label for="esInsumo" class="custom-control-label">Marque para afirmar</label>
      </div>
      <span id="esInsumoHelpBlock" class="form-text text-muted">un insumo es un articulo que se utilizara para producir otro producto.</span>
    </div>
  </div>
  <div class="form-group">
    <label for="unidadMedida">Unidad de Medida</label> 
    <div>
      <select [formControlName]="'unidadMedida'" id="unidadMedida" name="unidadMedida" class="custom-select" required="required" aria-describedby="unidadMedidaHelpBlock">
        <option value="Gramos">Gramos</option>
        <option value="Litros">Litros</option>
        <option value="Paquetes">Paquetes</option>
        <option value="Cajas">Cajas</option>
        <option value="Sobres">Sobres</option>
        <option value="Unidades">Unidades</option>
        <option value="Frasco">Frasco</option>
        <option value="Botellas">Botellas</option>
      </select> 
      <span id="unidadMedidaHelpBlock" class="form-text text-muted">en que unidad se mide el producto</span>
    </div>
  </div> 

  <div class="form-group">
    <label for="rubro">Rubro</label> 
    <div>
      <select [formControlName]="'rubroArticuloId'" id="rubro" name="rubro" class="custom-select" required="required" aria-describedby="rubroHelpBlock">
        <option *ngFor="let rubro of listaRubros;" value="{{rubro.id}}">{{rubro.denominacion}}</option>
      </select> 
      <span id="rubroMedidaHelpBlock" class="form-text text-muted">rubro al que pertenece el producto</span>
    </div>
  </div> 
  <div class="form-group">
    <button [disabled]="!this.form.valid" name="submit" type="submit" class="btn btn-primary">Editar</button>
  </div>
</form>


  </div>
</div>
</div>
  `,
  styles: []
})
export class EditarArticuloComponent implements OnInit {
  listaRubros: RubroArticulo[];
  articulo:Articulo;
  form: FormGroup;
  unsubcribe: any
  id:number;
  ngOnInit() {
   // this.id =Number( this.route.snapshot.paramMap.get('id'));
    this.getArticulo();
    this.getRubros();
    this.createForm();
    setTimeout(() => {
      this.initForm();
    }, 500);
    
  }
  constructor(private formBuilder: FormBuilder, private servicio:ProductoService,private router:Router, private route:ActivatedRoute) {
    
  }
  // Crea el Form
  createForm(){
    this.form= this.formBuilder.group(
      {
        denominacion:[null,Validators.required],
        precioCompra:[null,Validators.compose([Validators.required,Validators.min(0.1)])],
        precioVenta:[null,Validators.compose([Validators.required,Validators.min(0.1)])],
        stockActual:[null,Validators.compose([Validators.required,Validators.min(0)])],
        esInsumo:[null,Validators.nullValidator],
        unidadMedida:[null,Validators.compose([Validators.required,Validators.minLength(1)])],
        rubroArticuloId:[null,Validators.compose([Validators.required,Validators.minLength(1)])]
      }
    );
   
  }
  // Envia la PUT request
  onSubmit(){ 
    if(this.form.valid){
      let putArticulo = {id:this.articulo.id, ...this.form.value}
      if(putArticulo.esInsumo == null) putArticulo.esInsumo = false;
      console.log(putArticulo);
      
      this.servicio.putData("/Articulo",putArticulo)
      .subscribe((res)=>{
        if(res){
          this.router.navigate(["admin","stock"]);
        }else{
          console.log(res);
        }
    })
  }
  }
  // Toma los Rubros del backend
  getRubros(){
    this.servicio.getData('/RubroArticulo')
    .subscribe(rubros=>this.listaRubros = rubros.map(x => new RubroArticulo(x.id, x.denominacion))
    ,error => console.log('no se han podido acceder a los rubros',error));
  }
  // Tomar articulo del Backend
  getArticulo(){
    const id =  Number( this.route.snapshot.paramMap.get("id"));
    this.servicio.getSingleData(`/Articulo/${id}`)
    .subscribe(item => {
      console.log(item)
      this.articulo = 
      new Articulo(
        item.id,
        item.denominacion,
        item.precioCompra,
        item.precioVenta,
        item.stockActual,
        item.unidadMedida,
        item.esInsumo,
        item.rubroArticuloId)
    }) 
  }
  // Escribe los valores correspondientes en el form
  initForm(){
    if(this.articulo){
    for(let el in this.form.controls ){
      this.form.get(el).setValue( this.articulo[el])
    }
  }
  }
}
