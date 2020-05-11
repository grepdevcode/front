import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Cliente } from 'src/app/models/cliente';
import { Domicilio } from 'src/app/models/domicilio';
import { ProductoService } from 'src/app/services/producto.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { error } from 'protractor';

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
      password:new FormGroup({
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

  constructor( private formBuilder:FormBuilder, private servicio:ProductoService, private router: Router) { }

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
  postCliente(postObject){
    return this.servicio.postObservable('Cliente',postObject)
  }

  onSubmit(){
    this.registerForm.updateValueAndValidity();
    if(!this.registerForm.invalid){
      this.isSubmitted=true;
      let clienteObj= {...this.registerForm.value["cliente"], telefono: +this.registerForm.value["cliente"]["telefono"], roles:"permiso_Cliente" }
      let objetoPost = {cliente: clienteObj, domicilio: this.registerForm.value["domicilio"] , password: this.registerForm.value["password"]["password"] }
      console.log(objetoPost);
      this.postCliente(objetoPost).subscribe(res => this.router.navigate(["ingreso","login"]),
      error => console.log(error)
      )
    }  
  }
  password(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: passwordConfirm } = formGroup.get('passwordConfirm');
    return password === passwordConfirm ? null : { passwordNotMatch: true };
  }
}
