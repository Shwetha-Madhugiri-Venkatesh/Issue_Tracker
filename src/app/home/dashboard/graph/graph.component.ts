import { Component, OnInit } from '@angular/core';
import { HTTPService } from 'src/app/Services/http_service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit{

    selectedScale:{scale:string,value:string};

    scales:{scale:string,value:string}[]=[
        {scale:'Daily',value:"day"},
        {scale:'Weekly',value:"week"},
        {scale:'Monthly',value:"month"},
    ]
  data: { labels: string[]; datasets: { label: string; data: number[]; fill: boolean; borderColor: string; tension: number; }[]; };
  options: { responsive: boolean; plugins: { legend: { labels: { color: string; }; }; }; scales: { x: { ticks: { color: string; }; grid: { color: string; }; }; y: { ticks: { color: string; }; grid: { color: string; }; }; }; };

    constructor(private http_service:HTTPService){}
    ngOnInit(){
        this.data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [
        {
          label: 'Sales',
          data: [65, 59, 80, 81, 56],
          fill: false,
          borderColor: '#42A5F5',
          tension: 0
        }
      ]
    };

    this.options = {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      }
    };
    }

}
