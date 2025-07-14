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
    login_flag:boolean=false;
    authentication = new Subject();
    status = new Subject();
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
                this.login_flag=true;
                this.authentication.next([true]);
                sessionStorage.setItem("login",JSON.stringify(login_details));
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

    reset_password(login_details){
        console.log(login_details);
        let {userId,Password,confirmPassword}=login_details;
        this.http_service.fetch_users().subscribe((res:User[])=>{
            let user = res.find(item=>item.user_id==userId);
            console.log(user);
            user['password']=Password;
            console.log(user);
            this.http_service.update_user(user['id'],user).subscribe((res)=>{
                console.log(res);
                this.authentication.next("your password is succesfully updated");
            });
        })
    }
}