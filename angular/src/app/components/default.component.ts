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
  public tasks: Array<Task>;
  //Para paginación
  public loadingPage;
  public internalLoading;
  public actualPage;
  public pages;
  public pagePrev;
  public pageNext;
  private token;
  public noLogin;

  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _taskService: TaskService) {
  }

  ngOnInit() {
    this.token = this._userService.getLocalToken();
    if(this.token){
      this.getAllTasks();
    }else{
      this.noLogin = true;
    }
  }

  loadPage(actPage){
    this.actualPage = actPage;
    this.internalLoading = true;
    this._taskService.getPage(this.token, this.actualPage).subscribe(
      resp => {
        if (resp.json().status == "success") {
          const respJson = resp.json();
          this.tasks =respJson.data;

          //Total paginas
          this.pages = [];
          for (let i = 0; i <respJson.total_pages; i++) {
            this.pages.push(i);
          }
          //Establecer pagina anterior y pagina siguiente
          this.pagePrev = this.actualPage > 1 ?this.actualPage - 1 : this.actualPage;
          this.pageNext = this.actualPage < respJson.total_pages ? this.actualPage + 1 : this.actualPage;
          //ocultamos loader
          this.internalLoading = false;
          this.loadingPage = false;
        }
      },
      err => console.log(err)
    );
  }

  getAllTasks() {
    this.loadingPage = true;
    let actualPage = +this._route.snapshot.params.page;
    actualPage = actualPage ? actualPage : 1;
    this.loadPage(actualPage);
  } 

}
