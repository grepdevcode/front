import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductoService } from 'src/app/services/producto.service';
import { Router } from '@angular/router';
import { error } from 'protractor';


@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css']
})
export class IngresoComponent implements OnInit {
  loginError='';
  cartel:boolean=true;
  formIngreso = new FormGroup( 
    {
      email: new FormControl(null,Validators.compose([Validators.email,Validators.required])),
      password: new FormControl(null,Validators.compose([Validators.required,Validators.maxLength(8),Validators.minLength(8)]))
  });

  constructor(private auth: AuthService, private servicio: ProductoService,private route:Router) { }

  ngOnInit() {
    this.auth.logout();
  }
  postIngreso(){
    if(this.formIngreso.valid){
      const data = this.formIngreso.value;
      this.auth.login(data["email"], data["password"])
      .subscribe(authResponse=>{
        console.log(authResponse);
        
        this.route.navigate(["/"])
      },error => this.loginError = error)
    }
  }
  onSubmit(){
  this.postIngreso();
  }
}
