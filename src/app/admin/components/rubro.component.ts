import { Component, OnInit } from '@angular/core';
import { RubroArticulo } from 'src/app/models/rubro-articulo';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductoService } from 'src/app/services/producto.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-rubro',
  template: `
  <div class="container-fluid">
  <div class="row">
      <div class="col-sm-7 mx-auto" >
          <p class="h2">Rubros</p>
          <div class="text-right m-2 p-1">
              <button class="btn btn-sm btn-info"  (click)="openmodal(content)">
                  <i class="fas fa-plus"></i>
                  Nuevo
              </button>
          </div>
          <div>
              <table class="table">

                  <th>Denominacion</th>
                  <tbody>
                      <tr *ngFor="let rubro of listaRubros">
                          <td>{{rubro.denominacion}}</td>
                          <td>
                              <button class="btn btn-sm btn-info" (click)="openmodal(content,rubro.id)">
                                  <small>
                                      <i class="fas fa-edit"></i>
                                  </small>
                                  <small>
                                      Editar
                                  </small>
                              </button>
                              <button (click)="removeRubro(rubro.id)" class="btn btn-sm btn-danger">
                                   <small>
                                        <i class="fa fa-trash" aria-hidden="true"></i>
                                  </small>
                                  <small>
                                      Eliminar
                                  </small>
                               </button>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>
  </div>
</div>

<ng-template #content let-modal>
<div class="modal-header">

    <h4 *ngIf="!edit; else editar"  class="modal-title" id="modal-basic-title">Nuevo Rubro</h4>
    <ng-template #editar> Editar Rubro </ng-template>
    

    <button type="button" class="close" aria-label="Close" (click)="modal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    
  <form [formGroup]="form" (ngSubmit)="onSubmit(this.edit)">
  <div class="form-group row">
    <label class="col-4 col-form-label" for="denominacion">Denominación</label> 
    <div class="col-8">
      <input formControlName="denominacion" id="denominacion" name="denominacion" type="text" class="form-control" aria-describedby="denominacionHelpBlock" required="required"> 
      <span id="denominacionHelpBlock" class="form-text text-muted">Ingrese el nombre del rubro que desea agregar.</span>
    </div>
  </div> 
  <div class="form-group row">
    <div class="offset-4 col-8">

      <button *ngIf="!edit;else editbutton" name="submit" type="submit" class="btn btn-primary">Crear</button>

      <ng-template #editbutton> 
        <button  name="submit" type="submit" class="btn btn-primary"> Modificar </button>
      </ng-template>

    </div>
  </div>
</form>

  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-dark" (click)="cerrarModal()">Cerrar</button>
  </div>
</ng-template>
  `,
  styles: []
})
export class RubroComponent implements OnInit {

  listaRubros:RubroArticulo[]=[new RubroArticulo(12,'Conservas')];
  form:FormGroup= new FormGroup({denominacion:new FormControl(null,Validators.required)});
  edit:boolean=false;
  editId:number;
  constructor(private servicio:ProductoService,private modalService: NgbModal) { }

  ngOnInit() {
  }
  getRubros(){
    this.servicio.getData('/rubro_articulo/')
    .subscribe(data => this.listaRubros = data.map(x => new RubroArticulo(x.id,x.denominacion) ) )
  }
  openmodal(content,id?){
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(r =>{
        console.log(r);this.edit = false;
      },(reason)=>{
        console.log(reason);
        this.edit =false;
      })
      if(id){
        let rubro = this.getRubro(id);
        this.edit = true;
        this.editId = id
        this.form.get('denominacion').setValue(rubro);
      }
  }
  onSubmit(edit){
    const rubro =this.form.value;
    if(edit){
      this.updateRubro(this.editId,rubro);
    }else{
    (this.listaRubros.filter((rep:RubroArticulo)=> rep.denominacion == rubro.denominacion).length > 0)?
      alert('ya existe un rubro con esa denominacion')
      :
      this.createRubro(rubro);
    }
    this.cerrarModal();
  }
  createRubro(objeto){
    this.servicio.postObservable('/rubro_articulo/',objeto)
    .subscribe((respuesta:Response) => (respuesta.status===200)?alert('Se ha creado un nuevo rubro'):alert('ha ocurrido un error') );
  }
  updateRubro(id,obj){
    this.servicio.putData(`/rubro_articulo/${id}`,new RubroArticulo(id,obj.denominacion))
    .subscribe(x=>console.log(x));
  }
  removeRubro(id){
    if(confirm("Desea eliminar el rubro "+id+"?")){
      this.servicio.removeData(`/rubro_articulo/${id}`)
    .subscribe(elim => this.getRubros(),
    error =>{alert('ha habido un error no se ha podido eliminar el rubro'); console.log(error)})
    }
  }
  cerrarModal(){
    this.edit=false
    this.modalService.dismissAll();
    
  }
  getRubro(id){
    return this.servicio.getData(`/rubro_articulo/${id}`).subscribe(x=> x.shift());
  }

}


