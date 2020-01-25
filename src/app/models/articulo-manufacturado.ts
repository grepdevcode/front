import { DetallePedido } from './detalle-pedido';
import { ArticuloManufacturadoDetalle } from './articulo-manufacturado-detalle';

export class ArticuloManufacturado {
    tiempoEstimadoCocina: number;
denominación: string;
precioVenta: number;
listaArticuloManufacturadoDetalle:ArticuloManufacturadoDetalle[];
listaDetallePedidos: DetallePedido[];
}
