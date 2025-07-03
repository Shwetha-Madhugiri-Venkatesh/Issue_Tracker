import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { User } from 'src/app/Models/User';
import { DialogComponent } from '../dialog/dialog.component';
import { HTTPService } from 'src/app/Services/http_service';
import { AuthorizeUser } from 'src/app/Services/authorize_user';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent {

    constructor(private http_service:HTTPService,private authorize:AuthorizeUser, private two_way:TwoWayDataBinding){}
    products:User[];
    users_from_http:User[];
    cols:{field:string,header:string}[];
    columns:{name:string,value:string}[];
    filter_flag:boolean=false;
    columns_selected:[];

    @Output()
    display_dialog:EventEmitter<[boolean,string?]> = new EventEmitter<[boolean,string?]>;
   
    user_types=[{name:"User"},{name:"Admin"}];
    user_type:string;
    selectedNum:number=5;

     numbers = [
    { name: 'show 5', value: 5 },
    { name: 'show 10', value: 10 },
    { name: 'show 20', value: 20 },
  ];

  selectedCol:number=9;
  ngOnInit() {
        this.http_service.fetch_users().subscribe((res:User[])=>{
          this.users_from_http=res;
          this.products=this.users_from_http;
        });

        this.two_way.emit_users.subscribe((res)=>{
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

        this.columns=[
    {name:'User Name', value:'uname'},
    {name:'Email ID', value:'email_id'},
    {name:'Created Source', value:'created_source'},
    {name:'Created Source Type', value:'created_source_type'},
    {name:'Created Date Time', value:'created_datetime'},
    {name:'Last Modified Source', value:'last_modified_source'},
    {name:'Last Modified Source Type', value:'last_modified_source_type'},
    {name:'Last Modified Date Time', value:'last_modified_datetime'},
  ]
    }

    filter_form_submit(form:NgForm){
      console.log(form.value);
       let form_data:User={} as User;
        for(let key in form.value){
          if(form.value[key]!=""||undefined){
            form_data[key]=form.value[key];
          }
        }
      this.products = this.users_from_http.filter((item) =>{
        return item.uname==form_data.uname || item.email_id==form_data.email_id||
               item.type==form_data.type['name']||
               item.created_source==form_data.created_source||
               item.created_source_type==form_data.created_source_type||
               item.created_datetime==form_data.created_datetime||
               item.last_modified_source==form_data.last_modified_source||
               item.last_modified_source_type==form_data.last_modified_source_type||
               item.last_modified_datetime==form_data.last_modified_datetime;
      })
      console.log(this.products);
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
      this.products =this.users_from_http.slice(0,event.value.value);
    }

    get_selected_columns(event){
      this.columns_selected=event.value;
    }

    dynamic_columns(){
      console.log(this.columns_selected);
      this.columns=this.columns_selected;
      console.log(this.columns);
    }
}
