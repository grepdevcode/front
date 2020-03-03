import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url:string = "https://identitytoolkit.googleapis.com/v1/";
  miApiKey = "AIzaSyBH83QxcjjEX8-gI56_AEGKJ6DDJWBStHQ";
  userToken:string;
  permisos={
    comprar: true,
    admin: false,
    cocina:false
  }
// crear nuevos usuarios
// https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

//login
//https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
  constructor(private http: HttpClient){}

  login(form){

    const data ={
      ...form,
      returnSecureToken: true
    };
    return this.http.post(`${this.url}accounts:signInWithPassword?key=${this.miApiKey}`,data).pipe(map(res =>{
      this.guardarToken(res['idToken']);
      return res;
    }));
  }
  logout(){}
  signup(cliente){
    const data = {
      email: cliente.cliente.email,
      password: cliente.passwordgroup.password,
      info:{
        nombre:cliente.cliente.nombre,
        apellido:cliente.cliente.apellido,
        telefono:cliente.cliente.telefono,
      },
      domicilio:cliente.domicilio,
      returnSecureToken: true
    }
    console.log(data);
    return this.http.post(`${this.url}accounts:signUp?key=${this.miApiKey}`,data)
    .pipe(map(res =>{
      this.guardarToken(res['idToken']);
      return res;
    }));
  }
  guardarToken(idToken:string){
    this.userToken = idToken;
    localStorage.setItem('token',idToken);
  }
  leerToken(){
    if(localStorage.getItem('token')){
      this.userToken= localStorage.getItem('token');
    }else{
      this.userToken= '';
    }
    return this.userToken;
  }
}