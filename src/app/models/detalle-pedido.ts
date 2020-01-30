import { Pedido } from './pedido';
import { Factura } from './factura';
import { ArticuloManufacturado } from './articulo-manufacturado';
import { Articulo } from './articulo';

export class DetallePedido {
    cantidad : number;
    subtotal : number;
    pedido: Pedido;
    factura: Factura;
    articuloManufacturado: ArticuloManufacturado;
    articulo:Articulo;

    /**
     *
     */
    constructor() {


        
    }
}
