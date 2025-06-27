import { NgModule } from "@angular/core";
import { Routes, RouterModule} from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { DashboardComponent } from "./home/dashboard/dashboard.component";
import { AuthLogin } from "src/app/Guards/auth_login";
import { HomeComponent } from "./home/home.component";
import { IssuesComponent } from "./home/issues/issues.component";
import { UsersComponent } from "./home/users/users.component";

const routes:Routes = [
    {path:"",component:LoginComponent},
    {path:"login", component:LoginComponent},
    {path:"home", component:HomeComponent, canActivate:[AuthLogin], children:[
        {path:'dashboard', component:DashboardComponent},
        {path:'issues', component:IssuesComponent},
        {path:'users', component:UsersComponent},
    ]}
]
@NgModule({
   imports:[RouterModule.forRoot(routes)],
})
export class RoutingModule{}