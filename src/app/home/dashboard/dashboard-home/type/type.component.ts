import { Component, Input, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { Ticket } from 'src/app/Models/ticket';
import { HTTPService } from 'src/app/Services/http_service';
import { GoogleChartComponent, GoogleChartInterface, GoogleChartType } from 'ng2-google-charts';


@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.css'],
  providers: [MessageService]
})
export class TypeComponent {
  data;
  type_options: { plugins: { datalabels: { display: boolean; color: string; font: { size: number; weight: string; }; }; }; };
  @Input() other_header;
  @Input() font;
  public pieChart: GoogleChartInterface = {
    chartType: GoogleChartType.PieChart,
    options: { 'title': 'Tasks' },
  };
  @ViewChild('gc') google: GoogleChartComponent;
  constructor(private http_service: HTTPService, private message_service: MessageService) { }

  types: { type: string, value: string }[] = [
    { type: "Bug", value: "bug" },
    { type: "Feature", value: "feature" },
  ]

  ngOnInit() {
    let result = {}; //{type_name : number_of_issues}
    //the initial data load
    this.http_service.fetch_tickets().subscribe((res: Ticket[]) => {
      let number_of_issues = 0;
      //filtering the tickets
      for (let x of this.types) {
        number_of_issues = res.filter((item1) => item1.type == x.type).length;
        result[x.type] = number_of_issues;
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
          height:this.other_header?120:500,
        },
      };

      this.google?.draw(this.pieChart);
    },

      (err) => {
        this.message_service.add({
          severity: 'error',
          summary: 'Error',
          detail: err + ', Tickets fetch failed'
        });
      }
    )
  }
}