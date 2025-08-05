import { Component, HostListener, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GridsterComponent, IGridsterOptions } from '@hyperviewhq/angular2gridster';
import { customDashboard } from 'src/app/Models/customDashboard';
import { HTTPService } from 'src/app/Services/http_service';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';

@Component({
  selector: 'app-custom-dashboard',
  templateUrl: './custom-dashboard.component.html',
  styleUrls: ['./custom-dashboard.component.css']
})
export class CustomDashboardComponent {
  options:IGridsterOptions;
  add_visible:boolean=false;
  title:string;
  input:string;
  items:customDashboard[]=[];

  edit_flag:boolean=false;
  save_flag:boolean=false;
  previus_items=[];

  @ViewChild('gridsterComponent') gridster_component:GridsterComponent;
  constructor(public two_way:TwoWayDataBinding,public http_service:HTTPService){}
  ngOnInit(){
    this.two_way.current_dashboard_subcomponent("custom");

    this.options={
      lanes:4,
      direction:'vertical',
      floating:false,
      resizable:false,
      dragAndDrop:false,
    }

    let preload_data = JSON.parse(localStorage.getItem("customDashboard"))||{};
    if(Object.keys(preload_data).length!=0){
      this.items=preload_data;
      localStorage.setItem("customDashboard", JSON.stringify({}));
    }else{
      this.fetch_items();
    }
  }

  open_add_dialog(){
    this.cancel_change();
    this.add_visible=true;
  }

  fetch_items(){
    this.http_service.custom_dashboard_fetch().subscribe((res:customDashboard[])=>{
      this.items=res;
    })
  }
  add_component(add_form:NgForm){
    console.log(add_form.value);
    let item:customDashboard={
      title: '',
      input: '',
      w: 0,
      h: 0,
      x: 0,
      y: 0
    };
    item.title=add_form.value.title;
    item.input=add_form.value.input;
    item.w=2;
    item.h=2;
    if(this.items[this.items.length-1]?.x!=undefined){
      if(this.items[this.items.length-1]?.x==0){
        item.x=2;
        item.y=this.items[this.items.length-1]?.y||0;
      }else{
        item.x=0;
        item.y=(this.items[this.items.length-1]?.y||0)+2;
      }
    }
  //   if(this.items.length>0){
  //   let ind = this.items.findIndex(i=>i.x==item.x && i.y==item.y);
  //   console.log(ind);
  //   for(let p=ind;p<this.items.length;p++){
  //     if(this.items[p]?.x==0){
  //       this.items[p].x=2;
  //     }else{
  //       this.items[p].x=0;
  //       this.items[p].y=this.items[p].y+2;
  //     }
  //     this.http_service.custom_dashboard_put(this.items[p],this.items[p]['id']).subscribe((res)=>{
  //       console.log(res);
  //     })
  //   }
  // }
    this.http_service.custom_dashboard_post(item).subscribe((res:customDashboard[])=>{
      console.log(res);
      this.fetch_items();
      this.add_visible=false;
    })
  }

  cancel_change(){
    this.input='';
    this.title='';
  }

  @HostListener('window:beforeunload', ['$event'])
    onBeforeUnload(event: BeforeUnloadEvent) {
      if(this.save_flag==true){
      localStorage.setItem("customDashboard",JSON.stringify(this.items));
      }
    }

  edit(){
    this.previus_items=structuredClone(this.items);
    this.edit_flag=true;
    this.save_flag=false;
    this.gridster_component.setOption('resizable', true);
    this.gridster_component.setOption('dragAndDrop', true);
  }

  save(){
    this.save_flag=true;
    this.gridster_component.setOption('resizable', false);
    this.gridster_component.setOption('dragAndDrop', false);
    this.items.forEach(item=>{
      this.http_service.custom_dashboard_put(item,item['id']).subscribe((res)=>{
        console.log(res);
      });
    })
  }

  cancel(){
    this.items=this.previus_items;
    this.gridster_component.setOption('resizable', false);
    this.gridster_component.setOption('dragAndDrop',false); 
  }

  ngOnDestroy(){
    if(this.save_flag==true){
    localStorage.setItem("customDashboard",JSON.stringify(this.items));
    }
  }
}
