import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminService, PagedResult } from '../../core/services/admin.service';
import { TranslationService } from '../../core/services/translation.service';
import { NotificationService } from '../../core/services/notification.service';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  dateOfBirth?: Date;
  isActive: boolean;
  createdAt?: Date;
  totalPolicies?: number;
  activePolicies?: number;
}

@Component({
  selector: 'app-admin-customers',
  template: `
    <div class="admin-customers-container">
      
      <!-- Header Section -->
      <div class="page-header">
        <h1 class="page-title">
          <mat-icon>person</mat-icon>
          {{ translationService.instant('admin.customers.title') }}
        </h1>
        <p class="page-subtitle">
          {{ translationService.instant('admin.customers.subtitle') }}
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
                     (keyup.enter)="searchCustomers()"
                     [placeholder]="translationService.instant('admin.customers.searchPlaceholder')">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
            
            <button mat-raised-button color="primary" (click)="searchCustomers()" [disabled]="loading">
              <mat-icon>search</mat-icon>
              {{ translationService.instant('common.search') }}
            </button>
            
            <button mat-raised-button (click)="clearSearch()" [disabled]="loading">
              <mat-icon>clear</mat-icon>
              {{ translationService.instant('common.clear') }}
            </button>
            
            <button mat-raised-button color="accent" (click)="loadCustomers()" [disabled]="loading">
              <mat-icon>refresh</mat-icon>
              {{ translationService.instant('common.refresh') }}
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Summary Cards -->
      <div class="summary-cards" *ngIf="customerResult">
        <mat-card class="summary-card">
          <mat-card-content>
            <div class="summary-content">
              <mat-icon class="summary-icon">people</mat-icon>
              <div class="summary-info">
                <h3>{{ customerResult.totalElements }}</h3>
                <p>{{ translationService.instant('admin.customers.totalCustomers') }}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Customers Table -->
      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>
            {{ translationService.instant('admin.customers.customerList') }}
            <span class="customer-count" *ngIf="customerResult">
              ({{ customerResult.totalElements }} {{ translationService.instant('admin.customers.total') }})
            </span>
          </mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <!-- Loading State -->
          <div class="loading-container" *ngIf="loading">
            <mat-spinner diameter="40"></mat-spinner>
            <p>{{ translationService.instant('common.loading') }}...</p>
          </div>

          <!-- Customers Table -->
          <div class="table-container" *ngIf="!loading && customers.length > 0">
            <table mat-table [dataSource]="customers" class="customers-table">
              
              <!-- ID Column -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>{{ translationService.instant('common.id') }}</th>
                <td mat-cell *matCellDef="let customer">{{ customer.id }}</td>
              </ng-container>

              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>{{ translationService.instant('common.name') }}</th>
                <td mat-cell *matCellDef="let customer">
                  <div class="customer-info">
                    <div class="customer-avatar">
                      <mat-icon>person</mat-icon>
                    </div>
                    <div class="customer-details">
                      <strong>{{ customer.firstName }} {{ customer.lastName }}</strong>
                      <div class="customer-id">{{ customer.nationalId }}</div>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Contact Column -->
              <ng-container matColumnDef="contact">
                <th mat-header-cell *matHeaderCellDef>{{ translationService.instant('admin.customers.contact') }}</th>
                <td mat-cell *matCellDef="let customer">
                  <div class="contact-info">
                    <div class="contact-item">
                      <mat-icon class="contact-icon">email</mat-icon>
                      <span>{{ customer.email }}</span>
                    </div>
                    <div class="contact-item" *ngIf="customer.phoneNumber">
                      <mat-icon class="contact-icon">phone</mat-icon>
                      <span>{{ customer.phoneNumber }}</span>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Age Column -->
              <ng-container matColumnDef="age">
                <th mat-header-cell *matHeaderCellDef>{{ translationService.instant('admin.customers.age') }}</th>
                <td mat-cell *matCellDef="let customer">
                  {{ customer.dateOfBirth ? getAge(customer.dateOfBirth) : '-' }}
                </td>
              </ng-container>

              <!-- Policies Column -->
              <ng-container matColumnDef="policies">
                <th mat-header-cell *matHeaderCellDef>{{ translationService.instant('admin.customers.policies') }}</th>
                <td mat-cell *matCellDef="let customer">
                  <div class="policy-stats">
                    <mat-chip class="policy-chip active-policies">
                      {{ customer.activePolicies || 0 }} {{ translationService.instant('admin.customers.active') }}
                    </mat-chip>
                    <div class="total-policies">
                      {{ translationService.instant('admin.customers.totalOf') }} {{ customer.totalPolicies || 0 }}
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>{{ translationService.instant('common.status') }}</th>
                <td mat-cell *matCellDef="let customer">
                  <div class="status-indicator">
                    <div class="status-dot" [class.active]="customer.isActive"></div>
                    <span>{{ customer.isActive ? translationService.instant('common.active') : translationService.instant('common.inactive') }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Created Date Column -->
              <ng-container matColumnDef="created">
                <th mat-header-cell *matHeaderCellDef>{{ translationService.instant('common.created') }}</th>
                <td mat-cell *matCellDef="let customer">{{ customer.createdAt | date:'medium' }}</td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>{{ translationService.instant('common.actions') }}</th>
                <td mat-cell *matCellDef="let customer">
                  <button mat-icon-button [matMenuTriggerFor]="actionMenu" [disabled]="loading">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #actionMenu="matMenu">
                    <button mat-menu-item (click)="viewCustomer(customer)">
                      <mat-icon>visibility</mat-icon>
                      {{ translationService.instant('common.view') }}
                    </button>
                    <button mat-menu-item (click)="viewPolicies(customer)">
                      <mat-icon>description</mat-icon>
                      {{ translationService.instant('admin.customers.viewPolicies') }}
                    </button>
                    <button mat-menu-item (click)="viewClaims(customer)">
                      <mat-icon>assignment</mat-icon>
                      {{ translationService.instant('admin.customers.viewClaims') }}
                    </button>
                    <button mat-menu-item (click)="contactCustomer(customer)">
                      <mat-icon>contact_mail</mat-icon>
                      {{ translationService.instant('admin.customers.contact') }}
                    </button>
                  </mat-menu>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <!-- Empty State -->
          <div class="empty-state" *ngIf="!loading && customers.length === 0">
            <mat-icon class="empty-icon">person_outline</mat-icon>
            <h3>{{ translationService.instant('admin.customers.noCustomers') }}</h3>
            <p>{{ translationService.instant('admin.customers.noCustomersMessage') }}</p>
            <button mat-raised-button color="primary" (click)="loadCustomers()">
              <mat-icon>refresh</mat-icon>
              {{ translationService.instant('common.refresh') }}
            </button>
          </div>

          <!-- Pagination -->
          <mat-paginator 
            *ngIf="customerResult && customerResult.totalElements > 0"
            [length]="customerResult.totalElements"
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
    .admin-customers-container {
      padding: 24px;
      max-width: 1200px;
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
      min-width: 300px;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .summary-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
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
      font-size: 2rem;
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

    .customer-count {
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

    .customers-table {
      width: 100%;
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
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #f5f5f5;
      color: #666;
    }

    .customer-details strong {
      display: block;
      font-weight: 600;
    }

    .customer-id {
      font-size: 0.85rem;
      color: #666;
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
    }

    .contact-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #666;
    }

    .policy-stats {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .policy-chip {
      font-size: 0.75rem;
      height: 24px;
    }

    .policy-chip.active-policies {
      background: #4caf50;
      color: white;
    }

    .total-policies {
      font-size: 0.8rem;
      color: #666;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #f44336;
    }

    .status-dot.active {
      background: #4caf50;
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
      .admin-customers-container {
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
    }
  `]
})
export class AdminCustomersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  customers: Customer[] = [];
  customerResult: PagedResult<Customer> | null = null;
  loading = false;
  searchQuery = '';
  
  currentPage = 0;
  pageSize = 20;
  
  displayedColumns: string[] = ['id', 'name', 'contact', 'age', 'policies', 'status', 'created', 'actions'];

  constructor(
    private adminService: AdminService,
    public translationService: TranslationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCustomers(): void {
    this.loading = true;
    
    this.adminService.getAllCustomers(this.currentPage, this.pageSize, 'createdAt', 'desc')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.customerResult = result;
          this.customers = result.content;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading customers:', error);
          this.loading = false;
          this.notificationService.showError('Failed to load customers');
        }
      });
  }

  searchCustomers(): void {
    if (!this.searchQuery.trim()) {
      this.loadCustomers();
      return;
    }

    this.loading = true;
    this.currentPage = 0;
    
    this.adminService.searchCustomers(this.searchQuery.trim(), this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.customerResult = result;
          this.customers = result.content;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error searching customers:', error);
          this.loading = false;
          this.notificationService.showError('Failed to search customers');
        }
      });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.currentPage = 0;
    this.loadCustomers();
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    
    if (this.searchQuery.trim()) {
      this.searchCustomers();
    } else {
      this.loadCustomers();
    }
  }

  getAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  viewCustomer(customer: Customer): void {
    this.notificationService.showInfo(`Viewing customer: ${customer.firstName} ${customer.lastName}`);
    // TODO: Implement customer detail view
  }

  viewPolicies(customer: Customer): void {
    this.notificationService.showInfo(`Viewing policies for: ${customer.firstName} ${customer.lastName}`);
    // TODO: Implement customer policies view
  }

  viewClaims(customer: Customer): void {
    this.notificationService.showInfo(`Viewing claims for: ${customer.firstName} ${customer.lastName}`);
    // TODO: Implement customer claims view
  }

  contactCustomer(customer: Customer): void {
    this.notificationService.showInfo(`Contacting customer: ${customer.firstName} ${customer.lastName}`);
    // TODO: Implement customer contact functionality
  }
}