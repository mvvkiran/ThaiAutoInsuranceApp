import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PolicyService, Policy } from './policy.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-policy-detail',
  template: `
    <div class="policy-detail-container" *ngIf="policy">
      <div class="header-section">
        <div class="breadcrumb">
          <button mat-icon-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <span class="breadcrumb-text">Policy Management / Policy Details</span>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="editPolicy()">
            <mat-icon>edit</mat-icon>
            Edit Policy
          </button>
          <button mat-button [matMenuTriggerFor]="menu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="renewPolicy()" *ngIf="policy.status === 'ACTIVE'">
              <mat-icon>refresh</mat-icon>
              Renew Policy
            </button>
            <button mat-menu-item (click)="cancelPolicy()" *ngIf="policy.status === 'ACTIVE'">
              <mat-icon>cancel</mat-icon>
              Cancel Policy
            </button>
            <button mat-menu-item (click)="downloadPolicy()">
              <mat-icon>download</mat-icon>
              Download Certificate
            </button>
          </mat-menu>
        </div>
      </div>

      <!-- Policy Status Banner -->
      <mat-card class="status-banner" [class]="'status-' + policy.status.toLowerCase()">
        <mat-card-content>
          <div class="status-info">
            <div class="status-left">
              <h2>Policy {{ policy.policyNumber }}</h2>
              <mat-chip [class]="'status-chip-' + policy.status.toLowerCase()">
                {{ policy.status }}
              </mat-chip>
            </div>
            <div class="status-right">
              <div class="premium-info">
                <span class="premium-label">Annual Premium</span>
                <span class="premium-amount">฿{{ policy.premium.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Policy Information Sections -->
      <div class="content-grid">
        
        <!-- Policy Details -->
        <mat-card>
          <mat-card-header>
            <mat-card-title>Policy Information</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Policy Number</label>
                <span>{{ policy.policyNumber }}</span>
              </div>
              <div class="detail-item">
                <label>Policy Holder</label>
                <span>{{ policy.holderName }}</span>
              </div>
              <div class="detail-item">
                <label>Start Date</label>
                <span>{{ policy.startDate | date:'dd/MM/yyyy' }}</span>
              </div>
              <div class="detail-item">
                <label>End Date</label>
                <span>{{ policy.endDate | date:'dd/MM/yyyy' }}</span>
              </div>
              <div class="detail-item">
                <label>Coverage Type</label>
                <span>{{ policy.coverageType }}</span>
              </div>
              <div class="detail-item">
                <label>Coverage Amount</label>
                <span>฿{{ policy.coverageAmount.toLocaleString() }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Vehicle Information -->
        <mat-card>
          <mat-card-header>
            <mat-card-title>Vehicle Information</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="detail-grid">
              <div class="detail-item">
                <label>License Plate</label>
                <span class="license-plate">{{ policy.licensePlate }}</span>
              </div>
              <div class="detail-item">
                <label>Make</label>
                <span>{{ policy.vehicleMake }}</span>
              </div>
              <div class="detail-item">
                <label>Model</label>
                <span>{{ policy.vehicleModel }}</span>
              </div>
              <div class="detail-item">
                <label>Year</label>
                <span>{{ policy.year }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Premium Breakdown -->
        <mat-card>
          <mat-card-header>
            <mat-card-title>Premium Breakdown</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="premium-breakdown">
              <div class="premium-row">
                <span>Base Premium</span>
                <span>฿{{ getBasePremium().toLocaleString() }}</span>
              </div>
              <div class="premium-row">
                <span>Coverage Premium</span>
                <span>฿{{ getCoveragePremium().toLocaleString() }}</span>
              </div>
              <div class="premium-row">
                <span>Vehicle Age Adjustment</span>
                <span>฿{{ getAgeAdjustment().toLocaleString() }}</span>
              </div>
              <mat-divider></mat-divider>
              <div class="premium-row total">
                <span><strong>Total Annual Premium</strong></span>
                <span><strong>฿{{ policy.premium.toLocaleString() }}</strong></span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Policy History -->
        <mat-card>
          <mat-card-header>
            <mat-card-title>Policy History</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="history-timeline">
              <div class="timeline-item">
                <div class="timeline-dot active"></div>
                <div class="timeline-content">
                  <h4>Policy Created</h4>
                  <p>{{ policy.createdDate | date:'dd/MM/yyyy HH:mm' }}</p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-dot active"></div>
                <div class="timeline-content">
                  <h4>Policy Activated</h4>
                  <p>{{ policy.startDate | date:'dd/MM/yyyy' }}</p>
                </div>
              </div>
              <div class="timeline-item" *ngIf="policy.status !== 'ACTIVE'">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <h4>Status: {{ policy.status }}</h4>
                  <p>Current status</p>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

      </div>
    </div>

    <!-- Loading State -->
    <div class="loading-container" *ngIf="!policy && !error">
      <mat-spinner></mat-spinner>
      <p>Loading policy details...</p>
    </div>

    <!-- Error State -->
    <div class="error-container" *ngIf="error">
      <mat-icon class="error-icon">error_outline</mat-icon>
      <h3>Policy Not Found</h3>
      <p>{{ error }}</p>
      <button mat-raised-button color="primary" (click)="goBack()">
        Go Back to Policy List
      </button>
    </div>
  `,
  styles: [`
    .policy-detail-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
    }

    .breadcrumb-text {
      font-size: 14px;
    }

    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .status-banner {
      margin-bottom: 24px;
    }

    .status-banner.status-active {
      border-left: 4px solid #4caf50;
    }

    .status-banner.status-pending {
      border-left: 4px solid #ff9800;
    }

    .status-banner.status-expired {
      border-left: 4px solid #f44336;
    }

    .status-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .status-left h2 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .status-chip-active {
      background-color: #4caf50;
      color: white;
    }

    .status-chip-pending {
      background-color: #ff9800;
      color: white;
    }

    .status-chip-expired {
      background-color: #f44336;
      color: white;
    }

    .premium-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
    }

    .premium-label {
      font-size: 12px;
      color: #666;
    }

    .premium-amount {
      font-size: 24px;
      font-weight: 600;
      color: #1976d2;
    }

    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .detail-item label {
      font-size: 12px;
      color: #666;
      font-weight: 500;
    }

    .detail-item span {
      font-size: 14px;
      color: #333;
    }

    .license-plate {
      font-family: monospace;
      font-weight: 600;
      color: #1976d2;
    }

    .premium-breakdown {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .premium-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
    }

    .premium-row.total {
      margin-top: 8px;
      padding-top: 16px;
      font-size: 16px;
      color: #1976d2;
    }

    .history-timeline {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .timeline-item {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }

    .timeline-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #e0e0e0;
      margin-top: 6px;
      flex-shrink: 0;
    }

    .timeline-dot.active {
      background-color: #1976d2;
    }

    .timeline-content h4 {
      margin: 0 0 4px 0;
      font-size: 14px;
      font-weight: 500;
    }

    .timeline-content p {
      margin: 0;
      font-size: 12px;
      color: #666;
    }

    .loading-container, .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      text-align: center;
    }

    .error-icon {
      font-size: 48px;
      color: #f44336;
      margin-bottom: 16px;
    }

    .error-container h3 {
      margin: 16px 0 8px;
      color: #333;
    }

    .error-container p {
      margin-bottom: 24px;
      color: #666;
    }

    @media (max-width: 768px) {
      .header-section {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .status-info {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
      }

      .premium-info {
        align-items: flex-start;
      }

      .detail-grid {
        grid-template-columns: 1fr;
      }

      .content-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PolicyDetailComponent implements OnInit, OnDestroy {
  policy: Policy | null = null;
  error: string | null = null;
  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private policyService: PolicyService
  ) {}

  ngOnInit(): void {
    // Get policy ID from route parameters
    const policyId = this.route.snapshot.paramMap.get('id');
    
    if (policyId) {
      this.loadPolicy(policyId);
    } else {
      this.error = 'Policy ID not provided';
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadPolicy(policyId: string): void {
    this.subscription.add(
      this.policyService.getPolicyById(policyId).subscribe({
        next: (policy) => {
          this.policy = policy;
        },
        error: (err) => {
          this.error = 'Policy not found or could not be loaded';
          console.error('Error loading policy:', err);
        }
      })
    );
  }

  goBack(): void {
    this.router.navigate(['/policies']);
  }

  editPolicy(): void {
    if (this.policy) {
      this.router.navigate(['/policies/edit', this.policy.id]);
    }
  }

  renewPolicy(): void {
    if (this.policy) {
      console.log('Renewing policy:', this.policy);
      // Implement renewal logic
    }
  }

  cancelPolicy(): void {
    if (this.policy && confirm('Are you sure you want to cancel this policy?')) {
      console.log('Cancelling policy:', this.policy);
      // Implement cancellation logic
    }
  }

  downloadPolicy(): void {
    if (this.policy) {
      console.log('Downloading policy certificate:', this.policy);
      // Implement download logic
    }
  }

  getBasePremium(): number {
    if (!this.policy) return 0;
    // Calculate base premium (simplified)
    return Math.round(this.policy.premium * 0.6);
  }

  getCoveragePremium(): number {
    if (!this.policy) return 0;
    // Calculate coverage premium (simplified)
    return Math.round(this.policy.premium * 0.3);
  }

  getAgeAdjustment(): number {
    if (!this.policy) return 0;
    // Calculate age adjustment (simplified)
    return Math.round(this.policy.premium * 0.1);
  }
}