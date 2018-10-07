import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Response, Headers, Http } from '@angular/http';



@Injectable()
export class UserService {

  public url:String;
  public identity; //datos del usuario logueado
  public token; // que se va enviar en cada petición tras el login.

  constructor(private _http:Http) { //inyectamos Http, para poder hacer peticiones ajax
    this.url = GLOBAL.url;
  }

  signup(dataUserToLogin){
    let json = JSON.stringify(dataUserToLogin);
    let params = "json="+json;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});//enviamos como datos de un formulario

    return this._http
            .post(`${this.url}/login`, params, {headers});
  }

  register(dataUserToRegister){
    let json = JSON.stringify(dataUserToRegister);
    let params = "json="+json;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});//enviamos como datos de un formulario

    return this._http
            .post(`${this.url}/user/new`, params, {headers});
  }

  userEdit(dataUserToEdit, token){
    let json = JSON.stringify(dataUserToEdit);
    let params = `json=${json}&authorization=${token}`;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});//enviamos como datos de un formulario

    return this._http
            .post(`${this.url}/user/edit`, params, {headers});
  }

  /**
   * Devuelve un objeto JSON con los datos del usuario
   */
  getLocalIdentity(){
    let lSIdentity = localStorage.getItem('identity');
    return lSIdentity && lSIdentity.length ? JSON.parse(lSIdentity) : null;     
  }

  getLocalToken(){
    return localStorage.getItem('token');     
  }

  setLocalIdentity(identity:string){
    localStorage.setItem('identity', identity); 
  }

  setLocalToken(token){
    localStorage.setItem('token', token);
  }

}
