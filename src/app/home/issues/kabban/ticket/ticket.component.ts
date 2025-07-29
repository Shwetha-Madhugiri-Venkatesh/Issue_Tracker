import { Component, EventEmitter, Input, Output} from '@angular/core';
import { Ticket } from 'src/app/Models/ticket';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent {
  @Input()
  ticket: Ticket;

  @Input()
  priority

  @Output()
  commentForm: EventEmitter<Ticket> = new EventEmitter<Ticket>;

  priority_name: string = '';

  types: { type: string, value: string }[] = [
    { type: "Bug", value: "bug" },
    { type: "Feature", value: "feature" },
  ]

  ngOnInit() {
    this.priority_name = this.priority.find(item => item.priorityId == this.ticket.priorityId)?.priority;
  }
}
