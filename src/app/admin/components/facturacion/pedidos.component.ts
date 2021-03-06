import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { error } from 'protractor';
import { Factura } from 'src/app/models/factura';
import { DetallePedido } from 'src/app/models/detalle-pedido';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styles: []
})
export class PedidosComponent implements OnInit {
  page=1;
listaPedidos=[];
listaDetalles={};
listaCliente=[];
isLoaded=[false,false];
listaDomicilio: any=[];
listaArticuloManufacturado: any[]=[];
  listaArticulo=[];
  constructor(private servicio:ProductoService, private router:Router) { 
    this.initPedidos('Pedido/1/10')
    .subscribe(list =>{
      this.listaPedidos = list.filter(item => item.estado != 4);
       
       list.forEach(item=>{
        this.initDetalles(item.id)
        .subscribe(subList =>{
          this.listaDetalles[item.id] = subList;
        });
       })
      });
      this.getClientes().subscribe(list =>{
         this.listaCliente = list;
        });
        this.getDomicilio().subscribe(list => {
          this.listaDomicilio = list
        })
        this.getArticulosManufacturados().subscribe(list => this.listaArticuloManufacturado = list)
        this.getArticulos().subscribe(list =>{
           this.listaArticulo = list;
            this.isLoaded[0]=(this.listaArticulo.length > 0)? true:false })
  }

ngOnInit() {
  
  
  setTimeout(() => {
    
    this.isLoaded[1]=true;
  }, 1500);
}
initPedidos(url){
  return this.servicio.getData(url);
}
initDetalles(id){
   return  this.servicio.getData(`DetallePedido/${id}`);
}
getClientes(){
 return this.servicio.getData("Cliente/0/0")
}
getDomicilio(){
  return this.servicio.getData("Domicilio")
}
getArticulos(){
  return this.servicio.getData("Articulo/0/0")
}
getArticulosManufacturados(){
  return this.servicio.getData("ArticuloManufacturado/0/0")
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
  return 0
}
getTotal(pedidoid){
  return this.listaDetalles[pedidoid].reduce((prev,item) => prev + item.subtotal,0);
}
getDemora(id){
  const detalles =this.listaDetalles[id].filter(item => item.articuloManufacturadoId != null);
  const articulosManu = detalles.map(elemento => {
    return this.listaArticuloManufacturado.find(item => item.id == elemento.articuloManufacturadoId);
  });
  return articulosManu.reduce((acc, current) => {
    return acc+ current.tiempoEstimadoCocina;
  },0);
  // return this.listaDetalles[id].reduce((prev,current) => {
  //   let art;
  //   if(current.articuloManufacturadoId){
  //     let aux = this.listaArticuloManufacturado.find(item => item.id == current.articuloManufacturadoId);
  //     console.log(aux);
      
  //     art = aux.tiempoEstimadoCocina;
  //   }else{
  //     art =0;
  //   }
  //   console.log(prev.tiempoEstimadoCocina + art.tiempoEstimadoCocina);
    
  //   return prev.tiempoEstimadoCocina + art
  // },0)
}
findCliente(clienteid){
  return this.listaCliente.find(item => item.id == clienteid);
}
findDomicilio(id){
  return this.listaDomicilio.find(item => item.clienteId == id)
}
findDenominacion(detalle){
  if(detalle.articuloId){
    return this.listaArticulo.find(item => item.id == detalle.articuloId).denominacion;
  }else if(detalle.articuloManufacturadoId){
    return this.listaArticuloManufacturado.find(item => item.id == detalle.articuloManufacturadoId).denominacion;
  }
}

pagarYGenerarFactura(pedido){
  console.log(pedido);
  const total= this.getTotal(pedido.id);
  const descuento= this.getDescuento(pedido.id) * total;
  

  let auxPedido = {...pedido, estado: 4}; // estado 4 -> pagado
  const detalles = this.listaDetalles[auxPedido.id].map(item => {
    if(item.articuloManufacturadoId){
       item.articuloId = null
    }else if(item.articuloId){
       item.articuloManufacturadoId = null
    }
    return item
  })

  const putObject ={pedido:auxPedido, detallePedido: detalles}
console.log(putObject);

  let a = new Factura(new Date(),0,descuento,total,pedido.id);
  this.servicio.postObservable('Factura',a)
  .subscribe(res => {
    console.log(res);
    putObject.detallePedido.forEach(element => {

      element.facturaId = Number(res);
    });
    this.servicio.putData('DetallePedido', putObject).subscribe( item=>
      this.initPedidos(`Pedido/${this.page}/10`)
      .subscribe(list =>{
        this.listaPedidos = list.filter(item => item.estado != 4);
         
         list.forEach(item=>{
          this.initDetalles(item.id)
          .subscribe(subList =>{
            this.listaDetalles[item.id] = subList;
          });
         })
        })

    );
  },
  error=>console.log(error)
   );
}

cancelarPedido(item){
  if(!this.sePuedeCancelar(item)) return false;
  const lista = this.reemplazarCeros(item);
  console.log({pedido:item,listaDetalles:lista});
   if(confirm("Estas seguro que deseas cancelar el pedido?")){
     this.servicio.putData('ListaPedido/cancelar',{pedido: item, detallePedido:lista}).subscribe(res=>{
       if(res){
         this.servicio.removeData("Pedido",{pedido: item, detallePedido:lista})
         .subscribe( x=>{
          this.initPedidos(`Pedido/${this.page}/10`)
          .subscribe(list =>{
            this.listaPedidos = list.filter(item => item.estado != 4);
             
             list.forEach(item=>{
              this.initDetalles(item.id)
              .subscribe(subList =>{
                this.listaDetalles[item.id] = subList;
              });
             })
            });
            this.getArticulos().subscribe(list =>
              this.listaArticulo = list);
          }
         )
       }
     })
     //this.servicio.removeData("Pedido",item).subscribe(ob => this.getPedidoLista().subscribe(ob => this.listaPedido = ob)) 
   }
 }
 sePuedeCancelar(item):boolean{
   return (item.estado === 1 )?true: false;  
 }
 reemplazarCeros(item){
   if(item){
     const lista = this.listaDetalles[item.id];
     lista.forEach(element => {
       if(element.articuloId == 0){
         element.articuloId = null;
       }else if(element.articuloManufacturadoId == 0){
         element.articuloId = null;
       }
       if(element.facturaId == 0) element.facturaId =null;
     });
     return lista;
   }
 }

 paginationChange(){
  this.initPedidos(`Pedido/${this.page}/10`)
  .subscribe(list =>{
    this.listaPedidos = list.filter(item => item.estado != 4);
     
     list.forEach(item=>{
      this.initDetalles(item.id)
      .subscribe(subList =>{
        this.listaDetalles[item.id] = subList;
      });
     })
    });
}

}

