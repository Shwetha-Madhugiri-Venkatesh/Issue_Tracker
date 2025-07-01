import { NgModule } from "@angular/core";
import { Routes, RouterModule} from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { DashboardComponent } from "./home/dashboard/dashboard.component";
import { AuthLogin, login_canActivate } from "src/app/Guards/auth_login";
import { HomeComponent } from "./home/home.component";
import { IssuesComponent } from "./home/issues/issues.component";
import { UsersComponent } from "./home/users/users.component";

const routes:Routes = [
    {path:"",component:LoginComponent, canActivate:[login_canActivate]},
    // {path:"",component:LoginComponent},
    // {path:"",component:HomeComponent},
    {path:"home", component:HomeComponent,children:[
        {path:'dashboard', component:DashboardComponent},
        {path:'issues', component:IssuesComponent},
        {path:'users', component:UsersComponent},
    ]}
]
@NgModule({
   imports:[RouterModule.forRoot(routes)],
})
export class RoutingModule{}