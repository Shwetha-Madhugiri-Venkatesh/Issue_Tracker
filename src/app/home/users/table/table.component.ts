import { Component } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent {

    products;
    cols;

    selectedNum:number=5;
     numbers = [
    { name: '5', value: 5 },
    { name: '10', value: 10 },
    { name: '20', value: 20 },
  ];

  selectedCol:number=9;
  columns=[
    {name:'User Name', value:'user_name'},
    {name:'Email ID', value:'email'},
    {name:'Created Source', value:'created_source'},
    {name:'Created Source Type', value:'created_source_type'},
    {name:'Created Date Time', value:'created_datetime'},
    {name:'Last Modified Source', value:'last_modified_source'},
    {name:'Last Modified Source Type', value:'last_modified_source_type'},
    {name:'Last Modified Date Time', value:'last_modified_datetime'},
    {name:'Status', value:'status'},
  ]
    ngOnInit() {
        this.products=[{user_name:"Shwetha",email:"shwetha@gmail.com",created_source:"lokesh",created_source_type:"mentor",created_datetime:"today",
          last_modified_source:"lokesh",last_modified_source_type:"lead",last_modified_datetime:"today",icons:'<div class="icons"><i class="fa-solid fa-pen-to-square"></i> <i class="fa-solid fa-trash"></i></div>',
          status:'<button class="disabled-btn">Disabled</button>'
        }, {user_name:"Anith",email:"shwetha@gmail.com",created_source:"lokesh",created_source_type:"mentor",created_datetime:"today",
          last_modified_source:"lokesh",last_modified_source_type:"lead",last_modified_datetime:"today",icons:'<div class="icons"><i class="fa-solid fa-pen-to-square"></i> <i class="fa-solid fa-trash"></i></div>',
          status:'<button class="disabled-btn">Disabled</button>'
        },{user_name:"Shwetha",email:"shwetha@gmail.com",created_source:"lokesh",created_source_type:"mentor",created_datetime:"today",
          last_modified_source:"lokesh",last_modified_source_type:"lead",last_modified_datetime:"today",icons:'<div class="icons"><i class="fa-solid fa-pen-to-square"></i> <i class="fa-solid fa-trash"></i></div>',
          status:'<button class="disabled-btn">Disabled</button>'
        },{user_name:"Shwetha123",email:"shwetha@gmail.com",created_source:"lokesh",created_source_type:"mentor",created_datetime:"today",
          last_modified_source:"lokesh",last_modified_source_type:"lead",last_modified_datetime:"today",icons:'<div class="icons"><i class="fa-solid fa-pen-to-square"></i> <i class="fa-solid fa-trash"></i></div>',
          status:'<button class="disabled-btn">Disabled</button>'
        },{user_name:"Swathi",email:"shwetha@gmail.com",created_source:"lokesh",created_source_type:"mentor",created_datetime:"today",
          last_modified_source:"lokesh",last_modified_source_type:"lead",last_modified_datetime:"today",icons:'<div class="icons"><i class="fa-solid fa-pen-to-square"></i> <i class="fa-solid fa-trash"></i></div>',
          status:'<button class="disabled-btn">Disabled</button>'
        },{user_name:"Hari",email:"shwetha@gmail.com",created_source:"lokesh",created_source_type:"mentor",created_datetime:"today",
          last_modified_source:"lokesh",last_modified_source_type:"lead",last_modified_datetime:"today",icons:'<div class="icons"><i class="fa-solid fa-pen-to-square"></i> <i class="fa-solid fa-trash"></i></div>',
          status:'<button class="disabled-btn">Disabled</button>'
        }];
        this.cols = [
            { field: 'user_name', header: 'User Name' },
            { field: 'email', header: 'Email ID' },
            { field: 'created_source', header: 'Created Source' },
            { field: 'created_source_type', header: 'Created Source Type' },
            { field: 'created_datetime', header: 'Created Date Time' },
            { field: 'last_modified_source', header: 'Last Modified Source' },
            { field: 'last_modified_source_type', header: 'Last Modified Source Type' },
            { field: 'last_modified_datetime', header: 'Last modified Date Time' },
            { field: 'icons', header: 'Actions' },
            { field: 'status', header: 'Status' },
        ];
    }
}
