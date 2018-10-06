import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../services/user.service';
import { EmptyError } from 'rxjs';

@Component({
  selector: 'login',
  templateUrl: '../views/login.component.html',
  styleUrls: ['../views/login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public title: string;
  public token;
  public user;
  public identity;

  constructor( private _route:ActivatedRoute, private _router:Router, private userService:UserService) { 
    this.title = 'Identificate';
    this.token="";
    this.user = {
      "email":"",
      "password":"",
      "getHash":"true"
    }
  }

  onSubmit(){
    this.userService
        .signup(this.user)
        
        .subscribe(
          response=>{
            if(response){
              this.identity = response.json();
              if(response.status){ 

                localStorage.setItem('identity', response.text()); 
                
                //Una vez realizado el login correctamente, obtendremos el token que añadiremos a cada petición.
                this.userService.signup( {...this.user, getHash:null}).subscribe( responseToken => {
                  if(responseToken){
                    this.token = responseToken;
                    console.log(this.token);
                    if(responseToken.status){
                      localStorage.setItem('token', responseToken.json());
                      window.location.href = "/"
                    }
                  }else{
                    console.log("Get token: Error en servidor")
                  }
                });
              }
            }else{
              console.log("Login: Error en servidor")
            }        
          },
          error=>{
            console.log(error);
          }
        );
  }

  ngOnInit() {
    this.identity = this.userService.getLocalIdentity();    
    this.checkLogout();
  }

  checkLogout(){
    this._route.params.forEach(element => {
      if(element.action == "out"){
        localStorage.removeItem('identity');
        localStorage.removeItem('token');
        this.identity = null;
        this.token = null;
        window.location.href = "/login";
      }
    });
  }

}
