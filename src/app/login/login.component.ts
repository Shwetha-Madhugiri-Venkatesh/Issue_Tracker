import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { AuthorizeUser } from '../Services/authorize_user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit{

  constructor(private primeNg:PrimeNGConfig,private message_service:MessageService){}

  forgot:boolean=false;
  password:string='';
  confirmPassword:string='';
  user_Id:string='';
  log:boolean=true;

  authorize:AuthorizeUser=inject(AuthorizeUser);

  ngOnInit(){
    this.primeNg.ripple=true;
  }

  forgot_password(){
    this.forgot=!this.forgot;
    this.password='';
    this.user_Id='';
  }

  form_submit(form:NgForm){
    console.log(form.value);
    this.log = this.authorize.login(form.value);
    if(!this.log){
      this.message_service.add({severity:'error', summary:'Error', detail:'User credentials are wrong'});
    }
  }
}
