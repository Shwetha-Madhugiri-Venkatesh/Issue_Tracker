import { Component } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  dialog_flag:boolean=false;
  prefill_id:string='';
  dialog(data:[boolean,string?]){
    console.log(data);
    this.dialog_flag=data[0];
    this.prefill_id=data[1];
  }
 
}
