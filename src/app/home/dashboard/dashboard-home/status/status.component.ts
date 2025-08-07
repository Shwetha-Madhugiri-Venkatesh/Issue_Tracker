import { Component, Input, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { Ticket } from 'src/app/Models/ticket';
import { HTTPService } from 'src/app/Services/http_service';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';
import { GoogleChartComponent, GoogleChartInterface, GoogleChartType } from 'ng2-google-charts';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css'],
  providers: [MessageService]
})
export class StatusComponent {
  data;
  status_options;

  @Input() other_header;
  @Input() font;
  constructor(private http_service: HTTPService, private two_way: TwoWayDataBinding, private message_service:MessageService) { }

  public pieChart: GoogleChartInterface = {
      chartType: GoogleChartType.ColumnChart,
      options: { 'title': 'Tasks' },
    };
    @ViewChild('gc') google: GoogleChartComponent;
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

      this.pieChart = {
        ...this.pieChart,
        dataTable: [
          ['Dates', 'Number of Issues'],
          ...Object.entries(result)
        ],
        options: {
          vAxis: {
            title: 'Number of Issues',
            minValue: 0
          },
          hAxis: {
            title: 'Dates',
            minValue: 0
          },
           width:this.other_header?180:600,
          height:this.other_header?130:500,
        },
      };
      this.google?.draw(this.pieChart);
    },
    
    (err)=>{
      this.message_service.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: err+', Tickets fetch failed'
                    });
    }
  )
  }
}
