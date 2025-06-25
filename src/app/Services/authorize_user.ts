import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
    providedIn:'root',
})
export class AuthorizeUser{
    isLogged:boolean=false;
    route:Router=inject(Router);
    login(login_details:{email:string,Password:string}){
        let {email,Password}=login_details;
        this.isLogged=false;
        this.route.navigate(['/dashboard']);
        console.log(email,Password);
    }
}