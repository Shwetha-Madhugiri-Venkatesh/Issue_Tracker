import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
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
              private http_service:HTTPService,
            ){}

  forgot:boolean=false;
  password:string='';
  confirmPassword:string='';
  user_Id:string='';
  log:boolean=true;
  login_content:[{userId:string,Password:string,isLogged:boolean}];
  authorize:AuthorizeUser=inject(AuthorizeUser);

  ngOnInit(){
    this.primeNg.ripple=true;
     console.log("ngOnInit");
  }

  forgot_password(){
    this.forgot=!this.forgot;
    this.password='';
    this.user_Id='';
  }

  form_submit(form:NgForm){
    console.log(form);
    if(!form.valid){
      return;
    }
    this.log = this.authorize.login(form.value);
    if(!this.log){
      this.message_service.add({severity:'error', summary:'Error', detail:'User credentials are wrong'});
    }
  }
}
