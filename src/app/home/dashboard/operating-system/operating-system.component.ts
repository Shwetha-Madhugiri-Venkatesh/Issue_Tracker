import { Component } from '@angular/core';
import { Ticket } from 'src/app/Models/ticket';
import { HTTPService } from 'src/app/Services/http_service';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';

@Component({
  selector: 'app-operating-system',
  templateUrl: './operating-system.component.html',
  styleUrls: ['./operating-system.component.css']
})
export class OperatingSystemComponent {
  data;
        
          constructor(private http_service:HTTPService, private two_way:TwoWayDataBinding){}
        
            operatingSystems:{os_name:string,os_id:string}[]=this.two_way.operatingSystems;

  
        
          ngOnInit(){
            let result={};
            this.http_service.fetch_tickets().subscribe((res:Ticket[])=>{
              let number_of_issues=0;
              for(let x of this.operatingSystems){
                number_of_issues = res.filter((item1)=>item1.operatingSystem==x.os_id).length;
                result[x.os_name]=number_of_issues;
              }
              console.log(result);
              this.data = {
                 labels: Object.keys(result),
               datasets: [
                  {
                    label: 'Sales',
                    data: Object.values(result),
                    fill: false,
                    backgroundColor:["orange","magenta",'pink','yellow','green','gray','red',"blue",'skyblue'],
                    borderColor: 'white',
                    tension: 0
                  }
                ]
              };
            })
          }
}
