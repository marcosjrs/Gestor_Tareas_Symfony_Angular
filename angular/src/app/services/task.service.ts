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

}
