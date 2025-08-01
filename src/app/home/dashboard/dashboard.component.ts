import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  item1:GridsterItem={cols:2,rows:2,x:0,y:0};
  item2:GridsterItem={cols:2,rows:2,x:2,y:0};
  item3:GridsterItem={cols:2,rows:2,x:0,y:2};
  item4:GridsterItem={cols:2,rows:2,x:2,y:2};
  item5:GridsterItem={cols:4,rows:2,x:0,y:4};
  item6:GridsterItem={cols:2,rows:2,x:0,y:6};
  item7:GridsterItem={cols:2,rows:2,x:2,y:6};
  item8:GridsterItem={cols:2,rows:2,x:2,y:8};

  items=[this.item1,this.item2,this.item3,this.item4,this.item5,this.item6,this.item7,this.item8];
  preload_data = structuredClone(this.items);

  edit_flag:boolean=false;

  static itemChange(item, itemComponent) {
     console.info('itemChanged', item, itemComponent);
   }

   static itemResize(item, itemComponent) {
      console.info('itemResized',item, itemComponent);
   }
  constructor(private two_way:TwoWayDataBinding){}
  options:GridsterConfig|undefined;

  ngOnInit(){
    this.options={
      resizable:{
        enabled:false
      },
      draggable:{
        enabled:false
      },
      gridType:'fit',
      displayGrid:'onDrag&Resize',
      margin:5,
      maxCols:4,
      maxRows:8,
      //disableWindowResize:true,
      scrollToNewItems:true,
      pushResizeItems:true,
      itemChangeCallback: DashboardComponent.itemChange,
       itemResizeCallback: DashboardComponent.itemResize,
  //     gridType: 'fixed',
  // fixedColWidth: 612,      // Each column is 120px wide
  // fixedRowHeight: 450,     // Each row is 100px tall
  // draggable: { enabled: true },
  // resizable: { enabled: true },
  // displayGrid: 'always'
    }
    //calling TwoWayDataBinding server function
    this.two_way.current_route_emit('Dashboard'); //emits that the current route is dashboard
  }

  changedOptions() {
    this.options.api?.optionsChanged?.();
  }

  edit(){
    this.edit_flag=true;
    this.options={
      ...this.options,
      resizable:{
        enabled:true,
      },
      draggable:{
        enabled:true
      },
    }
  }

  save(){
    this.options={
      ...this.options,
      resizable:{
        enabled:false,
      },
      draggable:{
        enabled:false
      },
    }
  }
}
