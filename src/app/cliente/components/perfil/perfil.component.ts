import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {
    
  }

}
