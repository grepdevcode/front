import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductoService } from 'src/app/services/producto.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css']
})
export class IngresoComponent implements OnInit {

  
  constructor(private auth: AuthService, private servicio: ProductoService,private route:Router) { }
  
  cartel:boolean=true;
  formIngreso = new FormGroup( 
    {
      email: new FormControl(null,Validators.compose([Validators.email,Validators.required])),
      password: new FormControl(null,Validators.compose([Validators.required,Validators.maxLength(8),Validators.minLength(8)]))
  });

  ngOnInit() {
  }
  postIngreso(){
    if(this.formIngreso.valid){
      return this.servicio.postObservable('/ingreso/',this.formIngreso.value)
      .subscribe((res:Response)=>{
        (res.ok)?this.route.navigateByUrl('/'):alert('ha habido un error por favor revisa tu contraseña o correo')
      })
    }
  }
  onSubmit(){
    //this.postIngreso();
    
    this.postConFireBase();
  }
  postConFireBase(){
    if(this.formIngreso.valid){
      this.auth.login(this.formIngreso.value).subscribe(data => console.log('respuesta',data),error =>{console.log(error.error.message)});
    }
  }
}
