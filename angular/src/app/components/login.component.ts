import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: '../views/login.component.html',
  styleUrls: ['../views/login.component.css']
})
export class LoginComponent implements OnInit {
  public title: string;
  public user;

  constructor( private _route:ActivatedRoute, private _router:Router) { 
    this.title = 'Identificate';
    this.user = {
      "email":"",
      "password":"",
      "gethash":false
    }
  }

  onSubmit(){
    console.log(this.user);
  }

  ngOnInit() {
    console.log('El componente login.component ha sido cargado!!')
  }

}
