import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
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
  
  types:{type:string,value:string}[]=[
    {type:"Bug", value:"bug"},
    {type:"Feature",value:"feature"},
  ]
  
  ngOnInit(){
    this.priority_name=this.priority.find(item=>item.priorityId==this.ticket.priorityId)?.priority;
  }

  @Output()
  commentForm:EventEmitter<Ticket> = new EventEmitter<Ticket>;

  open_comment_form(ticket:Ticket){
    this.commentForm.emit(ticket);
  }

  autoResize(event: Event): void {
  const textarea = event.target as HTMLTextAreaElement;
  textarea.style.height = 'auto'; // Reset
  textarea.style.height = `${textarea.scrollHeight+10}px`; // Set new height
}

}
