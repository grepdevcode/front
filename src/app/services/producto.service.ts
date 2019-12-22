import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  url:string = 'http://192.168.191.208:8000/productos/';
  constructor( private http: HttpClient) { }

  /* tomar productos del servidor */
  getProductos():Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  
}
