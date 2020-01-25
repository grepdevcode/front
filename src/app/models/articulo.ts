import { ArticuloManufacturadoDetalle } from './articulo-manufacturado-detalle';
import { DetallePedido } from './detalle-pedido';
import { RubroArticulo } from './rubro-articulo';

export class Articulo {
denominación : string;
precioCompra: number;
precioVenta: number;
stockActual: number;
unidadMedida: string;
esInsumo: boolean;

listaArtManufactDetalle:ArticuloManufacturadoDetalle[];
listaDetallePedido:DetallePedido[];
rubroArticulo:RubroArticulo;
}
