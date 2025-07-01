import { inject, Injectable, ViewChild } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { LoginComponent } from "src/app/login/login.component";
import { AuthorizeUser } from "../Services/authorize_user";
import { HTTPService } from "../Services/http_service";

@Injectable({
    providedIn:'root',
})
export class AuthLogin implements CanActivate{
    constructor(private authorize:AuthorizeUser,private route:Router, private http_service:HTTPService){}
    @ViewChild(LoginComponent) login:LoginComponent;
    canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
       if(this.authorize.authentication){
        return true;
       }else{
        this.route.navigate(['']);
        return false;
       }
    }
}

export const login_canActivate=()=>{
    
    let flag = JSON.parse(sessionStorage.getItem("logged"))||false;
    let logged = true;
    if(flag){
        return false;
    }else{
        sessionStorage.setItem("logged",JSON.stringify(logged));
        return true;
    }
} 