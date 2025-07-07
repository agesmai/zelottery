import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';


export const verifyAccessGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const user = auth.currentUser;
  if (user && !user.emailVerified) return true;
  window.location.href = '/login';
  return false;

};
