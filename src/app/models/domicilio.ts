import { Cliente } from './cliente';

export class Domicilio {
    id:number;
    calle:String;
    numero:number;
    localidad:String;
    clienteId: number;

    constructor(calle,numero,localidad) {
        this.calle = calle;
        this.numero = numero;
        this.localidad = localidad;
    }
}
