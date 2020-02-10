import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { ArticuloManufacturado } from 'src/app/models/articulo-manufacturado';


@Component({
  selector: 'app-admin-productos',
  templateUrl: './admin-productos.component.html',
  styleUrls: ['./admin-productos.component.css']
})
export class AdminProductosComponent implements OnInit {

  listaArtManufacturados: ArticuloManufacturado[]=[new ArticuloManufacturado(13,15,"Tarta",150)];
  closeResult: string;
  

  constructor(private servicio:ProductoService) { }

  ngOnInit() {
    this.getArticulosManufacturados()
  }

  getArticulosManufacturados(){
    return this.servicio.getData('/articulo_manufacturado/')
    .subscribe(lam =>{
      this.listaArtManufacturados = lam}
      ,error=>{
        alert(error);
      } )
  }

  //eliminar articulo manufacturado
  removeArticuloManufacturado(id){
    let confirmacion;
    const articuloSelected = this.listaArtManufacturados.filter(x => x.id === id).shift();
    if(!articuloSelected){
      return "no existe Artiuclo con id: "+id; 
    }
    if (confirm(`Seguro que deseas eliminar el producto ${articuloSelected.denominacion} ${id} ?`) == true) {
      confirmacion = `Se ha eliminado un el producto ${articuloSelected.denominacion} ${id}`;
      this.servicio.removeData(`/articulo_manufacturado/${id}`).toPromise()
      .then(x => this.getArticulosManufacturados());
    } else {
      confirmacion = "Cancelado!";
    }
  }
  // update articulo manufacturado
  modifyArticuloManufacturado(id, obj){


    this.servicio.putData(`/articulo_manufacturado/${id}`, obj).toPromise()
    .then(x=> this.getArticulosManufacturados());
  }



}
