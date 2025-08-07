import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { Ticket } from 'src/app/Models/ticket';
import { HTTPService } from 'src/app/Services/http_service';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';

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

        this.data = {
          labels: Object.keys(result), //result object keys as category names
          datasets: [
            {
              label: 'Sales',
              data: Object.values(result), //result object values as number of issues respectively
              fill: false,
              backgroundColor: "blue",
              borderColor: '#42A5F5',
              tension: 0
            }
          ]
        };
      }

      this.category_options = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        responsive: true,
        plugins: {
          tooltip: {
            enabled: true
          },
          legend: { display: false },
          datalabels: {
            display: true,
            color: 'white',
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        },
        scales: {
          x: {
            grid: {
              drawBorder: false,
              drawOnChartArea: false,
              display: false
            },
            title: {
              display: true,
              text: 'Categories'
            }
          },
          y: {
            grid: {
              drawBorder: false,
              drawOnChartArea: false,
              display: false
            },
            title: {
              display: true,
              text: 'Number of Issues',
              rotation: 0,
              padding: { top: 0, bottom: 5, left: 20, right: 20 }
            }
          }
        }
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
    this.data = {
      labels: Object.keys(result), //result object keys as Subcategories name 
      datasets: [
        {
          label: 'Sales',
          data: Object.values(result), //result object values as number of issues 
          fill: false,
          backgroundColor: "blue",
          borderColor: '#42A5F5',
          tension: 0,
        },
      ]
    };
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
