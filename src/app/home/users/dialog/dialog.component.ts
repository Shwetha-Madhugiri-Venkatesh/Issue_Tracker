import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { TableComponent } from '../table/table.component';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/Models/User';
import { HTTPService } from 'src/app/Services/http_service';
import { Subject } from 'rxjs';
import { AuthorizeUser } from 'src/app/Services/authorize_user';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnChanges{

  @Input()
  visible:boolean=false;

  @Input()
  prefill:string='';

  @Output() visibleChange = new EventEmitter<boolean>();
  user_subject = new Subject();

  user_uname: string;
  user_fname: string;
  user_mname: string;
  user_lname: string;
  user_created_source: string;
  user_created_source_type: string;
  user_created_datetime: string;
  user_company_code: string;
  user_user_id: string;
  user_type: string;
  user_email_id: string;
  user_phone: string;
  user_last_modified_source: string;
  user_last_modified_datetime: string;
  user_address: string;
  user_country: string;
  user_state: string;
  user_city: string;
  user_postal_code: string;
  user_locale: string;
  user_time_zone: string;
  user_last_modified_source_type: string;
  user_password:string='';

  constructor(private http_service:HTTPService,private two_way:TwoWayDataBinding){};
  user:User;
  prefill_user:User;
  ngOnChanges(){
    if(this.prefill){
      this.http_service.fetch_user(this.prefill).subscribe((res:User)=>{
        console.log(res);
        this.prefill_user=res;
        this.user_uname=res.uname;
        this.user_fname=res.fname;
        this.user_mname=res.mname;
        this.user_lname=res.lname;
        this.user_created_source=res.created_source;
        this.user_created_source_type=res.created_source_type;
        this.user_created_datetime=res.created_datetime;
        this.user_company_code=res.company_code;
        this.user_user_id=res.user_id;
        this.user_type=res.type;
        this.user_email_id=res.email_id;
        this.user_phone=res.phone;
        this.user_last_modified_source=res.last_modified_source;
        this.user_last_modified_datetime=res.last_modified_datetime;
        this.user_address=res.address;
        this.user_country=res.country;
        this.user_state=res.state;
        this.user_city=res.city;
        this.user_postal_code=res.postal_code;
        this.user_locale=res.locale;
        this.user_time_zone=res.time_zone;
        this.user_last_modified_source_type=res.last_modified_source_type;
      })
    }else{
      this.reset_fields();
    }
  }

  form_submit(topForm:NgForm,bottomForm:NgForm){
    if(this.prefill){
      console.log("prefill",topForm.value,bottomForm.value);
      let updated_user = {...topForm.value,...bottomForm.value};
      this.http_service.update_user(this.prefill,updated_user).subscribe((res)=>{
        console.log(res);
        this.visible=false;
        this.get_users();
      })
    }else{
      console.log(topForm.value,bottomForm.value)
      this.user={...topForm.value,...bottomForm.value};
      console.log(this.user);
      this.http_service.create_new_user(this.user).subscribe((res)=>{
      console.log(res);
      this.visible=false;
      this.get_users();
    })
    }
  }

  onHide(){
    this.visibleChange.emit(false);
  }
  get_users(){
     this.http_service.fetch_users().subscribe((res:User[])=>{
      this.two_way.raise_emit_users(res);
    })
  }

  create_user_password(event){
    this.user_password=event.target.value+'@123';
    this.user_user_id=event.target.value+'_User123';
  }

  reset_fields(){
    this.user_uname='';
    this.user_fname='';
    this.user_mname='';
    this.user_lname='';
    this.user_created_source='';
    this.user_created_source_type='';
    this.user_created_datetime='';
    this.user_company_code='';
    this.user_user_id='';
    this.user_type='';
    this.user_email_id='';
    this.user_phone='';
    this.user_last_modified_source='';
    this.user_last_modified_datetime='';
    this.user_address='';
    this.user_country='';
    this.user_state='';
    this.user_city='';
    this.user_postal_code='';
    this.user_locale='';
    this.user_time_zone='';
    this.user_last_modified_source_type='';    
  }
}
