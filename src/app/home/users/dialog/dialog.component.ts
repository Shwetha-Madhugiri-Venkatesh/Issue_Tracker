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
  constructor(private http_service:HTTPService,private two_way:TwoWayDataBinding){};
  user:User;
  prefill_user:User;
  ngOnChanges(){
    if(this.prefill){
      console.log(this.prefill);
    }

    this.http_service.fetch_user(this.prefill).subscribe((res:User)=>{
      console.log(res);
      this.prefill_user=res;
    })
  }

  form_submit(topForm:NgForm,bottomForm:NgForm){
    console.log(topForm.value,bottomForm.value)
    this.user={...topForm.value,...bottomForm.value};
    console.log(this.user);
    this.http_service.create_new_user(this.user).subscribe((res)=>{
      console.log(res);
      this.visible=false;
      this.get_users();
    })
  }

  onHide(){
    this.visibleChange.emit(false);
  }
  get_users(){
     this.http_service.fetch_users().subscribe((res:User[])=>{
      this.two_way.raise_emit_users(res);
    })
  }

}
