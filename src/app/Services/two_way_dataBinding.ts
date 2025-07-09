import { EventEmitter, Injectable } from "@angular/core";
import { User } from "../Models/User";
import { Ticket } from "../Models/ticket";

@Injectable({
    providedIn:'root',
})
export class TwoWayDataBinding{
    priorities:{priorityId:string, priority:string}[]=[
        {priorityId:'L', priority:'Low'},
        {priorityId:'H', priority:'High'},
        {priorityId:'M', priority:'Medium'},
        {priorityId:'C', priority:'Critical'},
      ]
    
      statuses:{statusId:string, status:string,tickets:Ticket[]}[]=[
        {statusId:'O', status:'Open', tickets:[]},
        {statusId:'A', status:'Assigned', tickets:[]},
        {statusId:'P', status:'In Progress', tickets:[]},
        {statusId:'C', status:'Completed', tickets:[]},
      ]
    
      categories:{categoryId:string, categoryDesc:string}[]=[
        {categoryId:'HW', categoryDesc:"Hardware"},
        {categoryId:'SW', categoryDesc:"Software"},
        {categoryId:'AM', categoryDesc:'Access Management'},
      ];
    
      subcategories:{subCategoryId:string, categoryId:string , subCategoryDesc:string}[]=[
        {subCategoryId:'AL', categoryId:'HW',subCategoryDesc:'Allocate Laptop'},
        {subCategoryId:'AH', categoryId:'HW',subCategoryDesc:'Allocate Hardware'},
        {subCategoryId:'HR', categoryId:'HW',subCategoryDesc:'Hardware Replacement'},
        {subCategoryId:'SI', categoryId:'SW',subCategoryDesc:'Software Installation'},
        {subCategoryId:'AV', categoryId:'SW',subCategoryDesc:'Antivirus'},
        {subCategoryId:'EP', categoryId:'SW',subCategoryDesc:'Email password Update'},
        {subCategoryId:'LS', categoryId:'SW',subCategoryDesc:'Laptop slowness issue'},
        {subCategoryId:'SIs', categoryId:'SW',subCategoryDesc:'Sofware issue'},
        {subCategoryId:'SA', categoryId:'AM',subCategoryDesc:'Sofware Access'},
        {subCategoryId:'WA', categoryId:'AM',subCategoryDesc:'Wifi Access'},
        {subCategoryId:'DA', categoryId:'AM',subCategoryDesc:'Database Access'},
        {subCategoryId:'VA', categoryId:'AM',subCategoryDesc:'VPN Access'},
      ]
    
    emit_users:EventEmitter<User[]> = new EventEmitter<User[]>

    raise_emit_users(users:User[]){
        this.emit_users.emit(users);
    }
    
    emit_current_route:EventEmitter<string>=new EventEmitter<string>;

    current_route_emit(label:string){
        this.emit_current_route.emit(label);
    }
}