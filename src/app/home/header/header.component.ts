import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { User } from 'src/app/Models/User';
import { HTTPService } from 'src/app/Services/http_service';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [MessageService]
})
export class HeaderComponent {
  selected: string = 'Dashboard';
  login_user: {};
  logout_visible: boolean = false;
  user_details = { uname: '', type: '', profile: '', fname: '', lname: '', user_id: '' };
  items = [
    { label: 'Dashboard', icon: 'dashboard_1828765.png', route: "/home" },
    { label: 'Issues', icon: 'bug_8786300.png', route: 'issues' },
    { label: 'Users', icon: 'profile_7310896.png', route: 'users' },
  ];

  constructor(public router: Router, private two_way: TwoWayDataBinding, private http_service: HTTPService, private message_service:MessageService) { }

  ngOnInit() {
    //subscribing to the event in server to know the cuurent component in run, (Dashboard,Issues,Users)
    this.two_way.emit_current_route.subscribe((res) => {
      this.selected = res;
    })

    //Accessing the current logged in user
    this.login_user = JSON.parse(localStorage.getItem("login")) || {};
    this.http_service.fetch_users()
      .pipe(catchError((err) => {
        this.message_service.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'User fetch failed'
        });
        return throwError(() => err);
      }))
      .subscribe((res: User[]) => {
        this.user_details = res.find(item => item.user_id == this.login_user['userId']);
      })
  }

  //naviage function for nav bar menu
  navigate_to(route, label) {
    this.router.navigateByUrl("/home/" + route);
    this.selected = label;
  }

  //logout function
  logout_confirm() {
    localStorage.setItem("login", JSON.stringify({}));
    localStorage.setItem("logged", JSON.stringify(false));
    localStorage.setItem("issues_preload", JSON.stringify({}));
    localStorage.setItem("graph_preload", JSON.stringify({}));
    localStorage.setItem("kanban_preload", JSON.stringify({}));
    localStorage.setItem("list_preload", JSON.stringify({}));
    localStorage.setItem("category_preload", JSON.stringify({}));
    this.router.navigateByUrl("");
  }
}