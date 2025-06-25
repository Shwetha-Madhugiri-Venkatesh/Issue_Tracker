import { NgModule } from "@angular/core";
import { Routes, RouterModule} from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AuthLogin } from "src/app/Guards/auth_login";

const routes:Routes = [
    {path:"",component:LoginComponent},
    {path:"login", component:LoginComponent},
    {path:"dashboard", component:DashboardComponent, canActivate:[AuthLogin]}
]
@NgModule({
   imports:[RouterModule.forRoot(routes)],
})
export class RoutingModule{}