export interface Pedido {
    fecha: number,
    numero: number,
    estado: number,
    horaEstimadaFin: Date,
    tipoEnvio: number,
    detalles:any[]
}
