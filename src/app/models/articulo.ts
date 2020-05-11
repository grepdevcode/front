import { ArticuloManufacturadoDetalle } from './articulo-manufacturado-detalle';
import { DetallePedido } from './detalle-pedido';
import { RubroArticulo } from './rubro-articulo';

export class Articulo {
id:number;
denominacion : string;
precioCompra: number;
precioVenta: number;
stockActual: number;
unidadMedida: string;
esInsumo: boolean;

rubroArticuloId:number;

/**
 *
 */
constructor(id,denominacion,precioCompra,precioVenta,stockActual,unidadMedida,esInsumo,rubroArticulo) {
    this.id = id;
    this.denominacion = denominacion;
    this.precioCompra = precioCompra;
    this.precioVenta = precioVenta;
    this.stockActual = stockActual;
    this.unidadMedida = unidadMedida;
    this.esInsumo = esInsumo;
    this.rubroArticuloId = rubroArticulo;
}

}
