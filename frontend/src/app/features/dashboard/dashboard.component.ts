import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';
import { PolicyService, Policy } from '../policy/policy.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-container">
      
      <!-- Welcome Header -->
      <div class="welcome-section">
        <h1 class="welcome-title">
          {{ 'dashboard.welcome' | translate }}, {{ getUserDisplayName() }}!
        </h1>
        <p class="welcome-subtitle">
          {{ 'dashboard.welcomeMessage' | translate }}
        </p>
      </div>

      <!-- Quick Stats Cards -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon">description</mat-icon>
              <div class="stat-info">
                <h3 class="stat-number">{{ getActivePoliciesCount() }}</h3>
                <p class="stat-label">{{ 'dashboard.activePolicies' | translate }}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon">assignment</mat-icon>
              <div class="stat-info">
                <h3 class="stat-number">{{ getPendingPoliciesCount() }}</h3>
                <p class="stat-label">{{ 'dashboard.pendingClaims' | translate }}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon">notifications</mat-icon>
              <div class="stat-info">
                <h3 class="stat-number">3</h3>
                <p class="stat-label">{{ 'dashboard.notifications' | translate }}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h2>{{ 'dashboard.quickActions' | translate }}</h2>
        <div class="action-buttons">
          <button mat-raised-button color="primary" routerLink="/policies/new">
            <mat-icon>add</mat-icon>
            {{ 'policy.newPolicy' | translate }}
          </button>
          <button mat-raised-button color="accent" routerLink="/claims/new">
            <mat-icon>report_problem</mat-icon>
            {{ 'claims.newClaim' | translate }}
          </button>
          <button mat-stroked-button routerLink="/profile">
            <mat-icon>person</mat-icon>
            {{ 'user.profile' | translate }}
          </button>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="recent-activity">
        <h2>{{ 'dashboard.recentActivity' | translate }}</h2>
        <mat-card class="activity-card">
          <mat-card-content>
            <div class="activity-item">
              <mat-icon class="activity-icon">description</mat-icon>
              <div class="activity-info">
                <p class="activity-title">Policy POL-2024-001 created</p>
                <p class="activity-date">2 hours ago</p>
              </div>
            </div>
            <div class="activity-item">
              <mat-icon class="activity-icon">assignment</mat-icon>
              <div class="activity-info">
                <p class="activity-title">Claim CLM-2024-005 submitted</p>
                <p class="activity-date">1 day ago</p>
              </div>
            </div>
            <div class="activity-item">
              <mat-icon class="activity-icon">check_circle</mat-icon>
              <div class="activity-info">
                <p class="activity-title">Payment processed successfully</p>
                <p class="activity-date">3 days ago</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-section {
      margin-bottom: 32px;
      text-align: center;
    }

    .welcome-title {
      font-size: 28px;
      color: #1976d2;
      margin-bottom: 8px;
    }

    .welcome-subtitle {
      color: #666;
      font-size: 16px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .stat-card {
      .stat-content {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .stat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: #1976d2;
      }

      .stat-number {
        font-size: 24px;
        font-weight: bold;
        color: #1976d2;
        margin: 0;
      }

      .stat-label {
        color: #666;
        margin: 4px 0 0;
        font-size: 14px;
      }
    }

    .quick-actions {
      margin-bottom: 32px;

      h2 {
        margin-bottom: 16px;
        color: #333;
      }

      .action-buttons {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;

        button {
          min-width: 160px;
        }
      }
    }

    .recent-activity {
      h2 {
        margin-bottom: 16px;
        color: #333;
      }

      .activity-card {
        .activity-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 0;
          border-bottom: 1px solid #eee;

          &:last-child {
            border-bottom: none;
          }

          .activity-icon {
            color: #1976d2;
          }

          .activity-title {
            font-weight: 500;
            margin: 0 0 4px;
          }

          .activity-date {
            color: #666;
            font-size: 12px;
            margin: 0;
          }
        }
      }
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .action-buttons {
        flex-direction: column;

        button {
          width: 100%;
        }
      }

      .welcome-title {
        font-size: 24px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  policies: Policy[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    public translationService: TranslationService,
    private policyService: PolicyService
  ) {}

  ngOnInit(): void {
    // Subscribe to policy changes
    this.subscription.add(
      this.policyService.getPolicies().subscribe(policies => {
        this.policies = policies;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getUserDisplayName(): string {
    const user = this.authService.currentUser;
    if (!user) return '';
    
    if (this.translationService.currentLanguage === 'th' && user.firstNameThai && user.lastNameThai) {
      return user.firstNameThai + ' ' + user.lastNameThai;
    }
    
    return user.fullName || user.username;
  }

  getActivePoliciesCount(): number {
    return this.policies.filter(p => p.status === 'ACTIVE').length;
  }

  getPendingPoliciesCount(): number {
    return this.policies.filter(p => p.status === 'PENDING').length;
  }

  getTotalPremium(): number {
    return this.policies
      .filter(p => p.status === 'ACTIVE')
      .reduce((total, p) => total + p.premium, 0);
  }
}