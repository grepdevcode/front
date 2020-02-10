import { DetallePedido } from './detalle-pedido';
import { ArticuloManufacturadoDetalle } from './articulo-manufacturado-detalle';

export class ArticuloManufacturado {
    id:number;
    tiempoEstimadoCocina: number;
    denominacion: string;
    precioVenta: number;

    constructor(id,tiempo,denominacion,precioVenta) {
        this.id=id;
        this.tiempoEstimadoCocina =  tiempo;
        this.denominacion = denominacion;
        this.precioVenta = precioVenta;
    }
}
