import { NgModule } from "@angular/core";
import { Routes, RouterModule} from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { DashboardComponent } from "./home/dashboard/dashboard.component";
import { AuthLogin, login_canActivate } from "src/app/Guards/auth_login";
import { HomeComponent } from "./home/home.component";
import { IssuesComponent } from "./home/issues/issues.component";
import { UsersComponent } from "./home/users/users.component";
import { KabbanComponent } from "./home/issues/kabban/kabban.component";
import { ListComponent } from "./home/issues/list/list.component";

const routes:Routes = [
    {path:"",component:LoginComponent},
    // {path:"",component:LoginComponent},
    // {path:"",component:HomeComponent},
    {path:"home", component:HomeComponent,children:[
        {path:'', component:DashboardComponent},
        {path:'issues', component:IssuesComponent, children:[
            {path:'', component:KabbanComponent},
            {path:'list', component:ListComponent},
        ]},
        {path:'users', component:UsersComponent},
    ]}
]
@NgModule({
   imports:[RouterModule.forRoot(routes)],
})
export class RoutingModule{}