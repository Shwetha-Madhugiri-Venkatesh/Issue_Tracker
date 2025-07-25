import { Component } from '@angular/core';
import { Ticket } from 'src/app/Models/ticket';
import { HTTPService } from 'src/app/Services/http_service';
import { TwoWayDataBinding } from 'src/app/Services/two_way_dataBinding';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {
  data;
  selectedCategory;
  all_tickets;
  category_options;
  
    constructor(private http_service:HTTPService, private two_way:TwoWayDataBinding){}
  
    categories:{categoryId:string, categoryDesc:string}[]=this.two_way.categories;
  subcategories:{subCategoryId:string, categoryId:string , subCategoryDesc:string}[]=this.two_way.subcategories;
  
    ngOnInit(){
      let result={};
      this.http_service.fetch_tickets().subscribe((res:Ticket[])=>{
        this.all_tickets=res;
        let category_preload=JSON.parse(localStorage.getItem("category_preload"));
        if(Object.keys(category_preload)?.length!=0 ){
          this.selectedCategory=category_preload.selectedCategory;
          this.category_entered(this.selectedCategory);
          localStorage.setItem("category_preload",JSON.stringify({}));
        }
        if(this.selectedCategory==undefined){
        let number_of_issues=0;
        for(let x of this.categories){
          number_of_issues = res.filter((item1)=>item1.categoryId==x.categoryId).length;
          result[x.categoryDesc]=number_of_issues;
        }
        console.log(result);
        this.data = {
           labels: Object.keys(result),
         datasets: [
            {
              label: 'Sales',
              data: Object.values(result),
              fill: false,
              backgroundColor:"blue",
              borderColor: '#42A5F5',
              tension: 0
            }
          ]
        };
      }
       this.category_options={
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
      })
    }

    refresh(){
    this.ngOnInit();
  }

    category_entered(val){
    let result={};
    if(val==undefined){
      return;
    }
    let number_of_issues=0;
        for(let x of this.subcategories){
          number_of_issues = this.all_tickets.filter((item1)=>x.categoryId==this.selectedCategory.categoryId && item1.subCategoryId==x.subCategoryId).length;
          if(x.categoryId==this.selectedCategory.categoryId){
          result[x.subCategoryDesc]=number_of_issues;
          }
        }
        console.log(result);
        this.data = {
           labels: Object.keys(result),
         datasets: [
            {
              label: 'Sales',
              data: Object.values(result),
              fill: false,
              backgroundColor:"blue",
              borderColor: '#42A5F5',
              tension: 0,
            },
          ]
        };
  }

  ngOnDestroy(){
     if(Object.keys(JSON.parse(localStorage.getItem("login"))).length!=0){
    let category_preload=JSON.parse(localStorage.getItem("category_preload"))||{};
    category_preload['selectedCategory']=this.selectedCategory;
    localStorage.setItem("category_preload",JSON.stringify(category_preload));
     }
  }
}
