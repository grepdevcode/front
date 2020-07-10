import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Domicilio } from 'src/app/models/domicilio';
import { ProductoService } from 'src/app/services/producto.service';
import { Router, RouterLinkActive, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { Cliente } from 'src/app/models/cliente';

@Component({
  selector: 'app-editar-cliente',
  template: `
  <div class="container-fluid justify-content-center p-1">
  <div class="col-sm-5 mx-auto px-3">
          <p class="h3">Usuario n°</p>

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
                        <option value="Ciudad">Ciudad</option>
                        <option value="Godoy Cruz">Godoy Cruz</option>
                        <option value="Guaymallén">Guaymallén</option>
                        <option value="Maipu">Maipu</option>
                        <option value="Las Heras">Las Heras</option>
                      </select>
                    </div>
                  </div> 
             </div>
                  <div class="form-group">
                    <button [disabled]="!this.registerForm.valid" name="submit" type="submit" class="btn btn-primary">Enviar</button>
                  </div>
                </form>
  </div>
</div>
  `,
  styles: []
})
export class EditarClienteComponent implements OnInit {
usuario:Cliente;
domicilio:Domicilio;
registerForm: FormGroup;

ngOnInit() {
  this.getCliente()
  this.getDomicilio()
  setTimeout(() => {
    this.initForm();
    console.log(this.domicilio);
    
  }, 2000);
}
  
  constructor(private formBuilder: FormBuilder, private servicio:ProductoService,private router: Router, private route: ActivatedRoute ) {
    this.buildForm();
   }
  // Tomar cliente del backend
  getCliente(){
    const id = Number( this.route.snapshot.paramMap.get("id"));
    return this.servicio.getSingleData(`Cliente/${id}`).subscribe(data => this.usuario = data)
  }
  // Tomar el domicilio Correspondiente 
  getDomicilio(){
    const id = Number( this.route.snapshot.paramMap.get("id"));
    this.servicio.getData(`Domicilio`)
    .subscribe( list => {
      this.domicilio = list.filter((item:Domicilio) => item.clienteId == id).shift();
    });
  }
  // Construye el form
  buildForm(){
    this.registerForm =  this.formBuilder.group(
      {
        cliente:new FormGroup({
          nombre: new FormControl(null,[Validators.required,Validators.maxLength(30)]),
          apellido: new FormControl(null,[Validators.required,Validators.maxLength(30)]),
          telefono: new FormControl(null,[Validators.required,Validators.minLength(7),Validators.maxLength(12)]),
          email: new FormControl(null,[Validators.required,Validators.email])
        }),
        domicilio:new FormGroup({
          calle:new FormControl(null,[Validators.required,Validators.maxLength(60)]),
          numero:new FormControl(null,[Validators.required,Validators.maxLength(4),Validators.min(1)]),
          localidad:new FormControl(null,[Validators.required,Validators.maxLength(30)])
        })
      })
  }
  // Carga los datos en el form
  initForm(){
    const grupoCli = this.registerForm.controls['cliente'] as FormGroup;
    const grupoDom = this.registerForm.controls['domicilio'] as FormGroup;
    for(let prop in grupoCli.controls){
      grupoCli.controls[prop].setValue(this.usuario[prop])
    }
    for(let prop in grupoDom.controls){
      grupoDom.controls[prop].setValue(this.domicilio[prop])
    } 
  }

  onSubmit(){
    this.registerForm.updateValueAndValidity();
    
   (this.registerForm.valid)?this.putUsuario():alert('Hubo un error revisa los campos')
  }
  putUsuario(){
    if(this.registerForm.valid){
      const formdata =  this.registerForm.value;
      let cli = {...this.usuario, ...formdata["cliente"]};
      let dom = {...this.domicilio, ...formdata["domicilio"]}
      this.servicio.putData(`Cliente`,cli)
      .subscribe(res =>{
        this.servicio.putData('Domicilio',dom)
        .subscribe(res =>this.router.navigate(['admin','cliente']) );
        ;
      },
      error => alert(" un error ha ocurrido "+ error));
    }
  }

}
