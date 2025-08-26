import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminService, AdminDashboardStats, PagedResult } from '../../core/services/admin.service';
import { TranslationService } from '../../core/services/translation.service';
import { NotificationService } from '../../core/services/notification.service';
import { User } from '../../core/models';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="admin-dashboard-container">
      
      <!-- Header Section -->
      <div class="dashboard-header">
        <h1 class="dashboard-title">
          <mat-icon>admin_panel_settings</mat-icon>
          {{ translationService.instant('admin.dashboard.title') }}
        </h1>
        <p class="dashboard-subtitle">
          {{ translationService.instant('admin.dashboard.subtitle') }}
        </p>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-grid" *ngIf="!statsLoading">
        <mat-card class="stat-card users-card">
          <mat-card-content>
            <div class="stat-icon">
              <mat-icon>people</mat-icon>
            </div>
            <div class="stat-info">
              <h3 class="stat-number">{{ dashboardStats?.totalUsers || 0 }}</h3>
              <p class="stat-label">{{ translationService.instant('admin.dashboard.totalUsers') }}</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card customers-card">
          <mat-card-content>
            <div class="stat-icon">
              <mat-icon>person</mat-icon>
            </div>
            <div class="stat-info">
              <h3 class="stat-number">{{ dashboardStats?.totalCustomers || 0 }}</h3>
              <p class="stat-label">{{ translationService.instant('admin.dashboard.totalCustomers') }}</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card policies-card">
          <mat-card-content>
            <div class="stat-icon">
              <mat-icon>description</mat-icon>
            </div>
            <div class="stat-info">
              <h3 class="stat-number">{{ dashboardStats?.totalPolicies || 0 }}</h3>
              <p class="stat-label">{{ translationService.instant('admin.dashboard.totalPolicies') }}</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card revenue-card">
          <mat-card-content>
            <div class="stat-icon">
              <mat-icon>attach_money</mat-icon>
            </div>
            <div class="stat-info">
              <h3 class="stat-number">{{ formatCurrency(dashboardStats?.totalRevenue || 0) }}</h3>
              <p class="stat-label">{{ translationService.instant('admin.dashboard.totalRevenue') }}</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Loading State for Stats -->
      <div class="stats-loading" *ngIf="statsLoading">
        <div class="loading-grid">
          <mat-card class="stat-card-skeleton" *ngFor="let i of [1,2,3,4]">
            <mat-card-content>
              <mat-spinner diameter="32"></mat-spinner>
              <p>{{ translationService.instant('common.loading') }}...</p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Management Sections -->
      <div class="management-sections">
        
        <!-- Quick Actions -->
        <mat-card class="management-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>flash_on</mat-icon>
              {{ translationService.instant('admin.dashboard.quickActions') }}
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="quick-actions">
              <button mat-raised-button color="primary" (click)="loadUsers()">
                <mat-icon>people</mat-icon>
                {{ translationService.instant('admin.actions.viewAllUsers') }}
              </button>
              <button mat-raised-button color="accent" (click)="loadCustomers()">
                <mat-icon>person_add</mat-icon>
                {{ translationService.instant('admin.actions.viewAllCustomers') }}
              </button>
              <button mat-raised-button (click)="loadPolicies()">
                <mat-icon>description</mat-icon>
                {{ translationService.instant('admin.actions.viewAllPolicies') }}
              </button>
              <button mat-raised-button color="warn" (click)="refreshDashboard()">
                <mat-icon>refresh</mat-icon>
                {{ translationService.instant('admin.actions.refreshData') }}
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Recent Users -->
        <mat-card class="management-card" *ngIf="recentUsers.length > 0">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>group_add</mat-icon>
              {{ translationService.instant('admin.dashboard.recentUsers') }}
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="recent-items">
              <div class="recent-item" *ngFor="let user of recentUsers">
                <div class="item-avatar">
                  <mat-icon>person</mat-icon>
                </div>
                <div class="item-info">
                  <h4>{{ user.firstName }} {{ user.lastName }}</h4>
                  <p>{{ user.email }}</p>
                  <small>{{ user.role }}</small>
                </div>
                <div class="item-actions">
                  <button mat-icon-button>
                    <mat-icon>more_vert</mat-icon>
                  </button>
                </div>
              </div>
            </div>
            <div class="view-all-link">
              <button mat-button color="primary" (click)="loadUsers()">
                {{ translationService.instant('admin.actions.viewAll') }}
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Recent Customers -->
        <mat-card class="management-card" *ngIf="recentCustomers.length > 0">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>person_add</mat-icon>
              {{ translationService.instant('admin.dashboard.recentCustomers') }}
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="recent-items">
              <div class="recent-item" *ngFor="let customer of recentCustomers">
                <div class="item-avatar">
                  <mat-icon>person</mat-icon>
                </div>
                <div class="item-info">
                  <h4>{{ customer.firstName }} {{ customer.lastName }}</h4>
                  <p>{{ customer.email }}</p>
                  <small>{{ customer.phoneNumber }}</small>
                </div>
                <div class="item-actions">
                  <button mat-icon-button>
                    <mat-icon>more_vert</mat-icon>
                  </button>
                </div>
              </div>
            </div>
            <div class="view-all-link">
              <button mat-button color="primary" (click)="loadCustomers()">
                {{ translationService.instant('admin.actions.viewAll') }}
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>
          </mat-card-content>
        </mat-card>

      </div>

      <!-- System Status Section -->
      <mat-card class="system-status-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>monitor_heart</mat-icon>
            {{ translationService.instant('admin.dashboard.systemStatus') }}
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="status-indicators">
            <div class="status-item">
              <div class="status-dot active"></div>
              <span>{{ translationService.instant('admin.status.apiService') }}</span>
              <mat-icon class="status-icon success">check_circle</mat-icon>
            </div>
            <div class="status-item">
              <div class="status-dot active"></div>
              <span>{{ translationService.instant('admin.status.database') }}</span>
              <mat-icon class="status-icon success">check_circle</mat-icon>
            </div>
            <div class="status-item">
              <div class="status-dot active"></div>
              <span>{{ translationService.instant('admin.status.authentication') }}</span>
              <mat-icon class="status-icon success">check_circle</mat-icon>
            </div>
          </div>
          <div class="last-updated">
            <small>{{ translationService.instant('admin.dashboard.lastUpdated') }}: {{ lastUpdated | date:'medium' }}</small>
          </div>
        </mat-card-content>
      </mat-card>

    </div>
  `,
  styles: [`
    .admin-dashboard-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 32px;
      text-align: center;
    }

    .dashboard-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin: 0 0 8px 0;
      color: #1976d2;
      font-size: 2rem;
      font-weight: 600;
    }

    .dashboard-subtitle {
      color: #666;
      font-size: 1.1rem;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      transition: transform 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .stat-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px !important;
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      border-radius: 12px;
    }

    .users-card .stat-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .customers-card .stat-icon {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
    }

    .policies-card .stat-icon {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
    }

    .revenue-card .stat-icon {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      color: white;
    }

    .stat-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .stat-info {
      flex: 1;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 4px 0;
      color: #333;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #666;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .loading-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card-skeleton {
      height: 120px;
    }

    .stat-card-skeleton mat-card-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      gap: 12px;
    }

    .management-sections {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .management-card {
      min-height: 200px;
    }

    .management-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #1976d2;
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }

    .quick-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      font-weight: 500;
    }

    .recent-items {
      margin-top: 16px;
    }

    .recent-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #eee;
    }

    .recent-item:last-child {
      border-bottom: none;
    }

    .item-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #f5f5f5;
      color: #666;
    }

    .item-info {
      flex: 1;
    }

    .item-info h4 {
      margin: 0 0 4px 0;
      font-size: 0.95rem;
      font-weight: 600;
    }

    .item-info p {
      margin: 0 0 2px 0;
      font-size: 0.85rem;
      color: #666;
    }

    .item-info small {
      color: #999;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .view-all-link {
      margin-top: 16px;
      text-align: right;
    }

    .view-all-link button {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .system-status-card {
      margin-bottom: 32px;
    }

    .system-status-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #1976d2;
    }

    .status-indicators {
      margin-top: 16px;
    }

    .status-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
    }

    .status-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #4caf50;
    }

    .status-dot.inactive {
      background: #f44336;
    }

    .status-icon.success {
      color: #4caf50;
    }

    .status-icon.error {
      color: #f44336;
    }

    .last-updated {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #eee;
      text-align: center;
      color: #999;
    }

    @media (max-width: 768px) {
      .admin-dashboard-container {
        padding: 16px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .management-sections {
        grid-template-columns: 1fr;
      }

      .quick-actions {
        grid-template-columns: 1fr;
      }

      .dashboard-title {
        font-size: 1.5rem;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  dashboardStats: AdminDashboardStats | null = null;
  statsLoading = true;
  recentUsers: User[] = [];
  recentCustomers: any[] = [];
  lastUpdated = new Date();

  constructor(
    private adminService: AdminService,
    public translationService: TranslationService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData(): void {
    this.statsLoading = true;
    this.lastUpdated = new Date();
    
    // Load dashboard statistics
    this.adminService.getDashboardStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.dashboardStats = stats;
          this.statsLoading = false;
        },
        error: (error) => {
          console.error('Error loading dashboard stats:', error);
          this.statsLoading = false;
          this.notificationService.showError(
            'Failed to load dashboard statistics'
          );
        }
      });

    // Load recent users (first 5)
    this.adminService.getAllUsers(0, 5)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.recentUsers = result.content;
        },
        error: (error) => {
          console.error('Error loading recent users:', error);
        }
      });

    // Load recent customers (first 5)
    this.adminService.getAllCustomers(0, 5)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.recentCustomers = result.content;
        },
        error: (error) => {
          console.error('Error loading recent customers:', error);
        }
      });
  }

  refreshDashboard(): void {
    this.notificationService.showInfo('Refreshing dashboard data...');
    this.loadDashboardData();
  }

  loadUsers(): void {
    this.router.navigate(['/admin/users']);
  }

  loadCustomers(): void {
    this.router.navigate(['/admin/customers']);
  }

  loadPolicies(): void {
    this.router.navigate(['/admin/policies']);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
}