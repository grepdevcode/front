import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { ArticuloManufacturado } from 'src/app/models/articulo-manufacturado';


@Component({
  selector: 'app-admin-productos',
  templateUrl: './admin-productos.component.html',
  styleUrls: ['./admin-productos.component.css']
})
export class AdminProductosComponent implements OnInit {
  page=1;
  listaArtManufacturados: ArticuloManufacturado[]=[];
  closeResult: string;
  

  constructor(private servicio:ProductoService) { }

  ngOnInit() {
    this.getArticulosManufacturados()
  }
  // Tomar articulos manufacturados del Backend.
  getArticulosManufacturados(){
    return this.servicio.getData(`/ArticuloManufacturado/${this.page}/10`)
    .subscribe(lam =>{
      this.listaArtManufacturados = lam}
      ,error=>{
        alert(error);
      } )
  }
  //eliminar articulo manufacturado.
  removeArticuloManufacturado(articuloManufacturado){
    let confirmacion;
    if (confirm(`Seguro que deseas eliminar el producto ${articuloManufacturado.denominacion} ${articuloManufacturado.id} ?`) == true) {
      confirmacion = `Se ha eliminado un el producto ${articuloManufacturado.denominacion} ${articuloManufacturado.id}`;
      this.servicio.removeData(`/ArticuloManufacturado/`,articuloManufacturado)
      .subscribe(res => {
        alert(confirmacion);
        this.getArticulosManufacturados();
      });
    } else {
      confirmacion = "Cancelado!";
    }
  }

  paginationChange(){
    this.getArticulosManufacturados();
  }

}
