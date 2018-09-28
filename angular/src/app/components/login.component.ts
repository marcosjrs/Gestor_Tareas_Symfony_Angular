import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'login',
  templateUrl: '../views/login.component.html',
  styleUrls: ['../views/login.component.css']
})
export class LoginComponent implements OnInit {
  public title: string;

  constructor( ) { 
    this.title = 'Componente de Login';
  }

  ngOnInit() {
    console.log('El componente login.component ha sido cargado!!')
  }

}
