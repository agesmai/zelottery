import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./features/home/home').then(m => m.Home),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  }
];
