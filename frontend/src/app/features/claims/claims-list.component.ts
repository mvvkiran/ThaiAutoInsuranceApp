import { Component, OnInit } from '@angular/core';

export interface Claim {
  id: string;
  claimNumber: string;
  policyNumber: string;
  incidentDate: Date;
  incidentType: string;
  location: string;
  description: string;
  damageAmount: number;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'PAID';
  submittedDate: Date;
  claimantName: string;
  vehiclePlate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

@Component({
  selector: 'app-claims-list',
  template: `
    <div class="claims-container">
      <div class="page-header">
        <h1>Claims Management</h1>
        <div class="header-actions">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search claims...</mat-label>
            <input matInput 
                   [(ngModel)]="searchTerm" 
                   (ngModelChange)="onSearch()"
                   placeholder="Claim number, policy, or vehicle plate">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          <button mat-raised-button 
                  color="primary" 
                  routerLink="/claims/new">
            <mat-icon>add</mat-icon>
            New Claim
          </button>
        </div>
      </div>

      <mat-card class="claims-card">
        <mat-card-content>
          <div class="stats-row">
            <div class="stat-item">
              <span class="stat-number">{{ getSubmittedClaims() }}</span>
              <span class="stat-label">Submitted</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ getUnderReviewClaims() }}</span>
              <span class="stat-label">Under Review</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ getApprovedClaims() }}</span>
              <span class="stat-label">Approved</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">฿{{ getTotalClaimAmount().toLocaleString() }}</span>
              <span class="stat-label">Total Claims</span>
            </div>
          </div>

          <div class="table-container" *ngIf="filteredClaims.length > 0">
            <table mat-table [dataSource]="filteredClaims" class="claims-table">
              
              <ng-container matColumnDef="claimNumber">
                <th mat-header-cell *matHeaderCellDef>Claim Number</th>
                <td mat-cell *matCellDef="let claim">
                  <div class="claim-info">
                    <strong>{{ claim.claimNumber }}</strong>
                    <small>{{ claim.claimantName }}</small>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="policy">
                <th mat-header-cell *matHeaderCellDef>Policy & Vehicle</th>
                <td mat-cell *matCellDef="let claim">
                  <div class="policy-info">
                    <strong>{{ claim.policyNumber }}</strong>
                    <small>{{ claim.vehiclePlate }}</small>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="incident">
                <th mat-header-cell *matHeaderCellDef>Incident</th>
                <td mat-cell *matCellDef="let claim">
                  <div class="incident-info">
                    <strong>{{ claim.incidentType }}</strong>
                    <small>{{ claim.incidentDate | date:'dd/MM/yyyy' }} - {{ claim.location }}</small>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="amount">
                <th mat-header-cell *matHeaderCellDef>Damage Amount</th>
                <td mat-cell *matCellDef="let claim">
                  <strong>฿{{ claim.damageAmount.toLocaleString() }}</strong>
                </td>
              </ng-container>

              <ng-container matColumnDef="priority">
                <th mat-header-cell *matHeaderCellDef>Priority</th>
                <td mat-cell *matCellDef="let claim">
                  <mat-chip [class]="'priority-' + claim.priority.toLowerCase()">
                    {{ claim.priority }}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let claim">
                  <mat-chip [class]="'status-' + claim.status.toLowerCase().replace('_', '-')">
                    {{ formatStatus(claim.status) }}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="submitted">
                <th mat-header-cell *matHeaderCellDef>Submitted</th>
                <td mat-cell *matCellDef="let claim">
                  <small>{{ claim.submittedDate | date:'dd/MM/yyyy' }}</small>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let claim">
                  <button mat-icon-button [matMenuTriggerFor]="menu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu">
                    <button mat-menu-item (click)="viewClaim(claim)">
                      <mat-icon>visibility</mat-icon>
                      View Details
                    </button>
                    <button mat-menu-item (click)="editClaim(claim)" *ngIf="claim.status === 'SUBMITTED'">
                      <mat-icon>edit</mat-icon>
                      Edit Claim
                    </button>
                    <button mat-menu-item (click)="approveClaim(claim)" *ngIf="claim.status === 'UNDER_REVIEW'">
                      <mat-icon>check_circle</mat-icon>
                      Approve
                    </button>
                    <button mat-menu-item (click)="rejectClaim(claim)" *ngIf="claim.status === 'UNDER_REVIEW'">
                      <mat-icon>cancel</mat-icon>
                      Reject
                    </button>
                  </mat-menu>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <div class="empty-state" *ngIf="filteredClaims.length === 0">
            <mat-icon class="empty-icon">assignment</mat-icon>
            <h3>No claims found</h3>
            <p *ngIf="searchTerm">No claims match your search criteria.</p>
            <p *ngIf="!searchTerm">No claims have been submitted yet.</p>
            <button mat-raised-button color="primary" routerLink="/claims/new">
              Submit Your First Claim
            </button>
          </div>

        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .claims-container {
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
    
    .claims-table {
      width: 100%;
    }
    
    .claim-info, .policy-info, .incident-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    
    .claim-info strong, .policy-info strong, .incident-info strong {
      font-weight: 500;
    }
    
    .claim-info small, .policy-info small, .incident-info small {
      color: #666;
      font-size: 0.75rem;
    }
    
    .priority-high {
      background-color: #f44336;
      color: white;
    }
    
    .priority-medium {
      background-color: #ff9800;
      color: white;
    }
    
    .priority-low {
      background-color: #4caf50;
      color: white;
    }
    
    .status-submitted {
      background-color: #2196f3;
      color: white;
    }
    
    .status-under-review {
      background-color: #ff9800;
      color: white;
    }
    
    .status-approved {
      background-color: #4caf50;
      color: white;
    }
    
    .status-rejected {
      background-color: #f44336;
      color: white;
    }
    
    .status-paid {
      background-color: #9c27b0;
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
export class ClaimsListComponent implements OnInit {
  claims: Claim[] = [];
  filteredClaims: Claim[] = [];
  searchTerm = '';
  displayedColumns: string[] = ['claimNumber', 'policy', 'incident', 'amount', 'priority', 'status', 'submitted', 'actions'];

  ngOnInit(): void {
    this.loadSampleClaims();
    this.filteredClaims = [...this.claims];
  }

  private loadSampleClaims(): void {
    // Sample data for demonstration
    this.claims = [
      {
        id: '1',
        claimNumber: 'CLM-2024-001',
        policyNumber: 'POL-2024-001',
        incidentDate: new Date('2024-08-20'),
        incidentType: 'Collision',
        location: 'Sukhumvit Road, Bangkok',
        description: 'Minor collision with another vehicle at intersection',
        damageAmount: 25000,
        status: 'UNDER_REVIEW',
        submittedDate: new Date('2024-08-22'),
        claimantName: 'สมชาย ใจดี',
        vehiclePlate: 'กก-1234 กรุงเทพมหานคร',
        priority: 'MEDIUM'
      },
      {
        id: '2',
        claimNumber: 'CLM-2024-002',
        policyNumber: 'POL-2024-002',
        incidentDate: new Date('2024-08-18'),
        incidentType: 'Theft',
        location: 'Parking lot, Siam Paragon',
        description: 'Vehicle stolen from shopping mall parking',
        damageAmount: 150000,
        status: 'APPROVED',
        submittedDate: new Date('2024-08-19'),
        claimantName: 'วิไล สวยงาม',
        vehiclePlate: 'ขข-5678 กรุงเทพมหานคร',
        priority: 'HIGH'
      },
      {
        id: '3',
        claimNumber: 'CLM-2024-003',
        policyNumber: 'POL-2024-003',
        incidentDate: new Date('2024-08-15'),
        incidentType: 'Natural Disaster',
        location: 'Residential area, Nonthaburi',
        description: 'Flood damage during heavy rainfall',
        damageAmount: 75000,
        status: 'PAID',
        submittedDate: new Date('2024-08-16'),
        claimantName: 'ประยุทธ มั่นคง',
        vehiclePlate: 'คค-9999 นนทบุรี',
        priority: 'HIGH'
      },
      {
        id: '4',
        claimNumber: 'CLM-2024-004',
        policyNumber: 'POL-2024-001',
        incidentDate: new Date('2024-08-25'),
        incidentType: 'Vandalism',
        location: 'Home parking, Thonglor',
        description: 'Scratches and broken mirrors',
        damageAmount: 8000,
        status: 'SUBMITTED',
        submittedDate: new Date('2024-08-25'),
        claimantName: 'สมชาย ใจดี',
        vehiclePlate: 'กก-1234 กรุงเทพมหานคร',
        priority: 'LOW'
      }
    ];
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredClaims = [...this.claims];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredClaims = this.claims.filter(claim =>
      claim.claimNumber.toLowerCase().includes(term) ||
      claim.policyNumber.toLowerCase().includes(term) ||
      claim.vehiclePlate.toLowerCase().includes(term) ||
      claim.claimantName.toLowerCase().includes(term) ||
      claim.incidentType.toLowerCase().includes(term)
    );
  }

  formatStatus(status: string): string {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  getSubmittedClaims(): number {
    return this.claims.filter(c => c.status === 'SUBMITTED').length;
  }

  getUnderReviewClaims(): number {
    return this.claims.filter(c => c.status === 'UNDER_REVIEW').length;
  }

  getApprovedClaims(): number {
    return this.claims.filter(c => c.status === 'APPROVED').length;
  }

  getTotalClaimAmount(): number {
    return this.claims.reduce((total, c) => total + c.damageAmount, 0);
  }

  viewClaim(claim: Claim): void {
    console.log('View claim:', claim);
    // Navigate to claim detail view
  }

  editClaim(claim: Claim): void {
    console.log('Edit claim:', claim);
    // Navigate to claim edit form
  }

  approveClaim(claim: Claim): void {
    console.log('Approve claim:', claim);
    // Handle claim approval
    claim.status = 'APPROVED';
  }

  rejectClaim(claim: Claim): void {
    console.log('Reject claim:', claim);
    // Handle claim rejection
    claim.status = 'REJECTED';
  }
}