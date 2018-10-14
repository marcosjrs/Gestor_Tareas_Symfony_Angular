import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task';

@Component({
  selector: 'app-task-detail',
  templateUrl: '../views/task-detail.component.html',
  styleUrls: ['../views/task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  public task:Task;
  public token;

  constructor(private _router:Router, 
    private _route:ActivatedRoute, 
    private _userService:UserService,
    private _taskService:TaskService) { 

  }

  ngOnInit() {
    if(!this._userService.getLocalToken()){ this._router.navigate(["/login"]); }
    //Obtener información de una tarea en concreto.
  }

}
