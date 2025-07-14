import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  products:Ticket[]=[];
  cols;
  dynamic_subcategory: { subCategoryId: string; categoryId: string; subCategoryDesc: string; }[];

  http_users;
  http_tickets;
  filter = false;
  filterPriority;
  filterAssigneeId;
  users=[];
  fiterCategory;
  filterSubcategory;
  filterReporterId;
  filterStatus;
  filterType;
  filterAssignee;
  filterSubject;
  filterDescription;
  filterOpenedDate;
  filterDaysOld;
  filterReporter;
  filtered_tickets;
  filterTicketId;
  tickets;

  searchBtn:boolean=false;
  search_text:string='';
  filter_output=[];
  search_output=[];

  constructor(private http_service:HTTPService,private two_way_data:TwoWayDataBinding){}

  priorities:{priorityId:string, priority:string}[]=this.two_way_data.priorities;
  statuses:{statusId:string, status:string,tickets:Ticket[]}[]=this.two_way_data.statuses;
  categories:{categoryId:string, categoryDesc:string}[]=this.two_way_data.categories;
  subcategories:{subCategoryId:string, categoryId:string , subCategoryDesc:string}[]=this.two_way_data.subcategories;
  types:{type:string,value:string}[]=[
    {type:"Bug", value:"bug"},
    {type:"Feature",value:"feature"},
  ]

    ngOnInit() {
      this.two_way_data.current_issues_subcomponent("list");
      console.log("ngoninit",this.subcategories);
        this.http_service.fetch_tickets().subscribe((res:Ticket[])=>{
          this.http_tickets=res;
          res.forEach(item=>{
            item['priority']=this.priorities.find(i=>i.priorityId==item.priorityId)?.priority;
            item['category']=this.categories.find(i=>i.categoryId==item.categoryId)?.categoryDesc;
            item['subcategory']=this.subcategories.find(i=>i.subCategoryId==item.subCategoryId)?.subCategoryDesc;
            this.http_service.fetch_users().subscribe((res_users:User[])=>{
              item['assignee']=(res_users.find(i=>i.user_id==item.assigneeId)?.uname)?(res_users.find(i=>i.user_id==item.assigneeId)?.uname):"---";
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

        this.http_service.fetch_users().subscribe((res)=>{
          this.http_users=res;
        })
    }

  toggleFilter() {
    this.reset_fields();
    this.filter = !this.filter;
  }

  search(val){
    this.users=[];
    console.log(val.query);
    let search = val.query.toLowerCase();
    this.http_users.forEach((item)=>{
      if(item.user_id.toLowerCase().startsWith(search)){
        this.users.push(item);
      }
    })
    console.log(this.users);
  }

  category_entered(val){
    console.log(val.value);
    console.log(this.categories);
    this.dynamic_subcategory=this.subcategories.filter(item=>item.categoryId==val.value.categoryId);
  }
  issues_filter_form_submited(issuesFilterForm:NgForm){
    console.log(issuesFilterForm.value);
    let {filter_assignee,filter_reporter,filter_days_old,...rest}=issuesFilterForm.value;
    let form_data ={
      ticketId:rest.ticketId?.ticketId,
      categoryId:rest.category?.categoryId,
      subCategoryId:rest.subcategory?.subCategoryId,
      type:rest.type?.value,
      assigneeId:rest.assigneeId?.user_id,
      reportedId:rest.reportedId?.user_id,
      statusId:rest.status?.statusId,
      priorityId:rest.priority?.priorityId,
      subject:rest.subject?.trim(),
      description:rest.description.trim(),
      createDateTime:rest.createDateTime,
    }
    if(filter_days_old){
      let today = new Date();
      today.setDate(today.getDate()-filter_days_old);
      form_data.createDateTime=today.toLocaleDateString();
    }
    console.log(form_data);
    let keys= Object.keys(form_data);

    let filter_input=this.search_output.length!=0?this.search_output:this.http_tickets;
    this.filter_output = filter_input.filter(item=>{
      let match:boolean=false;
      for(let key of keys){
        if(form_data[key]!=undefined && form_data[key]!=""){
          if(item[key]==form_data[key]){
            match=true;
          }else if(key=='createDateTime'){
            if(item.createDateTime.includes(form_data.createDateTime)){
              match=true;
            }
          }else{
            match=false;
            break;
          }
        }
      }
      if(match){
        return item;
      }else{
        return null;
      }
    })
    this.products=this.filter_output;
    console.log(this.products);
  }

  assignee_id_change(){
    this.filterAssignee =this.http_users.find(item=>item.user_id==this.filterAssigneeId.user_id)?.uname;
  }

  reporter_id_change(){
    this.filterReporter =this.http_users.find(item=>item.user_id==this.filterReporterId.user_id)?.uname;
  }

  reset_fields(){
    this.filterPriority='';
    this.filterAssigneeId='';    
    this.fiterCategory='';
    this.filterSubcategory='';
    this.filterReporterId='';
    this.filterStatus='';
    this.filterType='';
    this.filterAssignee='';
    this.filterSubject='';
    this.filterDescription='';
    this.filterOpenedDate='';
    this.filterDaysOld='';
    this.filterReporter='';
    this.filterTicketId='';
  }

  search_tickets(val){
    this.tickets=[];
    let search = val.query.toLowerCase();
    this.http_tickets.forEach((item)=>{
      if(item.ticketId.toLowerCase().startsWith(search)){
        this.tickets.push(item);
      }
    })
  }

  reset_all(){
    this.reset_fields();
    this.filter_output=[];
    if(this.search_output.length!=0){
      this.products=this.search_output;
    }else{
      this.products=this.http_tickets;
    }
    this.filter=false;
  }

  search_clicked(){
    this.searchBtn=!this.searchBtn;
  }

  search_input(val){
    let inp =this.search_text;
    if(inp!=''){
    let search_input_array=this.filter_output.length!=0?this.filter_output:this.http_tickets;
    this.search_output = search_input_array.filter(item=>{
      item['category']=this.categories.find(j=>j.categoryId==item.categoryId).categoryDesc;
      item['subcategory'] = this.subcategories.find(j=>j.subCategoryId==item.subCategoryId).subCategoryDesc;
      item['priority']=this.priorities.find(j=>j.priorityId==item.priorityId).priority;
      item['status']=this.statuses.find(j=>j.statusId==item.statusId).status;
      let keys = Object.keys(item);
      let match=false;
      for(let key of keys){
        if(item[key].toString().toLowerCase().includes(inp.toLowerCase())){
          match=true;
          break;
        }
      }
      if(match){
        return item;
      }else{
        return null;
      }
    })
    console.log(this.search_output);
    this.products=this.search_output;
   }
   else{
    this.search_output=[];
    if(this.filter_output.length!=0){
      this.products=this.filter_output;
    }else{
      this.products=this.http_tickets;
    }
   }
  }

  getColor(val){
    switch(val){
      case 'bug': return 'orange';
      case 'feature': return 'blue';
      case 'Low': return 'yellowgreen';
      case 'High': return 'magenta';
      case 'Medium': return '#bbbb0d';
      case 'Critical': return 'red';
      default: return 'black';
    }
  }

  getBackGroundColor(val){
    switch(val){
      case 'bug': return '#fdf0d8';
      case 'feature': return '#def5fd';
      case 'Low': return '#ecfbec';
      case 'High': return '#fbe3e7';
      case 'Medium': return '#f2f2ec';
      case 'Critical': return '#faecec';
      default: return 'none';
    }
  }
}
