import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-customer-profile',
  template: `
    <div class="profile-container">
      <h1>Customer Profile</h1>
      <p>Manage your personal information and account settings.</p>
      
      <mat-card class="profile-card">
        <mat-card-content>
          <div class="profile-section">
            <h2>Account Information</h2>
            <div class="info-grid">
              <div class="info-item">
                <label>Full Name:</label>
                <span>{{ user?.fullName || 'Not specified' }}</span>
              </div>
              <div class="info-item">
                <label>Username:</label>
                <span>{{ user?.username }}</span>
              </div>
              <div class="info-item">
                <label>Email:</label>
                <span>{{ user?.email }}</span>
              </div>
              <div class="info-item">
                <label>Role:</label>
                <span>{{ user?.role }}</span>
              </div>
            </div>
          </div>
          
          <div class="profile-section">
            <h2>Personal Information</h2>
            <div class="info-grid">
              <div class="info-item">
                <label>First Name:</label>
                <span>{{ user?.firstName || 'Not specified' }}</span>
              </div>
              <div class="info-item">
                <label>Last Name:</label>
                <span>{{ user?.lastName || 'Not specified' }}</span>
              </div>
              <div class="info-item">
                <label>Phone Number:</label>
                <span>{{ user?.phoneNumber || 'Not specified' }}</span>
              </div>
              <div class="info-item">
                <label>Preferred Language:</label>
                <span>{{ user?.preferredLanguage || 'Not specified' }}</span>
              </div>
            </div>
          </div>
          
          <div class="profile-actions">
            <button mat-raised-button color="primary" type="button">
              <mat-icon>edit</mat-icon>
              Edit Profile
            </button>
            <button mat-stroked-button type="button">
              <mat-icon>lock</mat-icon>
              Change Password
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .profile-card {
      margin-top: 24px;
    }
    
    .profile-section {
      margin-bottom: 32px;
    }
    
    .profile-section h2 {
      margin-bottom: 16px;
      color: #333;
      padding-bottom: 8px;
      border-bottom: 2px solid #e0e0e0;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .info-item label {
      font-weight: 500;
      color: #666;
      font-size: 14px;
    }
    
    .info-item span {
      color: #333;
      font-size: 16px;
    }
    
    .profile-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e0e0e0;
    }
    
    @media (max-width: 768px) {
      .info-grid {
        grid-template-columns: 1fr;
      }
      
      .profile-actions {
        flex-direction: column;
      }
    }
  `]
})
export class CustomerProfileComponent implements OnInit {
  user: any = null;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser;
  }
}