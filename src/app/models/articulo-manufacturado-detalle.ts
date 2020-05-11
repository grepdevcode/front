
export class ArticuloManufacturadoDetalle {
    cantidad: number;
    articuloManufacturadoId: number;
    articuloId: number;

    /**
     *
     */
    constructor(manufacturado,articulo,cantidad) {
        this.articuloManufacturadoId = manufacturado
        this.articuloId = articulo
        this.cantidad = cantidad
    }
}
