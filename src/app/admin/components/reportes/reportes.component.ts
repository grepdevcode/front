import { Component, OnInit} from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { min } from 'rxjs/operators';
import { element } from 'protractor';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  reporteSelect:number;
  listaClientes=[];
  listaPedidos=[];

  comidasMasPedidas={
    qq : [{ data: [50, 50, 50, 50, 50, 50, 50], label: 'Comidas Mas Pedidas' }],
    nn : ["test","test","test","test","test", "test"]
  }

  clientesRegistrados={
    qq : [{ data: [], label: 'Cleintes Registrados' }],
    nn : []
  }

  ingresos={
    qq : [{ data: [78,54,42,95,12,23], label: 'Ingresos' }],
    nn : ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"]
  }

  pedidos={
    qq : [{ data: [], label: 'Pedidos' }],
    nn : []
  }

  pedidosXCliente={
    qq:[{data:[], label:""}],
    nn:[]
  }

  constructor(private servicio: ProductoService) { }

  ngOnInit() {
    this.getCliente().subscribe(list => {
      this.listaClientes = list.filter(item => item.roles == "permiso_Cliente")
    })
    // Comidas mas pedidas ----> Funciona
    this.getReporte().subscribe(list =>{
      console.log(list)
      this.comidasMasPedidas.nn= list.map(item=> item["Denominacion"]);
      this.comidasMasPedidas.qq[0] = {data: list.map(item=> item["Total"]), label:'Comidas Mas Pedidas' }
    });
    // Clintes registrados por periodo de tiempo  ---> Funciona
    this.getReporte(1,"2020-1-1","2020-6-30").subscribe(list =>{
      console.log("clientes registrados",list);
      let qq =[{ data: list.map(item => item.Cantidad), label: 'Clientes Registrados' }];
      Object.assign(this.clientesRegistrados.qq,qq)
      this.clientesRegistrados.nn = list.map(item => this.switchMes( item.Mes))
    });
    // ingresos por periodo de tiempo
    this.getReporte(2,"2020-1-1","2020-6-30").subscribe(list =>{
      console.log("Ingreso por periodo de tiempo",list);
      let qq =[{ data: list.map(item => item.Total), label: 'Ingresos' }];
      Object.assign(this.ingresos.qq,qq)
      this.ingresos.nn = list.map(item => this.switchMes( item.Mes))
    });
    // Pedidos por periodo de tiempo
    this.getReporte(4,"2020-1-1","2020-6-30").subscribe(list => {
      console.log("opcion 4,",list);
      let qq = [{data: list.map(item => item.Total), label: 'Pedidos'}];
      Object.assign(this.pedidos.qq,qq );
      this.pedidos.nn = list.map(item => this. switchMes(item.Mes))
    });

    this.getReporte(3,"2020-1-1","2020-6-30").subscribe(list => {
      console.log("AGRUPADOS POR CLIENTES PEDIDOS",list);
      this.listaPedidos = list;
    });

  }

  getReporte(op?:number, from?:string, to?:string){
    if(!op){
      return this.servicio.getData("Reportes")
    }
    if(op > 0 && op < 5){
      return this.servicio.getData(`Reportes/${op}/${from}/${to}`)
    }
    // 1 ClientesRegistradosPorPeriodoTiempo(from,to)
    // 2 FacturasPorPeriodoTiempo(from, to)
    // 3 PedidosPeriodoAgrupadosPorCliente(from, to)
    // 4 PedidosPorPeriodoTiempo(from, to)
  }

  switchMes(numeroMes:number){
    const meses =["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return meses[numeroMes-1];
  }

  getCliente(){
    return this.servicio.getData("Cliente");
  }

// - Comidas más pedidas por los clientes.
// - Ingresos (recaudaciones) por períodos de tiempo.
// - Pedidos por períodos de tiempo.
// - Cantidad de pedidos por periodo agrupados por cliente.
// - Clientes registrados por periodo de tiempo.
// - Control de Stock
detectarUsuario($event){
  const ev = $event.target.id;
  const arr = this.listaPedidos.filter(item => item.Id == ev);
  const arrayMeses= this.findArrayMes();
  this.pedidosXCliente.nn = arrayMeses.map(item => this.switchMes(item))
  
  if( this.pedidosXCliente.qq.find(item => item.label == arr[0].Email)){ // si ya existe

  }else{ // si no existe
    const dataArray = Array.from(arrayMeses, x => 0); 

    arrayMeses.forEach((item,index) =>{
      arr.forEach(element =>{
        if(item == element.mes){
          dataArray[index] = element.CantidadPedidos;
        }
      })
    })
    let qq = {data: dataArray, label: arr[0].Email};

      if(this.pedidosXCliente.qq[0].data.length < 1  ){
        Object.assign(this.pedidosXCliente.qq[0],qq )
      }else{
        this.pedidosXCliente.qq.push(qq)
        
      }
  }
}

// encontrar mes menor
findArrayMes(){
  /* objeto:{
    CantidadPedidos: 1,
    Email: "momo_schreba@outlook.com",
    Id: 10,
    mes: 6
  }*/
  const data= this.listaPedidos.map(item =>{
    return Number(item.mes);
  });
  const arrayMeses = data.filter(function(item, pos, self) {
    return self.indexOf(item) == pos;
  })
  const menor = Math.min(...arrayMeses);
  const mayor = Math.max(...arrayMeses);

  return Array.from({ length: (mayor - menor) + 1}, (_, i) => menor + (i));
}

}
