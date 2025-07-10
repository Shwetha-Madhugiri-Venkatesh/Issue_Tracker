import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService, PrimeNGConfig} from 'primeng/api';
import { Comment } from 'src/app/Models/comment';
import { Ticket } from 'src/app/Models/ticket';
import { User } from 'src/app/Models/User';
import { HTTPService } from 'src/app/Services/http_service';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';


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
  

  filter:boolean=false;
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
  filter_output=[];
  tickets;
  http_tickets: Ticket[];
  
  constructor(private http_service:HTTPService,private two_way_data:TwoWayDataBinding){}

  priorities:{priorityId:string, priority:string}[]=this.two_way_data.priorities;
  statuses:{statusId:string, status:string,tickets:Ticket[]}[]=this.two_way_data.statuses;
  categories:{categoryId:string, categoryDesc:string}[]=this.two_way_data.categories;
  subcategories:{subCategoryId:string, categoryId:string , subCategoryDesc:string}[]=this.two_way_data.subcategories;
  types:{type:string,value:string}[]=[
    {type:"Bug", value:"bug"},
    {type:"Feature",value:"feature"},
  ]

  ngOnInit(){
    this.two_way_data.current_issues_subcomponent("");
    this.login_user=JSON.parse(sessionStorage.getItem("login"))||{};
    this.http_service.fetch_users().subscribe((res:User[])=>{
    this.user_details=res.find(item=>item.user_id==this.login_user['userId']);
        console.log(this.user_details);
    })

    this.fetch_tickets_update();

    this.http_service.fetch_users().subscribe((res:User[])=>{
      this.users_list=res;
    })

    this.fetch_all_tickets();
      
  }
  fetch_all_tickets(){
    this.http_service.fetch_tickets().subscribe((res:Ticket[])=>{
        this.all_tickets=res;
        this.http_tickets=res;
        this.fetch_tickets_update();
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
    for(let s of this.statuses){
            s.tickets=this.all_tickets.filter(item=>item.statusId==s.statusId);
    }
  }
  bug_form_submit(bugForm:NgForm){
    console.log("bug form sumbit",bugForm.value);
    bugForm.value['input_file']=this.filePayload;
    console.log("bug form sumbit",bugForm.value);
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
            this.fetch_all_tickets();
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
    this.fetch_update_comments();
  }

  fetch_update_comments(){
    this.http_service.fetch_comments().subscribe((res:Comment[])=>{
      let comments =res.filter(item=>item.ticketId==this.comment_ticket.ticketId);
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
      comment_ticket_details.assigneeId=commentForm.value.assignee?.user_id;
      comment_ticket_details.statusId=commentForm.value.status.statusId;
      console.log(comment_ticket_details);
      let {assignee, priority, status,...rest}=comment_ticket_details

      this.http_service.update_ticket(comment_ticket_details.id,rest).subscribe((res)=>{
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
      this.fetch_update_comments();
    })
  }

  delete_comment(val){
    this.http_service.delete_comment(val.id).subscribe((res)=>{
      console.log(res);
      this.fetch_update_comments();
    })
  }

  toggleFilter() {
    this.reset_fields();
    this.filter = !this.filter;
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

    this.filter_output = this.http_tickets.filter(item=>{
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
    this.all_tickets=this.filter_output;
    console.log(this.all_tickets);
    this.fetch_tickets_update();
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

  assignee_id_change(){
    this.filterAssignee =this.users_list.find(item=>item.user_id==this.filterAssigneeId.user_id)?.uname;
  }

  reporter_id_change(){
    this.filterReporter =this.users_list.find(item=>item.user_id==this.filterReporterId.user_id)?.uname;
  }

  reset_all(){
    this.reset_fields();
    this.filter_output=[];
    this.all_tickets=this.http_tickets;
    this.fetch_tickets_update();
    this.filter=false;
  }

   search(val){
    this.users=[];
    console.log(val.query);
    let search = val.query.toLowerCase();
    this.users_list.forEach((item)=>{
      if(item.user_id.toLowerCase().startsWith(search)){
        this.users.push(item);
      }
    })
    console.log(this.users);
  }

  files_: File[] = [];
  filePayload;
onFilesSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;

      this.filePayload = {
        filename: file.name,
        filetype: file.type,
        data: base64
      };
    };
    reader.readAsDataURL(file);
  }
}

downloadFile(base64Data: string, filename: string) {
  const link = document.createElement('a');
  link.href = base64Data;
  link.download = filename;
  link.click();
}

}
