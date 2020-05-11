import { Component, OnInit } from '@angular/core';
import { Articulo } from 'src/app/models/articulo';
import { ProductoService } from 'src/app/services/producto.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  listaArticulos:Articulo[]=[];
  
  constructor(private servicio:ProductoService,private router:Router) { }

  ngOnInit() {
    this.getArticulos();
  }
  // Tomar articulos del backend
  getArticulos(){
    this.servicio.getData('/Articulo')
    .subscribe(art => this.listaArticulos = art.map(x =>
       new Articulo(
         x.id,
         x.denominacion,
         x.precioCompra,
         x.precioVenta,
         x.stockActual,
         x.unidadMedida,
         x.esinsumo,
         x.rubroArticulo
        )
      ),
      error=>console.log('error en getArticulos', error)
    )
    
  }
  // Envia DELETE request con el bojeto a borrar
  removeArticulo(articulo){
    if(confirm("Desea eliminar el articulo "+articulo.id+"?")){
      this.servicio.removeData("/Articulo",articulo)
      .subscribe(elim => this.getArticulos(),
      error =>{alert('ha habido un error no se ha podido eliminar el articulo'); console.log(error)})
    }
  }




}
