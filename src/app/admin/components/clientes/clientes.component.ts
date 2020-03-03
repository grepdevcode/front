import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  listaUsuarios:any[] = [];

  constructor(private servicio: ProductoService){}

  ngOnInit() {
    this.getClientes();
  }
  getClientes(){
    this.servicio.getData('/clientes/').subscribe(clientes => this.listaUsuarios = clientes );
  }
  removeCliente(index){
    const permiso = confirm(`Esta seguro que desae eliminar a el usuario ${this.listaUsuarios[index].nombre} ${this.listaUsuarios[index].apellido}?`);
    if(permiso){
      this.servicio.removeData(`/clientes/${index}`).subscribe((data:Response) => (data.ok)? this.getClientes(): alert('lo sentimos hubo un error'))
    }
  }
}
