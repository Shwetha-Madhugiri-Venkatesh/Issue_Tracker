import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { AuthorizeUser } from '../Services/authorize_user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  constructor(private primeNg:PrimeNGConfig){}

  forgot:boolean=false;
  password:string='';
  confirmPassword:string='';
  email_add:string='';

  authorize:AuthorizeUser=inject(AuthorizeUser);

  ngOnInit(){
    this.primeNg.ripple=true;
  }

  forgot_password(){
    this.forgot=!this.forgot;
    this.password='';
    this.email_add='';
  }

  form_submit(form:NgForm){
    console.log(form.value);
    this.authorize.login(form.value);
  }
}
