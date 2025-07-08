import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService, PrimeNGConfig} from 'primeng/api';
import { Comment } from 'src/app/Models/comment';
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
  selectedPriority='';
  selectedCategory='';
  selectedSubCategory='';
  subject='';
  description='';
  files='';
  bug:boolean=true;
  login_user;
  feature:boolean=false;
  user_details={uname:'',user_id:'',type:''};
  today=new Date().toLocaleString();
  dynamic_subcategory:{subCategoryId:string, categoryId:string , subCategoryDesc:string}[];
  all_tickets:Ticket[]=[];

  visible_comment:boolean=false;
  comment:string='';
  users_list:User[]=[];
  selectedUser:string='';
  updatePriority;
  updateStatus;
  comment_ticket:Ticket={
    reporter_name: '',
    ticketId: '',
    categoryId: '',
    subCategoryId: '',
    type: '',
    assigneeId: '',
    reportedId: '',
    subject: '',
    description: '',
    statusId: '',
    priorityId: '',
    createDateTime: '',
    lastModifiedDateTime: '',
    input_file: undefined
  };
  tickets_comments={};
  user_specific;

  edit_comment_visible:boolean=false;
  updated_comment:string='';
  comment_to_be_edited;
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

    this.fetch_tickets_update();

    this.http_service.fetch_users().subscribe((res:User[])=>{
      this.users_list=res;
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

  fetch_tickets_update(){
    this.http_service.fetch_tickets().subscribe((res:Ticket[])=>{
        this.all_tickets=res;
        for(let s of this.statuses){
            s.tickets=res.filter(item=>item.statusId==s.statusId);
        }
    })
  }
  bug_form_submit(bugForm:NgForm){
    this.reset_form_fields();
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
            this.fetch_tickets_update();
        })
        this.visible=false;
    })
  }

  add_bug(){
    this.visible=true;
  }

  reset_form_fields(){
    this.selectedPriority='';
    this.selectedCategory='';
    this.selectedSubCategory='';
    this.subject='';
    this.description='';
    this.files='';
  }
  get_comment_ticket(ticket:Ticket){
    this.visible_comment=true;
    console.log(ticket);
    ticket['assignee']=this.users_list.find(item=>item.user_id==ticket.assigneeId);
    ticket['priority']=this.priorities.find(item=>item.priorityId==ticket.priorityId);
    ticket['status']=this.statuses.find(item=>item.statusId==ticket.statusId);
    this.comment_ticket=ticket;
    console.log(this.comment_ticket);
    this.http_service.fetch_comments().subscribe((res:Comment[])=>{
      let comments =res.filter(item=>item.ticketId==ticket.ticketId);
      comments.forEach(item => {
        let user = this.users_list.find(i=>i.user_id==item.userId);
        item['uname']=user.uname;
      });
      comments.forEach(item=>{
        let res = comments.filter(fil_item=>{
          return item.userId==fil_item.userId;
        })
        console.log(res);
        this.tickets_comments[item.userId]=res;
      })
      console.log(this.tickets_comments);
      this.user_specific=Object.keys(this.tickets_comments)
    })
  }

  get_comment_submit(commentForm:NgForm,comment_ticket_details){
    console.log(commentForm.value);
    this.http_service.fetch_comments().subscribe((res:Comment[])=>{
      let form_data={
        commentId:`com${res.length+1}`,
        ticketId:comment_ticket_details.ticketId,
        userId:this.login_user.userId,
        message:commentForm.value.comment,
      }
      console.log(form_data);
      this.http_service.post_comment(form_data).subscribe((res)=>{
        console.log(res);
        this.visible_comment=false;
      })
      comment_ticket_details.priorityId=commentForm.value.priority.priorityId;
      comment_ticket_details.lastModifiedDateTime=commentForm.value.lastModifiedDateTime;
      comment_ticket_details.assigneeId=commentForm.value.assignee.user_id;
      comment_ticket_details.statusId=commentForm.value.status.statusId;
      console.log(comment_ticket_details);

      this.http_service.update_ticket(comment_ticket_details.id,comment_ticket_details).subscribe((res)=>{
        console.log(res);
        this.fetch_tickets_update();
      })
    })
  }

  edit_comment(comment,val){
    console.log(val);
    console.log(comment);
    this.comment_to_be_edited=comment;
    if(val==this.login_user.userId){
      this.edit_comment_visible=true;
    }else{
      return;
    }
  }

  update_comment(){
    console.log(this.updated_comment);
    this.edit_comment_visible=false;
    let {uname,...rest}=this.comment_to_be_edited;
    rest.message=this.updated_comment;
    console.log(rest);
    this.http_service.update_comment(rest.id,rest).subscribe((res)=>{
      console.log(res);
    })
  }

  delete_comment(val){
    this.http_service.delete_comment(val.id).subscribe((res)=>{
      console.log(res);
    })
  }
}
