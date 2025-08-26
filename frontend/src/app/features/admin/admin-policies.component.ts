import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminService, PagedResult } from '../../core/services/admin.service';
import { TranslationService } from '../../core/services/translation.service';
import { NotificationService } from '../../core/services/notification.service';

export interface Policy {
  id: string;
  policyNumber: string;
  customerName: string;
  customerEmail: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  licensePlate: string;
  coverageType: string;
  premium: number;
  status: string;
  effectiveDate: Date;
  expirationDate: Date;
  createdAt: Date;
}

@Component({
  selector: 'app-admin-policies',
  template: `
    <div class="admin-policies-container">
      
      <!-- Header Section -->
      <div class="page-header">
        <h1 class="page-title">
          <mat-icon>description</mat-icon>
          {{ translationService.instant('admin.policies.title') }}
        </h1>
        <p class="page-subtitle">
          {{ translationService.instant('admin.policies.subtitle') }}
        </p>
      </div>

      <!-- Search and Filter Bar -->
      <mat-card class="search-card">
        <mat-card-content>
          <div class="search-controls">
            <mat-form-field class="search-field" appearance="outline">
              <mat-label>{{ translationService.instant('common.search') }}</mat-label>
              <input matInput 
                     [(ngModel)]="searchQuery" 
                     (keyup.enter)="searchPolicies()"
                     [placeholder]="translationService.instant('admin.policies.searchPlaceholder')">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ translationService.instant('policy.status') }}</mat-label>
              <mat-select [(value)]="statusFilter" (selectionChange)="applyFilters()">
                <mat-option value="">{{ translationService.instant('common.all') }}</mat-option>
                <mat-option value="ACTIVE">{{ translationService.instant('policy.status.ACTIVE') }}</mat-option>
                <mat-option value="PENDING_PAYMENT">{{ translationService.instant('policy.status.PENDING_PAYMENT') }}</mat-option>
                <mat-option value="EXPIRED">{{ translationService.instant('policy.status.EXPIRED') }}</mat-option>
                <mat-option value="CANCELLED">{{ translationService.instant('policy.status.CANCELLED') }}</mat-option>
              </mat-select>
            </mat-form-field>
            
            <button mat-raised-button color="primary" (click)="searchPolicies()" [disabled]="loading">
              <mat-icon>search</mat-icon>
              {{ translationService.instant('common.search') }}
            </button>
            
            <button mat-raised-button (click)="clearSearch()" [disabled]="loading">
              <mat-icon>clear</mat-icon>
              {{ translationService.instant('common.clear') }}
            </button>
            
            <button mat-raised-button color="accent" (click)="loadPolicies()" [disabled]="loading">
              <mat-icon>refresh</mat-icon>
              {{ translationService.instant('common.refresh') }}
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Summary Cards -->
      <div class="summary-cards" *ngIf="policyResult">
        <mat-card class="summary-card total-card">
          <mat-card-content>
            <div class="summary-content">
              <mat-icon class="summary-icon">description</mat-icon>
              <div class="summary-info">
                <h3>{{ policyResult.totalElements }}</h3>
                <p>{{ translationService.instant('admin.policies.totalPolicies') }}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card active-card">
          <mat-card-content>
            <div class="summary-content">
              <mat-icon class="summary-icon">verified</mat-icon>
              <div class="summary-info">
                <h3>{{ getActivePoliciesCount() }}</h3>
                <p>{{ translationService.instant('admin.policies.activePolicies') }}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card revenue-card">
          <mat-card-content>
            <div class="summary-content">
              <mat-icon class="summary-icon">attach_money</mat-icon>
              <div class="summary-info">
                <h3>{{ formatCurrency(getTotalPremium()) }}</h3>
                <p>{{ translationService.instant('admin.policies.totalPremium') }}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Policies Table -->
      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>
            {{ translationService.instant('admin.policies.policyList') }}
            <span class="policy-count" *ngIf="policyResult">
              ({{ policyResult.totalElements }} {{ translationService.instant('admin.policies.total') }})
            </span>
          </mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <!-- Loading State -->
          <div class="loading-container" *ngIf="loading">
            <mat-spinner diameter="40"></mat-spinner>
            <p>{{ translationService.instant('common.loading') }}...</p>
          </div>

          <!-- Policies Table -->
          <div class="table-container" *ngIf="!loading && policies.length > 0">
            <table mat-table [dataSource]="policies" class="policies-table">
              
              <!-- Policy Number Column -->
              <ng-container matColumnDef="policyNumber">
                <th mat-header-cell *matHeaderCellDef>{{ translationService.instant('policy.policyNumber') }}</th>
                <td mat-cell *matCellDef="let policy">
                  <div class="policy-number">
                    <strong>{{ policy.policyNumber }}</strong>
                  </div>
                </td>
              </ng-container>

              <!-- Customer Column -->
              <ng-container matColumnDef="customer">
                <th mat-header-cell *matHeaderCellDef>{{ translationService.instant('admin.policies.customer') }}</th>
                <td mat-cell *matCellDef="let policy">
                  <div class="customer-info">
                    <div class="customer-avatar">
                      <mat-icon>person</mat-icon>
                    </div>
                    <div class="customer-details">
                      <strong>{{ policy.customerName }}</strong>
                      <div class="customer-email">{{ policy.customerEmail }}</div>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Vehicle Column -->
              <ng-container matColumnDef="vehicle">
                <th mat-header-cell *matHeaderCellDef>{{ translationService.instant('vehicle.vehicle') }}</th>
                <td mat-cell *matCellDef="let policy">
                  <div class="vehicle-info">
                    <div class="vehicle-details">
                      <strong>{{ policy.vehicleMake }} {{ policy.vehicleModel }}</strong>
                      <div class="vehicle-meta">{{ policy.vehicleYear }} • {{ policy.licensePlate }}</div>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Coverage Column -->
              <ng-container matColumnDef="coverage">
                <th mat-header-cell *matHeaderCellDef>{{ translationService.instant('policy.coverageType') }}</th>
                <td mat-cell *matCellDef="let policy">
                  <mat-chip class="coverage-chip">
                    {{ translationService.instant('policy.coverageTypes.' + policy.coverageType) }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Premium Column -->
              <ng-container matColumnDef="premium">
                <th mat-header-cell *matHeaderCellDef>{{ translationService.instant('policy.premium') }}</th>
                <td mat-cell *matCellDef="let policy">
                  <div class="premium-amount">
                    {{ formatCurrency(policy.premium) }}
                  </div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>{{ translationService.instant('policy.status') }}</th>
                <td mat-cell *matCellDef="let policy">
                  <mat-chip 
                    [class]="'status-chip status-' + policy.status.toLowerCase()">
                    {{ translationService.instant('policy.status.' + policy.status) }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Dates Column -->
              <ng-container matColumnDef="dates">
                <th mat-header-cell *matHeaderCellDef>{{ translationService.instant('admin.policies.coverage') }}</th>
                <td mat-cell *matCellDef="let policy">
                  <div class="date-range">
                    <div class="date-item">
                      <small>{{ translationService.instant('policy.effectiveDate') }}</small>
                      <div>{{ policy.effectiveDate | date:'shortDate' }}</div>
                    </div>
                    <div class="date-separator">→</div>
                    <div class="date-item">
                      <small>{{ translationService.instant('policy.expirationDate') }}</small>
                      <div>{{ policy.expirationDate | date:'shortDate' }}</div>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>{{ translationService.instant('common.actions') }}</th>
                <td mat-cell *matCellDef="let policy">
                  <button mat-icon-button [matMenuTriggerFor]="actionMenu" [disabled]="loading">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #actionMenu="matMenu">
                    <button mat-menu-item (click)="viewPolicy(policy)">
                      <mat-icon>visibility</mat-icon>
                      {{ translationService.instant('common.view') }}
                    </button>
                    <button mat-menu-item (click)="downloadPolicy(policy)">
                      <mat-icon>download</mat-icon>
                      {{ translationService.instant('admin.policies.download') }}
                    </button>
                    <button mat-menu-item (click)="viewClaims(policy)">
                      <mat-icon>assignment</mat-icon>
                      {{ translationService.instant('admin.policies.viewClaims') }}
                    </button>
                    <button mat-menu-item (click)="renewPolicy(policy)" 
                            *ngIf="policy.status === 'EXPIRED'">
                      <mat-icon>refresh</mat-icon>
                      {{ translationService.instant('admin.policies.renew') }}
                    </button>
                    <button mat-menu-item (click)="cancelPolicy(policy)" 
                            *ngIf="policy.status === 'ACTIVE'">
                      <mat-icon>cancel</mat-icon>
                      {{ translationService.instant('admin.policies.cancel') }}
                    </button>
                  </mat-menu>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <!-- Empty State -->
          <div class="empty-state" *ngIf="!loading && policies.length === 0">
            <mat-icon class="empty-icon">description_outlined</mat-icon>
            <h3>{{ translationService.instant('admin.policies.noPolicies') }}</h3>
            <p>{{ translationService.instant('admin.policies.noPoliciesMessage') }}</p>
            <button mat-raised-button color="primary" (click)="loadPolicies()">
              <mat-icon>refresh</mat-icon>
              {{ translationService.instant('common.refresh') }}
            </button>
          </div>

          <!-- Pagination -->
          <mat-paginator 
            *ngIf="policyResult && policyResult.totalElements > 0"
            [length]="policyResult.totalElements"
            [pageSize]="pageSize"
            [pageIndex]="currentPage"
            [pageSizeOptions]="[10, 20, 50, 100]"
            (page)="onPageChange($event)"
            [disabled]="loading">
          </mat-paginator>
        </mat-card-content>
      </mat-card>

    </div>
  `,
  styles: [`
    .admin-policies-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 24px;
    }

    .page-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0 0 8px 0;
      color: #1976d2;
      font-size: 1.75rem;
      font-weight: 600;
    }

    .page-subtitle {
      color: #666;
      margin: 0;
    }

    .search-card {
      margin-bottom: 24px;
    }

    .search-controls {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-field {
      flex: 1;
      min-width: 250px;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .summary-card {
      color: white;
    }

    .summary-card.total-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .summary-card.active-card {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .summary-card.revenue-card {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }

    .summary-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .summary-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      opacity: 0.8;
    }

    .summary-info h3 {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 700;
    }

    .summary-info p {
      margin: 4px 0 0 0;
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .table-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .policy-count {
      font-size: 0.9rem;
      color: #666;
      font-weight: normal;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
      gap: 16px;
    }

    .table-container {
      width: 100%;
      overflow-x: auto;
    }

    .policies-table {
      width: 100%;
    }

    .policy-number strong {
      color: #1976d2;
      font-weight: 600;
    }

    .customer-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .customer-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #f5f5f5;
      color: #666;
    }

    .customer-details strong {
      display: block;
      font-weight: 600;
    }

    .customer-email {
      font-size: 0.85rem;
      color: #666;
    }

    .vehicle-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .vehicle-details strong {
      display: block;
      font-weight: 600;
    }

    .vehicle-meta {
      font-size: 0.85rem;
      color: #666;
    }

    .coverage-chip {
      background: #2196f3;
      color: white;
      font-size: 0.75rem;
    }

    .premium-amount {
      font-weight: 600;
      color: #4caf50;
    }

    .status-chip {
      font-size: 0.75rem;
      font-weight: 500;
    }

    .status-chip.status-active {
      background: #4caf50;
      color: white;
    }

    .status-chip.status-pending_payment {
      background: #ff9800;
      color: white;
    }

    .status-chip.status-expired {
      background: #f44336;
      color: white;
    }

    .status-chip.status-cancelled {
      background: #9e9e9e;
      color: white;
    }

    .status-chip.status-draft {
      background: #607d8b;
      color: white;
    }

    .date-range {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
    }

    .date-item {
      text-align: center;
    }

    .date-item small {
      display: block;
      color: #666;
      font-size: 0.75rem;
    }

    .date-separator {
      color: #666;
      font-weight: bold;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ddd;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .empty-state p {
      margin: 0 0 24px 0;
    }

    @media (max-width: 768px) {
      .admin-policies-container {
        padding: 16px;
      }

      .search-controls {
        flex-direction: column;
        align-items: stretch;
      }

      .search-field {
        min-width: unset;
      }

      .page-title {
        font-size: 1.5rem;
      }

      .date-range {
        flex-direction: column;
        gap: 4px;
      }

      .date-separator {
        transform: rotate(90deg);
      }
    }
  `]
})
export class AdminPoliciesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  policies: Policy[] = [];
  policyResult: PagedResult<Policy> | null = null;
  loading = false;
  searchQuery = '';
  statusFilter = '';
  
  currentPage = 0;
  pageSize = 20;
  
  displayedColumns: string[] = ['policyNumber', 'customer', 'vehicle', 'coverage', 'premium', 'status', 'dates', 'actions'];

  constructor(
    private adminService: AdminService,
    public translationService: TranslationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadPolicies();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPolicies(): void {
    this.loading = true;
    
    this.adminService.getAllPolicies(this.currentPage, this.pageSize, 'createdAt', 'desc')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.policyResult = result;
          this.policies = result.content;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading policies:', error);
          this.loading = false;
          this.notificationService.showError('Failed to load policies');
        }
      });
  }

  searchPolicies(): void {
    if (!this.searchQuery.trim() && !this.statusFilter) {
      this.loadPolicies();
      return;
    }

    this.loading = true;
    this.currentPage = 0;
    
    // For now, use simple search - can be enhanced with backend filters
    this.adminService.getAllPolicies(this.currentPage, this.pageSize, 'createdAt', 'desc')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.policyResult = result;
          let filteredPolicies = result.content;
          
          // Client-side filtering (should be moved to backend in production)
          if (this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase();
            filteredPolicies = filteredPolicies.filter(policy => 
              policy.policyNumber.toLowerCase().includes(query) ||
              policy.customerName.toLowerCase().includes(query) ||
              policy.customerEmail.toLowerCase().includes(query) ||
              policy.licensePlate.toLowerCase().includes(query)
            );
          }
          
          if (this.statusFilter) {
            filteredPolicies = filteredPolicies.filter(policy => 
              policy.status === this.statusFilter
            );
          }
          
          this.policies = filteredPolicies;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error searching policies:', error);
          this.loading = false;
          this.notificationService.showError('Failed to search policies');
        }
      });
  }

  applyFilters(): void {
    this.searchPolicies();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.statusFilter = '';
    this.currentPage = 0;
    this.loadPolicies();
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPolicies();
  }

  getActivePoliciesCount(): number {
    return this.policies.filter(policy => policy.status === 'ACTIVE').length;
  }

  getTotalPremium(): number {
    return this.policies.reduce((total, policy) => total + (policy.premium || 0), 0);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  viewPolicy(policy: Policy): void {
    this.notificationService.showInfo(`Viewing policy: ${policy.policyNumber}`);
    // TODO: Implement policy detail view
  }

  downloadPolicy(policy: Policy): void {
    this.notificationService.showInfo(`Downloading policy: ${policy.policyNumber}`);
    // TODO: Implement policy download
  }

  viewClaims(policy: Policy): void {
    this.notificationService.showInfo(`Viewing claims for policy: ${policy.policyNumber}`);
    // TODO: Implement policy claims view
  }

  renewPolicy(policy: Policy): void {
    this.notificationService.showInfo(`Renewing policy: ${policy.policyNumber}`);
    // TODO: Implement policy renewal
  }

  cancelPolicy(policy: Policy): void {
    this.notificationService.showInfo(`Cancelling policy: ${policy.policyNumber}`);
    // TODO: Implement policy cancellation
  }
}