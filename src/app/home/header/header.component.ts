import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  selected:string = 'Dashboard';
   items = [
            { label: 'Dashboard', icon: 'dashboard_1828765.png', route: "/home" },
           { label: 'Issues', icon: 'bug_8786300.png', route: 'issues' },
            { label: 'Users', icon: 'profile_7310896.png', route: 'users' },
        ];
  constructor(public router:Router, private two_way:TwoWayDataBinding){}

  ngOnInit(){
    this.two_way.emit_current_route.subscribe((res)=>{
      this.selected=res;
    })
  }
  navigate_to(route,label){
    this.router.navigateByUrl("/home/"+route);
    this.selected=label;
  }
}
