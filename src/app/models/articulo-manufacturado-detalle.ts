
export class ArticuloManufacturadoDetalle {
    cantidad: number;
    articuloManufacturado: number;
    articulo: number;

    /**
     *
     */
    constructor(manufacturado,articulo,cantidad) {
        this.articuloManufacturado = manufacturado
        this.articulo = articulo
        this.cantidad = cantidad
    }
}
