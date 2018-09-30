import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'login',
  templateUrl: '../views/login.component.html',
  styleUrls: ['../views/login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public title: string;
  public user;

  constructor( private _route:ActivatedRoute, private _router:Router, private userService:UserService) { 
    this.title = 'Identificate';
    this.user = {
      "email":"",
      "password":"",
      "gethash":false
    }
    console.log(userService.signup());
  }

  onSubmit(){
    console.log(this.user);
  }

  ngOnInit() {
    console.log('El componente login.component ha sido cargado!!')
  }

}
