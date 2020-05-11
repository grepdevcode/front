import { Pedido } from './pedido';
import { DetallePedido } from './detalle-pedido';

export class Factura {
    fecha: Date;
    numero: number;
    montoDescuento: number;
    total: number;
    pedidoId:number;

    constructor(fecha,numero,montoDescuento,total,pedido) {
    this.fecha= fecha;
    this.pedidoId= pedido;
    this.numero= numero;
    this.montoDescuento= montoDescuento;
    this.total= total;
    }
}
