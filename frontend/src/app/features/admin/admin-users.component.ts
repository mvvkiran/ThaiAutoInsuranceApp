import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminService, PagedResult } from '../../core/services/admin.service';
import { TranslationService } from '../../core/services/translation.service';
import { NotificationService } from '../../core/services/notification.service';
import { User } from '../../core/models';

@Component({
  selector: 'app-admin-users',
  template: `
    <div class="admin-users-container">
      
      <!-- Header Section -->
      <div class="page-header">
        <h1 class="page-title">
          <mat-icon>people</mat-icon>
          {{ translationService.instant('admin.users.title') }}
        </h1>
        <p class="page-subtitle">
          {{ translationService.instant('admin.users.subtitle') }}
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
                     (keyup.enter)="searchUsers()"
                     [placeholder]="translationService.instant('admin.users.searchPlaceholder')">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
            
            <button mat-raised-button color="primary" (click)="searchUsers()" [disabled]="loading">
              <mat-icon>search</mat-icon>
              {{ translationService.instant('common.search') }}
            </button>
            
            <button mat-raised-button (click)="clearSearch()" [disabled]="loading">
              <mat-icon>clear</mat-icon>
              {{ translationService.instant('common.clear') }}
            </button>
            
            <button mat-raised-button color="accent" (click)="loadUsers()" [disabled]="loading">
              <mat-icon>refresh</mat-icon>
              {{ translationService.instant('common.refresh') }}
            </button>

            <button mat-raised-button color="primary" (click)="addUser()" [disabled]="loading">
              <mat-icon>person_add</mat-icon>
              {{ translationService.instant('admin.users.addUser') }}
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Users Table -->
      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>
            {{ translationService.instant('admin.users.userList') }}
            <span class="user-count" *ngIf="userResult">
              ({{ userResult.totalElements }} {{ translationService.instant('admin.users.total') }})
            </span>
          </mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <!-- Loading State -->
          <div class="loading-container" *ngIf="loading">
            <mat-spinner diameter="40"></mat-spinner>
            <p>{{ translationService.instant('common.loading') }}...</p>
          </div>

          <!-- Users Table -->
          <div class="table-container" *ngIf="!loading && users.length > 0">
            <table mat-table [dataSource]="users" class="users-table">
              
              <!-- ID Column -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>{{ translationService.instant('common.id') }}</th>
                <td mat-cell *matCellDef="let user">{{ user.id }}</td>
              </ng-container>

              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>{{ translationService.instant('common.name') }}</th>
                <td mat-cell *matCellDef="let user">
                  <div class="user-info">
                    <div class="user-avatar">
                      <mat-icon>person</mat-icon>
                    </div>
                    <div class="user-details">
                      <strong>{{ user.firstName }} {{ user.lastName }}</strong>
                      <div class="user-username">{{ '@' + user.username }}</div>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Email Column -->
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>{{ translationService.instant('auth.email') }}</th>
                <td mat-cell *matCellDef="let user">
                  <div class="email-cell">
                    <span>{{ user.email }}</span>
                    <mat-icon class="verified-icon" *ngIf="user.emailVerified" [title]="translationService.instant('admin.users.emailVerified')">verified</mat-icon>
                  </div>
                </td>
              </ng-container>

              <!-- Role Column -->
              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef>{{ translationService.instant('common.role') }}</th>
                <td mat-cell *matCellDef="let user">
                  <mat-chip 
                    [class]="'role-chip role-' + user.role.toLowerCase()">
                    {{ translationService.instant('user.role.' + user.role) }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>{{ translationService.instant('common.status') }}</th>
                <td mat-cell *matCellDef="let user">
                  <div class="status-indicator">
                    <div class="status-dot" [class.active]="user.isActive"></div>
                    <span>{{ user.isActive ? translationService.instant('common.active') : translationService.instant('common.inactive') }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Phone Column -->
              <ng-container matColumnDef="phone">
                <th mat-header-cell *matHeaderCellDef>{{ translationService.instant('auth.phoneNumber') }}</th>
                <td mat-cell *matCellDef="let user">{{ user.phoneNumber || '-' }}</td>
              </ng-container>

              <!-- Created Date Column -->
              <ng-container matColumnDef="created">
                <th mat-header-cell *matHeaderCellDef>{{ translationService.instant('common.created') }}</th>
                <td mat-cell *matCellDef="let user">{{ user.createdAt | date:'medium' }}</td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>{{ translationService.instant('common.actions') }}</th>
                <td mat-cell *matCellDef="let user">
                  <button mat-icon-button [matMenuTriggerFor]="actionMenu" [disabled]="loading">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #actionMenu="matMenu">
                    <button mat-menu-item (click)="viewUser(user)">
                      <mat-icon>visibility</mat-icon>
                      {{ translationService.instant('common.view') }}
                    </button>
                    <button mat-menu-item (click)="editUser(user)">
                      <mat-icon>edit</mat-icon>
                      {{ translationService.instant('common.edit') }}
                    </button>
                    <button mat-menu-item (click)="toggleUserStatus(user)" 
                            [disabled]="user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'">
                      <mat-icon>{{ user.isActive ? 'block' : 'check_circle' }}</mat-icon>
                      {{ user.isActive ? translationService.instant('admin.users.deactivate') : translationService.instant('admin.users.activate') }}
                    </button>
                    <mat-divider></mat-divider>
                    <button mat-menu-item (click)="deleteUser(user)" 
                            [disabled]="user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'"
                            class="delete-action">
                      <mat-icon>delete</mat-icon>
                      {{ translationService.instant('common.delete') }}
                    </button>
                  </mat-menu>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <!-- Empty State -->
          <div class="empty-state" *ngIf="!loading && users.length === 0">
            <mat-icon class="empty-icon">people_outline</mat-icon>
            <h3>{{ translationService.instant('admin.users.noUsers') }}</h3>
            <p>{{ translationService.instant('admin.users.noUsersMessage') }}</p>
            <button mat-raised-button color="primary" (click)="loadUsers()">
              <mat-icon>refresh</mat-icon>
              {{ translationService.instant('common.refresh') }}
            </button>
          </div>

          <!-- Pagination -->
          <mat-paginator 
            *ngIf="userResult && userResult.totalElements > 0"
            [length]="userResult.totalElements"
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
    .admin-users-container {
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

    .table-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-count {
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

    .users-table {
      width: 100%;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #f5f5f5;
      color: #666;
    }

    .user-details strong {
      display: block;
      font-weight: 600;
    }

    .user-username {
      font-size: 0.85rem;
      color: #666;
    }

    .email-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .verified-icon {
      color: #4caf50;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .role-chip {
      font-size: 0.75rem;
      font-weight: 500;
    }

    .role-chip.role-admin {
      background: #f44336;
      color: white;
    }

    .role-chip.role-super_admin {
      background: #9c27b0;
      color: white;
    }

    .role-chip.role-agent {
      background: #ff9800;
      color: white;
    }

    .role-chip.role-customer {
      background: #4caf50;
      color: white;
    }

    .role-chip.role-underwriter {
      background: #2196f3;
      color: white;
    }

    .role-chip.role-claims_adjuster {
      background: #607d8b;
      color: white;
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

    .delete-action {
      color: #f44336 !important;
    }

    .delete-action .mat-icon {
      color: #f44336 !important;
    }

    @media (max-width: 768px) {
      .admin-users-container {
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
export class AdminUsersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  users: User[] = [];
  userResult: PagedResult<User> | null = null;
  loading = false;
  searchQuery = '';
  
  currentPage = 0;
  pageSize = 20;
  
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'status', 'phone', 'created', 'actions'];

  constructor(
    private adminService: AdminService,
    public translationService: TranslationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers(): void {
    this.loading = true;
    
    this.adminService.getAllUsers(this.currentPage, this.pageSize, 'createdAt', 'desc')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.userResult = result;
          this.users = result.content;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.loading = false;
          this.notificationService.showError('Failed to load users');
        }
      });
  }

  searchUsers(): void {
    if (!this.searchQuery.trim()) {
      this.loadUsers();
      return;
    }

    this.loading = true;
    this.currentPage = 0;
    
    this.adminService.searchUsers(this.searchQuery.trim(), this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.userResult = result;
          this.users = result.content;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error searching users:', error);
          this.loading = false;
          this.notificationService.showError('Failed to search users');
        }
      });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.currentPage = 0;
    this.loadUsers();
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    
    if (this.searchQuery.trim()) {
      this.searchUsers();
    } else {
      this.loadUsers();
    }
  }

  addUser(): void {
    // TODO: Open add user dialog
    this.notificationService.showInfo('Add user functionality will be implemented soon');
  }

  viewUser(user: User): void {
    this.adminService.getUserById(user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (detailedUser) => {
          // TODO: Open user detail dialog with detailedUser
          this.notificationService.showInfo(`Viewing user: ${detailedUser.firstName} ${detailedUser.lastName}`);
        },
        error: (error) => {
          console.error('Error loading user details:', error);
          this.notificationService.showError('Failed to load user details');
        }
      });
  }

  editUser(user: User): void {
    // TODO: Open edit user dialog
    this.notificationService.showInfo(`Edit user functionality will be implemented soon for: ${user.firstName} ${user.lastName}`);
  }

  deleteUser(user: User): void {
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      this.notificationService.showError('Cannot delete admin users');
      return;
    }

    if (confirm(`Are you sure you want to delete user ${user.firstName} ${user.lastName}? This action cannot be undone.`)) {
      this.adminService.deleteUser(user.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notificationService.showSuccess('User deleted successfully');
            this.loadUsers(); // Reload the user list
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            this.notificationService.showError('Failed to delete user');
          }
        });
    }
  }

  toggleUserStatus(user: User): void {
    if ((user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && user.isActive) {
      this.notificationService.showError('Cannot deactivate admin users');
      return;
    }

    const action = user.isActive ? 'deactivate' : 'activate';
    if (confirm(`Are you sure you want to ${action} user ${user.firstName} ${user.lastName}?`)) {
      this.adminService.toggleUserStatus(user.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedUser) => {
            this.notificationService.showSuccess(`User ${action}d successfully`);
            // Update the user in the current list
            const index = this.users.findIndex(u => u.id === updatedUser.id);
            if (index >= 0) {
              this.users[index] = updatedUser;
            }
          },
          error: (error) => {
            console.error('Error toggling user status:', error);
            this.notificationService.showError(`Failed to ${action} user`);
          }
        });
    }
  }
}