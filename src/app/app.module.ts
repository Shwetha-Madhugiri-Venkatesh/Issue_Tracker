import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { IssuesComponent } from './home/issues/issues.component';
import { UsersComponent } from './home/users/users.component';
import { GraphComponent } from './home/dashboard/graph/graph.component';
import { HeaderComponent } from './home/header/header.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';

import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { RoutingModule } from './rounting.module';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { TabMenuModule } from 'primeng/tabmenu';
import { ChartModule } from 'primeng/chart';
import { TableComponent } from './home/users/table/table.component';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { DialogComponent } from './home/users/dialog/dialog.component';
import { KabbanComponent } from './home/issues/kabban/kabban.component';
import { ListComponent } from './home/issues/list/list.component';
import { TicketComponent } from './home/issues/kabban/ticket/ticket.component';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { EditorModule } from 'primeng/editor';
import { SidebarModule } from 'primeng/sidebar';
import { AutoCompleteModule } from 'primeng/autocomplete';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    HomeComponent,
    IssuesComponent,
    UsersComponent,
    GraphComponent,
    TableComponent,
    DialogComponent,
    KabbanComponent,
    ListComponent,
    TicketComponent,
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
    TabMenuModule,
    HttpClientModule,
   ChartModule,
   TableModule,
   CommonModule,
   DropdownModule,
   MultiSelectModule,
   DialogModule,
   FileUploadModule,
   ProgressBarModule,
   EditorModule,
   SidebarModule,
   AutoCompleteModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
