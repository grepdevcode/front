import { Domicilio } from './domicilio';
import { Pedido } from './pedido';

export class Cliente {
    nombre:String;
apellido:String;
telefono:number;
email:String;
domicilio: Domicilio
listaPedidos: Pedido[];
}
