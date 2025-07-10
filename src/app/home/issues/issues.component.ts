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
  constructor(private two_way:TwoWayDataBinding,private router:Router){}
  
  kabban:boolean=false;
  list:boolean=false;
  route:string='';


  ngOnInit(){
    this.two_way.current_route_emit('Issues')
    this.two_way.emit_issues_subcomponent.subscribe((res)=>{
      if(res==""){
        this.kabban=true;
        this.list=false;
      }else if(res=="list"){
        this.list=true;
        this.kabban=false;
      }
    })
  }

  kabban_clicked(){
    this.kabban=true;
    this.list=false;
    this.route='/issues';
    this.router.navigateByUrl("/home/issues/"+this.route);
  }

  list_clicked(){
    this.list=true;
    this.kabban=false;
    this.route='list';
    this.router.navigateByUrl("/home/issues/"+this.route);
  }
}
