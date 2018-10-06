import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'register',
  templateUrl: '../views/register.component.html',
  styleUrls: ['../views/register.component.css'],
  providers:[UserService]
})
export class RegisterComponent implements OnInit {

  public title: string;
  public user;
  public identity;
  public status;
  public lastEmailRegistered;

  constructor( private _route:ActivatedRoute, private _router:Router, private userService:UserService) { 
    this.title = 'Registrate';
    this.user =  new User(1, "user", "", "", "", "");
  }

  ngOnInit() {
    console.log('[Componente Register]');
  }

  onSubmit(){
    this.lastEmailRegistered = JSON.parse(JSON.stringify(this.user.email));

    this.userService
      .register(this.user)
      .subscribe(
        resp=>{
          if(!resp.json() || resp.json().status != "success"){
            this.status = "error";
          }else if(resp.json().status == "success"){            
            this.status = "success";
            this.user =  new User(1, "user", "", "", "", "");
          }
        },
        err=>{
          this.status = "error";
        }
      );
  }

}
