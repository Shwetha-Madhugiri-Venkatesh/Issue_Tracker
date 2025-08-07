import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { Ticket } from 'src/app/Models/ticket';
import { HTTPService } from 'src/app/Services/http_service';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.css'],
   providers: [MessageService]
})
export class BrowserComponent implements OnInit {

  data;
  browser_options;
  @Input() other_header;
  constructor(private http_service: HTTPService, private two_way: TwoWayDataBinding, private message_service:MessageService) { }

  //from TwoWayDataBinding server
  browsers: { browser_name: string, browser_id: string }[] = this.two_way.browsers;

  ngOnInit() {
    let result = {}; //{Browsername: number_of_issues}
    this.http_service.fetch_tickets().subscribe((res: Ticket[]) => {
      let number_of_issues = 0;
      //filtering the browsers based on their ids
      for (let x of this.browsers) {
        number_of_issues = res.filter((item1) => item1.browser == x.browser_id).length;
        if (number_of_issues != 0) {
          result[x.browser_name] = number_of_issues;
        }
      }

      this.data = {
        labels: Object.keys(result), //result object keys as browser names
        datasets: [
          {
            label: 'Sales',
            data: Object.values(result), //result object values as number of issues respectively
            fill: false,
            backgroundColor: ["orange", "magenta", 'pink', 'blue', 'green', 'gray', 'red'],
            borderColor: 'white',
            tension: 0,
          }
        ]
      };

      this.browser_options = {
        plugins: {
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
