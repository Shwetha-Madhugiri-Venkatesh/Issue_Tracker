import { Component, OnInit } from '@angular/core';
import { Ticket } from 'src/app/Models/ticket';
import { HTTPService } from 'src/app/Services/http_service';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';

@Component({
  selector: 'app-priority',
  templateUrl: './priority.component.html',
  styleUrls: ['./priority.component.css']
})
export class PriorityComponent implements OnInit{

  data;
  priority_options;
  constructor(private http_service:HTTPService, private two_way:TwoWayDataBinding){}

  priorities:{priorityId:string, priority:string}[]=this.two_way.priorities;

  ngOnInit(){
    let result={};
    this.http_service.fetch_tickets().subscribe((res:Ticket[])=>{
      let number_of_issues=0;
      for(let x of this.priorities){
        number_of_issues = res.filter((item1)=>item1.priorityId==x.priorityId).length;
        result[x.priority]=number_of_issues;
      }
      console.log(result);
      this.data = {
         labels: Object.keys(result),
       datasets: [
          {
            label: 'Sales',
            data: Object.values(result),
            fill: false,
            backgroundColor:"blue",
            borderColor: '#42A5F5',
            tension: 0
          }
        ]
      };
    })

    this.priority_options={
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      responsive: true,
  plugins: {
    tooltip: {
      enabled: true
    },
    legend: { display: false },
    datalabels: {
      display: true,
      color: 'white',
      font: {
        size: 14,
        weight: 'bold'
      }
    }
  }
      ,
      scales: {
        x: {
          grid: {
            
            drawBorder: false,
            drawOnChartArea: false,    
            display: false  
          },
          title: {
            display: true,
            text: 'Priority'
          }
        },
        y: {
          grid: {
            
            drawBorder: false,
            drawOnChartArea: false,
            display: false
          },
          title: {
            display: true,
            text: 'Number of Issues',
            rotation: 0,
            padding: { top: 0, bottom: 5, left: 20, right: 20 }
          }
        }
      }
    }
  }

  refresh(){
    this.ngOnInit();
  }
}
