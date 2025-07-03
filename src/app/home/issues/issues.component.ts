import { Component } from '@angular/core';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';

@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.css']
})
export class IssuesComponent {
  constructor(private two_way:TwoWayDataBinding){}

  ngOnInit(){
    this.two_way.current_route_emit('Issues')
  }
}
