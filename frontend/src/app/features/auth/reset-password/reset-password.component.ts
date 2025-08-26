import { Component } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  template: `
    <div class="reset-password-container">
      <h2>Reset Password</h2>
      <p>Password reset form will be implemented here</p>
      <a routerLink="/auth/login">Back to Login</a>
    </div>
  `,
  styles: [`
    .reset-password-container {
      padding: 20px;
      text-align: center;
    }
  `]
})
export class ResetPasswordComponent { }