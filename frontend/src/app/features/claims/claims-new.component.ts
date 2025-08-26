import { Component } from '@angular/core';

@Component({
  selector: 'app-claims-new',
  template: `
    <div class="claims-new-container">
      <h1>New Claim</h1>
      <p>Submit a new insurance claim.</p>
      
      <mat-card>
        <mat-card-content>
          <div class="form-section">
            <h2>Incident Information</h2>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Incident Date</mat-label>
                <input matInput [matDatepicker]="picker">
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Incident Type</mat-label>
                <mat-select>
                  <mat-option value="collision">Collision</mat-option>
                  <mat-option value="theft">Theft</mat-option>
                  <mat-option value="fire">Fire Damage</mat-option>
                  <mat-option value="flood">Flood Damage</mat-option>
                  <mat-option value="vandalism">Vandalism</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Incident Location</mat-label>
                <input matInput placeholder="Enter the exact location where the incident occurred">
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Incident Description</mat-label>
                <textarea matInput rows="4" placeholder="Describe what happened in detail..."></textarea>
              </mat-form-field>
            </div>
          </div>
          
          <div class="form-section">
            <h2>Policy Information</h2>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Policy Number</mat-label>
                <mat-select>
                  <mat-option value="POL-001">TH-2024-001234 (Toyota Camry)</mat-option>
                  <mat-option value="POL-002">TH-2024-001235 (Honda Civic)</mat-option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Estimated Damage Amount</mat-label>
                <input matInput type="number" placeholder="0.00">
                <span matSuffix>฿</span>
              </mat-form-field>
            </div>
          </div>
          
          <div class="form-actions">
            <button mat-stroked-button routerLink="/claims">
              Back to Claims
            </button>
            <button mat-raised-button color="primary" type="button">
              Submit Claim
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .claims-new-container {
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
      padding-bottom: 8px;
      border-bottom: 2px solid #e0e0e0;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }
    
    .form-row .full-width {
      grid-column: 1 / -1;
    }
    
    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 24px;
    }
    
    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ClaimsNewComponent {
}