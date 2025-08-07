import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { Ticket } from 'src/app/Models/ticket';
import { HTTPService } from 'src/app/Services/http_service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
   providers: [MessageService]
})
export class GraphComponent implements OnInit {

  all_tickets = [];
  start_date;
  end_date;
  data: { labels: string[]; datasets: { label: string; data: number[]; fill: boolean; backgroundColor: string, borderColor: string; tension: number; }[]; };
  graph_options;

  @Input() graph_header;
  @Input() graph_header_right;
  constructor(private http_service: HTTPService, private message_service:MessageService) { }

  ngOnInit() {
    let today = new Date();
    //The initial data load
    this.http_service.fetch_tickets().subscribe((res: Ticket[]) => {
      this.all_tickets = res;

      //fetching the preload data from localstorage if present
      let preload_info = JSON.parse(localStorage.getItem("graph_preload")) || {};

      //assigning the preload data
      if (Object.keys(preload_info)?.length != 0 && preload_info != undefined) {
        this.start_date = preload_info.start_date ? new Date(preload_info.start_date) : undefined;
        this.end_date = preload_info.end_date ? new Date(preload_info.end_date) : undefined;
        this.graph_data(this.start_date, this.end_date)
        localStorage.setItem("graph_preload", JSON.stringify({}));
      }

      //if preload data is not present, the data is undefined
      if (this.data == undefined) {
        let filtered_record = this.for_day(today); //calling method to filter records
        this.data = {
          labels: [today.toLocaleDateString() + ""],
          datasets: [
            {
              label: 'Sales',
              data: [filtered_record.length],
              fill: false,
              backgroundColor: 'blue',
              borderColor: '#42A5F5',
              tension: 0,
            }
          ]
        };
      }

      this.graph_options = {
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
              text: 'Dates'
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
    },
    (err)=>{
      this.message_service.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: err+', Tickets fetch failed'
                    });
    }
  )
    //end of initial data load
  }
  
  //method to filter the tickets specific to the date which is passed as a parameter
  for_day(date) {
    let filtered_record = this.all_tickets.filter(item => {
      let idate = new Date(item.createDateTime).toLocaleString();
      return idate.startsWith(date.toLocaleDateString())
    });
    return filtered_record;
  }

  // onSelectEvent call for start and end dates
  graph_data(start_date, end_date) {
    let result = [];
    let start = structuredClone(start_date); //to prevent the original date modification, using deep copy

    if (start_date != undefined && end_date != undefined) {
      let labels = [];

      //calling for_day() to filter the tickets
      for (let x = start.getDate(); x <= end_date.getDate(); x++) {
        result.push(this.for_day(new Date(start.setDate(x))).length);
        labels.push(new Date(start.setDate(x)).toLocaleDateString());
      }

      this.data = {
        labels: labels,
        datasets: [
          {
            label: 'Sales',
            data: result,
            fill: false,
            backgroundColor: "blue",
            borderColor: '#42A5F5',
            tension: 0,
          }
        ]
      };
    }
  }

  //storing data which should be preloaded once the user navigates
  ngOnDestroy() {
    /*first canactivate for login will execute, after that ngOnDestroy will execute. Since I am clearing the data 
    present in local storage and again it is loaded since the ngOnDestroy will execute at last I am checking the 
    condition below*/

    //if the user is still logged in
    if (Object.keys(JSON.parse(localStorage.getItem("login"))).length != 0) {
      let preload_info = JSON.parse(localStorage.getItem("graph_preload")) || {};
      preload_info['start_date'] = this.start_date;
      preload_info['end_date'] = this.end_date;
      preload_info['data'] = this.data;
      localStorage.setItem("graph_preload", JSON.stringify(preload_info));
    }
  }
}
