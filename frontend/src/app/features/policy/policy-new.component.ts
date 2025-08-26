import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { PolicyService } from './policy.service';

@Component({
  selector: 'app-policy-new',
  template: `
    <div class="policy-new-container">
      <h1>New Insurance Policy</h1>
      <p>Create a new insurance policy for your vehicle.</p>
      
      <mat-card>
        <mat-card-content>
          <form [formGroup]="policyForm" (ngSubmit)="onCreatePolicy()" novalidate>
            
            <div class="form-section">
              <h2>Vehicle Information</h2>
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>License Plate</mat-label>
                  <input matInput 
                         formControlName="licensePlate"
                         placeholder="e.g. กก-1234 กรุงเทพมหานคร">
                  <mat-error *ngIf="policyForm.get('licensePlate')?.errors?.['required']">
                    License plate is required
                  </mat-error>
                </mat-form-field>
                
                <mat-form-field appearance="outline">
                  <mat-label>Vehicle Make</mat-label>
                  <mat-select formControlName="vehicleMake">
                    <mat-option value="toyota">Toyota</mat-option>
                    <mat-option value="honda">Honda</mat-option>
                    <mat-option value="nissan">Nissan</mat-option>
                    <mat-option value="mazda">Mazda</mat-option>
                    <mat-option value="isuzu">Isuzu</mat-option>
                    <mat-option value="mitsubishi">Mitsubishi</mat-option>
                  </mat-select>
                  <mat-error *ngIf="policyForm.get('vehicleMake')?.errors?.['required']">
                    Vehicle make is required
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Vehicle Model</mat-label>
                  <input matInput 
                         formControlName="vehicleModel"
                         placeholder="e.g. Camry, Civic, Almera">
                  <mat-error *ngIf="policyForm.get('vehicleModel')?.errors?.['required']">
                    Vehicle model is required
                  </mat-error>
                </mat-form-field>
                
                <mat-form-field appearance="outline">
                  <mat-label>Year</mat-label>
                  <mat-select formControlName="year">
                    <mat-option *ngFor="let year of years" [value]="year">{{year}}</mat-option>
                  </mat-select>
                  <mat-error *ngIf="policyForm.get('year')?.errors?.['required']">
                    Year is required
                  </mat-error>
                </mat-form-field>
              </div>
            </div>

            <div class="form-section">
              <h2>Coverage Options</h2>
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Coverage Type</mat-label>
                  <mat-select formControlName="coverageType" (selectionChange)="onCoverageTypeChange($event.value)">
                    <mat-option value="third_party">Third Party Only</mat-option>
                    <mat-option value="comprehensive">Comprehensive</mat-option>
                  </mat-select>
                  <mat-error *ngIf="policyForm.get('coverageType')?.errors?.['required']">
                    Coverage type is required
                  </mat-error>
                </mat-form-field>
                
                <mat-form-field appearance="outline">
                  <mat-label>Coverage Amount (THB)</mat-label>
                  <mat-select formControlName="coverageAmount">
                    <mat-option value="1000000">1,000,000</mat-option>
                    <mat-option value="2000000">2,000,000</mat-option>
                    <mat-option value="3000000">3,000,000</mat-option>
                    <mat-option value="5000000">5,000,000</mat-option>
                  </mat-select>
                  <mat-error *ngIf="policyForm.get('coverageAmount')?.errors?.['required']">
                    Coverage amount is required
                  </mat-error>
                </mat-form-field>
              </div>
            </div>

            <div class="premium-section" *ngIf="estimatedPremium">
              <mat-card class="premium-card">
                <mat-card-content>
                  <h3>Premium Calculation</h3>
                  <div class="premium-details">
                    <div class="premium-row">
                      <span>Base Premium:</span>
                      <span>{{ basePremium | currency:'THB':'symbol-narrow' }}</span>
                    </div>
                    <div class="premium-row">
                      <span>Coverage Premium:</span>
                      <span>{{ coveragePremium | currency:'THB':'symbol-narrow' }}</span>
                    </div>
                    <div class="premium-row total">
                      <span><strong>Total Annual Premium:</strong></span>
                      <span><strong>{{ estimatedPremium | currency:'THB':'symbol-narrow' }}</strong></span>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
            
            <div class="form-actions">
              <button mat-stroked-button type="button" routerLink="/policies">
                Back to Policies
              </button>
              <button mat-raised-button 
                      color="primary" 
                      type="submit"
                      [disabled]="policyForm.invalid || isLoading">
                <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                {{ isLoading ? 'Creating...' : 'Create Policy' }}
              </button>
            </div>

          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .policy-new-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .form-section {
      margin-bottom: 32px;
    }
    
    .form-section h2 {
      margin-bottom: 16px;
      color: #333;
      font-size: 1.5rem;
      font-weight: 500;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }
    
    .premium-section {
      margin: 32px 0;
    }
    
    .premium-card {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
    }
    
    .premium-card h3 {
      margin-bottom: 16px;
      color: #495057;
      font-size: 1.25rem;
    }
    
    .premium-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .premium-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
    }
    
    .premium-row.total {
      border-top: 1px solid #dee2e6;
      margin-top: 8px;
      padding-top: 16px;
      font-size: 1.1rem;
    }
    
    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 24px;
    }
    
    mat-spinner {
      margin-right: 8px;
    }
    
    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .form-actions {
        flex-direction: column;
      }
      
      .premium-row {
        font-size: 0.9rem;
      }
    }
  `]
})
export class PolicyNewComponent {
  policyForm!: FormGroup;
  isLoading = false;
  years: number[] = [];
  
  // Premium calculation properties
  estimatedPremium = 0;
  basePremium = 0;
  coveragePremium = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService,
    private policyService: PolicyService
  ) {
    this.initializeForm();
    this.generateYears();
  }

  private initializeForm(): void {
    this.policyForm = this.fb.group({
      licensePlate: ['', [Validators.required]],
      vehicleMake: ['', [Validators.required]],
      vehicleModel: ['', [Validators.required]],
      year: ['', [Validators.required]],
      coverageType: ['', [Validators.required]],
      coverageAmount: ['', [Validators.required]]
    });

    // Subscribe to form changes to calculate premium
    this.policyForm.valueChanges.subscribe(() => {
      this.calculatePremium();
    });
  }

  private generateYears(): void {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 20; year--) {
      this.years.push(year);
    }
  }

  onCoverageTypeChange(coverageType: string): void {
    // Reset coverage amount when type changes
    this.policyForm.patchValue({ coverageAmount: '' });
    this.calculatePremium();
  }

  private calculatePremium(): void {
    const formValue = this.policyForm.value;
    
    if (!formValue.coverageType || !formValue.coverageAmount || !formValue.year) {
      this.estimatedPremium = 0;
      return;
    }

    // Base premium calculation
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - parseInt(formValue.year);
    
    // Base premium varies by vehicle age
    this.basePremium = vehicleAge <= 3 ? 8000 : vehicleAge <= 10 ? 12000 : 15000;
    
    // Coverage premium based on type and amount
    const coverageAmount = parseInt(formValue.coverageAmount);
    if (formValue.coverageType === 'comprehensive') {
      this.coveragePremium = coverageAmount * 0.015; // 1.5% of coverage
    } else {
      this.coveragePremium = coverageAmount * 0.008; // 0.8% of coverage
    }
    
    this.estimatedPremium = this.basePremium + this.coveragePremium;
  }

  onCreatePolicy(): void {
    if (this.policyForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    
    const policyData = {
      ...this.policyForm.value,
      premium: this.estimatedPremium
    };

    // Simulate API call
    setTimeout(() => {
      // Save the policy using the service
      const newPolicy = this.policyService.addPolicy(policyData);
      console.log('Policy created:', newPolicy);
      
      this.isLoading = false;
      this.notificationService.showSuccess(
        `Policy ${newPolicy.policyNumber} created successfully! Premium: ฿${newPolicy.premium.toLocaleString()}`
      );
      
      // Navigate back to policies list
      this.router.navigate(['/policies']);
    }, 1500);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.policyForm.controls).forEach(key => {
      const control = this.policyForm.get(key);
      control?.markAsTouched();
    });
  }
}