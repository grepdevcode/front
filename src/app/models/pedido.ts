import { Factura } from './factura';
import { DetallePedido } from './detalle-pedido';
import { Cliente } from './cliente';


export class Pedido {
fecha:number;
numero:number;
estado:number;
horaEstimadaFin: Date;
tipoEnvio:number
cliente: Cliente;
factura: Factura;
listaDetalles: DetallePedido[];

}
