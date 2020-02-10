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
cliente: number;
factura: number;

/**
 *
 */
constructor(fecha,
    numero,
    estado,
    horaEstimadaFin,
    tipoEnvio,
    cliente,
    factura,
    listaDetalles) {

        this.numero = numero;
        this.estado = estado;
        this.horaEstimadaFin = horaEstimadaFin;
        this.tipoEnvio = tipoEnvio;
        this.cliente = cliente;
        this.factura = factura;
}

}
