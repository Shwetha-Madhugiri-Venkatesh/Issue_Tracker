import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // @HostListener('window:beforeunload', ['$event'])
  // unloadNotification($event: any): void {
  //   const flag1 = JSON.parse(localStorage.getItem("login") || "{}");
  //   const flag2 = JSON.parse(localStorage.getItem("logged") || "false");

  //   if (Object.keys(flag1).length !== 0 && flag2 === true) {
  //     // Run your cleanup
  //     localStorage.setItem("login", JSON.stringify({}));
  //     localStorage.setItem("logged", JSON.stringify(false));
  //     localStorage.setItem("issues_preload", JSON.stringify({}));
  //     localStorage.setItem("graph_preload", JSON.stringify({}));
  //     localStorage.setItem("kanban_preload", JSON.stringify({}));
  //     localStorage.setItem("list_preload", JSON.stringify({}));
  //     localStorage.setItem("category_preload", JSON.stringify({}));

  //   }
  // }
}
