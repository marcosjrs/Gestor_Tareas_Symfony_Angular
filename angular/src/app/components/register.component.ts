import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'register',
  templateUrl: '../views/register.component.html',
  styleUrls: ['../views/register.component.css']
})
export class RegisterComponent implements OnInit {

  public title: string;

  constructor() { 
    this.title = 'Componente de Register';
  }

  ngOnInit() {
    console.log('[Componente Register]');
  }

}
