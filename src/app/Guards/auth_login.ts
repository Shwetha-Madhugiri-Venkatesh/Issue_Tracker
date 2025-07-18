import { inject, Injectable, ViewChild } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
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
     let flag1 = JSON.parse(localStorage.getItem("login"))||{};
       let flag2 = JSON.parse(localStorage.getItem("logged"))||false;
    if((Object.keys(flag1).length!=0) && (flag2===true)){
      return true;
    }else{
        this.route.navigate(['']);
        return false;
    }
    }
}