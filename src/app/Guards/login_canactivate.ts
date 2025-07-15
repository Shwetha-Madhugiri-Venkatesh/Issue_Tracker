import { inject, Injectable, ViewChild } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, CanActivateFn, Resolve, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { LoginComponent } from "src/app/login/login.component";

@Injectable({
    providedIn:'root',
})
export class LoginCanActivate implements CanActivate{
    @ViewChild(LoginComponent) login:LoginComponent;
    constructor(private route:Router){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
       let flag = JSON.parse(localStorage.getItem("logged"))||false;
        let logged = true;
    if(flag){
      return false;
    }else{
        localStorage.setItem("logged",JSON.stringify(logged));
        return true;
    }
    }
}