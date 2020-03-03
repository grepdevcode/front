import { Domicilio } from './domicilio';
import { Pedido } from './pedido';

export class Cliente {
    id:number;
    nombre:String;
    apellido:String;
    telefono:number;
    email:String;
    domicilio: number;
    /**
     *
     */
    constructor(nombre,apellido,telefono) {
        this.nombre= nombre;
        this.apellido = apellido;
        this.telefono = telefono;
    }
}
