import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {

  @Input()
  visible:boolean=false;

  @Output() visibleChange = new EventEmitter<boolean>();


}
