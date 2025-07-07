import {Routes} from '@angular/router';
import {verifyAccessGuard} from './guards/verify-access-guard';
import {authGuard} from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then(m => m.Home),
    canActivate: [authGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home').then(m => m.Home),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.Register),
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./features/auth/forgot-password/forgot-password').then(m => m.ForgotPassword)
  },
  {
    path: 'email-verification',
    loadComponent: () => import('./features/auth/email-verification/email-verification')
      .then(m => m.EmailVerification),
    canActivate: [verifyAccessGuard],
  },
];
