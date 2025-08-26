import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PolicyService, Policy } from './policy.service';
import { NotificationService } from '../../core/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-policy-edit',
  template: `
    <div class="policy-edit-container" *ngIf="policy">
      <div class="header-section">
        <div class="breadcrumb">
          <button mat-icon-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <span class="breadcrumb-text">Policy Management / Edit Policy</span>
        </div>
        <div class="header-actions">
          <button mat-button (click)="goBack()">Cancel</button>
          <button mat-raised-button 
                  color="primary" 
                  (click)="onSavePolicy()" 
                  [disabled]="policyForm.invalid || isLoading">
            <mat-icon *ngIf="isLoading">sync</mat-icon>
            <mat-icon *ngIf="!isLoading">save</mat-icon>
            {{ isLoading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>

      <!-- Policy Status Banner -->
      <mat-card class="status-banner">
        <mat-card-content>
          <div class="policy-header">
            <div>
              <h2>Edit Policy {{ policy.policyNumber }}</h2>
              <mat-chip [class]="'status-chip-' + policy.status.toLowerCase()">
                {{ policy.status }}
              </mat-chip>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Edit Form -->
      <form [formGroup]="policyForm" (ngSubmit)="onSavePolicy()">
        <div class="form-grid">

          <!-- Policy Information -->
          <mat-card>
            <mat-card-header>
              <mat-card-title>Policy Information</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Policy Holder Name</mat-label>
                  <input matInput formControlName="holderName" placeholder="Enter policy holder name">
                  <mat-error *ngIf="policyForm.get('holderName')?.hasError('required')">
                    Policy holder name is required
                  </mat-error>
                  <mat-error *ngIf="policyForm.get('holderName')?.hasError('minlength')">
                    Name must be at least 2 characters
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Start Date</mat-label>
                  <input matInput [matDatepicker]="startPicker" formControlName="startDate">
                  <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                  <mat-datepicker #startPicker></mat-datepicker>
                  <mat-error *ngIf="policyForm.get('startDate')?.hasError('required')">
                    Start date is required
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>End Date</mat-label>
                  <input matInput [matDatepicker]="endPicker" formControlName="endDate">
                  <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                  <mat-datepicker #endPicker></mat-datepicker>
                  <mat-error *ngIf="policyForm.get('endDate')?.hasError('required')">
                    End date is required
                  </mat-error>
                </mat-form-field>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Vehicle Information -->
          <mat-card>
            <mat-card-header>
              <mat-card-title>Vehicle Information</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>License Plate</mat-label>
                  <input matInput formControlName="licensePlate" placeholder="กก-1234 กรุงเทพมหานคร">
                  <mat-error *ngIf="policyForm.get('licensePlate')?.hasError('required')">
                    License plate is required
                  </mat-error>
                  <mat-error *ngIf="policyForm.get('licensePlate')?.hasError('pattern')">
                    Please enter a valid Thai license plate format
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Vehicle Make</mat-label>
                  <mat-select formControlName="vehicleMake">
                    <mat-option value="Toyota">Toyota</mat-option>
                    <mat-option value="Honda">Honda</mat-option>
                    <mat-option value="Nissan">Nissan</mat-option>
                    <mat-option value="Mazda">Mazda</mat-option>
                    <mat-option value="Mitsubishi">Mitsubishi</mat-option>
                    <mat-option value="Isuzu">Isuzu</mat-option>
                  </mat-select>
                  <mat-error *ngIf="policyForm.get('vehicleMake')?.hasError('required')">
                    Vehicle make is required
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Vehicle Model</mat-label>
                  <mat-select formControlName="vehicleModel">
                    <mat-option value="Camry">Camry</mat-option>
                    <mat-option value="Vios">Vios</mat-option>
                    <mat-option value="Altis">Altis</mat-option>
                    <mat-option value="Civic">Civic</mat-option>
                    <mat-option value="City">City</mat-option>
                    <mat-option value="Accord">Accord</mat-option>
                  </mat-select>
                  <mat-error *ngIf="policyForm.get('vehicleModel')?.hasError('required')">
                    Vehicle model is required
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Year</mat-label>
                  <mat-select formControlName="year">
                    <mat-option *ngFor="let year of years" [value]="year">{{ year }}</mat-option>
                  </mat-select>
                  <mat-error *ngIf="policyForm.get('year')?.hasError('required')">
                    Vehicle year is required
                  </mat-error>
                </mat-form-field>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Coverage Information -->
          <mat-card>
            <mat-card-header>
              <mat-card-title>Coverage Information</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Coverage Type</mat-label>
                  <mat-select formControlName="coverageType" (selectionChange)="calculatePremium()">
                    <mat-option value="Basic">Basic Coverage</mat-option>
                    <mat-option value="Standard">Standard Coverage</mat-option>
                    <mat-option value="Comprehensive">Comprehensive Coverage</mat-option>
                    <mat-option value="Premium">Premium Coverage</mat-option>
                  </mat-select>
                  <mat-error *ngIf="policyForm.get('coverageType')?.hasError('required')">
                    Coverage type is required
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Coverage Amount (THB)</mat-label>
                  <mat-select formControlName="coverageAmount" (selectionChange)="calculatePremium()">
                    <mat-option value="500000">500,000</mat-option>
                    <mat-option value="1000000">1,000,000</mat-option>
                    <mat-option value="2000000">2,000,000</mat-option>
                    <mat-option value="3000000">3,000,000</mat-option>
                    <mat-option value="5000000">5,000,000</mat-option>
                  </mat-select>
                  <mat-error *ngIf="policyForm.get('coverageAmount')?.hasError('required')">
                    Coverage amount is required
                  </mat-error>
                </mat-form-field>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Premium Information -->
          <mat-card class="premium-card">
            <mat-card-header>
              <mat-card-title>Premium Calculation</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="premium-breakdown">
                <div class="premium-row">
                  <span>Base Premium</span>
                  <span>฿{{ basePremium.toLocaleString() }}</span>
                </div>
                <div class="premium-row">
                  <span>Coverage Premium</span>
                  <span>฿{{ coveragePremium.toLocaleString() }}</span>
                </div>
                <div class="premium-row">
                  <span>Vehicle Age Adjustment</span>
                  <span>฿{{ ageAdjustment.toLocaleString() }}</span>
                </div>
                <mat-divider></mat-divider>
                <div class="premium-row total">
                  <span><strong>Total Annual Premium</strong></span>
                  <span><strong>฿{{ estimatedPremium.toLocaleString() }}</strong></span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

        </div>
      </form>
    </div>

    <!-- Loading State -->
    <div class="loading-container" *ngIf="!policy && !error">
      <mat-spinner></mat-spinner>
      <p>Loading policy information...</p>
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
    .policy-edit-container {
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

    .policy-header h2 {
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

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .form-row:last-child {
      margin-bottom: 0;
    }

    .full-width {
      width: 100%;
    }

    .form-row .mat-form-field {
      flex: 1;
    }

    .premium-card {
      grid-column: 1 / -1;
      background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
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
      font-size: 18px;
      color: #1976d2;
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

      .form-grid {
        grid-template-columns: 1fr;
      }

      .form-row {
        flex-direction: column;
        gap: 16px;
      }
    }
  `]
})
export class PolicyEditComponent implements OnInit, OnDestroy {
  policy: Policy | null = null;
  policyForm!: FormGroup;
  error: string | null = null;
  isLoading = false;
  years: number[] = [];
  
  // Premium calculation variables
  estimatedPremium = 0;
  basePremium = 0;
  coveragePremium = 0;
  ageAdjustment = 0;

  private subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private policyService: PolicyService,
    private notificationService: NotificationService
  ) {
    this.initializeForm();
    this.generateYears();
  }

  ngOnInit(): void {
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

  private initializeForm(): void {
    this.policyForm = this.fb.group({
      holderName: ['', [Validators.required, Validators.minLength(2)]],
      licensePlate: ['', [Validators.required, Validators.pattern(/^[กข-๛]{1,2}-?\d{1,4}\s*[ก-๛\s]*$/)]],
      vehicleMake: ['', Validators.required],
      vehicleModel: ['', Validators.required],
      year: ['', Validators.required],
      coverageType: ['', Validators.required],
      coverageAmount: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });

    // Subscribe to form changes for premium calculation
    this.subscription.add(
      this.policyForm.valueChanges.subscribe(() => {
        this.calculatePremium();
      })
    );
  }

  private generateYears(): void {
    const currentYear = new Date().getFullYear();
    const startYear = 1990;
    
    for (let year = currentYear; year >= startYear; year--) {
      this.years.push(year);
    }
  }

  private loadPolicy(policyId: string): void {
    this.subscription.add(
      this.policyService.getPolicyById(policyId).subscribe({
        next: (policy) => {
          this.policy = policy;
          this.populateForm(policy);
        },
        error: (err) => {
          this.error = 'Policy not found or could not be loaded';
          console.error('Error loading policy:', err);
        }
      })
    );
  }

  private populateForm(policy: Policy): void {
    this.policyForm.patchValue({
      holderName: policy.holderName,
      licensePlate: policy.licensePlate,
      vehicleMake: policy.vehicleMake,
      vehicleModel: policy.vehicleModel,
      year: policy.year,
      coverageType: policy.coverageType,
      coverageAmount: policy.coverageAmount,
      startDate: policy.startDate,
      endDate: policy.endDate
    });

    this.calculatePremium();
  }

  calculatePremium(): void {
    if (this.policyForm.invalid) {
      return;
    }

    const formValue = this.policyForm.value;
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - formValue.year;

    // Base premium calculation
    this.basePremium = 15000;

    // Coverage type multiplier
    const coverageMultiplier = {
      'Basic': 1.0,
      'Standard': 1.3,
      'Comprehensive': 1.8,
      'Premium': 2.5
    };

    // Coverage amount factor
    const coverageAmount = parseFloat(formValue.coverageAmount) || 0;
    const coverageFactor = coverageAmount / 1000000; // Per million THB

    this.coveragePremium = this.basePremium * 
      (coverageMultiplier[formValue.coverageType as keyof typeof coverageMultiplier] || 1) * 
      coverageFactor * 0.8;

    // Age adjustment
    let ageFactor = 1.0;
    if (vehicleAge <= 3) ageFactor = 0.8;
    else if (vehicleAge <= 7) ageFactor = 1.0;
    else if (vehicleAge <= 15) ageFactor = 1.3;
    else ageFactor = 1.8;

    this.ageAdjustment = this.basePremium * (ageFactor - 1);

    // Calculate total
    this.estimatedPremium = Math.round(this.basePremium + this.coveragePremium + this.ageAdjustment);
  }

  onSavePolicy(): void {
    if (this.policyForm.invalid || !this.policy) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    
    const updatedPolicy: Policy = {
      ...this.policy,
      ...this.policyForm.value,
      premium: this.estimatedPremium,
      updatedDate: new Date()
    };

    this.subscription.add(
      this.policyService.updatePolicy(updatedPolicy).subscribe({
        next: (policy) => {
          this.notificationService.showSuccess('Policy updated successfully!');
          this.router.navigate(['/policies', policy.id]);
        },
        error: (err) => {
          this.notificationService.showError('Failed to update policy. Please try again.');
          console.error('Error updating policy:', err);
          this.isLoading = false;
        }
      })
    );
  }

  private markFormGroupTouched(): void {
    Object.keys(this.policyForm.controls).forEach(key => {
      const control = this.policyForm.get(key);
      control?.markAsTouched();
    });
  }

  goBack(): void {
    if (this.policy) {
      this.router.navigate(['/policies', this.policy.id]);
    } else {
      this.router.navigate(['/policies']);
    }
  }
}