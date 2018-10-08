import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Task } from '../models/task';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task.new',
  templateUrl: '../views/task.new.component.html',
  styleUrls: ['../views/task.new.component.css']
})
export class TaskNewComponent implements OnInit {
  public title;
  public identity;
  public token;
  public task:Task;
  public status:string ="pending";

  constructor(private _userService:UserService, private _router:Router, private _route:ActivatedRoute, private _taskService:TaskService) {
    this.title = 'Nueva Tarea';
    this.identity = this._userService.getLocalIdentity();
    this.token = this._userService.getLocalToken();
  }

  ngOnInit() {
    if(!this.identity){
      this._router.navigate(['/login']);
    }else{
      this.task = new Task(1,"","","new",null,null);
    }
  }

  onSubmit(){
    this._taskService.create(this.task, this.token).subscribe(
      resp=>{
        this.status = resp.json().status;
      },
      err=>{
        console.log("Error");
      }
    );
  }

}
