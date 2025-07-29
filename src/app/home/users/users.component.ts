import { Component } from '@angular/core';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  dialog_flag: boolean = false;
  prefill_id: string = '';

  constructor(private two_way: TwoWayDataBinding) { }

  ngOnInit() {
    this.two_way.current_route_emit('Users');
  }

  //function for handling the dialog display 
  dialog(data: [boolean, string?]) {
    this.dialog_flag = data[0];
    this.prefill_id = data[1];
  }
}
