import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Task } from '../models/task';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task.edit',
  templateUrl: '../views/task.edit.component.html',
  styleUrls: ['../views/task.edit.component.css']
})
export class TaskEditComponent implements OnInit {
  public title;
  public identity;
  public token;
  public task:Task;
  public status:string;
  public loadingPage:boolean;

  constructor(private _userService:UserService, private _router:Router, private _route:ActivatedRoute, private _taskService:TaskService) {
    this.title = 'Modificar Tarea';
    this.identity = this._userService.getLocalIdentity();
    this.token = this._userService.getLocalToken();
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


  onSubmit(){
    this._taskService.updateTask( this.token, this.task).subscribe(
      resp=>{
        this.status = resp.json().status;
        this._router.navigate(["/"]);
      },
      err=>{
        console.log("Error");
      }
    );
  }

}
