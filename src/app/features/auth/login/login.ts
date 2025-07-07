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

import {cilUser, cilLockLocked, cibGoogle, cilSun, cilMoon} from '@coreui/icons';


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
  failCount = 0;
  lockedUntil: number | null = null;
  remainingSeconds = 0;
  lockInterval: any;

  private auth = inject(Auth);
  private router = inject(Router);
  private iconSet = inject(IconSetService);

  constructor() {
    this.iconSet.icons = {cilUser, cilLockLocked, cibGoogle, cilSun, cilMoon};
  }

  ngOnInit() {
    const savedLock = parseInt(localStorage.getItem('lockedUntil') ?? '');
    const now = Date.now();
    if (savedLock && Date.now() < savedLock) {
      this.lockedUntil = savedLock;
      this.updateRemainingSeconds();
      this.startCountdown();
    }
  }

  updateRemainingSeconds() {
    if (this.lockedUntil) {
      const now = Date.now();
      this.remainingSeconds = Math.max(
        Math.ceil((this.lockedUntil - now) / 1000),
        0
      );
    } else {
      this.remainingSeconds = 0;
    }
  }

  startCountdown() {
    this.error.set('');
    this.lockInterval = setInterval(() => {
      this.updateRemainingSeconds();
      if (this.remainingSeconds <= 0) {
        clearInterval(this.lockInterval);
        this.lockedUntil = null;
        localStorage.removeItem('lockedUntil');
        this.remainingSeconds = 0;
        this.error.set('');
      }
    }, 1000);
  }

  login() {
    const now = Date.now();

    if (this.lockedUntil && Date.now() < this.lockedUntil) {
      this.error.set(`Tạm khóa đăng nhập.`);
      return;
    }
    this.loading.set(true);
    signInWithEmailAndPassword(this.auth, this.email(), this.password())
      .then(() => {
        this.failCount = 0;
        this.router.navigate(['/home'])
      })
      .catch((err) => {
        this.failCount++;
        if (this.failCount >= 3) {
          const lockSeconds = 15;
          this.remainingSeconds = lockSeconds;
          this.lockedUntil = Date.now() + lockSeconds * 1000;
          localStorage.setItem('lockedUntil', this.lockedUntil.toString());
          this.startCountdown();
        } else {
          this.error.set('Email hoặc mật khẩu không đúng.');
        }
      })
      .finally(() => this.loading.set(false));
  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then(() => {
        console.log('Logged in with Google account!!!');
        this.router.navigate(['/home'])
      })
      .catch((err) => this.error.set(err.message));
  }
}
