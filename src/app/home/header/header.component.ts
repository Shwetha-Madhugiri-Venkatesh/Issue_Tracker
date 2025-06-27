import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(public router:Router){}
  items = [
            { label: 'Dashboard', icon: 'fa-solid fa-table-columns', route: 'dashboard' },
           { label: 'Issues', icon: 'fa-solid fa-bug', route: 'issues' },
            { label: 'Users', icon: 'fa-solid fa-user', route: 'users' },
        ];

  navigate_to(route){
    this.router.navigateByUrl("/home/"+route);
  }
}
