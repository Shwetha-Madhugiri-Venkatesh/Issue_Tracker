import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { Ticket } from 'src/app/Models/ticket';
import { HTTPService } from 'src/app/Services/http_service';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';

import { GoogleChartComponent, GoogleChartInterface, GoogleChartType } from 'ng2-google-charts';

@Component({
  selector: 'app-priority',
  templateUrl: './priority.component.html',
  styleUrls: ['./priority.component.css'],
  providers: [MessageService]
})
export class PriorityComponent implements OnInit {
  data;
  priority_options;

  @Input() other_header;
   @Input() font;
  public pieChart: GoogleChartInterface = {
        chartType: GoogleChartType.ColumnChart,
        options: { 'title': 'Tasks' },
      };
      @ViewChild('gc') google: GoogleChartComponent;
  constructor(private http_service: HTTPService, private two_way: TwoWayDataBinding, private message_service:MessageService) { }

  //data from TwoWayDataBinding server
  priorities: { priorityId: string, priority: string }[] = this.two_way.priorities;

  ngOnInit() {
    let result = {}; //{priority_name : number_of_issues}

    //the initial data load
    this.http_service.fetch_tickets().subscribe((res: Ticket[]) => {
      let number_of_issues = 0;
      //filtering the tickets according to priority Ids
      for (let x of this.priorities) {
        number_of_issues = res.filter((item1) => item1.priorityId == x.priorityId).length;
        result[x.priority] = number_of_issues;
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
