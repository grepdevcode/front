import { Domicilio } from './domicilio';
import { Pedido } from './pedido';
import { AuthRoles } from '../auth/auth-roles.enum';

export class Cliente {
    id:number;
    nombre:String;
    apellido:String;
    telefono:number;
    email:String;
    domicilio: number;
    roles:string;
    fechaRegistro:string;
    /**
     *
     */
    constructor(nombre,apellido,telefono) {
        this.nombre= nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.roles = AuthRoles.rolEspectador
    }
}
