import { Component, OnInit } from '@angular/core';
import { Ticket } from 'src/app/Models/ticket';
import { HTTPService } from 'src/app/Services/http_service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  // selectedScale: { scale: string, value: string };
  // month: boolean = false;
  // day: boolean = true;
  // week: boolean = false;
  // selectedDate;
  // selectedMonth;
  // selectedWeek={ name: "first", value: 7,start:1 };
  // show_cal: boolean = false;
  all_tickets=[];
  today=new Date();
  
  // scales: { scale: string, value: string }[] = [
  //   { scale: 'Daily', value: "day" },
  //   { scale: 'Weekly', value: "week" },
  //   { scale: 'Monthly', value: "month" },
  // ]

  // weeks = [
  //   { name: "first", value: 7,start:1 },
  //   { name: "second", value: 14,start:8 },
  //   { name: "third", value: 21,start:15},
  //   { name: "fourth", value: 28,start:22 },
  //   { name: "fifth", value: 0 ,start:29},
  // ];

  start_date;
  end_date;
  data: { labels: string[]; datasets: { label: string; data: number[]; fill: boolean;backgroundColor:string, borderColor: string; tension: number;}[]; };
  graph_options;
  constructor(private http_service: HTTPService) { }

  ngOnInit() {
    let today = new Date();
    this.http_service.fetch_tickets().subscribe((res: Ticket[]) => {
      this.all_tickets = res;
      let preload_info =JSON.parse(localStorage.getItem("graph_preload"));
    if(Object.keys(preload_info)?.length!=0 && preload_info!=undefined){
      this.start_date=preload_info.start_date?new Date(preload_info.start_date):undefined;
      this.end_date=preload_info.end_date?new Date(preload_info.end_date):undefined;
      this.graph_data(this.start_date,this.end_date)
      //this.data=(preload_info.data.datasets[0].data.length==1 && preload_info.data.datasets[0].data[0]==0)?undefined:preload_info.data;
      localStorage.setItem("graph_preload",JSON.stringify({}));
    }
    if(this.data==undefined){
      console.log("p",this.data);
      let filtered_record = this.for_day(today);
      this.data = {
      labels: [today.toLocaleDateString()+""],
      datasets: [
        {
          label: 'Sales',
          data: [filtered_record.length],
          fill: false,
          backgroundColor:'blue',
          borderColor: '#42A5F5',
          tension: 0,
        }
      ]
    };
  }
    this.graph_options={
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      responsive: true,
  plugins: {
    tooltip: {
      enabled: true
    },
    legend: { display: false },
  }
      ,
      scales: {
        x: {
          grid: {
            
            drawBorder: false,
            drawOnChartArea: false,    
            display: false  
          },
          title: {
            display: true,
            text: 'Priority'
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
  // }
  // scale_selected() {
  //   if (this.selectedScale.value == 'day') {
  //     this.day = true;
  //     this.month = false;
  //     this.week = false;
  //     this.for_day(new Date());
  //   } else if (this.selectedScale.value == 'week') {
  //     this.day = false;
  //     this.month = false;
  //     this.week = true;
  //     this.for_week(this.selectedWeek,new Date());
  //   } else {
  //     this.day = false;
  //     this.month = true;
  //     this.week = false;
  //     this.for_month(new Date())
  //   }
  }
  start_date_selected(){
    console.log(this.start_date);
    this.graph_data(this.start_date,this.end_date);
  }

  refresh(){
    this.ngOnInit();
  }
  end_date_selected(){
    console.log(this.end_date);
    this.graph_data(this.start_date,this.end_date);
  }

  
  // show_calender() {
  //   this.show_cal = !this.show_cal;
  // }

  // day_selected() {
  //   let date = new Date(this.selectedDate);
  //   this.for_day(date);
  // }

  // week_selected() {
  //   if(this.selectedMonth!=undefined){
  //     let month_input = new Date(this.selectedMonth);
  //     this.for_week(this.selectedWeek,month_input);
  //     this.weeks[4].value=new Date(new Date().getFullYear(),month_input.getMonth()+1,0).getDate();
  //   }else{
  //     this.for_week(this.selectedWeek,new Date());
  //     this.for_week(this.selectedWeek,new Date());
  //     this.weeks[4].value=new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate();
  //   }
  // }

  // month_selected(){
  //   let month_input = new Date(this.selectedMonth);
  //   this.for_month(month_input);
  // }

  // for_month(month_input){
  //   let today = new Date();
  //   let no_of_days;
  //   if(today.getMonth()!==month_input.getMonth()){
  //     let last_day = new Date(today.getFullYear(),month_input.getMonth()+1,0);
  //     no_of_days=last_day.getDate();
  //   }else{
  //     no_of_days = today.getDate();
  //     month_input=today;
  //   }
  //     let x = [];
  //     let p = 7;
  //     while (p <= no_of_days) {
  //       x.push(p);
  //       p += 7;
  //     }

  //     if (no_of_days - x[x.length - 1] > 0) {
  //       x.push(x[x.length - 1] + (no_of_days - x[x.length - 1]));
  //     }

  //     let initial_month_output = [];
  //     let number_of_issues = 0;
  //     let weekly = {};
  //     let week=[];
  //     let count=0;
  //     for (let y = 1; y <= no_of_days; y++) {
  //       month_input.setDate(y);
  //       let res = this.all_tickets.filter(item => item.createDateTime.startsWith(month_input.toLocaleDateString()));
  //       number_of_issues += res.length;
  //       week.push(res.length);
  //       if (x.includes(y)) {
  //         initial_month_output.push(number_of_issues);
  //         weekly[this.weeks[count].name]=week;
  //         count++;
  //         week=[];
  //       }
  //     }
  //     this.data = {
  //       labels: [...x],
  //       datasets: [
  //         {
  //           label: 'Sales',
  //           data: [...initial_month_output],
  //           fill: false,
  //           borderColor: '#42A5F5',
  //           tension: 0
  //         }
  //       ]
  //     };
  //     if(this.week){
  //       return weekly;
  //     }else{
  //       return null;
  //     }
  // }

  // for_day(date){
  //   let filtered_record = this.all_tickets.filter(item => item.createDateTime.startsWith(date.toLocaleDateString()));
  //   this.data = {
  //     labels: [date.getDate() + ""],
  //     datasets: [
  //       {
  //         label: 'Sales',
  //         data: [filtered_record.length],
  //         fill: false,
  //         borderColor: '#42A5F5',
  //         tension: 0
  //       }
  //     ]
  //   };
  // }

  for_day(date){
    console.log(new Date(date).toLocaleDateString());
    let filtered_record = this.all_tickets.filter(item => {
      let idate = new Date(item.createDateTime);
      console.log(idate);
      return item.createDateTime.startsWith(date.toLocaleDateString())});
    return filtered_record;
  }

  // for_week(week,month){
  //   let res= this.for_month(month);
  //   if(res[week.name]==undefined){
  //     res[week.name]=[0,0,0,0,0,0,0];
  //   }
  //   let label_inp=[];
  //   for(let i=week.start;i<=week.value;i++){
  //     label_inp.push(i);
  //   }
  //   this.data = {
  //     labels:label_inp,
  //       datasets: [
  //         {
  //           label: 'Sales',
  //           data: [...res[week.name]],
  //           fill: false,
  //           borderColor: '#42A5F5',
  //           tension: 0
  //         }
  //       ]
  //     };
  // }

  graph_data(start_date,end_date){
    let res=[];
    let start = structuredClone(start_date);
    if(start_date!=undefined && end_date!=undefined){
      let labels=[];
      for(let x=start.getDate(); x<=end_date.getDate();x++){
        res.push(this.for_day(new Date(start.setDate(x))).length);
        labels.push(new Date(start.setDate(x)).toLocaleDateString());
      }
      this.data = {
      labels:labels,
      datasets: [
        {
          label: 'Sales',
          data: res,
          fill: false,
          backgroundColor:"blue",
          borderColor: '#42A5F5',
          tension: 0,
        }
      ]
    };
    }
    console.log(res);
  }

  ngOnDestroy(){
    if(Object.keys(JSON.parse(localStorage.getItem("login"))).length!=0){
    let preload_info=JSON.parse(localStorage.getItem("graph_preload"))||{};
    preload_info['start_date']=this.start_date;
    preload_info['end_date']=this.end_date;
    preload_info['data']=this.data;
    localStorage.setItem("graph_preload",JSON.stringify(preload_info));
    }
  }
}
