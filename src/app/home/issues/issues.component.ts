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
  
  kabban:boolean;
  list:boolean;
  route:string='';


  ngOnInit(){
    let issues_preload=JSON.parse(localStorage.getItem("issues_preload"));
    this.two_way.current_route_emit('Issues')
    if(Object.keys(issues_preload).length!=0){
    if(issues_preload.kabban==true){
      this.kabban=true;
      this.list=true;
      this.router.navigateByUrl("/home/issues");
    }
    if(issues_preload.list==true){
      this.list=true;
      this.kabban=false;
      this.router.navigateByUrl("/home/issues/list");
    }
    localStorage.setItem("issues_preload",JSON.stringify({}));
    }

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
    this.route='';
    this.router.navigateByUrl("/home/issues"+this.route);
  }

  list_clicked(){
    this.list=true;
    this.kabban=false;
    this.route='list';
    this.router.navigateByUrl("/home/issues/"+this.route);
  }

  ngOnDestroy(){
    let issues_preload=JSON.parse(localStorage.getItem("issues_preload"))||{};
    issues_preload['kabban']=this.kabban;
    issues_preload['list']=this.list;
    localStorage.setItem("issues_preload",JSON.stringify(issues_preload));
  }
}
