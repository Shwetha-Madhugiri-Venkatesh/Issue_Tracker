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
export class DialogComponent implements OnChanges,OnInit{

  @Input()
  visible:boolean=false;

  @Input()
  prefill:string='';

  @Output() visibleChange = new EventEmitter<boolean>();
  user_subject = new Subject();
  today=new Date().toLocaleString();

  user_uname: string;
  user_fname: string;
  user_mname: string;
  user_lname: string;
  user_created_source: string;
  user_created_source_type: string;
  user_created_datetime: string;
  user_company_code: string;
  user_user_id: string='';
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
  login_user:{};
  user_details={uname:'',type:''};
  last_modified;
  editable:boolean=false;
  profile_pic_input;
  http_users;
  ngOnInit(){
    this.login_user=JSON.parse(localStorage.getItem("login"))||{};
    this.http_service.fetch_users().subscribe((res:User[])=>{
      this.http_users=res;
      this.user_details=res.find(item=>item.user_id==this.login_user['userId']);
      console.log(this.user_details);
      this.last_modified=structuredClone(this.user_details);
    })

    if(this.prefill){
      this.user_details.uname=this.prefill_user?.created_source;
      this.user_details.type=this.prefill_user?.created_source_type;
    }else{
      this.user_details.uname=this.last_modified?.uname;
      this.user_details.type=this.last_modified?.type;
    }
  }

  prefill_fields(){
    this.http_service.fetch_user(this.prefill).subscribe((res:User)=>{
        console.log(res);
        this.editable=false;
        this.prefill_user=res;
        this.user_uname=res.uname;
        this.user_fname=res.fname;
        this.user_mname=res.mname;
        this.user_lname=res.lname;
        this.user_details.uname=res.created_source;
        this.user_details.type=res.created_source_type;
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
        this.user_password=res.password;
        this.profile_pic_input=res.profile;
      })
  }
  ngOnChanges(){
    if(this.prefill){
     this.prefill_fields();
    }else{
      this.reset_fields();
    }
  }

  close_form(){
    if(!this.editable){
    this.visible=false;
    }else{
      this.prefill_fields();
    }
  }

  edit_form(){
    this.editable=true;
    this.profile_pic_input='';
  }

  form_submit(topForm:NgForm,bottomForm:NgForm){
    if(!topForm.valid || !bottomForm.valid){
      return;
    }
    this.get_users();
    let ind= this.http_users.find(item=>item.email_id==topForm.value.email_id);
    if(ind){
      return;
    }
    if(this.prefill){
      console.log("prefill",topForm.value,bottomForm.value);
      let updated_user = {...topForm.value,...bottomForm.value};
      updated_user['profile']=this.profile_pic_input;
      this.http_service.update_user(this.prefill,updated_user).subscribe((res)=>{
        console.log(res);
        this.visible=false;
        this.get_users();
      })
    }else{
      console.log(topForm.value,bottomForm.value)
      this.user={...topForm.value,...bottomForm.value};
      this.user['profile']=this.profile_pic_input;
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
      this.http_users=res;
      this.two_way.raise_emit_users(res);
    })
  }

  create_user_password(event){
    if(!this.prefill){
    this.user_password=event.target.value+'@123';
    this.user_user_id=event.target.value+'_User123';
    }
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
    this.profile_pic_input=''; 
  }
  profile_pic_selected(event:Event){
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length>0){
      let allowed_types = ['image/jpg', 'image/png'];
      const file = input.files[0];
      if(!allowed_types.includes(file.type)){
        alert("not allowed");
        return;
      }

      let maxSize = 2*1024*1024;
      if(file.size>maxSize){
        alert("file is large");
        return;
      }
      const reader = new FileReader();
      reader.onload=()=>{
        this.profile_pic_input = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
