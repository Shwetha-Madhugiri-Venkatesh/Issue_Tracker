import { Component, Input, ViewChild } from '@angular/core';
import { Ticket } from 'src/app/Models/ticket';
import { KabbanComponent } from '../kabban.component';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent {
  @Input()
  ticket:Ticket;
  @Input()
  priority
  priority_name:string='';
  
  ngOnInit(){
    this.priority_name=this.priority.find(item=>item.priorityId==this.ticket.priorityId).priority;
  }
}
