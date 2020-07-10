import { Component, OnInit } from '@angular/core';
import { Routes, ActivatedRouteSnapshot, Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {
  password:string='';
  passwordconfirm:string='';
  claseform={
    pass1:"form-control",
    pass2:"form-control"
  };
  habilitado:boolean= false;
  private uid= this.activatedRoute.snapshot.queryParams['id'];

  constructor(private router: Router,private activatedRoute:ActivatedRoute,private servicio: ProductoService) { }

  ngOnInit() {
    console.log(this.uid);
    
    this.servicio.getData(`ResetPassword?id=${this.uid}`)
    .subscribe(data =>{
      console.log(data);
      
      if(data){
        this.habilitado = true;
      }else{
        this.router.navigate(["ingreso","login"]);
        return false
      }
    })
  }

  passwordValidation(password){
    // validar solo la primera y despues validar que la segunda sea igual
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    const esValido = regex.test(password) && (this.password == this.passwordconfirm);
    if(regex.test(password)){
      this.claseform.pass1 = "form-control is-valid";
      if(this.password == this.passwordconfirm){
        this.claseform.pass2 = "form-control is-valid";
        return true;
      }else{
        this.claseform.pass2 = "form-control is-invalid";
        return false;
      }
    }else{
      this.claseform.pass1 = "form-control is-invalid";
      return false;
    }
  }

  updatePassword(){
    return this.servicio.putData('ResetPassword', {nuevoPassword:this.password, uid:this.uid});
  }

  onSubmit(){
    const esValido = this.passwordValidation(this.password);
    if(esValido){
      this.updatePassword().subscribe(data => {
        if(data){
          alert("Se ha modificado tu password exitosamente");
          this.router.navigate(["ingreso","login"]);
        }
      })
    }
  }
}
