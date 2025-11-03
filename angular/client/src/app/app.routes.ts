import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AngularWrapperComponent } from './angular-wrapper.component';

export const routes: Routes = [
  {
    path:'',component: HomeComponent
  },
  {
    path: 'react',
    loadComponent: () => import('./react-wrapper.component').then(m => m.ReactWrapperComponent),
  },
  {
    path: 'angular',
    loadComponent: () => import('./angular-wrapper.component').then(m => m.AngularWrapperComponent),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {path:'**',component: HomeComponent}

  
];
