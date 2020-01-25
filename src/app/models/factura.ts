import { Pedido } from './pedido';
import { DetallePedido } from './detalle-pedido';

export class Factura {
    fecha: Date;
    numero: number;
    montoDescuento: number;
    total: number;
    pedido:Pedido;
    listaDetalles: DetallePedido[];
}
