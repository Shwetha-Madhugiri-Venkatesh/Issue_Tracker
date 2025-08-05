import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { Ticket } from 'src/app/Models/ticket';
import { HTTPService } from 'src/app/Services/http_service';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css'],
  providers: [MessageService]
})
export class StatusComponent {
  data;
  status_options;

  constructor(private http_service: HTTPService, private two_way: TwoWayDataBinding, private message_service:MessageService) { }

  //data from TwoWayDataBinding server
  statuses: { statusId: string, status: string, tickets: Ticket[] }[] = this.two_way.statuses;

  ngOnInit() {
    let result = {}; //{status_name : number_of_issues}

    //the initial data load
    this.http_service.fetch_tickets().subscribe((res: Ticket[]) => {
      let number_of_issues = 0;
      //filtering the tickets
      for (let x of this.statuses) {
        number_of_issues = res.filter((item1) => item1.statusId == x.statusId).length;
        result[x.status] = number_of_issues;
      }

      this.data = {
        labels: Object.keys(result), //result object keys as status names
        datasets: [
          {
            label: 'Sales',
            data: Object.values(result), //result object values as number of issues
            fill: false,
            backgroundColor: "blue",
            borderColor: '#42A5F5',
            tension: 0
          }
        ]
      };
    },
    
    (err)=>{
      this.message_service.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: err+', Tickets fetch failed'
                    });
    }
  )

    this.status_options = {
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
            text: 'Status',
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
            padding: { top: 0, bottom: 5, left: 20, right: 20 },
          }
        }
      }
    }
  }
}
