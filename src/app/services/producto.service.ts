import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Authorization': 'my-auth-token'
    }),
    params: new HttpParams()
  };

  //para carrito
  carrito = [];
  private pedido = new BehaviorSubject(JSON.stringify(this.carrito));
  currentPedido = this.pedido.asObservable();
  //
  url:string = '/ArticuloManufacturado';
  urlpostpedido = "/Pedido";


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

  //universal
  getData(url:string):Observable<any[]>{
    return this.http.get<any[]>(url);
  }

  getSingleData(url:string):Observable<any>{
    return this.http.get<any[]>(url);
  }

  postData(url:string, nuevoObjeto:any){
    return this.http.post(url, nuevoObjeto, this.httpOptions)
    .subscribe(
      (res:any) =>{
        console.log(res)
      },
      error=>{
        console.log(error)
      }
    );
  }

  postObservable(url:string, nuevoObjeto:any):Observable<any>{
    return this.http.post<any>(url, nuevoObjeto, this.httpOptions)
  }


  putData(url:string, objetoModificado:any){
    return this.http.put(url, objetoModificado, this.httpOptions)
  }

  patchData(url:string, objetoModificado:any){
    return this.http.patch(url, objetoModificado, this.httpOptions)
  }

  removeData(url:string, objetoEliminado:any, pedirPermiso?: boolean):Observable<any>{
    const options = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'my-auth-token'
      }),
      body: objetoEliminado
    };
    return this.http.delete(url, options)
  }

  handleHttpError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
    } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(error);
};


}

