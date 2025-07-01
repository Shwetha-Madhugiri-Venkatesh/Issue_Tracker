import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
    providedIn:'root',
})
export class AuthorizeUser{
    route:Router=inject(Router);
    login_content:[];
    index:number;
    authentication:boolean=false;
    login(login_details:{userId:string,Password:string}){
        let {userId,Password}=login_details;
        //http check
        if(userId=="shwe"){
            // //local storage check
            // this.login_content = JSON.parse(localStorage.getItem("login"))||[];
            // this.index = this.login_content.findIndex((item)=>{return item['userId']==userId;});
            // if(!this.index){
            //     this.authentication=true;
            //     this.route.navigate(['/home',login_details]);
            // }
            console.log("true");
            this.authentication=true;
             this.route.navigate(['/home',login_details]);
        }
        //console.log(userId,Password);
        return this.authentication;
    }
}