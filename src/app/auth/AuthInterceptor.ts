import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable, throwError as ObservableThrowError }  from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router:Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth header from the service.
    const jwt = this.auth.getToken();
    // Clone the request to add the new header.
    const authReq = req.clone({headers: req.headers.set('Authorization', `Bearer ${jwt}`)});
    // Pass on the cloned request instead of the original request.
    return next.handle(authReq).pipe(
        catchError((error,caught)=>{
            if(error.status === 401 ){
                this.router.navigate(['ingreso','login'],
                {queryParams:{redirectUrl: this.router.routerState.snapshot.url}});
            }
            return ObservableThrowError(error);
        })
    );
  }
}