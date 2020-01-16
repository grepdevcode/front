import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Pedido } from '../interfaces/pedido';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {


  //para carrito
  carrito = [];
  private pedido = new BehaviorSubject(JSON.stringify(this.carrito));
  currentPedido = this.pedido.asObservable();
  //
  url:string = '/articulomanufacturado';
  urlpostpedido = "/recibir_pedido/";


  constructor( private http: HttpClient) { }

  /* tomar productos del servidor */
  getProductos():Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  cambiarPedido(pedido:string){
    this.pedido.next(pedido);
  }

  postPedido(pedido){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'my-auth-token'
      })
    };
    return this.http.post<any>(this.urlpostpedido, pedido, httpOptions);
  }
}

