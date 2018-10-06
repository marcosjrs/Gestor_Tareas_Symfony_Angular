import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './components/login.component';
import {RegisterComponent} from './components/register.component';

const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'login/:action', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '**', component: LoginComponent } //el resto de las rutas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
