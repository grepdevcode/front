import { Component, OnInit } from '@angular/core';
import { IngresoService } from 'src/app/services/ingreso.service';
import { Usuario } from 'src/app/interfaces/usuario';


@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css']
})
export class IngresoComponent implements OnInit {

  
  constructor(private _ingresoService: IngresoService ) { }


  ngOnInit() {
  }

  ingresar(email:string,password:string,event:Event){

    event.preventDefault();
    this._ingresoService.login(email,password)
    .subscribe(
      res =>{ console.log(res);},
      error =>{ console.log(error)},
    )
  }


}
