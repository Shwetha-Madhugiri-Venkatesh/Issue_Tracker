import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { Ticket } from 'src/app/Models/ticket';
import { User } from 'src/app/Models/User';
import { HTTPService } from 'src/app/Services/http_service';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
   providers: [MessageService]
})
export class ListComponent {
  products: Ticket[] = [];
  cols;
  dynamic_subcategory: { subCategoryId: string; categoryId: string; subCategoryDesc: string; }[];
  http_users;
  http_tickets;
  filter = false;
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
  tickets;
  searchBtn: boolean = false;
  search_text: string = '';
  filter_output = [];
  search_output = [];
  kanban_preload;
  goToPageNumber = '';
  totalPages: number;

  constructor(private http_service: HTTPService, private two_way_data: TwoWayDataBinding,private message_service:MessageService) { }

  //Data from TwoWayDataBinding server
  priorities: { priorityId: string, priority: string }[] = this.two_way_data.priorities;
  statuses: { statusId: string, status: string, tickets: Ticket[] }[] = this.two_way_data.statuses;
  categories: { categoryId: string, categoryDesc: string }[] = this.two_way_data.categories;
  subcategories: { subCategoryId: string, categoryId: string, subCategoryDesc: string }[] = this.two_way_data.subcategories;

  types: { type: string, value: string }[] = [
    { type: "Bug", value: "bug" },
    { type: "Feature", value: "feature" },
  ]

  ngOnInit() {
    //Preloading the list component data from local storage
    this.kanban_preload = JSON.parse(localStorage.getItem("list_preload")) || {};
    if (Object.keys(this.kanban_preload).length != 0) {
      this.search_text = this.kanban_preload.search_text;
      this.search_output = this.kanban_preload.search_output;
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
      this.filter_output = this.kanban_preload.filter_output;
      if (this.kanban_preload.filter_output.length != 0) {
        this.products = this.kanban_preload.filter_output;
      }
      if (this.kanban_preload.search_output.length != 0) {
        this.products = this.kanban_preload.search_output;
      }
      //emptying the preload variable in local storage
      localStorage.setItem("list_preload", JSON.stringify({}));
    }

    //emiting the subcomponent name to parent mediated by a server
    this.two_way_data.current_issues_subcomponent("list");

    //The initial table data
    this.http_service.fetch_tickets().subscribe((res: Ticket[]) => {
      this.http_tickets = res;
      res.forEach(item => {
        this.http_service.fetch_users().subscribe((res_users: User[]) => {
          item['assignee'] = (res_users.find(i => i.user_id == item.assigneeId)?.uname) ? (res_users.find(i => i.user_id == item.assigneeId)?.uname) : "---";
          item['priority'] = item['priority'].priority;
          if ((this.kanban_preload.search_output?.length == 0 && this.kanban_preload.filter_output?.length == 0) || (this.kanban_preload.search_output?.length == undefined && this.kanban_preload.filter_output?.length == undefined)) {
            this.products = res;
          }
        },

        (err)=>{
          this.message_service.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: err+', User fetch failed'
              });
        }
      )
      })
    },

    (err)=>{
      this.message_service.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: err+', Tickets fetch failed'
      });
    }
  )

    //Table columns
    this.cols = [
      { field: 'type', header: 'Type' },
      { field: 'priority', header: 'Priority' },
      { field: 'subject', header: 'Subject' },
      { field: 'category', header: 'Category' },
      { field: 'subcategory', header: 'Subcategory' },
      { field: 'assignee', header: 'Assignee' },
    ];

    // Fetching users
    this.http_service.fetch_users().subscribe((res) => {
      this.http_users = res;
    },
    (err)=>{
      this.message_service.add({
              severity: 'error',
              summary: 'Error',
              detail: err|| ', User fetch failed'
            });
    }
  )
  }
  //ngOnInit ends

  //Autocomplete functions for both assignee Id and Reporter Id fields 
  search(val) {
    this.users = [];
    let search = val.query.toLowerCase();
    this.http_users.forEach((item) => {
      if (item.user_id.toLowerCase().startsWith(search)) {
        this.users.push(item);
      }
    })
  }

  //setting subcategories dynamically
  category_entered(val) {
    this.dynamic_subcategory = this.subcategories.filter(item => item.categoryId == val.value.categoryId);
  }

  //Filter form submit function
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

    let filter_input = this.search_output.length != 0 ? this.search_output : this.http_tickets;
    this.filter_output = filter_input.filter(item => {
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
    this.products = this.filter_output;
    this.filter = false;
  }

  //Assigning the filter assignee from assignee Id field
  assignee_id_change() {
    this.filterAssignee = this.http_users.find(item => item.user_id == this.filterAssigneeId.user_id)?.uname;
  }

  //Assigning the filter reporter from reporter Id field
  reporter_id_change() {
    this.filterReporter = this.http_users.find(item => item.user_id == this.filterReporterId.user_id)?.uname;
  }

  //reseting filter form fields
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
  }

  //Autocomplete function for tickets Id
  search_tickets(val) {
    this.tickets = [];
    let search = val.query.toLowerCase();
    this.http_tickets.forEach((item) => {
      if (item.ticketId.toLowerCase().startsWith(search)) {
        this.tickets.push(item);
      }
    })
  }

  // Filter reset function
  reset_all() {
    this.reset_fields();
    this.filter_output = [];
    if (this.search_output.length != 0) {
      this.products = this.search_output;
    } else {
      this.products = this.http_tickets;
    }
    this.filter = false;
  }

  //filtering based on search input
  search_input(val) {
    let inp = this.search_text;
    if (inp != '') {
      let search_input_array = this.filter_output.length != 0 ? this.filter_output : this.http_tickets;
      this.search_output = search_input_array.filter(item => {
        let keys = Object.keys(item);
        let match = false;
        for (let key of keys) {
          if (item[key].toString().toLowerCase().includes(inp.toLowerCase())) {
            match = true;
            break;
          }
        }
        if (match) {
          return item;
        } else {
          return null;
        }
      })
      this.products = this.search_output;
    }
    else {
      this.search_output = [];
      if (this.filter_output.length != 0) {
        this.products = this.filter_output;
      } else {
        this.products = this.http_tickets;
      }
    }
  }

  //color defining function for ticket type and priority
  getColor(val) {
    switch (val) {
      case 'Bug': return 'orange';
      case 'Feature': return 'blue';
      case 'Low': return 'yellowgreen';
      case 'High': return 'magenta';
      case 'Medium': return '#bbbb0d';
      case 'Critical': return 'red';
      default: return 'black';
    }
  }

  //backgroundColor defining function for ticket type and priority
  getBackGroundColor(val) {
    switch (val) {
      case 'Bug': return '#fdf0d8';
      case 'Feature': return '#def5fd';
      case 'Low': return '#ecfbec';
      case 'High': return '#fbe3e7';
      case 'Medium': return '#f2f2ec';
      case 'Critical': return '#faecec';
      default: return 'none';
    }
  }

  //pagination go button function
  goToPage(dt: any) {
    const rowsPerPage = 5;
    this.totalPages = Math.ceil(this.products.length / rowsPerPage);
    const pageIndex = Number(this.goToPageNumber) - 1;
    if (pageIndex >= 0 && pageIndex < this.totalPages) {
      dt.first = pageIndex * dt.rows;
    } else {
      alert('Invalid page number');
    }
  }

  //Storing the data to be preloaded to preserve the state of the component
  ngOnDestroy() {
    let kanban_preload = JSON.parse(localStorage.getItem("list_preload")) || {};
    kanban_preload['search_output'] = this.search_output;
    kanban_preload['search_text'] = this.search_text;
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
    localStorage.setItem("list_preload", JSON.stringify(kanban_preload));
  }
}
