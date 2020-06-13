import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/models/pedido';
import { ProductoService } from 'src/app/services/producto.service';
import { ArticuloManufacturadoDetalle } from 'src/app/models/articulo-manufacturado-detalle';
import { DetallePedido } from 'src/app/models/detalle-pedido';
import { ArticuloManufacturado } from 'src/app/models/articulo-manufacturado';

@Component({
  selector: 'app-cocina',
  templateUrl: './cocina.component.html',
  styleUrls: ['./cocina.component.css']
})
export class CocinaComponent implements OnInit {
  listaPedidos : Pedido[]=[];
  listaDetalles={};
  ListaProductos:ArticuloManufacturado[]=[];
  estados={1: "En espera", 2: "En Cocina", 3: "Listo"};
  constructor(private servicio:ProductoService) { }

  ngOnInit() {
    this.initPedidos().subscribe(array =>{
      this.listaPedidos = array.filter(row => row["estado"] < 3 )
      this.initDetallePedidos();
    } );
    this.initArticulosManufacturados().subscribe(list => this.ListaProductos = list);
  }
/**
 * Estados:
 * 1- En Espera
 * 2- En cocina
 * 3- Listo
 * 4- Pagado
 * 5- Cancelado?
 */
  // Tomar los pedidos del backend, excepto los que ya estan listos( estado 3)
  initPedidos(){
    return this.servicio.getData("Pedido")
  }
  // Tomar los Detalles del backend 
  initDetallePedidos(){
    this.listaPedidos.forEach(pedido=>{
      this.servicio.getData(`DetallePedido/${pedido.id}`)
      .subscribe(list => {
        this.listaDetalles[pedido.id]= list.filter(item => item.articuloManufacturadoId)
    })
  });
  }
  //Tomar los Articulos Manufacturados del backend.
  initArticulosManufacturados(){
    return this.servicio.getData('ArticuloManufacturado')

  }
  // Envia una Put request al backend
  updateEstadoPedido(pedido:Pedido){
    pedido.estado += 1;
    this.servicio.putData(`Pedido`,pedido)
    .subscribe(row =>{
      if(row){
        this.initPedidos().subscribe(array =>{
          this.listaPedidos = array.filter(row => row["estado"] < 3 )
          this.initDetallePedidos();
        } );
      }
    });
  }
  // Cambiar el estdo del pedido
  cambiarEstadoPedido(pedido:Pedido){
    if(pedido.estado <= 3){
      if(confirm("cambiaras el estado a "+ this.estados[`${pedido.estado + 1 }`]+ ", estas seguro?" )){
        this.updateEstadoPedido(pedido);
      //   this.initPedidos().subscribe(array =>{
      //     this.listaPedidos = array.filter(row => row["estado"] < 3 );
      //     this.initPedidos().subscribe(array =>{
      //       this.listaPedidos = array.filter(row => row["estado"] < 3 )
      //       this.initDetallePedidos();
      //     } );
      //   });
       }
    }
  }
  // Cambia la fecha date a un formato hh:mm
  cambiarFormatoFechaHhMm(date:Date){
    const fecha = new Date(date);
    return `${fecha.getHours()}:${fecha.getMinutes()}`
  }
  // Extraer lista de Articulos Manufacturados por id Pedido
  generarListadeArticulosManufacturado(item:any|null){
      return this.ListaProductos.find(art => art.id == item.articuloManufacturadoId).denominacion;
  }
}
