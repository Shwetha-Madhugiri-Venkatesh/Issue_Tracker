import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { customPipe } from 'src/app/custom_pipes/custom_pipe_one';
import { Comment } from 'src/app/Models/comment';
import { Ticket } from 'src/app/Models/ticket';
import { User } from 'src/app/Models/User';
import { HTTPService } from 'src/app/Services/http_service';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';

@Component({
  selector: 'app-kabban',
  templateUrl: './kabban.component.html',
  styleUrls: ['./kabban.component.css'],
  providers: [customPipe]
})
export class KabbanComponent implements OnInit {
  text = "shwetha"
  visible: boolean = false;
  selectedPriority = '';
  selectedCategory = '';
  selectedSubCategory = '';
  subject = '';
  description = '';
  files = '';
  bug: boolean = true;
  login_user;
  feature: boolean = false;
  user_details = { uname: '', user_id: '', type: '' };
  today = new Date();
  dynamic_subcategory: { subCategoryId: string, categoryId: string, subCategoryDesc: string }[];
  all_tickets: Ticket[] = [];
  visible_comment: boolean = false;
  comment: string = '';
  users_list: User[] = [];
  selectedUser: string = '';
  updatePriority;
  updateStatus;
  text_area: boolean = false;
  text_area2: boolean = false;
  comment_ticket: Ticket = {
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
    createDateTime: this.today,
    lastModifiedDateTime: this.today,
    input_file: undefined,
    browser: '',
    operatingSystem: '',
  };
  tickets_comments = {};
  user_specific;

  edit_comment_visible: boolean = false;
  updated_comment: string;
  comment_to_be_edited;
  filter: boolean = false;
  filterPriority;
  filterAssigneeId;
  users = [];
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
  filter_output = [];
  tickets;
  http_tickets: Ticket[];
  selectedbrowser;
  selectedOS;
  delete_visible: boolean = false;
  delete_comment_id;
  kanban_preload;
  original_comment_ticket;
  users_suggestions;
  filePayload;

  constructor(private http_service: HTTPService, private two_way_data: TwoWayDataBinding) { }

  //Data from TwoWayDataBinding server
  priorities: { priorityId: string, priority: string }[] = this.two_way_data.priorities;
  statuses: { statusId: string, status: string, tickets: Ticket[] }[] = this.two_way_data.statuses;
  categories: { categoryId: string, categoryDesc: string }[] = this.two_way_data.categories;
  subcategories: { subCategoryId: string, categoryId: string, subCategoryDesc: string }[] = this.two_way_data.subcategories;
  browsers: { browser_name: string, browser_id: string }[] = this.two_way_data.browsers;
  operatingSystems: { os_name: string, os_id: string }[] = this.two_way_data.operatingSystems;

  types: { type: string, value: string }[] = [
    { type: "Bug", value: "bug" },
    { type: "Feature", value: "feature" },
  ]

  ngOnInit() {
    //Preloading the data
    this.kanban_preload = JSON.parse(localStorage.getItem("kanban_preload")) || {};
    this.filter = this.kanban_preload.filter;
    this.filterPriority = this.kanban_preload.filterPriority;
    this.filterAssigneeId = this.kanban_preload.filterAssigneeId;
    this.fiterCategory = this.kanban_preload.fiterCategory;
    this.filterSubcategory = this.kanban_preload.filterSubcategory;
    this.filterReporterId = this.kanban_preload.filterReporterId;
    this.filterStatus = this.kanban_preload.filterStatus;
    this.filterType = this.kanban_preload.filterType;
    this.filterAssignee = this.kanban_preload.filterAssignee;
    this.filterSubject = this.kanban_preload.filterSubject;
    this.filterDescription = this.kanban_preload.filterDescription;
    this.filterOpenedDate = this.kanban_preload.filterOpenedDate;
    this.filterDaysOld = this.kanban_preload.filterDaysOld;
    this.filterReporter = this.kanban_preload.filterReporter;
    this.filterTicketId = this.kanban_preload.filterTicketId;
    this.filtered_tickets = this.kanban_preload.filtered_tickets;
    if (this.kanban_preload.filter_output != undefined && this.kanban_preload.filter_output?.length > 0) {
      this.all_tickets = this.kanban_preload.filter_output;
    }
    this.filter_output = this.kanban_preload.filter_output;
    //setting the preload object to empty
    localStorage.setItem("kanban_preload", JSON.stringify({}));

    //emitting the current route name
    this.two_way_data.current_issues_subcomponent("");

    //Logged in user details
    this.login_user = JSON.parse(localStorage.getItem("login")) || {};
    this.http_service.fetch_users().subscribe((res: User[]) => {
      this.user_details = res.find(item => item.user_id == this.login_user['userId']);
    })

    this.fetch_tickets_update();

    this.http_service.fetch_users().subscribe((res: User[]) => {
      this.users_list = res;
    })

    this.fetch_all_tickets();
  }

  //HTTP Request to fetch Tickets
  fetch_all_tickets() {
    this.http_service.fetch_tickets().subscribe((res: Ticket[]) => {
      if (this.kanban_preload.filter_output == undefined || this.kanban_preload.filter_output?.length == 0) {
        this.all_tickets = res;
      }
      this.http_tickets = res;
      this.fetch_tickets_update();
    })
  }

  category_entered(val) {
    this.dynamic_subcategory = this.subcategories.filter(item => item.categoryId == val.value.categoryId);
  }

  //Fetching the updated tickets
  fetch_tickets_update() {
    for (let s of this.statuses) {
      s.tickets = this.all_tickets.filter(item => item.statusId == s.statusId);
    }
  }

  //Tickets creating form submit
  bug_form_submit(bugForm: NgForm) {
    if (!bugForm.valid) {
      return;
    }
    bugForm.value['input_file'] = this.filePayload;

    this.http_service.fetch_tickets().subscribe((res: Ticket[]) => {
      let len = res.filter(item => item.categoryId == bugForm.value.category.categoryId && item.subCategoryId == bugForm.value.subcategory.subCategoryId);
      let form_data = {
        reporter_name: bugForm.value.reporter_name,
        reportedId: bugForm.value.reportedId,
        type: this.bug ? "Bug" : "Feature",
        ticketId: `${bugForm.value.category.categoryId}#${bugForm.value.subcategory.subCategoryId}#${len.length + 1}`,
        categoryId: bugForm.value.category.categoryId,
        subCategoryId: bugForm.value.subcategory.subCategoryId,
        assigneeId: '',
        statusId: 'O',
        subject: bugForm.value.subject,
        description: bugForm.value.description,
        priorityId: bugForm.value.priority.priorityId,
        createDateTime: new Date(),
        lastModifiedDateTime: new Date(),
        input_file: bugForm.value.input_file,
        browser: bugForm.value.browser.browser_id,
        operatingSystem: bugForm.value.operatingSystem.os_id,
      }
      this.http_service.post_ticket(form_data).subscribe((res) => {
        this.fetch_all_tickets();
      })
      this.visible = false;
    })
  }

  //Reseting the Ticket creating form fields
  reset_form_fields() {
    this.selectedPriority = '';
    this.selectedCategory = '';
    this.selectedSubCategory = '';
    this.subject = '';
    this.description = '';
    this.files = '';
  }

  //Accessing the ticket for which comment form has to be opened
  get_comment_ticket(ticket: Ticket) {
    this.reset_comment_fields();
    this.visible_comment = true;
    ticket['assignee'] = this.users_list.find(item => item.user_id == ticket.assigneeId);
    ticket['priority'] = this.priorities.find(item => item.priorityId == ticket.priorityId);
    ticket['status'] = this.statuses.find(item => item.statusId == ticket.statusId);
    ticket['lastModifiedDateTimeString'] = new Date(ticket['lastModifiedDateTime']).toLocaleString();
    ticket['CreatedDateTimeString'] = new Date(ticket['createDateTime']).toLocaleString();
    this.comment_ticket = ticket;
    this.original_comment_ticket = structuredClone(this.comment_ticket);
    this.fetch_update_comments();
  }

  //Fetching updated comments
  fetch_update_comments() {
    this.tickets_comments = {};
    this.http_service.fetch_comments().subscribe((res: Comment[]) => {
      let comments = res.filter(item => item.ticketId == this.comment_ticket.ticketId);
      comments.forEach(item => {
        let user = this.users_list.find(i => i.user_id == item.userId);
        item['uname'] = user?.uname;
      });
      comments.forEach(item => {
        let res = comments.filter(fil_item => {
          return item.userId == fil_item.userId;
        })
        if (res.length != 0) {
          this.tickets_comments[item.userId] = res;
        }
      })
      this.user_specific = Object.keys(this.tickets_comments);
      for (let x of this.user_specific) {
        for (let y of this.tickets_comments[x]) {
          y.last_modified_date = new Date(y.last_modified_date).toLocaleString();
        }
      }
    })
  }

  //The comment form submit function
  get_comment_submit(commentForm: NgForm, comment_ticket_details) {
    if (this.comment != "") {
      this.http_service.fetch_comments().subscribe((res: Comment[]) => {
        let form_data = {
          commented_person: this.user_details.uname,
          commentId: `com${res.length + 1}`,
          ticketId: comment_ticket_details.ticketId,
          userId: this.login_user.userId,
          message: commentForm.value.comment,
          commented_date: new Date(),
          last_modified_date: new Date(),
        }
        this.http_service.post_comment(form_data).subscribe((res) => {
        })
      })
    }
    let modified = false;
    if (this.original_comment_ticket.priorityId != commentForm.value.priority.priorityId) {
      modified = true;
    }
    if ((commentForm.value.assignee?.user_id != undefined) && (this.original_comment_ticket.assigneeId) != commentForm.value.assignee?.user_id) {
      modified = true;
    }
    if (this.original_comment_ticket.statusId != commentForm.value.status.statusId) {
      modified = true;
    }
    comment_ticket_details.priorityId = commentForm.value.priority.priorityId;
    comment_ticket_details.assigneeId = commentForm.value.assignee?.user_id;
    comment_ticket_details.statusId = commentForm.value.status.statusId;
    if (this.original_comment_ticket.subject != commentForm.value.subject) {
      modified = true;
    }
    if (this.original_comment_ticket.description != commentForm.value.description) {
      modified = true;
    }
    if (modified == true) {
      comment_ticket_details.lastModifiedDateTime = new Date();
    }
    let { assignee, priority, status, ...rest } = comment_ticket_details;

    this.http_service.update_ticket(comment_ticket_details.id, rest).subscribe((res) => {
      this.fetch_tickets_update();
      this.get_comment_ticket(this.comment_ticket);
      this.fetch_update_comments();
    })
  }

  //For autocomplete component in comment form
  filterUsers(val) {
    this.users_suggestions = this.users_list.filter(item => item.uname.toLowerCase().startsWith(val.query));
  }

  //Accessing the comment for which edit dialog has to open
  edit_comment(comment, val) {
    this.comment_to_be_edited = comment;
    if (val == this.login_user.userId) {
      this.updated_comment = this.comment_to_be_edited.message;
      this.edit_comment_visible = true;
    }
  }

  //Update the comment
  update_comment() {
    this.edit_comment_visible = false;
    let { uname, ...rest } = this.comment_to_be_edited;
    rest.message = this.updated_comment;
    rest.last_modified_date = new Date();
    this.http_service.update_comment(rest.id, rest).subscribe((res) => {
      this.fetch_update_comments();
    })
  }

  //Delete the comment
  delete_comment(val) {
    this.delete_comment_id = val;
    if (val.userId == this.login_user.userId) {
      this.delete_visible = true;
    }
  }

  //Reset the filter fields
  reset_fields() {
    this.filterPriority = '';
    this.filterAssigneeId = '';
    this.fiterCategory = '';
    this.filterSubcategory = '';
    this.filterReporterId = '';
    this.filterStatus = '';
    this.filterType = '';
    this.filterAssignee = '';
    this.filterSubject = '';
    this.filterDescription = '';
    this.filterOpenedDate = '';
    this.filterDaysOld = '';
    this.filterReporter = '';
    this.filterTicketId = '';
    this.fetch_tickets_update();
  }

  //the filter form submit function
  issues_filter_form_submited(issuesFilterForm: NgForm) {
    let { filter_assignee, filter_reporter, filter_days_old, ...rest } = issuesFilterForm.value;
    let form_data = {
      ticketId: rest.ticketId?.ticketId,
      categoryId: rest.category?.categoryId,
      subCategoryId: rest.subcategory?.subCategoryId,
      type: rest.type?.type,
      assigneeId: rest.assigneeId?.user_id,
      reportedId: rest.reporterId?.user_id,
      statusId: rest.status?.statusId,
      priorityId: rest.priority?.priorityId,
      subject: rest.subject?.trim(),
      description: rest.description?.trim(),
      createDateTime: new Date(rest.createDateTime).toLocaleDateString(),
    }
    if (filter_days_old) {
      let today = new Date();
      today.setDate(today.getDate() - filter_days_old);
      form_data.createDateTime = today.toLocaleDateString();
    }
    let keys = Object.keys(form_data);

    this.filter_output = this.http_tickets.filter(item => {
      let match: boolean = false;
      for (let key of keys) {
        if (form_data[key] != undefined && form_data[key] != "") {
          if (item[key] == form_data[key]) {
            match = true;
          } else if (key == 'createDateTime') {
            if (new Date(item.createDateTime).toLocaleString().startsWith(form_data.createDateTime)) {
              match = true;
            }
          } else {
            match = false;
            break;
          }
        }
      }
      if (match) {
        return item;
      } else {
        return null;
      }
    })
    this.all_tickets = this.filter_output;
    this.filter = false;
    this.fetch_tickets_update();
  }

  //resetting comment form fields
  reset_comment_fields() {
    this.comment = '';
    this.text_area = false;
    this.text_area2 = false;
  }

  //For autocomplete for tickets ID in filter form
  search_tickets(val) {
    this.tickets = [];
    let search = val.query.toLowerCase();
    this.http_tickets.forEach((item) => {
      if (item.ticketId.toLowerCase().startsWith(search)) {
        this.tickets.push(item);
      }
    })
  }

  //finding the filter_assignee from Autocomplete for assigneeId field
  assignee_id_change() {
    this.filterAssignee = this.users_list.find(item => item.user_id == this.filterAssigneeId.user_id)?.uname;
  }

  //finding the filter_reporter from Autocomplete for reporterId field
  reporter_id_change() {
    this.filterReporter = this.users_list.find(item => item.user_id == this.filterReporterId.user_id)?.uname;
  }

  //Filter reset function
  reset_all() {
    this.reset_fields();
    this.filter_output = [];
    this.all_tickets = this.http_tickets;
    this.fetch_tickets_update();
  }

  //Autocomplete function for both reporter ID and assignee ID fields
  search(val) {
    this.users = [];
    let search = val.query.toLowerCase();
    this.users_list.forEach((item) => {
      if (item.user_id.toLowerCase().startsWith(search)) {
        this.users.push(item);
      }
    })
  }

  //Profile selected function in ticket creating form
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

  //Download the file function in comment form
  downloadFile(base64Data: string, filename: string) {
    const link = document.createElement('a');
    link.href = base64Data;
    link.download = filename;
    link.click();
  }

  //delete confirm fuction for comment
  delete_confirm() {
    this.http_service.delete_comment(this.delete_comment_id.id).subscribe((res) => {
      this.fetch_update_comments();
      this.delete_visible = false;
    })
  }

  //Storing the preloading data for kanban component
  ngOnDestroy() {
    let kanban_preload = JSON.parse(localStorage.getItem("kanban_preload")) || {};
    kanban_preload['filter'] = this.filter;
    kanban_preload['filterPriority'] = this.filterPriority;
    kanban_preload['filterAssigneeId'] = this.filterAssigneeId;
    kanban_preload['fiterCategory'] = this.fiterCategory;
    kanban_preload['filterSubcategory'] = this.filterSubcategory;
    kanban_preload['filterReporterId'] = this.filterReporterId;
    kanban_preload['filterStatus'] = this.filterStatus;
    kanban_preload['filterType'] = this.filterType;
    kanban_preload['filterAssignee'] = this.filterAssignee;
    kanban_preload['filterSubject'] = this.filterSubject;
    kanban_preload['filterDescription'] = this.filterDescription;
    kanban_preload['filterOpenedDate'] = this.filterOpenedDate;
    kanban_preload['filterDaysOld'] = this.filterDaysOld;
    kanban_preload['filterReporter'] = this.filterReporter;
    kanban_preload['filterTicketId'] = this.filterTicketId;
    kanban_preload['filtered_tickets'] = this.filtered_tickets;
    kanban_preload['filter_output'] = this.filter_output;
    localStorage.setItem("kanban_preload", JSON.stringify(kanban_preload));
  }
}