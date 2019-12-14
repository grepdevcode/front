import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';

import { Usuario } from '../interfaces/usuario';
import { Observable } from 'rxjs';
import { EmailValidator } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class IngresoService {
  private url:string = "http://localhost:5555/";
  constructor(private http:HttpClient) { }

  // post para login usuario
  login(email:string,password:string){
    console.log('email: '+email, 'password: '+password);
    return this.http.post(this.url,{
      email: email,
      password: password
    });
  }

  addUsuario(usuario:Usuario){
    console.log(usuario);
    this.http.post(this.url,usuario);
  }
}
