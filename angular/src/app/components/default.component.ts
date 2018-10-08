import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { UserService } from '../services/user.service';
import { Task } from '../models/task';

@Component({
  selector: 'app-default',
  templateUrl: '../views/default.component.html',
  styleUrls: ['../views/default.component.css']
})
export class DefaultComponent implements OnInit {
  public tasks:Array<Task>;

  constructor(private _route:ActivatedRoute, private _router:Router, private _userService:UserService, private _taskService:TaskService) {    
  }

  ngOnInit() {
    this.getAllTasks();
  }

  getAllTasks(){
    let page = +this._route.snapshot.params.page;    

    this._taskService.get(this._userService.getLocalToken(), page ? page : 1).subscribe(
      resp=>{
        if(resp.json().status=="success"){
          this.tasks = resp.json().data;
        }
      },
      err=>console.log(err)
    );
  }

}
