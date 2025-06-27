import { inject, Injectable, ViewChild } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { LoginComponent } from "src/app/login/login.component";
import { AuthorizeUser } from "../Services/authorize_user";

@Injectable({
    providedIn:'root',
})
export class AuthLogin implements CanActivate{
    authorize:AuthorizeUser = inject(AuthorizeUser);
    route:Router=inject(Router);
    @ViewChild(LoginComponent) login:LoginComponent;
    canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
       if(this.authorize.isLogged){
        return true;
       }else{
        this.route.navigate(['/login']);
        return false;
       }
    }
}