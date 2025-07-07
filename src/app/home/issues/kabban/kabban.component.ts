import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService, PrimeNGConfig} from 'primeng/api';
import { Ticket } from 'src/app/Models/ticket';
import { User } from 'src/app/Models/User';
import { HTTPService } from 'src/app/Services/http_service';


@Component({
  selector: 'app-kabban',
  templateUrl: './kabban.component.html',
  styleUrls: ['./kabban.component.css']
})
export class KabbanComponent implements OnInit {
  visible:boolean=false;
  selectedPriority;
  selectedCategory;
  selectedSubCategory;
  bug:boolean=true;
  login_user;
  feature:boolean=false;
  user_details={uname:'',user_id:''};
  today=new Date().toLocaleString();
  dynamic_subcategory:{subCategoryId:string, categoryId:string , subCategoryDesc:string}[];
  all_tickets:Ticket[]=[];
  priorities:{priorityId:string, priority:string}[]=[
    {priorityId:'L', priority:'Low'},
    {priorityId:'H', priority:'High'},
    {priorityId:'M', priority:'Medium'},
    {priorityId:'C', priority:'Critical'},
  ]

  statuses:{statusId:string, status:string,tickets:Ticket[]}[]=[
    {statusId:'O', status:'Open', tickets:[]},
    {statusId:'A', status:'Assigned', tickets:[]},
    {statusId:'P', status:'In Progress', tickets:[]},
    {statusId:'C', status:'Completed', tickets:[]},
  ]

  categories:{categoryId:string, categoryDesc:string}[]=[
    {categoryId:'HW', categoryDesc:"Hardware"},
    {categoryId:'SW', categoryDesc:"Software"},
    {categoryId:'AM', categoryDesc:'Access Management'},
  ]

  subcategories:{subCategoryId:string, categoryId:string , subCategoryDesc:string}[]=[
    {subCategoryId:'AL', categoryId:'HW',subCategoryDesc:'Allocate Laptop'},
    {subCategoryId:'AH', categoryId:'HW',subCategoryDesc:'Allocate Hardware'},
    {subCategoryId:'HR', categoryId:'HW',subCategoryDesc:'Hardware Replacement'},
    {subCategoryId:'SI', categoryId:'SW',subCategoryDesc:'Software Installation'},
    {subCategoryId:'AV', categoryId:'SW',subCategoryDesc:'Antivirus'},
    {subCategoryId:'EP', categoryId:'SW',subCategoryDesc:'Email password Update'},
    {subCategoryId:'LS', categoryId:'SW',subCategoryDesc:'Laptop slowness issue'},
    {subCategoryId:'SIs', categoryId:'SW',subCategoryDesc:'Sofware issue'},
    {subCategoryId:'SA', categoryId:'AM',subCategoryDesc:'Sofware Access'},
    {subCategoryId:'WA', categoryId:'AM',subCategoryDesc:'Wifi Access'},
    {subCategoryId:'DA', categoryId:'AM',subCategoryDesc:'Database Access'},
    {subCategoryId:'VA', categoryId:'AM',subCategoryDesc:'VPN Access'},
  ]

  constructor(private http_service:HTTPService){}
  
  ngOnInit(){
    this.login_user=JSON.parse(sessionStorage.getItem("login"))||{};
    this.http_service.fetch_users().subscribe((res:User[])=>{
    this.user_details=res.find(item=>item.user_id==this.login_user['userId']);
        console.log(this.user_details);
    })
      
    this.http_service.fetch_tickets().subscribe((res:Ticket[])=>{
        this.all_tickets=res;
        for(let s of this.statuses){
            s.tickets=res.filter(item=>item.statusId==s.statusId);
        }
    })
  }

  category_entered(val){
    console.log(val.value);
    this.dynamic_subcategory=this.subcategories.filter(item=>item.categoryId==val.value.categoryId);
  }
  ticket_type_bug(){
    this.bug=true;
    this.feature=false;
  }
  ticket_type_feature(){
    this.feature=true;
    this.bug=false;
  }

  bug_form_submit(bugForm:NgForm){
    this.http_service.fetch_tickets().subscribe((res:Ticket[])=>{
        let len = res.filter(item=>item.categoryId==bugForm.value.category.categoryId && item.subCategoryId==bugForm.value.subcategory.subCategoryId);
        console.log(len.length);
        let form_data={
            reporter_name:bugForm.value.reporter_name,
            reportedId:bugForm.value.reportedId,
            type:this.bug?"bug":"feature",
            ticketId: `${bugForm.value.category.categoryId}#${bugForm.value.subcategory.subCategoryId}#${len.length+1}`,
            categoryId:bugForm.value.category.categoryId,
            subCategoryId:bugForm.value.subcategory.subCategoryId,
            assigneeId:'',
            statusId:'O',
            subject:bugForm.value.subject,
            description:bugForm.value.description,
            priorityId:bugForm.value.priority.priorityId,
            createDateTime:this.today,
            lastModifiedDateTime:this.today,
            input_file:bugForm.value.input_file,
        }
        console.log(form_data);
        this.http_service.post_ticket(form_data).subscribe((res)=>{
            console.log(res);
        })
        this.visible=false;
    })
  }

  add_bug(){
    this.visible=true;
  }
}
