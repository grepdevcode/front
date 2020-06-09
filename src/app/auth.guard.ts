import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, CanLoad, Router, ActivatedRoute, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, IAuthStatus } from './services/auth.service';
import { tap } from 'rxjs/operators';
import { AuthRoles } from './auth/auth-roles.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad{
  protected currentAuthStatus:IAuthStatus;
  canLoad(route: import("@angular/router").Route, segments: import("@angular/router").UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
    if(route.path === 'tienda' ){
      return this.accesoTienda(route);
    }else{
      return this.checkLogin() && this.checkPermiso(route);
    }
    
  }

  constructor(private auth: AuthService, private router:Router) {
    this.auth.authStatus.subscribe(auth => this.currentAuthStatus = this.auth.getAuthStatus())
  }

  checkLogin(){
    if(this.auth.getToken()== null || this.auth.getToken() == '' ){
      alert('Para acceder primero debes hacer login');
      this.router.navigate(['ingreso']);
      return false;
    }
    return true;
  }

  protected checkPermiso(route?:Route ){
    let rolmatch = true;

    if(route){
      const expectedRol = route['data'].expectedRol;
      console.log(expectedRol);
      
      if(expectedRol){
        rolmatch = this.currentAuthStatus.role === expectedRol;
      }

    }
    if(!rolmatch){
      alert("No tienes permiso para acceder a esta sección" );
      return false;
    }
    return rolmatch;
  }
  protected accesoTienda(route:Route){
    let rolmatch = false;
    if(route){
      rolmatch = this.currentAuthStatus.role === AuthRoles.rolCliente  || this.currentAuthStatus.role === AuthRoles.rolEspectador ;
    }
    return rolmatch;
  }
}
