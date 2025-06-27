import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { FormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { RoutingModule } from './rounting.module';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from './home/header/header.component';
import { HomeComponent } from './home/home.component';
import { BadgeModule } from 'primeng/badge';
import { TabMenuModule } from 'primeng/tabmenu';
import { IssuesComponent } from './home/issues/issues.component';
import { UsersComponent } from './home/users/users.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    HomeComponent,
    IssuesComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    ButtonModule,
    RoutingModule,
    RouterModule,
    ToastModule,
    BadgeModule,
    TabMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
