import { Component, OnInit } from '@angular/core';
import { CrearComponent} from '../../../helpers/crud/crear/crear.component';
import Articulo from '../../../templates/Articulo';

@Component({
  selector: 'app-cocina',
  templateUrl: './cocina.component.html',
  styleUrls: ['./cocina.component.css']
})
export class CocinaComponent implements OnInit {
  templateArticulo = Articulo;
  constructor() { }

  ngOnInit() {
    console.log('cocina',this.templateArticulo)
  }

}
