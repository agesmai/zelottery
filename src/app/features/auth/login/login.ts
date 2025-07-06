import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

// CoreUI modules
import {
  FormModule,
  InputGroupComponent,
  ButtonModule,
  CardModule,
  AlertModule,
} from '@coreui/angular';

import {IconModule, IconSetService} from '@coreui/icons-angular';

import { cilUser, cilLockLocked, cibGoogle, cilSun, cilMoon } from '@coreui/icons';


import {Auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider} from '@angular/fire/auth';
import {RouterModule, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    FormModule,
    InputGroupComponent,
    ButtonModule,
    CardModule,
    AlertModule,
    IconModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  theme = signal<'light' | 'dark'>(
    document.documentElement.getAttribute('data-coreui-theme') === 'dark' ? 'dark' : 'light'
  );

  toggleTheme() {
    const newTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(newTheme);
    document.documentElement.setAttribute('data-coreui-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }

  email = signal('');
  password = signal('');
  error = signal<string | null>(null);
  loading = signal(false);

  private auth = inject(Auth);
  private router = inject(Router);
  private iconSet = inject(IconSetService);

  constructor() {
    this.iconSet.icons = { cilUser, cilLockLocked, cibGoogle, cilSun, cilMoon };
  }


  login() {
    this.loading.set(true);
    signInWithEmailAndPassword(this.auth, this.email(), this.password())
      .then(() => this.router.navigate(['/home']))
      .catch((err) => this.error.set(err.message))
      .finally(() => this.loading.set(false));
  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then(() => {
        console.log('Logged in with Google account!!!');
        this.router.navigate(['/home'])})
      .catch((err) => this.error.set(err.message));
  }
}
