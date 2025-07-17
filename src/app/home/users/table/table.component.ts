import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { User } from 'src/app/Models/User';
import { DialogComponent } from '../dialog/dialog.component';
import { HTTPService } from 'src/app/Services/http_service';
import { AuthorizeUser } from 'src/app/Services/authorize_user';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';
import { MultiSelect } from 'primeng/multiselect';
import { MessageService, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  providers:[MessageService]
})
export class TableComponent {
  login_user: any;
  user_details: User;
  today=new Date().toLocaleString();
  delete_visible:boolean=false;
filter_user_name: any='';
filter_user_email_id: any='';
filter_user_created_source: any='';
filter_user_created_source_type: any='';
filter_user_datetime: any='';
filter_user_last_modified_source: any='';
filter_user_last_modified_source_type: any='';
filter_user_last_modified_datetime: any='';

    constructor(private http_service:HTTPService,private primeNg:PrimeNGConfig,private message_service:MessageService,private authorize:AuthorizeUser, private two_way:TwoWayDataBinding){}
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
    selectedNum:number=0;
    len:number=8;

     numbers = [
    { name: 'show 5', value: 5 },
    { name: 'show 10', value: 10 },
    { name: 'show 20', value: 20 },
  ];

  selectedCol:{field:string,header:string}[]=[];
  dynamic_page_number={ name: 'show 5', value: 5 };
  ngOnInit() {
      this.login_user=JSON.parse(localStorage.getItem("login"))||{};
    this.http_service.fetch_users().subscribe((res:User[])=>{
      this.selectedNum=res.length;
      this.user_details=res.find(item=>item.user_id==this.login_user['userId']);
      console.log(this.user_details);
    })
       this.get_all_users();
        this.two_way.emit_users.subscribe(res=>{
          this.users_from_http=res;
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
            { field: 'last_modified_datetime', header: 'Last Modified Date Time' },
        ];
        this.columns=this.cols;
        this.selectedCol=this.columns;
    }
    filter_form_submit(form:NgForm){
      console.log(form.value);
      let form_data = {...form.value,type:(form.value.type==undefined)?undefined:form.value.type['name']};
      this.products= this.users_from_http.filter(item=>{
        let match:boolean = false;
        for(let key in form_data){
          console.log(form[key]);
          if(form_data[key]!=undefined && form_data[key]!=""){
          if(key=='last_modified_datetime' || key=='created_datetime'){
            let form_date = new Date(form_data[key]).toLocaleDateString();
            if(item[key].startsWith(form_date)){
              match=true;
            }
          }else
          if(item[key].toLowerCase()==form_data[key].toLowerCase()){
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
      console.log(this.products);
    }

    filter_display(){
      this.filter_flag=true;
    }
    dialog_display(){
      console.log("btn");
      this.display_dialog.emit([true]);
    }

    open_form(id:string){
      if(this.delete){
        this.delete=false;
        return;
      }
      if(this.user_details?.type=='Admin'){
      this.display_dialog.emit([true,id]);
      }else{
        // this.message_service.add({severity:'warn', summary:'Warn', detail:"Access Denied"});
        return;
      }
    }

    reset_fields(){
      this.filter_user_name='';
      this.filter_user_email_id='';
      this.filter_user_datetime='';
      this.filter_user_last_modified_datetime='';
      this.filter_user_last_modified_source='';
      this.filter_user_last_modified_source_type='';
      this.filter_user_created_source='';
      this.filter_user_created_source_type='';
      this.user_type='';
    }
    close_filter(){
    this.filter_flag=false;
  }
    reset_form(){
      this.products = this.users_from_http;
      this.reset_fields();
    }

    dynamic_rows(event){
      console.log(event.value);
      if(this.users_from_http.length>event.value.value){
        this.dynamic_page_number=event.value;
      }else{
        this.products=this.users_from_http;
      }
    }

    get_selected_columns(val){
      console.log(this.selectedCol);
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
    delete = false;
    delete_id;
    delete_the_user(id:string){
    this.delete=true;
    this.delete_visible=true;
    this.delete_id=id;
    }
goToPageNumber = '';
totalPages: number;

    goToPage(dt: any) {
  const rowsPerPage = 5; // Match your paginator [rows] input
  this.totalPages = Math.ceil(this.products.length / rowsPerPage);
  const pageIndex = Number(this.goToPageNumber) - 1;
  if (pageIndex >= 0 && pageIndex < this.totalPages) {
    dt.first = pageIndex * dt.rows;
    this.goToPageNumber='';
  } else {
    this.goToPageNumber='';
    alert('Invalid page number');
  }
}

delete_confirm(){
  if(this.user_details.type=='Admin'){
     this.http_service.delete_user(this.delete_id).subscribe(res=>{
      console.log(res);
      this.get_all_users();
      this.delete_visible=false;
     })
    }else{
      this.message_service.add({severity:'warn', summary:'Warn', detail:"Access Denied"});
      this.delete_visible=false;
      return;
  }
}

cancel_delete(){
  this.delete_visible=false;
}

}
