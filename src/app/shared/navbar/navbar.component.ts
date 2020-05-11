import { Component, OnInit } from '@angular/core';
import { AuthService, IAuthStatus } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AuthRoles } from 'src/app/auth/auth-roles.enum';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  protected currentAuthStatus:IAuthStatus;
  AuthRoles= [AuthRoles.rolAdmin,AuthRoles.rolCocina,AuthRoles.rolCliente];
  constructor(private auth: AuthService, private router: Router) {
    this.auth.authStatus.subscribe(auth => this.currentAuthStatus = this.auth.getAuthStatus())
   }

  ngOnInit() {
    
  }

  ingresar(){
    this.router.navigateByUrl('ingreso/login');
  }
  salir(){
    this.auth.logout();
    this.router.navigate(["tienda","productos"])
  }

  estaLogeado(){
    if(this.currentAuthStatus.unique_name){
      return true;
    }
    return false;
  }
  

}
