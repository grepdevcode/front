import { Pedido } from './pedido';
import { DetallePedido } from './detalle-pedido';

export class Factura {
    fecha: Date;
    numero: number;
    montoDescuento: number;
    total: number;
    pedido:number;

    constructor(fecha,numero,montoDescuento,total,pedido) {
    this.fecha= fecha;
    this.pedido= numero;
    this.numero= montoDescuento;
    this.montoDescuento= total;
    this.total= pedido;
    }
}
