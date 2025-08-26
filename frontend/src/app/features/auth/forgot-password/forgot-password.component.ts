import { Component } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  template: `
    <div class="forgot-password-container">
      <h2>Forgot Password</h2>
      <p>Password reset form will be implemented here</p>
      <a routerLink="/auth/login">Back to Login</a>
    </div>
  `,
  styles: [`
    .forgot-password-container {
      padding: 20px;
      text-align: center;
    }
  `]
})
export class ForgotPasswordComponent { }