import { Component, HostListener} from '@angular/core';
import { Router } from '@angular/router';
import { Ticket } from 'src/app/Models/ticket';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  home: boolean;
  custom: boolean;
  route: string = '';
  sub;

  constructor(private two_way: TwoWayDataBinding, private router: Router) { }

  ngOnInit() {
    //Preloading the data if present in local storage
    let dashboard_preload = JSON.parse(localStorage.getItem("dashboard_preload"))||{};

    //Emitting the current component name as issues
    this.two_way.current_route_emit('Dashboard'); //emits that the current route is dashboard

    //If Preloading data is present
    if (Object.keys(dashboard_preload).length != 0) {
      if (dashboard_preload.home == true) {
        this.router.navigateByUrl("/home");
        this.home = true;
        this.custom = false;
      }
      if (dashboard_preload.custom == true) {
        this.router.navigateByUrl("/home/custom");
        this.custom = true;
        this.home = false;
      }
      localStorage.setItem("dashboard_preload", JSON.stringify({}));
    }
    else {
      this.sub = this.two_way.emit_dashboard_subcomponent.subscribe((res) => {
        if (res == "") {
          this.home = true;
          this.custom = false;
        } else if (res == "list") {
          this.custom = true;
          this.home = false;
        }
        this.sub.unsubscribe();
      })
    }
  }

  //navigation function for kanban button
  home_clicked() {
    this.home = true;
    this.custom = false;
    this.route = '';
    this.router.navigateByUrl("/home" + this.route);
  }

  //navigation function for list button
  custom_clicked() {
    this.custom = true;
    this.home = false;
    this.route = 'custom';
    this.router.navigateByUrl("/home/" + this.route);
  }

  set_preload(){
    let dashboard_preload = JSON.parse(localStorage.getItem("dashboard_preload")) || {};
    dashboard_preload['home'] = this.home;
    dashboard_preload['custom'] = this.custom;
    localStorage.setItem("dashboard_preload", JSON.stringify(dashboard_preload));
  }

  @HostListener('window:beforeunload', ['$event'])
    onBeforeUnload(event: BeforeUnloadEvent) {
     this.set_preload();
    }
  
  //Storing the data which needs to be preloaded when the user navigates
  ngOnDestroy() {
    this.set_preload();
  }
}
