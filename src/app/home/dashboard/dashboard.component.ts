import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridListItem, IGridsterOptions } from '@hyperviewhq/angular2gridster';
import { HTTPService } from 'src/app/Services/http_service';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  item1={x:0,y:0,w:2,h:2};
  item2={x:2,y:0,w:2,h:2};
  item3={w:2,h:2,x:0,y:2};
  item4={w:2,h:2,x:2,y:2};
  item5={w:4,h:2,x:0,y:4};
  item6={w:2,h:2,x:0,y:6};
  item7={w:2,h:2,x:2,y:6};

  items=[this.item1,this.item2,this.item3,this.item4,this.item5,this.item6,this.item7];

  edit_flag:boolean=false;
  save_flag:boolean=false;
  previus_items=[];

  static itemChange(item, itemComponent) {
     console.info('itemChanged', item, itemComponent);
   }

   static itemResize(item, itemComponent) {
      console.info('itemResized',item, itemComponent);
   }
  constructor(private two_way:TwoWayDataBinding, public http_service:HTTPService){}
  options:IGridsterOptions;

  ngOnInit(){
    this.options={
    lanes: 4, 
    direction: 'vertical',
      floating: true, 
  dragAndDrop: true,
    resizable: true,
  //     gridType: 'fixed',
  // fixedColWidth: 612,    
  // fixedRowHeight: 450, 
  // draggable: { enabled: true },
  // resizable: { enabled: true },
  // displayGrid: 'always'
    }
    //calling TwoWayDataBinding server function
    this.two_way.current_route_emit('Dashboard'); //emits that the current route is dashboard
    let preload_data = JSON.parse(localStorage.getItem("dashboard"));
    if(Object.keys(preload_data).length!=0){
      this.items=preload_data;
    }
  }
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    if(this.save_flag==true){
    localStorage.setItem("dashboard",JSON.stringify(this.items));
    }
  }

  edit(){
    this.previus_items=structuredClone(this.items);
    this.edit_flag=true;
    this.save_flag=false;
    this.options={
      ...this.options,
      resizable:true,
      dragAndDrop:true,
    }
  }

  save(){
    this.save_flag=true;
    this.options={
      ...this.options,
      resizable:false,
      dragAndDrop:false,
    }
  }

  cancel(){
    this.items=this.previus_items;
    this.options={
      ...this.options,
     resizable:false,
      dragAndDrop:false,
    }
  }
}
