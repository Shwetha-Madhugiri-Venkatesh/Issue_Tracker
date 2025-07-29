import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class LoginCanActivate implements CanActivate {

    constructor(private route: Router) { }

    canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        let flag1 = JSON.parse(localStorage.getItem("login")) || '';
        let flag2 = JSON.parse(localStorage.getItem("logged")) || false;
        let logged = true;

        //canActivate for login page
        if ((Object.keys(flag1).length != 0) && (flag2 === true)) {
            this.route.navigate(['/home']);
            return false;
        } else {
            localStorage.setItem("logged", JSON.stringify(logged));
            return true;
        }
    }
}