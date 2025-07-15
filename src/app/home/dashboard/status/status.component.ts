import { Component } from '@angular/core';
import { Ticket } from 'src/app/Models/ticket';
import { HTTPService } from 'src/app/Services/http_service';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent {
  
    data;
    status_options;

    constructor(private http_service:HTTPService, private two_way:TwoWayDataBinding){}
  
    statuses:{statusId:string, status:string,tickets:Ticket[]}[]=this.two_way.statuses;
  
    ngOnInit(){
      let result={};
      this.http_service.fetch_tickets().subscribe((res:Ticket[])=>{
        let number_of_issues=0;
        for(let x of this.statuses){
          number_of_issues = res.filter((item1)=>item1.statusId==x.statusId).length;
          result[x.status]=number_of_issues;
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

      this.status_options={
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      responsive: true,
  plugins: {
    tooltip: {
      enabled: true
    },
    legend: { display: false },
  },
      scales: {
        x: {
          grid: {
            
            drawBorder: false,
            drawOnChartArea: false,    
            display: false  
          },
          title: {
            display: true,
            text: 'Status'
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
}
