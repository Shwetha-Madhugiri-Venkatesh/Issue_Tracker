import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate,  Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root',
})
export class list_canActivate implements CanActivate{
    constructor(private route:Router){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        let issues_preload=JSON.parse(localStorage.getItem("issues_preload"))||{};
        if(issues_preload.list){
            return true;
        }else{
            return false;
        }
    }
}