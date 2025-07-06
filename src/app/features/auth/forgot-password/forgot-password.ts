import {Component, signal, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {Auth, sendPasswordResetEmail} from '@angular/fire/auth';
import {
  FormModule,
  InputGroupComponent,
  ButtonModule,
  CardModule,
  AlertModule
} from '@coreui/angular';

import {IconModule, IconSetService} from '@coreui/icons-angular';
import {cilEnvelopeClosed, cilReload} from '@coreui/icons';

@Component({
  selector: 'app-forgot-password',
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
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword {
  email = signal('');
  message = signal<string | null>(null);
  error = signal<string | null>(null);
  loading = signal(false);
  captcha = '';
  captchaInput = '';

  private auth = inject(Auth);
  private iconSet = inject(IconSetService);

  constructor() {
    this.iconSet.icons = {cilReload, cilEnvelopeClosed};
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

  resetPassword() {
    this.loading.set(true);
    if (this.captchaInput.trim().toUpperCase() !== this.captcha.toUpperCase()) {
      this.generateCaptcha(); // Tạo CAPTCHA mới
      this.error.set('Mã xác minh không đúng. Vui lòng thử lại.');
      this.loading.set(false);
      return;
    }
    sendPasswordResetEmail(this.auth, this.email())
      .then(() => this.message.set('Đã gửi email đặt lại mật khẩu!'))
      .catch(err => this.error.set(err.message))
      .finally(() => this.loading.set(false));
  }
}
