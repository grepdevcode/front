import { Component, OnInit } from '@angular/core';
import { Factura } from 'src/app/models/factura';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {
  listaFacturas:Factura[];
  constructor() { }

  ngOnInit() {
  }

}
