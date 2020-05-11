import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Articulo } from 'src/app/models/articulo';
import { ArticuloManufacturado } from 'src/app/models/articulo-manufacturado';
import { ArticuloManufacturadoDetalle } from 'src/app/models/articulo-manufacturado-detalle';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  @Input() unidad:Articulo|ArticuloManufacturado;
  @Output() carrito = new EventEmitter();
  detalles:ArticuloManufacturadoDetalle[]=[];
  insumos:Articulo[]=[];
  listaXproducto:String[]=[];

  constructor(private servicio: ProductoService) { }

  ngOnInit() {
    this.initDetalles();
    this.initInsumos();
    console.log(this.unidad);
    
    setTimeout(()=>{
    this.fillListaxPorducto()},500);
  }
  initDetalles(){
    this.servicio.getData('ArticuloManufacturadoDetalle')
    .subscribe(x =>
      x.map(
         d => this.detalles.push(new ArticuloManufacturadoDetalle(d.articuloManufacturadoId,d.articuloId,d.cantidad))
       )
     ); 
  }
  initInsumos(){
    this.servicio.getData("/Articulo")
    .subscribe(data => data.filter(x => x.esInsumo).map(
      a =>{
        this.insumos.push(
       new Articulo(
        a.id,
        a.denominacion,
        a.precioCompra,
        a.precioVenta,
        a.stockActual,
        a.unidadMedida,
        a.esInsumo,
        a.rubroArticulo))}))    
  }
  onCarrito(unidad){
    console.log(unidad);
    this.carrito.emit(unidad);
  }
  checkDataType(unidad:ArticuloManufacturado| Articulo){
    return unidad instanceof ArticuloManufacturado;
  }
  fillListaxPorducto(){
    if(!(this.unidad instanceof ArticuloManufacturado)){
      return;
    }
    
    let listaIdArticulo =[];
    this.detalles.map(row =>{
      if(row.articuloManufacturadoId == this.unidad.id){
        listaIdArticulo.push(row.articuloId);
    }});
console.log(listaIdArticulo);

    this.insumos.map(row =>{
      if(listaIdArticulo.includes(row.id)){
        this.listaXproducto.push(row.denominacion);
      }
    });
  }

}
