import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PolicyService, Policy } from './policy.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-policy-list',
  template: `
    <div class="policy-container">
      <div class="page-header">
        <h1>Policy Management</h1>
        <div class="header-actions">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search policies...</mat-label>
            <input matInput 
                   [(ngModel)]="searchTerm" 
                   (ngModelChange)="onSearch()"
                   placeholder="Policy number, license plate, or vehicle">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          <button mat-raised-button 
                  color="primary" 
                  routerLink="/policies/new">
            <mat-icon>add</mat-icon>
            New Policy
          </button>
        </div>
      </div>

      <mat-card class="policies-card">
        <mat-card-content>
          <div class="stats-row">
            <div class="stat-item">
              <span class="stat-number">{{ getActivePolicies() }}</span>
              <span class="stat-label">Active Policies</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ getPendingPolicies() }}</span>
              <span class="stat-label">Pending</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ getExpiringPolicies() }}</span>
              <span class="stat-label">Expiring Soon</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">฿{{ getTotalPremiums().toLocaleString() }}</span>
              <span class="stat-label">Total Premium</span>
            </div>
          </div>

          <div class="table-container" *ngIf="filteredPolicies.length > 0">
            <table mat-table [dataSource]="filteredPolicies" class="policies-table">
              
              <ng-container matColumnDef="policyNumber">
                <th mat-header-cell *matHeaderCellDef>Policy Number</th>
                <td mat-cell *matCellDef="let policy">
                  <div class="policy-info">
                    <strong>{{ policy.policyNumber }}</strong>
                    <small>{{ policy.holderName }}</small>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="vehicle">
                <th mat-header-cell *matHeaderCellDef>Vehicle</th>
                <td mat-cell *matCellDef="let policy">
                  <div class="vehicle-info">
                    <strong>{{ policy.licensePlate }}</strong>
                    <small>{{ policy.year }} {{ policy.vehicleMake }} {{ policy.vehicleModel }}</small>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="coverage">
                <th mat-header-cell *matHeaderCellDef>Coverage</th>
                <td mat-cell *matCellDef="let policy">
                  <div class="coverage-info">
                    <strong>{{ policy.coverageType }}</strong>
                    <small>฿{{ policy.coverageAmount.toLocaleString() }}</small>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="premium">
                <th mat-header-cell *matHeaderCellDef>Premium</th>
                <td mat-cell *matCellDef="let policy">
                  <strong>฿{{ policy.premium.toLocaleString() }}</strong>
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let policy">
                  <mat-chip [class]="'status-' + policy.status.toLowerCase()">
                    {{ policy.status }}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="period">
                <th mat-header-cell *matHeaderCellDef>Policy Period</th>
                <td mat-cell *matCellDef="let policy">
                  <div class="period-info">
                    <small>{{ policy.startDate | date:'dd/MM/yyyy' }}</small>
                    <small>{{ policy.endDate | date:'dd/MM/yyyy' }}</small>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let policy">
                  <button mat-icon-button [matMenuTriggerFor]="menu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu">
                    <button mat-menu-item (click)="viewPolicy(policy)">
                      <mat-icon>visibility</mat-icon>
                      View Details
                    </button>
                    <button mat-menu-item (click)="editPolicy(policy)">
                      <mat-icon>edit</mat-icon>
                      Edit Policy
                    </button>
                    <button mat-menu-item (click)="renewPolicy(policy)" *ngIf="policy.status === 'ACTIVE'">
                      <mat-icon>refresh</mat-icon>
                      Renew Policy
                    </button>
                    <button mat-menu-item (click)="cancelPolicy(policy)" *ngIf="policy.status === 'ACTIVE'">
                      <mat-icon>cancel</mat-icon>
                      Cancel Policy
                    </button>
                  </mat-menu>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <div class="empty-state" *ngIf="filteredPolicies.length === 0">
            <mat-icon class="empty-icon">policy</mat-icon>
            <h3>No policies found</h3>
            <p *ngIf="searchTerm">No policies match your search criteria.</p>
            <p *ngIf="!searchTerm">You haven't created any policies yet.</p>
            <button mat-raised-button color="primary" routerLink="/policies/new">
              Create Your First Policy
            </button>
          </div>

        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .policy-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    
    .page-header h1 {
      margin: 0;
      color: #333;
    }
    
    .header-actions {
      display: flex;
      gap: 16px;
      align-items: center;
    }
    
    .search-field {
      width: 300px;
    }
    
    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .stat-item {
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .stat-number {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1976d2;
    }
    
    .stat-label {
      font-size: 0.875rem;
      color: #666;
    }
    
    .table-container {
      margin-top: 24px;
      overflow-x: auto;
    }
    
    .policies-table {
      width: 100%;
    }
    
    .policy-info, .vehicle-info, .coverage-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    
    .policy-info strong, .vehicle-info strong, .coverage-info strong {
      font-weight: 500;
    }
    
    .policy-info small, .vehicle-info small, .coverage-info small {
      color: #666;
      font-size: 0.75rem;
    }
    
    .period-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 0.75rem;
    }
    
    .status-active {
      background-color: #4caf50;
      color: white;
    }
    
    .status-pending {
      background-color: #ff9800;
      color: white;
    }
    
    .status-expired {
      background-color: #f44336;
      color: white;
    }
    
    .status-cancelled {
      background-color: #757575;
      color: white;
    }
    
    .empty-state {
      text-align: center;
      padding: 48px 24px;
      color: #666;
    }
    
    .empty-icon {
      font-size: 48px;
      color: #ccc;
      margin-bottom: 16px;
    }
    
    .empty-state h3 {
      margin: 16px 0 8px;
      color: #333;
    }
    
    .empty-state p {
      margin-bottom: 24px;
    }
    
    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }
      
      .header-actions {
        flex-direction: column;
      }
      
      .search-field {
        width: 100%;
      }
      
      .stats-row {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class PolicyListComponent implements OnInit, OnDestroy {
  policies: Policy[] = [];
  filteredPolicies: Policy[] = [];
  searchTerm = '';
  displayedColumns: string[] = ['policyNumber', 'vehicle', 'coverage', 'premium', 'status', 'period', 'actions'];
  private subscription: Subscription = new Subscription();

  constructor(
    private policyService: PolicyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to policy changes
    this.subscription.add(
      this.policyService.getPolicies().subscribe(policies => {
        this.policies = policies;
        this.applyFilter();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSearch(): void {
    this.applyFilter();
  }

  private applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredPolicies = [...this.policies];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredPolicies = this.policies.filter(policy =>
      policy.policyNumber.toLowerCase().includes(term) ||
      policy.licensePlate.toLowerCase().includes(term) ||
      policy.vehicleMake.toLowerCase().includes(term) ||
      policy.vehicleModel.toLowerCase().includes(term) ||
      policy.holderName.toLowerCase().includes(term)
    );
  }

  getActivePolicies(): number {
    return this.policies.filter(p => p.status === 'ACTIVE').length;
  }

  getPendingPolicies(): number {
    return this.policies.filter(p => p.status === 'PENDING').length;
  }

  getExpiringPolicies(): number {
    const twoMonthsFromNow = new Date();
    twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);
    return this.policies.filter(p => p.status === 'ACTIVE' && p.endDate <= twoMonthsFromNow).length;
  }

  getTotalPremiums(): number {
    return this.policies
      .filter(p => p.status === 'ACTIVE')
      .reduce((total, p) => total + p.premium, 0);
  }

  viewPolicy(policy: Policy): void {
    this.router.navigate(['/policies', policy.id]);
  }

  editPolicy(policy: Policy): void {
    this.router.navigate(['/policies/edit', policy.id]);
  }

  renewPolicy(policy: Policy): void {
    console.log('Renew policy:', policy);
    // Handle policy renewal
  }

  cancelPolicy(policy: Policy): void {
    console.log('Cancel policy:', policy);
    // Handle policy cancellation
  }
}