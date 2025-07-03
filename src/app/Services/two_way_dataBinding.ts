import { EventEmitter, Injectable } from "@angular/core";
import { User } from "../Models/User";

@Injectable({
    providedIn:'root',
})
export class TwoWayDataBinding{
    emit_users:EventEmitter<User[]> = new EventEmitter<User[]>

    raise_emit_users(users:User[]){
        this.emit_users.emit(users);
    }
    
    emit_current_route:EventEmitter<string>=new EventEmitter<string>;

    current_route_emit(label:string){
        this.emit_current_route.emit(label);
    }
}