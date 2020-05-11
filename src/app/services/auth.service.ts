import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { AuthRoles } from '../auth/auth-roles.enum';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import * as decode from 'jwt-decode';
import { error } from 'protractor';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends CacheService {

  private readonly authProvider : (email:string, password: string) => Observable<IServerAuthResponse>;
  authStatus= new BehaviorSubject<IAuthStatus>(this.getItem('authStatus')|| defaultAuthStatus);
  constructor( private http: HttpClient) { 
    super();
    this.authStatus.subscribe(authStatus=>{
      this.setItem('authStatus', authStatus)
    })
    this.authProvider = this.userAuthProvider;
  }
// Envia el Post a el backend 
  userAuthProvider(email:string, password:string):Observable<IServerAuthResponse>{
    return this.http.post<IServerAuthResponse>('Token' ,{email:email, password: password})
  }
  // Ingreso de usuario, decodifia y devuelve token
  login(email:string, password:string): Observable<IAuthStatus>{
    this.logout();
    const loginResponse = this.userAuthProvider(email,password).pipe(
      map(value =>{
        this.setToken(value.accessToken);
        const result = decode(value.accessToken);
        return result as IAuthStatus;
      }));

    loginResponse.subscribe(res =>{
      this.authStatus.next(res)
    },error =>{
      this.logout();
      return throwError(error)
    })
    return loginResponse;
  }
  logout(){
    this.clear();
    this.authStatus.next(defaultAuthStatus);
  }
   setToken(jwt:string){
    this.setItem('jwt',jwt);
  }
   getToken():string{
    return this.getItem('jwt') || '';
  }
   clear(){
    localStorage.clear();
  }
  getAuthStatus():IAuthStatus{
    return this.getItem('authStatus')
  }
  getIdUsuario(){
    if(this.getAuthStatus().primarysid == null){
      console.log(this.getAuthStatus().primarysid);
      
      return null
    }else{
      return Number(this.getAuthStatus().primarysid)
    } 
  }
}
export interface IAuthStatus{
  role: AuthRoles,
  primarysid: string,
  unique_name: string
}
interface IServerAuthResponse{
  accessToken: string;
}
const defaultAuthStatus : IAuthStatus = {role: AuthRoles.rolEspectador, primarysid: null, unique_name: null }