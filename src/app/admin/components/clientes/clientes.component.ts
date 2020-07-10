import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { Cliente } from 'src/app/models/cliente';
import { error } from 'protractor';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
page =0;
  listaUsuarios:Cliente[] = [];

  constructor(private servicio: ProductoService){}

  ngOnInit() {
    this.getClientes('/Cliente/1/10').subscribe(clientes => this.listaUsuarios = clientes);
  }
  getClientes(url){
   return this.servicio.getData(url);
  }
  cambiarRol($event,usuario){
    const pass = confirm(`Esta por cambiar los permisos del usuario ${usuario.id}, esta seguro de realizar esta modificación?`)
    if(pass){
      usuario.roles = $event.target.value;
      this.updateCliente(usuario);
    }
  }
  removeCliente(cliente){
    const permiso = confirm(`Esta seguro que desae eliminar a el usuario ${cliente.nombre} ${cliente.apellido}?`);
    if(permiso){
      this.servicio.removeData(`Cliente`,cliente).subscribe((data) => this.getClientes(`/Cliente/${this.page}/10`),error =>  alert('lo sentimos hubo un error'))
    }
  }
  updateCliente(cliente){
    this.servicio.putData('Cliente',cliente).subscribe(updated => alert("se ha actualizado un registro"), error=> alert("No se aha podido actualizar el cliente"))
  }
  paginationChange(){
    this.getClientes(`Cliente/${this.page}/10`).subscribe(list=> this.listaUsuarios = list)
  }
}
