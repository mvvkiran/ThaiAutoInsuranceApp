import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="admin-container">
      <h1>Admin Dashboard</h1>
      <p>Admin dashboard and management will be implemented here</p>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 24px;
    }
  `]
})
export class AdminDashboardComponent { }