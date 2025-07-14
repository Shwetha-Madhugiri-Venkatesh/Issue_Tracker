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
    
      browsers:{browser_name:string, browser_id:string}[]=[
        {browser_name:"Google Chrome", browser_id:"GC"},
        {browser_name:"Internet Explorer, Safari", browser_id:"IES"},
        {browser_name:"Netscape", browser_id:"NS"},
        {browser_name:"Firefax, Google Chrome", browser_id:"FGC"},
        {browser_name:"Firefax, Opera", browser_id:"FO"},
        {browser_name:"Opera", browser_id:"O"},
        {browser_name:"null", browser_id:"N"}
      ];

      operatingSystems:{os_name:string,os_id:string}[]=[
        {os_name:"Linux",os_id:"L"},
        {os_name:"Mac Os X",os_id:"MOsX"},
        {os_name:"Windows XP",os_id:"WXP"},
        {os_name:"Mac OS X",os_id:"MOSX"},
        {os_name:"Windows 2000, Mac Os X",os_id:"W2000MOX"},
        {os_name:"Windows 7",os_id:"W7"},
        {os_name:"Windows Vista",os_id:"WV"},
        {os_name:"Windows XP, Mac Os X",os_id:"WXPMOX"},
        {os_name:"null",os_id:"N"},
      ]
    emit_users:EventEmitter<User[]> = new EventEmitter<User[]>

    raise_emit_users(users:User[]){
        this.emit_users.emit(users);
    }
    
    emit_current_route:EventEmitter<string>=new EventEmitter<string>;

    current_route_emit(label:string){
        this.emit_current_route.emit(label);
    }

    emit_issues_subcomponent:EventEmitter<string>=new EventEmitter<string>;

    current_issues_subcomponent(label:string){
      this.emit_issues_subcomponent.emit(label);
    }
}