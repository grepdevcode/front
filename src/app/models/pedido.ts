import { Factura } from './factura';
import { DetallePedido } from './detalle-pedido';
import { Cliente } from './cliente';


export class Pedido {
    id:number;
    fecha:number;
    numero:number;
    estado:number;
    horaEstimadaFin: Date;
    tipoEnvio:number
    clienteId: number;

/**
 *
 */
constructor(fecha,estado,horaEstimadaFin,tipoEnvio,cliente) {
        this.fecha = fecha;
        this.estado = estado;
        this.horaEstimadaFin = horaEstimadaFin;
        this.tipoEnvio = tipoEnvio;
        this.clienteId = cliente;
}

}
