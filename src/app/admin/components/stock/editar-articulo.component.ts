import { Component, OnInit } from '@angular/core';
import { RubroArticulo } from 'src/app/models/rubro-articulo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductoService } from 'src/app/services/producto.service';
import { ActivatedRoute } from '@angular/router';
import { Articulo } from 'src/app/models/articulo';

@Component({
  selector: 'app-editar-articulo',
  template:`
  <div class="col-sm-7 offset-sm-2">
  <p class="h2"> </p>
<div class="card">
  <div class="card-header">Articulo N°{{this.id}}</div>
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
        <option value="g">Gramos</option>
        <option value="l">Litros</option>
        <option value="p">Paquetes</option>
        <option value="c">Cajas</option>
        <option value="s">Sobres</option>
        <option value="u">Unidades</option>
        <option value="f">Frasco</option>
      </select> 
      <span id="unidadMedidaHelpBlock" class="form-text text-muted">en que unidad se mide el producto</span>
    </div>
  </div> 

  <div class="form-group">
    <label for="rubro">Rubro</label> 
    <div>
      <select [formControlName]="'rubro'" id="rubro" name="rubro" class="custom-select" required="required" aria-describedby="rubroHelpBlock">
        <option *ngFor="let rubro of listaRubros;" value="{{rubro.id}}">{{rubro.denominacion}}</option>
      </select> 
      <span id="rubroMedidaHelpBlock" class="form-text text-muted">rubro al que pertenece el producto</span>
    </div>
  </div> 
  <div class="form-group">
    <button name="submit" type="submit" class="btn btn-primary">Editar</button>
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
  articulo:Articulo= new Articulo(3,"anchoas",12,50,100,"f",true,1);
  public form: FormGroup;
  unsubcribe: any
  id:number;

  ngOnInit() {
    this.getRubros();
    this.getArticulo();
    this.id =Number( this.route.snapshot.paramMap.get('id'));
    console.log(this.articulo)
    this.initForm();
  }

  constructor(private formBuilder: FormBuilder, private servicio:ProductoService, private route:ActivatedRoute) {
    this.form= this.formBuilder.group(
      {
        denominacion:[null,Validators.required],
        precioCompra:[null,Validators.compose([Validators.required,Validators.min(1)])],
        precioVenta:[null,Validators.compose([Validators.required,Validators.min(1)])],
        stockActual:[null,Validators.compose([Validators.required,Validators.min(0)])],
        esInsumo:[null,Validators.nullValidator],
        unidadMedida:[null,Validators.compose([Validators.required,Validators.minLength(1)])],
        rubro:[null,Validators.compose([Validators.required,Validators.minLength(1)])]
      }
    );
  }

  onSubmit(){
    if(this.form.valid){
      this.servicio.putData(`/articulos/${this.id}`,this.form.value).subscribe(art=>{
        alert(`se ha modificado el articulo ${art}.`)
      },error =>{ alert('ha ocurrido un error')})
    }
  }
  getRubros(){
    this.servicio.getData('/rubro_articulo/')
    .subscribe(rubros=>this.listaRubros = rubros.map(x => new RubroArticulo(x.id, x.denominacion))
    ,error => console.log('no se han podido acceder a los rubros',error));
  }
  getArticulo(){
    this.servicio.getData(`/articulo/${this.id}`)
    .subscribe(x => {
      let item = x.shift();
      console.log(item)
      this.articulo = new Articulo(item.id,item.denominacion,item.precioCompra,item.precioVenta,item.stockActual,item.unidadMedida,item.esInsumo,item.rubroArticulo)
    })
  }
  initForm(){
    for(let el in this.form.controls ){
      this.form.get(el).setValue( this.articulo[el])
    }
  }


}
