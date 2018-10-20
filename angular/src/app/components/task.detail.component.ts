import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task';
import { ESTADOS } from '../services/global';

@Component({
  selector: 'app-task.detail',
  templateUrl: '../views/task-detail.component.html',
  styleUrls: ['../views/task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  public task:Task;
  public token;
  public loadingPage;
  public ESTADOS;

  constructor(private _router: Router,
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _taskService: TaskService) {
    this.token = _userService.getLocalToken();
    this.ESTADOS = ESTADOS;

  }

  ngOnInit() {
    if (!this._userService.getLocalToken()) { this._router.navigate(["/login"]); }
    //Obtener información de una tarea en concreto.
    const idTask = this._route.snapshot.params.id;

    //Mostramos loader
    this.loadingPage = true;
    
    this._taskService.getTask(this.token, idTask).subscribe(
      resp => {
        //ocultamos loader
        this.loadingPage = false;
        const jsonTask = resp.json().data;
        if (jsonTask) {
          this.task = new Task(jsonTask.id, jsonTask.title, jsonTask.description, jsonTask.status, jsonTask.createdAt, jsonTask.updatedAt, jsonTask.user);
        }else{
          this._router.navigate(["/login"]);
        }
      },
      err => {
      }
    );
  }

}
