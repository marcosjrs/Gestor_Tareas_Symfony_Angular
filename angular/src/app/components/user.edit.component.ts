import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: '../views/user.edit.component.html',
  styleUrls: ['../views/user.edit.component.css'],
  providers:[UserService]
})
export class UserEditComponent implements OnInit {
  public title;
  public user:User;
  public identity;
  public status;
  public token;

  constructor(private _userService:UserService, private _route:ActivatedRoute, private _router:Router) { 
    this.title = "Mi Perfil";
    this.identity = this._userService.getLocalIdentity();
    this.token = this._userService.getLocalToken();
  }

  ngOnInit() {

    if(this.identity == null){
      this._router.navigate( ['/login']);
    }else{
      this.user = new User(this.identity.sub, this.identity.role, this.identity.name, 
                    this.identity.surname, this.identity.email, this.identity.password);
    }

  }

  onSubmit(){
    this._userService.userEdit(this.user,this.token)
      .subscribe(
        resp=>{
          if(resp.json().status=="success"){
            this.status = "success";
            this._userService.setLocalIdentity(JSON.stringify(this.user))
          }else{
            this.status = "error";
          }
        },
        error=>{
          console.log("Error",error);
        }
      )
  }

}
