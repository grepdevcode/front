import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  registerForm: FormGroup = this.formBuilder.group(
    {
      client_id: 'elNVVXt73bWPs98oIovZ0lOWJ9a2nrvi',
      connection: 'YOUR_CONNECTION_NAME',
      email:"",
      nombre: "",
      apellido: "",
      telefono: "",
      password:"",
      repPassword:"",
      user_metadata: {
      }
    })

  constructor( private formBuilder:FormBuilder, private http: HttpClient) { }

  ngOnInit() {
  }

  handleSubmit(){
    console.log(this.registerForm.value);
    console.log(this.http.post('https://enzomzaocv.auth0.com/dbconnections/signup',this.registerForm.value));
  }

  /* registrar(usuario:Usuario, event:Event){
    console.log('usuario->'+usuario);
    console.log('contraseña->'+contrasena,'rep->'+repContrasena);
    this._ingresoService.addUsuario(usuario);
  } */
}
