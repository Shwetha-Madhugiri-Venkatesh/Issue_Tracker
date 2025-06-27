import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
    providedIn:'root',
})
export class AuthorizeUser{
    isLogged:boolean=false;
    route:Router=inject(Router);
    login(login_details:{userId:string,Password:string}){
        let {userId,Password}=login_details;
            this.isLogged=true;
            this.route.navigate(['/home']);
        console.log(userId,Password);
        return this.isLogged;
    }
}