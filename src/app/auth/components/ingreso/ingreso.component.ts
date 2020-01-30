import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css']
})
export class IngresoComponent implements OnInit {

  
  constructor(private auth: AuthService) { }


  ngOnInit() {
  }

  ingresar(){
    this.auth.login('');
  }

}
