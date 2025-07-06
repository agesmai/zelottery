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
import {cilUser, cilEnvelopeClosed} from '@coreui/icons';

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

  private auth = inject(Auth);
  private iconSet = inject(IconSetService);

  constructor() {
    this.iconSet.icons = {cilUser, cilEnvelopeClosed};
  }

  resetPassword() {
    this.loading.set(true);
    sendPasswordResetEmail(this.auth, this.email())
      .then(() => this.message.set('Đã gửi email đặt lại mật khẩu!'))
      .catch(err => this.error.set(err.message))
      .finally(() => this.loading.set(false));
  }
}
