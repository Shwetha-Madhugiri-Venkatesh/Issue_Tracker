import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(private two_way:TwoWayDataBinding){}
  
  ngOnInit(){
    //calling TwoWayDataBinding server function
    this.two_way.current_route_emit('Dashboard'); //emits that the current route is dashboard
  }
}
