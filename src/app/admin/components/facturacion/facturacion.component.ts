import { Component, OnInit } from '@angular/core';
import { Factura } from 'src/app/models/factura';
import { ProductoService } from 'src/app/services/producto.service';
import { Observable } from 'rxjs';
import * as jsPDF from 'jspdf'
import { DetallePedido } from 'src/app/models/detalle-pedido';
import { Articulo } from 'src/app/models/articulo';
import { ArticuloManufacturado } from 'src/app/models/articulo-manufacturado';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {
  listaFacturas:Factura[];
  listaArticulos:Articulo[]=[];
  listaManufacturados:ArticuloManufacturado[]=[];
  constructor(private servicio: ProductoService) { }

  ngOnInit() {
    this.initFacturas().subscribe(list=> this.listaFacturas = list)
    this.getArticulos();
    this.getManufacturados();
  }
  
initFacturas(){
 return this.servicio.getData('Factura');
}
getDetalleByPedido(pedidoId){
  return this.servicio.getData(`DetallePedido/${pedidoId}`);
}
getArticulos(){
 this.servicio.getData('Articulo').subscribe(list => this.listaArticulos = list);
}
getManufacturados(){
  this.servicio.getData('ArticuloManufacturado').subscribe(list => this.listaManufacturados = list);
}
findDenominacion(detalle:Detalles){
  if(detalle.articuloId){
   return this.listaArticulos.find(item => item.id == detalle.articuloId).denominacion;
  }else if( detalle.articuloManufacturadoId){
    return this.listaManufacturados.find(item=> item.id == detalle.articuloManufacturadoId).denominacion;
  }else{
    return '';
  }
}
getDataDetalle(detalle:Detalles){
  return `- ${this.findDenominacion(detalle)} x ${detalle.cantidad} - ${detalle.subtotal}\n`
}
generarPdf(factura:Factura){
  console.log("generarPdf", factura);
  
  let textoDetalle= [];
  this.getDetalleByPedido(factura.pedidoId)
  .subscribe(list =>{
    list.forEach((item:Detalles) =>{
      textoDetalle.push( this.getDataDetalle(item));
    })
    this.escribirFactura(factura, textoDetalle)

  });

}

escribirFactura(factura:Factura,detalles){
  var doc = new jsPDF();
  doc.text('Gracias por comprar en el Buen Sabor!', 10, 10);
  doc.text(`N° Factura: ${factura.pedidoId}`, 10, 20);
  doc.text(`Fecha: ${factura.fecha}`, 10, 30);
  doc.text(`Pedido: ${factura.pedidoId}`, 10, 40);
  doc.text(`Total: $${factura.total}`, 10, 50);
  doc.text(`Descuento: $${factura.montoDescuento}`, 10, 60);
  doc.text(`Final: $${factura.total - factura.montoDescuento}`, 10, 70);
  doc.text('---------- Detalle---------',10,80)
  detalles.forEach((item,index) => {
    doc.text(item,20,(90 + 10 * index))
  })
  doc.output('dataurlnewwindow');
}

}

interface Detalles{
  id: number,
  cantidad: number,
  subtotal: number
  facturaId: number,
  pedidoId :number
  articuloManufacturadoId:number,
  articuloId: number
}