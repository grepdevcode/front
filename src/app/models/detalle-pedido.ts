import { Pedido } from './pedido';
import { Factura } from './factura';
import { ArticuloManufacturado } from './articulo-manufacturado';
import { Articulo } from './articulo';

export class DetallePedido {
    cantidad : number;
    subtotal : number;
    pedido: number;
    facturaId: number;
    articuloManufacturado: ArticuloManufacturado;
    articulo:Articulo ;
    /**
     *
     */
    constructor(cantidad,subtotal,articulo,articuloManufacturado) {
        this.cantidad=cantidad;
        this.subtotal = subtotal;
        this.articulo = articulo ;
        this.articuloManufacturado = articuloManufacturado;
    }
}
