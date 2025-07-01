import { Component } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  dialog_flag=false;

  dialog(val:boolean){
    console.log(val);
    this.dialog_flag=val;
  }

 
}
