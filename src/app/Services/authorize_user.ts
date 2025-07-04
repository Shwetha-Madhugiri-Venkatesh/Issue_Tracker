import { EventEmitter, inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../Models/User";
import { HTTPService } from "./http_service";
import { Subject } from "rxjs";

@Injectable({
    providedIn:'root',
})
export class AuthorizeUser{
    route:Router=inject(Router);
    login_content:[];
    index:number;
    authentication = new Subject();
    constructor(private http_service:HTTPService){}
    login(login_details:{userId:string,Password:string}){
        let {userId,Password}=login_details;
        this.http_service.fetch_users().subscribe((res:User[])=>{
            let user:boolean=false;
            this.index=res.findIndex(item=>{
                if(item.user_id==userId){
                    user=true;
                }
                return item.user_id==userId && item.password==Password;
            });
            if(this.index!=-1){
                this.authentication.next([true]);
                this.route.navigate(['/home',login_details]);
            }else{
                if(user){
                    this.authentication.next([false,'Password is wrong']);
                }else{
                    this.authentication.next([false,'User does not exist']);
                }
            }
        });
        // return {auth:this.authentication,err:error_message};
        //console.log(userId,Password);
    }
}