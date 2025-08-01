import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";

@Injectable({
    providedIn:'root',
})
export class ErrorInterceptor implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError((err)=>{
                    console.log(err);
                    switch(err.status){
                        case 400: return throwError("Missing or invalid parameters")               
                        case 401: return throwError("Missing/invalid auth token, User not logged in")
                        case 403: return throwError("Permission denied")
                        case 404: return throwError("Path not found")
                        case 405: return throwError("Invalid HTTP Method")
                        case 408: return throwError("Request Timeout")
                        default: return throwError('HTTP Error');
                    }
                }))
    }
}