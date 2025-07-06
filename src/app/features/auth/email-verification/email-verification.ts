import { Component } from '@angular/core';
import { Auth, sendEmailVerification, reload } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-verification',
  imports: [],
  templateUrl: './email-verification.html',
  styleUrl: './email-verification.scss'
})
export class EmailVerification {
  message = 'Vui lòng kiểm tra email đã đăng ký để xác minh tài khoản.';
  loading = false;

  constructor(private auth: Auth, private router: Router) {
  }

  resend() {
    const user = this.auth.currentUser;
    if (!user) return;

    this.loading = true;
    sendEmailVerification(user)
      .then(() => {
        this.message = 'Email xác minh đã được gửi lại.';
      })
      .catch(err => {
        this.message = 'Lỗi gửi lại email: ' + err.message;
      })
      .finally(() => (this.loading = false));
  }

  checkVerified() {
    const user = this.auth.currentUser;
    if (!user) return;

    this.loading = true;
    reload(user)
      .then(() => {
        if (user.emailVerified) {
          this.message = 'Email đã xác minh!';
          this.router.navigate(['/home']);
        } else {
          this.message = 'Email chưa được xác minh.';
        }
      })
      .catch(err => {
        this.message = 'Lỗi kiểm tra xác minh: ' + err.message;
      })
      .finally(() => (this.loading = false));
  }
}
