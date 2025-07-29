import { Component } from '@angular/core';
import { Ticket } from 'src/app/Models/ticket';
import { HTTPService } from 'src/app/Services/http_service';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.css']
})
export class TypeComponent {
  data;
  type_options: { plugins: { datalabels: { display: boolean; color: string; font: { size: number; weight: string; }; }; }; };

  constructor(private http_service: HTTPService) { }

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

      this.data = {
        labels: Object.keys(result), //result object keys as type names
        datasets: [
          {
            label: 'Sales',
            data: Object.values(result), //result object values as number of issues respectively
            fill: false,
            backgroundColor: ['blue', "orange"],
            borderColor: 'white',
            tension: 0
          }
        ]
      };

      this.type_options = {
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
    })
  }
}