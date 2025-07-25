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
    input_file: undefined,
    browser:'',
    operatingSystem:'',
  };
  tickets_comments={};
  user_specific;

  edit_comment_visible:boolean=false;
  updated_comment:string;
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

  selectedbrowser;
  selectedOS;
  delete_visible:boolean=false;
  delete_comment_id;
  constructor(private http_service:HTTPService,private two_way_data:TwoWayDataBinding){}

  priorities:{priorityId:string, priority:string}[]=this.two_way_data.priorities;
  statuses:{statusId:string, status:string,tickets:Ticket[]}[]=this.two_way_data.statuses;
  categories:{categoryId:string, categoryDesc:string}[]=this.two_way_data.categories;
  subcategories:{subCategoryId:string, categoryId:string , subCategoryDesc:string}[]=this.two_way_data.subcategories;
  browsers:{browser_name:string, browser_id:string}[]=this.two_way_data.browsers;
  operatingSystems:{os_name:string,os_id:string}[]=this.two_way_data.operatingSystems;
  types:{type:string,value:string}[]=[
    {type:"Bug", value:"bug"},
    {type:"Feature",value:"feature"},
  ]
  kanban_preload;
  ngOnInit(){
    this.kanban_preload=JSON.parse(localStorage.getItem("kanban_preload"))||{};
    this.filter=this.kanban_preload.filter;
    this.filterPriority=this.kanban_preload.filterPriority;
    this.filterAssigneeId=this.kanban_preload.filterAssigneeId;
    this.fiterCategory=this.kanban_preload.fiterCategory;
    this.filterSubcategory=this.kanban_preload.filterSubcategory;
    this.filterReporterId=this.kanban_preload.filterReporterId;
    this.filterStatus=this.kanban_preload.filterStatus;
    this.filterType=this.kanban_preload.filterType;
    this.filterAssignee=this.kanban_preload.filterAssignee;
    this.filterSubject=this.kanban_preload.filterSubject;
    this.filterDescription=this.kanban_preload.filterDescription;
    this.filterOpenedDate=this.kanban_preload.filterOpenedDate;
    this.filterDaysOld=this.kanban_preload.filterDaysOld;
    this.filterReporter=this.kanban_preload.filterReporter;
    this.filterTicketId=this.kanban_preload.filterTicketId;
    this.filtered_tickets=this.kanban_preload.filtered_tickets;
    if(this.kanban_preload.filter_output!=undefined && this.kanban_preload.filter_output?.length>0){
      this.all_tickets=this.kanban_preload.filter_output;
    }
    this.filter_output=this.kanban_preload.filter_output;
    localStorage.setItem("kanban_preload",JSON.stringify({}));
    this.two_way_data.current_issues_subcomponent("");
    this.login_user=JSON.parse(localStorage.getItem("login"))||{};
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
        if(this.kanban_preload.filter_output==undefined || this.kanban_preload.filter_output?.length==0){
          this.all_tickets=res;
        }
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
    if(!bugForm.valid){
      return;
    }
    console.log("bug form sumbit",bugForm.value);
    bugForm.value['input_file']=this.filePayload;
    console.log("bug form sumbit",bugForm.value);
    this.http_service.fetch_tickets().subscribe((res:Ticket[])=>{
        let len = res.filter(item=>item.categoryId==bugForm.value.category.categoryId && item.subCategoryId==bugForm.value.subcategory.subCategoryId);
        console.log(len.length);
        let form_data={
            reporter_name:bugForm.value.reporter_name,
            reportedId:bugForm.value.reportedId,
            type:this.bug?"Bug":"Feature",
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
            browser:bugForm.value.browser.browser_id,
            operatingSystem:bugForm.value.operatingSystem.os_id,
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
    this.tickets_comments={};
    this.http_service.fetch_comments().subscribe((res:Comment[])=>{
      let comments =res.filter(item=>item.ticketId==this.comment_ticket.ticketId && item.message!="");
      comments.forEach(item => {
        let user = this.users_list.find(i=>i.user_id==item.userId);
        item['uname']=user?.uname;
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
        this.fetch_update_comments();
      })
    })
  }

  edit_comment(comment,val){
    console.log(val);
    console.log(comment);
    this.comment_to_be_edited=comment;
    if(val==this.login_user.userId){
      this.edit_comment_visible=true;
      this.updated_comment='';
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
    this.delete_comment_id = val;
     if(val.userId==this.login_user.userId){
    this.delete_visible=true;
     }
  }

  toggleFilter() {
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
    this.fetch_tickets_update();
  }

  autoResize(event: Event): void {
  const textarea = event.target as HTMLTextAreaElement;
  textarea.style.height = 'auto'; // reset height
  textarea.style.height = `${textarea.scrollHeight}px`; // set to fit content
}


  issues_filter_form_submited(issuesFilterForm:NgForm){
    console.log(issuesFilterForm.value);
    let {filter_assignee,filter_reporter,filter_days_old,...rest}=issuesFilterForm.value;
    let form_data ={
      ticketId:rest.ticketId?.ticketId,
      categoryId:rest.category?.categoryId,
      subCategoryId:rest.subcategory?.subCategoryId,
      type:rest.type?.type,
      assigneeId:rest.assigneeId?.user_id,
      reportedId:rest.reporterId?.user_id,
      statusId:rest.status?.statusId,
      priorityId:rest.priority?.priorityId,
      subject:rest.subject?.trim(),
      description:rest.description?.trim(),
      createDateTime:new Date(rest.createDateTime).toLocaleDateString(),
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
    this.filter=false;
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
  }

  close_filter(){
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

delete_confirm(){
  this.http_service.delete_comment(this.delete_comment_id.id).subscribe((res)=>{
      console.log(res);
      this.fetch_update_comments();
      this.delete_visible=false;
    })
}

cancel_delete(){
  this.delete_visible=false;
}


ngOnDestroy(){
  let kanban_preload=JSON.parse(localStorage.getItem("kanban_preload"))||{};
  kanban_preload['filter']=this.filter;
  kanban_preload['filterPriority']=this.filterPriority;
  kanban_preload['filterAssigneeId']=this.filterAssigneeId;
  kanban_preload['fiterCategory']=this.fiterCategory;
  kanban_preload['filterSubcategory']=this.filterSubcategory;
  kanban_preload['filterReporterId'] = this.filterReporterId;
  kanban_preload['filterStatus']=this.filterStatus;
  kanban_preload['filterType']=this.filterType;
  kanban_preload['filterAssignee']=this.filterAssignee;
  kanban_preload['filterSubject']=this.filterSubject;
  kanban_preload['filterDescription']=this.filterDescription;
  kanban_preload['filterOpenedDate']=this.filterOpenedDate;
  kanban_preload['filterDaysOld']=this.filterDaysOld;
  kanban_preload['filterReporter']=this.filterReporter;
  kanban_preload['filterTicketId']=this.filterTicketId;
  kanban_preload['filtered_tickets']=this.filtered_tickets;
  kanban_preload['filter_output']=this.filter_output;
  localStorage.setItem("kanban_preload",JSON.stringify(kanban_preload));
}
}