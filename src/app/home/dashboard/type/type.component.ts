import { Component } from '@angular/core';
import { Ticket } from 'src/app/Models/ticket';
import { HTTPService } from 'src/app/Services/http_service';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.css']
})
export class TypeComponent {
    
      data;
  type_options: { plugins: { legend: { labels: { font: { size: number; }; }; }; datalabels: { display: boolean; color: string; font: { size: number; weight: string; }; }; }; };
    
      constructor(private http_service:HTTPService, private two_way:TwoWayDataBinding){}
    
      types:{type:string,value:string}[]=[
    {type:"Bug", value:"bug"},
    {type:"Feature",value:"feature"},
  ]
    
      ngOnInit(){
        let result={};
        this.http_service.fetch_tickets().subscribe((res:Ticket[])=>{
          let number_of_issues=0;
          for(let x of this.types){
            number_of_issues = res.filter((item1)=>item1.type==x.type).length;
            result[x.type]=number_of_issues;
          }
          console.log(result);
          this.data = {
             labels: Object.keys(result),
           datasets: [
              {
                label: 'Sales',
                data: Object.values(result),
                fill: false,
                backgroundColor:['blue',"orange"],
                borderColor: 'white',
                tension: 0
              }
            ]
          };
          this.type_options = {
    plugins: {
    legend: {
      labels: {
        font:{
              size:this.getResponsiveFontSize()
            }
      }
    },
    datalabels: {
      display: true,
      color: 'white',
      font: {
        size: 14,
        weight: 'bold'
      }
    }
  }
};
        })
      }
      refresh(){
    this.ngOnInit();
  }

  getResponsiveFontSize() {
    const vw = window.innerWidth / 100;
    return Math.max(12, vw); // prevent too small
  }

}