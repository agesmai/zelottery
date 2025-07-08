import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {Auth, onAuthStateChanged} from '@angular/fire/auth';
import {Observable} from 'rxjs';

export const authGuard: CanActivateFn = (): Observable<boolean> => {
  const auth = inject(Auth);
  const router = inject(Router);

  return new Observable<boolean>((observer) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        observer.next(true);
      } else {
        router.navigate(['/login']).then(() => {
          observer.next(false);
          observer.complete();
        });
        observer.next(false);
      }
      observer.complete();
    });
  });
};
