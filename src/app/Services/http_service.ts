import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../Models/User";

@Injectable({
    providedIn:'root',
})
export class HTTPService{
    constructor(private http:HttpClient){}

    post_login(login_details:{userId:string,Password:string}){
        return this.http.post("http://localhost:3001/login",login_details);
    }

    fetch_login(){
        return this.http.get("http://localhost:3001/login");
    }

    create_new_user(user_details:User){
        return this.http.post("http://localhost:3001/users",user_details);
    }

    fetch_users(){
        return this.http.get("http://localhost:3001/users");
    }

    fetch_user(id:string){
        return this.http.get(`http://localhost:3001/users/${id}`);
    }
}