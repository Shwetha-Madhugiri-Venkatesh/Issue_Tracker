import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/Models/User';
import { HTTPService } from 'src/app/Services/http_service';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  selected:string = 'Dashboard';
  login_user:{};
  user_details={uname:'',type:'',profile:''};
   items = [
            { label: 'Dashboard', icon: 'dashboard_1828765.png', route: "/home" },
           { label: 'Issues', icon: 'bug_8786300.png', route: 'issues' },
            { label: 'Users', icon: 'profile_7310896.png', route: 'users' },
        ];
  constructor(public router:Router, private two_way:TwoWayDataBinding,private http_service:HTTPService){}

  ngOnInit(){
    this.two_way.emit_current_route.subscribe((res)=>{
      this.selected=res;
    })
    this.login_user=JSON.parse(localStorage.getItem("login"))||{};
    this.http_service.fetch_users().subscribe((res:User[])=>{
      this.user_details=res.find(item=>item.user_id==this.login_user['userId']);
      console.log(this.user_details);
    })
  }
  navigate_to(route,label){
    this.router.navigateByUrl("/home/"+route);
    this.selected=label;
  }

  logout(){
    if(confirm("are you sure?")){
    let login=JSON.parse(localStorage.getItem("logged"))||{};
    login=false;
    localStorage.setItem("logged",login);
    this.router.navigateByUrl("");
    }else{
      return;
    }
  }
}
