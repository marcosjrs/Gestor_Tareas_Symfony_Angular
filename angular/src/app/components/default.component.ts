import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { UserService } from '../services/user.service';
import { Task } from '../models/task';
import { ESTADOS } from '../services/global';

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
  public loadingUpdateData;
  public actualPage;
  public pages;
  public pagePrev;
  public pageNext;
  private token;
  public noLogin;
  public ESTADOS;
  public idTaskToDelete;
  public search;
  public inSearch;
  

  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _taskService: TaskService) {
    this.ESTADOS = ESTADOS;
    this.search = {filter: "0", order: "0", searchString: ""};
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
    this.inSearch = false;
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
          this.loadingUpdateData = false;
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

  selectDeleteTask(id){
    this.idTaskToDelete = id;
  }

  deleteTask(id){
    this.loadingUpdateData = true;
    this.tasks = this.tasks.filter(obj => obj.id !== id); //optimistic ;)
    this._taskService.deleteTask(this.token, id).subscribe(
      resp=>{ 
        this.loadPage(this.actualPage); 
      },
      err =>{
        this.loadPage(this.actualPage); 
      } 
    );
  }

  onSubmit(){
    this.inSearch = true;
    this._taskService
        .search(this.token, this.search.searchString, this.search.filter, this.search.order)
        .subscribe(
          resp=>{
            this.inSearch = false;
            if (resp.json().status == "success") {
              const respJson = resp.json();
              this.tasks =respJson.data;
            }
          },
          err=>{
            console.log(err);
          }
        );
  }

}
