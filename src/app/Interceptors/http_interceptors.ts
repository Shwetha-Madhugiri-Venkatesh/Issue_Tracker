import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, tap, throwError } from "rxjs";
import { TwoWayDataBinding } from "../Services/two_way_dataBinding";
import { Ticket } from "../Models/ticket";
import { HTTPService } from "../Services/http_service";
import { User } from "../Models/User";

@Injectable({
    providedIn:'root',
})
export class HTTPInterceptors implements HttpInterceptor{
    constructor(public two_way:TwoWayDataBinding, public http_service:HTTPService){}

    priorities: { priorityId: string, priority: string }[] = this.two_way.priorities;
    statuses: { statusId: string, status: string, tickets: Ticket[] }[] = this.two_way.statuses;
    categories: { categoryId: string, categoryDesc: string }[] = this.two_way.categories;
    subcategories: { subCategoryId: string, categoryId: string, subCategoryDesc: string }[] = this.two_way.subcategories;
    browsers: { browser_name: string, browser_id: string }[] = this.two_way.browsers;
    operatingSystems: { os_name: string, os_id: string }[] = this.two_way.operatingSystems;
    
    types: { type: string, value: string }[] = [
        { type: "Bug", value: "bug" },
        { type: "Feature", value: "feature" },
    ];

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(map((event)=>{
            if(event instanceof HttpResponse && event.body){
                if(req.headers.get('data_type')=='tickets'){
                    let modified = event.body.map(item=>{
                    let category = this.categories.find(category_val=>category_val.categoryId==item.categoryId).categoryDesc;
                    let subcategory = this.subcategories.find(subcategory_val=>subcategory_val.subCategoryId==item.subCategoryId).subCategoryDesc;
                    let status = this.statuses.find(status_val=>status_val.statusId==item?.statusId);
                    let priority = this.priorities.find(priority_val=>priority_val.priorityId==item.priorityId);
                    // let browser_type = this.browsers.find(browser_val=>browser_val.browser_id==item.browser).browser_name;
                    // let operatingSystemType = this.operatingSystems.find(operating_system=>operating_system.os_id==item.operatingSystem).os_name;
                    let CreatedDateTimeString = new Date(item.createDateTime).toLocaleString();
                    let lastModifiedDateTimeString = new Date(item.lastModifiedDateTime).toLocaleString();
                    return ({...item,
                        category:category,
                        subcategory:subcategory,
                        status:status,
                        priority:priority,
                        // browser_type:browser_type,
                        // operatingSystemType:operatingSystemType,
                        CreatedDateTimeString:CreatedDateTimeString,
                        lastModifiedDateTimeString:lastModifiedDateTimeString,
                    })
                });
                return event.clone({body:modified});
                }

                if(req.headers.get('data_type')=='users'){
                    let modified = event.body.map(item=>{
                        let created_datetimeString = new Date(item.created_datetime).toLocaleString();
                        let last_modified_datetimeString = new Date(item.last_modified_datetime).toLocaleString();
                        return ({...item,
                            created_datetimeString:created_datetimeString,
                            last_modified_datetimeString:last_modified_datetimeString,
                        })
                    });
                return event.clone({body:modified});
                }

                if(req.headers.get('data_type')=='comments'){
                    let modified = event.body.map(item=>{
                        let created_datetimeString = new Date(item.commented_date).toLocaleString();
                        let last_modified_datetimeString = new Date(item.last_modified_date).toLocaleString();
                        return ({...item,
                            created_datetimeString:created_datetimeString,
                            last_modified_datetimeString:last_modified_datetimeString,
                        })
                    });
                return event.clone({body:modified});
                }
            }
            return event;
        }))
    }
}