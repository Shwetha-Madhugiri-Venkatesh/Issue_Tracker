import { Component } from '@angular/core';
import { Ticket } from 'src/app/Models/ticket';
import { HTTPService } from 'src/app/Services/http_service';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.css']
})
export class BrowserComponent {
  data;
  browser_options;

  constructor(private http_service: HTTPService, private two_way: TwoWayDataBinding) { }

  browsers: { browser_name: string, browser_id: string }[] = this.two_way.browsers;


  ngOnInit() {
    let result = {};
    this.http_service.fetch_tickets().subscribe((res: Ticket[]) => {
      let number_of_issues = 0;
      for (let x of this.browsers) {
        number_of_issues = res.filter((item1) => item1.browser == x.browser_id).length;
        if(number_of_issues!=0){
        result[x.browser_name] = number_of_issues;
        }
      }
      console.log(result);
      this.data = {
        labels: Object.keys(result),
        datasets: [
          {
            label: 'Sales',
            data: Object.values(result),
            fill: false,
            backgroundColor: ["orange", "magenta", 'pink', 'blue', 'green', 'gray', 'red'],
            borderColor: 'white',
            tension: 0,
          }
        ]
      };

      this.browser_options = {
    plugins: {
    legend: {
      labels: {
        font:{
              size:this.getResponsiveFontSize()
            }
      }
    }
  }
};
    })
  }

  getResponsiveFontSize() {
    const vw = window.innerWidth / 100;
    return Math.max(12, vw); // prevent too small
  }

  refresh(){
    this.ngOnInit();
  }
}
