import { Component, EventEmitter, inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { AuthorizeUser } from '../Services/authorize_user';
import { HTTPService } from '../Services/http_service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit{

  constructor(private primeNg:PrimeNGConfig,
              private message_service:MessageService,
              private authorize:AuthorizeUser,
            ){}

  forgot:boolean=false;
  password:string='';
  confirmPassword:string='';
  user_Id:string='';
  log:boolean;
  err:string='Credentials are wrong!';
  sub;
  login_content:[{userId:string,Password:string,isLogged:boolean}];

  @ViewChild('form') form:NgForm;
  ngOnInit(){
    this.all_fields_invalid=false;
    this.primeNg.ripple=true;
     console.log("ngOnInit");
  }

  forgot_password(){
    this.form.reset();
    this.all_fields_invalid=false;
    this.forgot=!this.forgot;
    this.password='';
    this.user_Id='';
  }
 all_fields_invalid=false;
  form_submit(form:NgForm){
    console.log(form);
    if(this.forgot){
      if(!form.valid){
      this.all_fields_invalid=true;
      return;
    }
      console.log(form.value);
      this.authorize.reset_password(form.value);
      this.sub = this.authorize.authentication.subscribe((res:string)=>{
        this.message_service.add({severity:'success', summary:'Success', detail:res});
        this.sub.unsubscribe();
      })
    }else{
      if(!form.valid){
      this.all_fields_invalid=true;
      return;
    }
    this.authorize.login(form.value);
    this.sub = this.authorize.authentication.subscribe((res)=>{
      this.log = res[0];
      this.err=res[1];
      if(!this.log){
        this.message_service.add({severity:'error', summary:'Error', detail:this.err});
      }
      this.sub.unsubscribe();
    });
    }
  }
}
