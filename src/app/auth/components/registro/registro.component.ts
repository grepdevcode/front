import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  registerForm: FormGroup = this.formBuilder.group(
    {
      nombre: "",
      apellido: "",
      telefono: "",
      correo:"",
      contrasena:"",
      repContrasena:""

    })

  constructor( private formBuilder:FormBuilder) { }

  ngOnInit() {
  }

  handleSubmit(){
    let form =this.registerForm.value;
    let usuario = 
    {
      nombre: form.nombre,
      apellido: form.apellido,
      telefono: form.telefono,
      email:form.correo
    }

  }

  /* registrar(usuario:Usuario, event:Event){
    console.log('usuario->'+usuario);
    console.log('contraseña->'+contrasena,'rep->'+repContrasena);
    this._ingresoService.addUsuario(usuario);
  } */
}
