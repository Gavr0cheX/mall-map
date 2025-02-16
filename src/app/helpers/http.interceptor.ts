import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from "../auth.service";
import { BehaviorSubject, Observable, throwError } from 'rxjs';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.authService.token.pipe(take(1)).subscribe((token: any) => {
      req = this.addTokenHeader(req, token);
    })


    return next.handle(req).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && !req.url.includes('/user/login') && error.status === 403) {
        return this.handle403Error(req, next);
      }
      return throwError(() => new Error(error));
    }));
  }
  private handle403Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true
      return this.authService.autoLogin(true).pipe(
        switchMap(user => {
          if (user) {
            return this.authService.token.pipe(
              switchMap((token: any) => {
                request = this.addTokenHeader(request, token);
                this.isRefreshing = false;
                this.refreshTokenSubject.next(token);
                return next.handle(request);
              }));
          } else {
            this.authService.logOut();
            return throwError(() => new Error("Failed to refresh token"));
          }
        }), catchError(error => {
          this.authService.logOut();
          return throwError(() => new Error(error));
        })
      )
    }
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => {
        request = this.addTokenHeader(request, token);
        return next.handle(request)
      })
    );
  }
  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      withCredentials: true,
      setHeaders: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];