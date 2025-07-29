import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Ticket } from 'src/app/Models/ticket';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';

@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.css']
})
export class IssuesComponent {
  kabban: boolean;
  list: boolean;
  route: string = '';
  sub;

  constructor(private two_way: TwoWayDataBinding, private router: Router) { }

  ngOnInit() {
    //Preloading the data if present in local storage
    let issues_preload = JSON.parse(localStorage.getItem("issues_preload"));

    //Emitting the current component name as issues
    this.two_way.current_route_emit('Issues');

    //If Preloading data is present
    if (Object.keys(issues_preload).length != 0) {
      if (issues_preload.kabban == true) {
        this.router.navigateByUrl("/home/issues");
        this.kabban = true;
        this.list = false;
      }
      if (issues_preload.list == true) {
        this.router.navigateByUrl("/home/issues/list");
        this.list = true;
        this.kabban = false;
      }
      localStorage.setItem("issues_preload", JSON.stringify({}));
    }
    else {
      this.sub = this.two_way.emit_issues_subcomponent.subscribe((res) => {
        if (res == "") {
          this.kabban = true;
          this.list = false;
        } else if (res == "list") {
          this.list = true;
          this.kabban = false;
        }
        this.sub.unsubscribe();
      })
    }
  }

  //navigation function for kanban button
  kabban_clicked() {
    this.kabban = true;
    this.list = false;
    this.route = '';
    this.router.navigateByUrl("/home/issues" + this.route);
  }

  //navigation function for list button
  list_clicked() {
    this.list = true;
    this.kabban = false;
    this.route = 'list';
    this.router.navigateByUrl("/home/issues/" + this.route);
  }
  
  //Storing the data which needs to be preloaded when the user navigates
  ngOnDestroy() {
    let issues_preload = JSON.parse(localStorage.getItem("issues_preload")) || {};
    issues_preload['kabban'] = this.kabban;
    issues_preload['list'] = this.list;
    localStorage.setItem("issues_preload", JSON.stringify(issues_preload));
  }
}
