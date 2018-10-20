import { Injectable } from '@angular/core';
import { Task } from '../models/task';
import { Http, Headers } from '@angular/http';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private _http:Http) { 

  }

  create(task:Task, token){
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(`${GLOBAL.url}/task/new`,`json=${JSON.stringify(task)}&authorization=${token}`,{headers});
  }

  getPage(token,page=1){
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(`${GLOBAL.url}/task/list?page=${page}`,`authorization=${token}`,{headers});
  }

  getTask(token,id){
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(`${GLOBAL.url}/task/detail/${id}`,`authorization=${token}`,{headers});
  }

  updateTask(token,task){
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(`${GLOBAL.url}/task/edit/${task.id}`,`json=${JSON.stringify(task)}&authorization=${token}`,{headers});
  }

  deleteTask(token,id){
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(`${GLOBAL.url}/task/remove/${id}`,`authorization=${token}`,{headers});
  }

  search(token, search, filter, order){
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    let url = search ? `${GLOBAL.url}/task/search/${search}`:`${GLOBAL.url}/task/search`;
    return this._http.post(url,`filter=${filter}&order=${order}&authorization=${token}`,{headers});
  }

}
