import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/models/pedido';
import { ProductoService } from 'src/app/services/producto.service';
import { AuthService } from 'src/app/services/auth.service';
import { DetallePedido } from 'src/app/models/detalle-pedido';
import { Articulo } from 'src/app/models/articulo';
import { ArticuloManufacturado } from 'src/app/models/articulo-manufacturado';
import { error } from 'protractor';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  listaPedido=[];
  listaArticulos:Articulo[]=[];
  listaManufacturados:ArticuloManufacturado[]=[];
  Id;
  isLoaded=false;
  constructor(private servicio: ProductoService, private auth:AuthService) { }

  ngOnInit() {
    this.getId();
    this.getPedidoLista().subscribe(ob => {this.listaPedido = ob; setTimeout(() => {
      this.isLoaded = true
    }, 2000);  });
    this.getManufacturados();
    this.getArticulos();

  }
  getId(){
    return this.Id=this.auth.getIdUsuario();
  }
  getPedidoLista():Observable<any[]>{
    return this.servicio.getData(`ListaPedido/${this.Id}`)
  }
  getManufacturados(){
   return this.servicio.getData(`ArticuloManufacturado`).subscribe(list => this.listaManufacturados = list);
  }
  getArticulos(){
    this.servicio.getData(`Articulo`).subscribe(list => this.listaArticulos = list);
    console.log(this.listaPedido);
    
  }
  getDetalles(i){
    let array='';
    this.listaPedido[i]['listaDetalles'].forEach(item =>{
      if(item.articuloId){
      array += `-${item.cantidad} x ${this.getNombreArticuloById(item.articuloId)} \n`;
      }else if(item.articuloManufacturadoId){
        array += `-${item.cantidad} x ${this.getNombreManufacturadoById(item.articuloManufacturadoId)}\n`;
      }
    });
    return array;
  }
  getNombreArticuloById(id){
    return this.listaArticulos.find(item => item.id == id).denominacion
  }
  getNombreManufacturadoById(id){
    return this.listaManufacturados.find(item => item.id == id).denominacion
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
  getTotal(i){
    const total=this.listaPedido[i]['listaDetalles'].reduce((prev,item) => prev + item.subtotal,0);
    if(this.listaPedido[i]['tipoEnvio'] == 1){
      return total - (0.1 * total);
    }
    return this.listaPedido[i]['listaDetalles'].reduce((prev,item) => prev + item.subtotal,0);
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
  cancelarPedido(item){
   if(!this.sePuedeCancelar(item.horaEstimadaFin)) return false;
   this.reemplazarCeros(item);
   const pedido = {...item};
   delete pedido.listaDetalles
   const lista = [...item.listaDetalles];
   console.log({pedido:pedido,listaDetalles:lista});
    if(confirm("Estas seguro que deseas cancelar el pedido?")){
      this.servicio.putData('ListaPedido/cancelar',{pedido: pedido, detallePedido:lista}).subscribe(res=>{
        if(res){
          this.servicio.removeData("Pedido",{pedido: pedido, detallePedido:lista}).subscribe(ob => this.getPedidoLista().subscribe(ob => this.listaPedido = ob)) 
        }
      })
      //this.servicio.removeData("Pedido",item).subscribe(ob => this.getPedidoLista().subscribe(ob => this.listaPedido = ob)) 
    }
  }
  sePuedeCancelar(horaFin:Date):boolean{
    const horaActual = new Date();
    let horaLimite =new Date(horaFin);
    horaLimite.setHours(horaLimite.getHours() -1);
    if( horaActual >= horaLimite){
      return false;
    }
    return true;
  }
  reemplazarCeros(item){
    if(item){
      item.listaDetalles.forEach(element => {
        if(element.articuloId == 0){
          element.articuloId = null;
        }else if(element.articuloManufacturadoId == 0){
          element.articuloId = null;
        }
        if(element.facturaId == 0) element.facturaId =null;
      });
      return item;
    }
  }
}