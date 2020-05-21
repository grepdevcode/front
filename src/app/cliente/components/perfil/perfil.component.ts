import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  idUsuario;
  cliente;
  domicilioUsuario;
  texto={nombre:"", email:""};
  telefono;
  model={
    calle:"",
    numero:0,
    localidad:""
  };
  isLoaded=false
  modoEditar=false;

  constructor(private auth: AuthService, private service:ProductoService) {
   }

  ngOnInit() {
    this.idUsuario = this.auth.getIdUsuario();
    this.service.getData(`Cliente/${this.idUsuario}`).subscribe(item => this.cliente = item);
    this.getDomicilio().subscribe(list => {
      this.domicilioUsuario =list.find(item => item.clienteId == this.idUsuario)
      console.log(this.cliente);
      console.log(this.domicilioUsuario);
    });
    setTimeout(() => {
      this.isLoaded = true
      this.setValores()
    }, 800);
  }

getCliente(id){
  return this.service.getData("Cliente/"+id);
}
getDomicilio(){
  return this.service.getData("Domicilio")
}
setValores(){
  this.texto.nombre = this.cliente["nombre"] + " "+ this.cliente["apellido"] 
  this.texto.email = this.cliente["email"]
  this.telefono = this.cliente["telefono"]
  this.model.calle = this.domicilioUsuario["calle"]
  this.model.numero = this.domicilioUsuario["numero"]
  this.model.localidad = this.domicilioUsuario["localidad"]
}
habilitarEditar(){
  this.modoEditar = true
}
editarCliente(){
  this.modoEditar = false
  const nuevoDomicilio = {...this.domicilioUsuario, ...this.model};
  const nuevoCliente = {...this.cliente, telefono: +this.telefono };
  console.log(nuevoDomicilio);
  console.log(nuevoCliente);
  this.service.putData(`Domicilio`,nuevoDomicilio).subscribe(item =>{
    this.getDomicilio();
  });
  this.service.putData(`Cliente`,nuevoCliente).subscribe(item =>{
    this.getCliente(nuevoCliente.id).subscribe(item => this.cliente = item)
  }
  );
}
}
