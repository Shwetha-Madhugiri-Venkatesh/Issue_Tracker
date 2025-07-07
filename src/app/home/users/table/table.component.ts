import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { User } from 'src/app/Models/User';
import { DialogComponent } from '../dialog/dialog.component';
import { HTTPService } from 'src/app/Services/http_service';
import { AuthorizeUser } from 'src/app/Services/authorize_user';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';
import { MultiSelect } from 'primeng/multiselect';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent {
  login_user: any;
  user_details: User;

    constructor(private http_service:HTTPService,private authorize:AuthorizeUser, private two_way:TwoWayDataBinding){}
    products:User[]=[];
    users_from_http:User[];
    cols:{field:string,header:string}[];
    columns:{field:string,header:string}[]=[];
    filter_flag:boolean=false;
    columns_selected:{field:string,header:string}[];
    @Output()
    display_dialog:EventEmitter<[boolean,string?]> = new EventEmitter<[boolean,string?]>;
   
    @ViewChild('multi') multi:MultiSelect;
    user_types=[{name:"User"},{name:"Admin"}];
    user_type:string;
    selectedNum:number=5;
    len:number=8;

     numbers = [
    { name: 'show 5', value: 5 },
    { name: 'show 10', value: 10 },
    { name: 'show 20', value: 20 },
  ];

  selectedCol:{field:string,header:string}[]=[];
  ngOnInit() {
      this.login_user=JSON.parse(sessionStorage.getItem("login"))||{};
    this.http_service.fetch_users().subscribe((res:User[])=>{
      this.user_details=res.find(item=>item.user_id==this.login_user['userId']);
      console.log(this.user_details);
    })
       this.get_all_users();
        this.two_way.emit_users.subscribe(res=>{
          this.products=res;
        })
        this.cols = [
            { field: 'uname', header: 'User Name' },
            { field: 'email_id', header: 'Email ID' },
            { field: 'created_source', header: 'Created Source' },
            { field: 'created_source_type', header: 'Created Source Type' },
            { field: 'created_datetime', header: 'Created Date Time' },
            { field: 'last_modified_source', header: 'Last Modified Source' },
            { field: 'last_modified_source_type', header: 'Last Modified Source Type' },
            { field: 'last_modified_datetime', header: 'Last modified Date Time' },
        ];
        this.columns=this.cols;
    }
    filter_form_submit(form:NgForm){
      let form_data = {...form.value,type:(form.value.type==undefined)?undefined:form.value.type['name']};
      this.products= this.users_from_http.filter(item=>{
        let match:boolean = false;
        for(let key in form_data){
          console.log(form[key]);
          if(form_data[key]!=undefined && form_data[key]!=""){
          if(item[key]==form_data[key]){
            match=true;
          } else{
            match=false;
            break;
          }
          }
        }
        if(match){
          return item;
        }
        else{
          return null;
        }
      })
    }

    filter_display(){
      this.filter_flag=!this.filter_flag;
    }
    dialog_display(){
      console.log("btn");
      this.display_dialog.emit([true]);
    }

    open_form(id:string){
      this.display_dialog.emit([true,id]);
    }

    dynamic_rows(event){
      console.log(event.value);
      if(this.users_from_http.length>event.value){
        this.products =this.users_from_http.slice(0,event.value.value);
      }else{
        this.products=this.users_from_http;
      }
    }

    get_selected_columns(val){
      this.columns_selected=val.value;
      this.len=val.value.length;
    }

    dynamic_columns(){
      this.multi.hide();
      this.cols=this.columns_selected;
    }

    get_all_users(){
      this.http_service.fetch_users().subscribe((res:User[])=>{
          this.users_from_http=res;
          this.products=this.users_from_http;
        });
    }
    delete_the_user(id:string){
     this.http_service.delete_user(id).subscribe(res=>{
      console.log(res);
      this.get_all_users();
     })
    }
}
