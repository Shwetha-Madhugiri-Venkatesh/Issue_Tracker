import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { User } from 'src/app/Models/User';
import { DialogComponent } from '../dialog/dialog.component';
import { HTTPService } from 'src/app/Services/http_service';
import { AuthorizeUser } from 'src/app/Services/authorize_user';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';
import { MultiSelect } from 'primeng/multiselect';
import { MessageService, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  providers: [MessageService]
})
export class TableComponent {
  login_user: any;
  user_details: User;
  today = new Date().toLocaleString();
  delete_visible: boolean = false;
  filter_user_name: any = '';
  filter_user_email_id: any = '';
  filter_user_created_source: any = '';
  filter_user_created_source_type: any = '';
  filter_user_datetime: any = '';
  filter_user_last_modified_source: any = '';
  filter_user_last_modified_source_type: any = '';
  filter_user_last_modified_datetime: any = '';
  filtered_output;
  products: User[] = [];
  users_from_http: User[];
  cols: { field: string, header: string }[];
  columns: { field: string, header: string }[] = [];
  filter_flag: boolean = false;

  @Output()
  display_dialog: EventEmitter<[boolean, string?]> = new EventEmitter<[boolean, string?]>;

  @ViewChild('multi') multi: MultiSelect;
  user_types = [{ name: "User" }, { name: "Admin" }];
  user_type: string;
  selectedNum: number = 0;

  numbers = [
    { name: 'show 5', value: 5 },
    { name: 'show 10', value: 10 },
    { name: 'show 20', value: 20 },
  ];

  selectedCol: { field: string, header: string }[] = [];
  columns_selected: { field: string, header: string }[] = [];
  dynamic_page_number = { name: 'show 5', value: 5 };
  table_preload;
  delete = false;
  delete_id;
  goToPageNumber = '';
  totalPages: number;

  constructor(private http_service: HTTPService, private primeNg: PrimeNGConfig, private message_service: MessageService, private authorize: AuthorizeUser, private two_way: TwoWayDataBinding) { }
  
  ngOnInit() {
    //Preloading the data if it is present in local storage
    this.table_preload = JSON.parse(localStorage.getItem("table_preload")) || {};

    //Table columns
    this.cols = [
      { field: 'uname', header: `User Name` },
      { field: 'email_id', header: 'Email ID' },
      { field: 'type', header: 'User Type' },
      { field: 'created_source', header: 'Created Source' },
      { field: 'created_source_type', header: 'Created Source Type' },
      { field: 'created_datetimeString', header: 'Created Date Time' },
      { field: 'last_modified_source', header: 'Last Modified Source' },
      { field: 'last_modified_source_type', header: 'Last Modified Source Type' },
      { field: 'last_modified_datetimeString', header: 'Last Modified Date Time' },
    ];
    this.columns = structuredClone(this.cols);

    //Assigning the preloaded data
    if (Object.keys(this.table_preload).length != 0) {
      this.filter_user_name = this.table_preload.filter_user_name;
      this.filter_user_email_id = this.table_preload.filter_user_email_id;
      this.filter_user_created_source = this.table_preload.filter_user_created_source;
      this.filter_user_created_source_type = this.table_preload.filter_user_created_source_type;
      this.filter_user_datetime = this.table_preload.filter_user_datetime;
      this.filter_user_last_modified_datetime = this.table_preload.filter_user_last_modified_datetime;
      this.filter_user_last_modified_source = this.table_preload.filter_user_last_modified_source;
      this.filter_user_last_modified_source_type = this.table_preload.filter_user_last_modified_source_type;
      this.filter_flag = this.table_preload.filter_flag;
      this.dynamic_page_number = this.table_preload.dynamic_page_number;
      this.selectedCol = this.table_preload.selectedCol;
      this.filtered_output = this.table_preload.filtered_output;
      if (this.table_preload.filtered_output != undefined) {
        this.products = this.table_preload.filtered_output;
      }
      if (this.table_preload.selectedCol != undefined) {
        this.cols = this.table_preload.selectedCol;
      }
      localStorage.setItem("table_preload", JSON.stringify({}));
    } else {
      this.selectedCol = this.columns;
    }

    this.get_all_users();

    //Accessing the current user who logged in
    this.login_user = JSON.parse(localStorage.getItem("login")) || {};
    this.http_service.fetch_users().subscribe((res: User[]) => {
      this.selectedNum = res.length;
      this.user_details = res.find(item => item.user_id == this.login_user['userId']);
    })

    //Event which is defined in TwoWayDataBinding server to get the updated user from dialog component
    this.two_way.emit_users.subscribe(res => {
      res.forEach(item => {
        item['created_datetimeString'] = new Date(item.created_datetime).toLocaleString();
        item['last_modified_datetimeString'] = new Date(item.last_modified_datetime).toLocaleString();
      })
      this.users_from_http = res;
      this.products = res;
    })
  }

  //User filter form submit function
  filter_form_submit(form: NgForm) {
    let form_data = { ...form.value, type: (form.value.type == undefined) ? undefined : form.value.type['name'] };
    this.filtered_output = this.users_from_http.filter(item => {
      let match: boolean = false;
      for (let key in form_data) {
        if (form_data[key] != undefined && form_data[key] != "") {
          if (key == 'last_modified_datetime' || key == 'created_datetime') {
            let form_date = new Date(form_data[key]).toLocaleDateString();
            if (new Date(item[key]).toLocaleString().startsWith(form_date)) {
              match = true;
            }
          } else if (key == 'uname') {
            if (item[key].toLowerCase().startsWith(form_data[key].toLowerCase())) {
              match = true;
            }
          } else if (item[key].toLowerCase() == form_data[key].toLowerCase()) {
            match = true;
          } else {
            match = false;
            break;
          }
        }
      }
      if (match) {
        return item;
      }
      else {
        return null;
      }
    })
    this.products = this.filtered_output;
    this.filter_flag = false;
  }

  //open dailog box to add new user
  open_form(id: string) {
    if (this.delete) {
      this.delete = false;
      return;
    }
    this.display_dialog.emit([true, id]);
  }

  //resetting the filter form fields
  reset_fields() {
    this.filter_user_name = '';
    this.filter_user_email_id = '';
    this.filter_user_datetime = '';
    this.filter_user_last_modified_datetime = '';
    this.filter_user_last_modified_source = '';
    this.filter_user_last_modified_source_type = '';
    this.filter_user_created_source = '';
    this.filter_user_created_source_type = '';
    this.user_type = '';
  }
  
  //filter reset button function
  reset_form() {
    this.products = this.users_from_http;
    this.reset_fields();
  }

  //Dynamic rows dropdown selected function
  dynamic_rows(event) {
    if (this.users_from_http.length > event.value.value) {
      this.dynamic_page_number = event.value;
    } else {
      this.products = this.users_from_http;
    }
  }
  
  //fetch all the users from json through HTTP Request
  get_all_users() {
    this.http_service.fetch_users().subscribe((res: User[]) => {
      res.forEach(item => {
        item['created_datetimeString'] = new Date(item.created_datetime).toLocaleString();
        item['last_modified_datetimeString'] = new Date(item.last_modified_datetime).toLocaleString();
      })
      this.users_from_http = res;
      if (this.products.length == 0) {
        this.products = this.users_from_http;
      }
    });
  }

  //Delete dialog box open function
  delete_the_user(id: string) {
    this.delete = true;
    this.delete_visible = true;
    this.delete_id = id;
  }

  //paginator go button function
  goToPage(dt: any) {
    const rowsPerPage = 5;
    this.totalPages = Math.ceil(this.products.length / rowsPerPage);
    const pageIndex = Number(this.goToPageNumber) - 1;
    if (pageIndex >= 0 && pageIndex < this.totalPages) {
      dt.first = pageIndex * dt.rows;
      this.goToPageNumber = '';
    } else {
      this.goToPageNumber = '';
      this.message_service.add({ severity: 'error', summary: 'Error', detail: 'Invalid number' });
    }
  }

  //user delete function
  delete_confirm() {
    if (this.user_details.type == 'Admin') {
      this.http_service.delete_user(this.delete_id).subscribe(res => {
        this.get_all_users();
        this.delete_visible = false;
      })
    }
  }

  //Storing the data which need to be preloaded
  ngOnDestroy() {
    let table_preload = JSON.parse(localStorage.getItem("table_preload")) || {};
    table_preload['filter_user_name'] = this.filter_user_name;
    table_preload['filter_user_email_id'] = this.filter_user_email_id;
    table_preload['filter_user_created_source'] = this.filter_user_created_source;
    table_preload['filter_user_created_source_type'] = this.filter_user_created_source_type;
    table_preload['filter_user_datetime'] = this.filter_user_datetime;
    table_preload['filter_user_last_modified_datetime'] = this.filter_user_last_modified_datetime;
    table_preload['filter_user_last_modified_source'] = this.filter_user_last_modified_source;
    table_preload['filter_user_last_modified_source_type'] = this.filter_user_last_modified_source_type;
    table_preload['filter_flag'] = this.filter_flag;
    table_preload['dynamic_page_number'] = this.dynamic_page_number;
    table_preload['selectedCol'] = this.selectedCol;
    table_preload['filtered_output'] = this.filtered_output;
    localStorage.setItem("table_preload", JSON.stringify(table_preload));
  }
}
