import {Component, signal, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Router} from '@angular/router';
import {Auth, createUserWithEmailAndPassword, sendEmailVerification} from '@angular/fire/auth';
import {
  FormModule,
  InputGroupComponent,
  ButtonModule,
  CardModule,
  AlertModule
} from '@coreui/angular';

import {IconModule, IconSetService} from '@coreui/icons-angular';

import {cilUser, cilLockLocked, cilReload} from '@coreui/icons';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FormModule,
    InputGroupComponent,
    ButtonModule,
    CardModule,
    AlertModule,
    IconModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  email = signal('');
  password = signal('');
  error = signal<string | null>(null);
  loading = signal(false);
  captcha = '';
  captchaInput = '';

  private auth = inject(Auth);
  private router = inject(Router);
  private iconSet = inject(IconSetService);

  constructor() {
    this.iconSet.icons = {cilUser, cilLockLocked, cilReload};
  }

  ngOnInit() {
    this.generateCaptcha();
  }

  generateCaptcha() {
    const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    this.captcha = Array.from({length: 5}, () =>
      charset[Math.floor(Math.random() * charset.length)]
    ).join('');
    this.error.set('');
  }

  register() {
    this.loading.set(true);
    if (this.captchaInput.trim().toUpperCase() !== this.captcha.toUpperCase()) {
      this.generateCaptcha(); // Tạo CAPTCHA mới
      this.error.set('Mã xác minh không đúng. Vui lòng thử lại.');
      this.loading.set(false);
      return;
    }
    createUserWithEmailAndPassword(this.auth, this.email(), this.password())
      .then(({user}) => {
        return sendEmailVerification(user)
          .then(() => {
            this.router.navigate(['/email-verification']);
          });
      })
      .catch(err => {
        this.error.set('Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
        console.error(err.message);
      })
      .finally(() => this.loading.set(false));
  }
}

