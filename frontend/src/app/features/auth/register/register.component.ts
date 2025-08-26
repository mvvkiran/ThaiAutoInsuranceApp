import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  template: `
    <div class="register-container">
      <h2>Register Component</h2>
      <p>Registration form will be implemented here</p>
      <a routerLink="/auth/login">Back to Login</a>
    </div>
  `,
  styles: [`
    .register-container {
      padding: 20px;
      text-align: center;
    }
  `]
})
export class RegisterComponent { }