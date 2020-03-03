import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Cliente } from 'src/app/models/cliente';
import { Domicilio } from 'src/app/models/domicilio';
import { ProductoService } from 'src/app/services/producto.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  isSubmitted:boolean=false;
  registerForm: FormGroup = this.formBuilder.group(
    {
      cliente:new FormGroup({
        nombre: new FormControl('',Validators.compose([Validators.required,Validators.maxLength(30)])),
        apellido: new FormControl('',Validators.compose([Validators.required,Validators.maxLength(30)])),
        telefono: new FormControl('',Validators.compose([Validators.required,Validators.minLength(7),Validators.maxLength(12)])),
        email: new FormControl('',Validators.compose([Validators.required,Validators.email]))
      }),
      passwordgroup:new FormGroup({
        password:new FormControl('',Validators.compose([Validators.required,Validators.maxLength(8),Validators.minLength(8)])),
        passwordConfirm: new FormControl('',Validators.compose([Validators.required,Validators.maxLength(8),Validators.minLength(8)]))
      }, { validators: this.password.bind(this)}),
      domicilio:new FormGroup({
        calle:new FormControl('',Validators.compose([Validators.required,Validators.maxLength(60)])),
        numero:new FormControl('',Validators.compose([Validators.required,Validators.maxLength(4),Validators.min(1)])),
        localidad:new FormControl('',Validators.compose([Validators.required,Validators.maxLength(30)]))
      })
    }
    )

  constructor( private formBuilder:FormBuilder, private servicio:ProductoService, private auth:AuthService) { }

  ngOnInit(){
  }
  getFormCliente(){
    const precliente=this.registerForm.get('cliente').value;
    return new Cliente(precliente.nombre,precliente.apellido,precliente.telefono);
  }
  getFormDomicilio(){
    const predomicilio = this.registerForm.get('domicilio').value;
    return new Domicilio(predomicilio.calle, predomicilio.numero,predomicilio.localidad);
  }
  postCliente(objeto){
    this.servicio.postObservable('/clientes/',objeto)
    .subscribe(respuesta => this.postDomicilio(respuesta.id),
    error=>console.log(error));
  }
  postDomicilio(fk){
    let domicilio = this.getFormDomicilio();
    domicilio.cliente= fk;
    this.servicio.postObservable('/domicilios/',domicilio)
    .subscribe(respuesta => console.log('post de domicilio',respuesta),
    error=>console.log(error));
  }
  onSubmit(){
    if(!this.registerForm.invalid){
      this.isSubmitted=true;
      const cliente = this.getFormCliente();
      console.log(this.registerForm.value);
      this.auth.signup(this.registerForm.value).subscribe(data => console.log('respuesta',data));
      //this.postCliente(cliente);
    }  
  }
  password(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: passwordConfirm } = formGroup.get('passwordConfirm');
    return password === passwordConfirm ? null : { passwordNotMatch: true };
  }
}
