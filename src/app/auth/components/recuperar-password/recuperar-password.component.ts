import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css']
})
export class RecuperarPasswordComponent implements OnInit {

  constructor(private service:ProductoService) { }
  email:'';
  claseform: string = "form-control";
  mensajeEnviado:boolean=false;
  ngOnInit() {

  }
  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  onSubmit(){
    if(this.validateEmail(this.email)){
      this.claseform = "form-control is-valid"
      this.service.postObservable('ResetPassword',{ToEmail:this.email})
      .subscribe(data => this.mensajeEnviado = data);
    }else{
      this.claseform = "form-control is-invalid"
    }
  }
}
