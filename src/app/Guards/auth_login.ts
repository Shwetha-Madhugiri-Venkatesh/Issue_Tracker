import { Injectable} from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class AuthLogin implements CanActivate {

  constructor(private route: Router) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let flag1 = JSON.parse(localStorage.getItem("login")) || {};
    let flag2 = JSON.parse(localStorage.getItem("logged")) || false;

    //canActivate for home and its child components
    if ((Object.keys(flag1).length != 0) && (flag2 === true)) {
      return true;
    } else {
      this.route.navigate(['/']);
      return false;
    }
  }
}