import { Component } from '@angular/core';
import { Ticket } from 'src/app/Models/ticket';
import { User } from 'src/app/Models/User';
import { HTTPService } from 'src/app/Services/http_service';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {
  products:Ticket[];
  cols;
  constructor(private http_service:HTTPService,private two_way_data:TwoWayDataBinding){}

  priorities:{priorityId:string, priority:string}[]=this.two_way_data.priorities;
  statuses:{statusId:string, status:string,tickets:Ticket[]}[]=this.two_way_data.statuses;
  categories:{categoryId:string, categoryDesc:string}[]=this.two_way_data.categories;
  subcategories:{subCategoryId:string, categoryId:string , subCategoryDesc:string}[]=this.two_way_data.subcategories;

    ngOnInit() {
        this.http_service.fetch_tickets().subscribe((res:Ticket[])=>{
          res.forEach(item=>{
            item['priority']=this.priorities.find(i=>i.priorityId=item.priorityId).priority;
            item['category']=this.categories.find(i=>i.categoryId=item.categoryId).categoryDesc;
            item['subcategory']=this.subcategories.find(i=>i.subCategoryId=item.subCategoryId).subCategoryDesc;
            this.http_service.fetch_users().subscribe((res_users:User[])=>{
              item['assignee']=res_users.find(i=>i.user_id==item.assigneeId);
              console.log(res);
              this.products=res;
              console.log(this.products);
            })
          })
        })
        this.cols = [
            { field: 'type', header: 'Type' },
            { field: 'priority', header: 'Priority' },
            { field: 'subject', header: 'Subject' },
            { field: 'category', header: 'Category' },
            { field: 'subcategory', header: 'Subcategory' },
            { field: 'assignee', header: 'Assignee' },
        ];
    }
}
