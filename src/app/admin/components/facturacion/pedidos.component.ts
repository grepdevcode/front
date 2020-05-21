import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { error } from 'protractor';
import { Factura } from 'src/app/models/factura';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styles: []
})
export class PedidosComponent implements OnInit {
listaPedidos=[];
listaDetalles={};
isLoaded=[false,false];
  constructor(private servicio:ProductoService) { }

ngOnInit() {
  this.initPedidos()
  .subscribe(list =>{
    this.listaPedidos = list.filter(item => item.estado != 4);
     this.isLoaded[0]=true;
     list.forEach(item=>{
      this.initDetalles(item.id)
      .subscribe(subList =>{
        this.listaDetalles[item.id] = subList;
          this.isLoaded[1]=true;
      });
     })
    });
  
  setTimeout(() => {
    console.log(this.listaDetalles);
   // this.isLoaded[1]=true
  }, 5000);
}
initPedidos(){
  return this.servicio.getData('Pedido');
}
initDetalles(id){
   return  this.servicio.getData(`DetallePedido/${id}`);
}
getTipoEnvio(tipoEnvio){
  switch (tipoEnvio) {
    case 0:
      return "Delivery";
    case 1: 
      return "Retira en Local";
    default:
      return "Error";
  }
}
getEstado(estado){
  switch (estado) {
    case 1:
      return "En espera";
    case 2: 
      return "En Cocina";
    case 3:
      return "Listo";
    default:
      return "Error";
  }
}
getDescuento(id){
  const tipoEnvio=  this.listaPedidos.find(item => item.id == id)['tipoEnvio'];
  if(tipoEnvio == 1){
    return 0.10
  }
  return 1
}
getTotal(pedidoid){
  return this.listaDetalles[pedidoid].reduce((prev,item) => prev + item.subtotal,0);
}
pagarYGenerarFactura(pedido){
  console.log(pedido);
  const total= this.getTotal(pedido.id);
  const descuento= this.getDescuento(pedido.id) * total;

  let auxPedido = {...pedido, estado: 4}; // estado 4 -> pagado
  const putObject ={pedido:auxPedido, detallePedido: this.listaDetalles[auxPedido.id]}
console.log(auxPedido);

  let a = new Factura(new Date(),0,descuento,total,pedido.id);
  this.servicio.postObservable('Factura',a)
  .subscribe(res => {
    putObject.detallePedido.forEach(element => {
      element.facturaId = Number(res);
    });
    this.servicio.putData('DetallePedido',putObject).subscribe( item=>
      this.initPedidos()
    );
  },
  error=>console.log(error)
   );
}
}
