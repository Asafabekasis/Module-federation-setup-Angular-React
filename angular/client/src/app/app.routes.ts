import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'react',
    loadComponent: () => import('./react-wrapper.component').then(m => m.ReactWrapperComponent),
  },
  {
    path: '',
    redirectTo: '/react',
    pathMatch: 'full'
  }
];
