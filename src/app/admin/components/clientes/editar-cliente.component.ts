import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Domicilio } from 'src/app/models/domicilio';
import { ProductoService } from 'src/app/services/producto.service';
import { Router, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-editar-cliente',
  template: `
  <div class="container-fluid justify-content-center p-1">
  <div class="col-sm-5 mx-auto px-3">
          <p class="h3">Usuario n°{{usuario.id}}</p>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
              <div formGroupName="cliente">
                  <div class="form-group">
                    <label for="nombre">Nombre</label> 
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text">
                          <i class="fa fa-user-circle"></i>
                        </div>
                      </div> 
                      <input formControlName="nombre" id="nombre" maxlength="30" name="nombre" type="text" required="required" class="form-control">
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="apellido">Apelido</label> 
                    <input formControlName="apellido" maxlength="30" id="apellido" name="apellido" type="text" required="required" class="form-control">
                  </div>
                  <div class="form-group">
                    <label for="email">Email</label> 
                    <input formControlName="email"  id="email" name="email" type="email" required="required" class="form-control">
                  </div>
                  <div class="form-group">
                    <label for="telefono">Teléfono</label> 
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text">
                          <i class="fa fa-phone-square"></i>
                        </div>
                      </div> 
                      <input formControlName="telefono" minlength="7" maxlength="12" id="telefono" name="telefono" placeholder="ej.4329905 o 261568034" type="tel" aria-describedby="telefonoHelpBlock" required="required" class="form-control">
                    </div> 
                    <span id="telefonoHelpBlock" class="form-text text-muted">ingrese su celular con el prefijo (ej. 261) y sin el 15-</span>
                  </div>
              </div>
              <div formGroupName="domicilio">
                  <div class="form-group">
                    <label for="calle">Calle</label> 
                    <input formControlName="calle"  id="calle" maxlength="60" name="calle" placeholder="ej. Ferrucio Soppelssa" type="text" required="required" class="form-control">
                  </div>
                  <div class="form-group">
                    <label for="numero">Numero</label> 
                    <input formControlName="numero" min="1" max="9999" id="numero" name="numero" type="number" class="form-control" required="required">
                  </div>
                  <div class="form-group">
                    <label for="localidad">Localidad</label> 
                    <div>
                      <select formControlName="localidad"  id="localidad" name="localidad" class="custom-select" required="required">
                        <option value="c">Ciudad</option>
                        <option value="gc">Godoy Cruz</option>
                        <option value="g">Guaymallén</option>
                        <option value="m">Maipu</option>
                        <option value="lh">Las Heras</option>
                      </select>
                    </div>
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
export class EditarClienteComponent implements OnInit {
@Input() usuario;
domicilio:Domicilio;
registerForm: FormGroup;
  
  constructor(private formBuilder: FormBuilder, private servicio:ProductoService,private router: Router ) {
    this.registerForm =  this.formBuilder.group(
      {
        cliente:new FormGroup({
          nombre: new FormControl(this.usuario.nombre,[Validators.required,Validators.maxLength(30)]),
          apellido: new FormControl(this.usuario.apellido,[Validators.required,Validators.maxLength(30)]),
          telefono: new FormControl(this.usuario.telefono,[Validators.required,Validators.minLength(7),Validators.maxLength(12)]),
          email: new FormControl(this.usuario.email,[Validators.required,Validators.email])
        }),
        domicilio:new FormGroup({
          calle:new FormControl(this.domicilio.calle,[Validators.required,Validators.maxLength(60)]),
          numero:new FormControl(this.domicilio.numero,[Validators.required,Validators.maxLength(4),Validators.min(1)]),
          localidad:new FormControl(this.domicilio.localidad,[Validators.required,Validators.maxLength(30)])
        })
      })
   }
  ngOnInit() {
    this.getDomicilio(this.usuario.domicilio);
  }
  getDomicilio(id){
    this.servicio.getData(`/cliente/${id}`).subscribe(data => this.domicilio = data.shift());
  }
  onSubmit(){
   (this.registerForm.valid)?this.putUsuario():alert('Hubo un error revisa los campos')
  }
putUsuario(){
  const nuevoUsuario =  this.registerForm.value();
  this.servicio.putData(`/clientes/${this.usuario.id}`,nuevoUsuario).subscribe((data:Response) =>{
    if(data.ok){
      alert('Se ha modificado correctamente el usuario '+this.usuario.id)
      this.router.navigate(['admin','clientes']);
    }else{
      alert('ha ocurrido un error');
    } 
  })
}

}
