import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../Models/User";
import { Ticket } from "../Models/ticket";
import { Comment } from "../Models/comment";

@Injectable({
    providedIn:'root',
})
export class HTTPService{
    constructor(private http:HttpClient){}

    create_new_user(user_details:User){
        return this.http.post("http://localhost:3001/users",user_details);
    }

    fetch_users(){
        let header = new HttpHeaders();
        header = header.set('data_type','users');
        return this.http.get("http://localhost:3001/users",{headers:header});
    }

    fetch_user(id:string){
        return this.http.get(`http://localhost:3001/users/${id}`);
    }

    update_user(id:string,updated_user:User){
        return this.http.put(`http://localhost:3001/users/${id}`,updated_user);
    }

    delete_user(id:string){
        return this.http.delete(`http://localhost:3001/users/${id}`);
    }

    post_ticket(ticket_details:Ticket){
        return this.http.post("http://localhost:3001/tickets",ticket_details);
    }

    update_ticket(id:string,updated_ticket_details:Ticket){
        return this.http.put(`http://localhost:3001/tickets/${id}`,updated_ticket_details);
    }

    fetch_tickets(){
        let header = new HttpHeaders();
        header = header.set('data_type','tickets');
        return this.http.get("http://localhost:3001/tickets",{headers:header});
    }

    post_comment(comment_details:Comment){
        return this.http.post("http://localhost:3001/comments",comment_details);
    }

    update_comment(id:string,updated_comment:Comment){
        return this.http.put(`http://localhost:3001/comments/${id}`,updated_comment)
    }

    delete_comment(id:string){
        return this.http.delete(`http://localhost:3001/comments/${id}`);
    }
    fetch_comments(){
        let header = new HttpHeaders();
        header = header.set('data_type','comments');
        return this.http.get("http://localhost:3001/comments",{headers:header});
    }

    // dashboard_put(arr,id){
    //     return this.http.put(`http://localhost:3001/dashboard/${id}`,arr);
    // }

    // dashboard_get(){
    //     return this.http.get(`http://localhost:3001/dashboard`);
    // }

    // dashboard_post(arr){
    //     return this.http.post(`http://localhost:3001/dashboard`,arr);
    // }
}