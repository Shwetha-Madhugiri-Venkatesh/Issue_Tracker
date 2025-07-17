import { NgModule } from "@angular/core";
import { Routes, RouterModule} from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { DashboardComponent } from "./home/dashboard/dashboard.component";
import { AuthLogin } from "src/app/Guards/auth_login";
import { HomeComponent } from "./home/home.component";
import { IssuesComponent } from "./home/issues/issues.component";
import { UsersComponent } from "./home/users/users.component";
import { KabbanComponent } from "./home/issues/kabban/kabban.component";
import { ListComponent } from "./home/issues/list/list.component";
import { LoginCanActivate } from "./Guards/login_canactivate";

const routes:Routes = [
    {path:"",component:LoginComponent,canActivate:[LoginCanActivate]},
    {path:"home", component:HomeComponent, canActivate:[AuthLogin], children:[
        {path:'', component:DashboardComponent},
        {path:'issues', component:IssuesComponent,canActivate:[AuthLogin], children:[
            {path:'', component:KabbanComponent, canActivate:[AuthLogin]},
            {path:'list', component:ListComponent,canActivate:[AuthLogin]},
        ]},
        {path:'users', component:UsersComponent,canActivate:[AuthLogin]},
    ]}
]
@NgModule({
   imports:[RouterModule.forRoot(routes)],
})
export class RoutingModule{}