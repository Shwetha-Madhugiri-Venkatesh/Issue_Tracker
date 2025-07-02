import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { User } from 'src/app/Models/User';
import { DialogComponent } from '../dialog/dialog.component';
import { HTTPService } from 'src/app/Services/http_service';
import { AuthorizeUser } from 'src/app/Services/authorize_user';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent {

    constructor(private http_service:HTTPService,private authorize:AuthorizeUser){}
    products:User[];
    cols:{field:string,header:string}[];
    filter_flag:boolean=false;

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
  columns=[
    {name:'User Name', value:'user_name'},
    {name:'Email ID', value:'email'},
    {name:'Created Source', value:'created_source'},
    {name:'Created Source Type', value:'created_source_type'},
    {name:'Created Date Time', value:'created_datetime'},
    {name:'Last Modified Source', value:'last_modified_source'},
    {name:'Last Modified Source Type', value:'last_modified_source_type'},
    {name:'Last Modified Date Time', value:'last_modified_datetime'},
    {name:'Status', value:'status'},
  ]
  ngOnInit() {
        this.http_service.fetch_users().subscribe((res:User[])=>{
          this.products=res;
        });

        this.authorize.emit_users.subscribe((res)=>{
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
    }

    filter_form_submit(form:NgForm){
      console.log(form);
    }

    filter_display(){
      this.filter_flag=!this.filter_flag;
    }
    dialog_display(){
      console.log("btn");
      this.display_dialog.emit([true]);
    }

    open_form(uid){
      console.log(uid);
      this.display_dialog.emit([true,uid]);
    }
}
