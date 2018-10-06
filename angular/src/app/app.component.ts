import { Component } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent {

  title = 'angular';
  public identity;
  public token;

  constructor(private _userService:UserService){
    this.identity = this._userService.getLocalIdentity();
    this.token = this._userService.getLocalToken();
  }

  ngOnInit(){
  }
}
