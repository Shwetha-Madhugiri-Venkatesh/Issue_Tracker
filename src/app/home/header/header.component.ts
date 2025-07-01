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
            { label: 'Dashboard', icon: 'dashboard_1828765.png', route: 'dashboard' },
           { label: 'Issues', icon: 'bug_8786300.png', route: 'issues' },
            { label: 'Users', icon: 'profile_7310896.png', route: 'users' },
        ];


  navigate_to(route){
    this.router.navigateByUrl("/home/"+route);
  }
}
