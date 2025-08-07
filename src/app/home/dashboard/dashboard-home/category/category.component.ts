import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { Ticket } from 'src/app/Models/ticket';
import { HTTPService } from 'src/app/Services/http_service';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';
import { GoogleChartComponent, GoogleChartInterface, GoogleChartType } from 'ng2-google-charts';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
   providers: [MessageService]
})
export class CategoryComponent implements OnInit{

  data;
  selectedCategory;
  all_tickets;
  category_options;
  @Input() category_header;
  @Input() category_header_right;
  @Input() font;
  public pieChart: GoogleChartInterface = {
    chartType: GoogleChartType.ColumnChart,
    options: { 'title': 'Tasks' },
  };
  @ViewChild('gc') google: GoogleChartComponent;
  constructor(private http_service: HTTPService, private two_way: TwoWayDataBinding,  private message_service:MessageService) { }

  //Data from TwoWayDataBinding server
  categories: { categoryId: string, categoryDesc: string }[] = this.two_way.categories;
  subcategories: { subCategoryId: string, categoryId: string, subCategoryDesc: string }[] = this.two_way.subcategories;

  ngOnInit() {
    let result = {};//{category_name: number_of_issues}
    this.http_service.fetch_tickets().subscribe((res: Ticket[]) => {
      this.all_tickets = res;

      //fetching preload data from localstorage if present
      let category_preload = JSON.parse(localStorage.getItem("category_preload")) || {};
      //assigning the preload data
      if (Object.keys(category_preload)?.length != 0) {
        this.selectedCategory = category_preload.selectedCategory;
        this.category_entered(this.selectedCategory);
        localStorage.setItem("category_preload", JSON.stringify({}));
      }

      //If preload is not present, selectedCategory will be still undefined
      if (this.selectedCategory == undefined) {
        let number_of_issues = 0;

        //filtering data according to category Ids
        for (let x of this.categories) {
          number_of_issues = res.filter((item1) => item1.categoryId == x.categoryId).length;
          result[x.categoryDesc] = number_of_issues;
        }

        this.pieChart = {
          ...this.pieChart,
          dataTable: [
            ['Dates', 'Number of Issues'],
            ...Object.entries(result)
          ],
          options: {
            vAxis: {
              title: 'Number of Issues',
              minValue: 0
            },
            hAxis: {
              title: 'Dates',
              minValue: 0
            },
          width:this.category_header?180:1200,
          height:this.category_header?110:500,
          },
        };
        this.google?.draw(this.pieChart);
      }
    },
    
    (err)=>{
      this.message_service.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: err+', Tickets fetch failed'
                    });
    }
  )
    //end of initial settings
  }

  //method for calculating number of issues for subcategories of the specific category
  category_entered(val) {
    let result = {}; //{subcategory_name: number_of_issues}

    if (val == undefined) return;

    let number_of_issues = 0;
    //filtering subcategories based on their Ids and category Ids
    for (let x of this.subcategories) {
      number_of_issues = this.all_tickets.filter((item1) => x.categoryId == this.selectedCategory.categoryId && item1.subCategoryId == x.subCategoryId).length;
      if (x.categoryId == this.selectedCategory.categoryId) {
        result[x.subCategoryDesc] = number_of_issues;
      }
    }
    
    //modifying the data

    this.pieChart = {
        ...this.pieChart,
        dataTable: [
          ['Date', 'Issues'],
          ...Object.entries(result)
        ],
      };
      this.google.draw(this.pieChart);
  }

  //storing data which should be preloaded once the user navigates
  ngOnDestroy() {
    /*first canactivate for login will execute, after that ngOnDestroy will execute. Since I am clearing the data 
    present in local storage and again it is loaded since the ngOnDestroy will execute at last I am checking the 
    condition below*/

    //if the user is still logged in
    if (Object.keys(JSON.parse(localStorage.getItem("login"))).length != 0) {
      let category_preload = JSON.parse(localStorage.getItem("category_preload")) || {};
      category_preload['selectedCategory'] = this.selectedCategory;
      localStorage.setItem("category_preload", JSON.stringify(category_preload));
    }
  }
}
