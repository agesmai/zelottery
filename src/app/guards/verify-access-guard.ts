import { CanActivateFn } from '@angular/router';

export const verifyAccessGuard: CanActivateFn = (route, state) => {
  return true;
};
