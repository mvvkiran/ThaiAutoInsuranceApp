import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
}

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="confirm-dialog" [ngClass]="'dialog-' + data.type">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon [ngSwitch]="data.type">
          <ng-container *ngSwitchCase="'warning'">warning</ng-container>
          <ng-container *ngSwitchCase="'danger'">error</ng-container>
          <ng-container *ngSwitchDefault>info</ng-container>
        </mat-icon>
        {{ data.title }}
      </h2>
      
      <mat-dialog-content class="dialog-content">
        <p [innerHTML]="data.message"></p>
      </mat-dialog-content>
      
      <mat-dialog-actions class="dialog-actions">
        <button mat-button (click)="onCancel()">
          {{ data.cancelText || 'ยกเลิก' }}
        </button>
        <button mat-raised-button 
                [color]="data.type === 'danger' ? 'warn' : 'primary'"
                (click)="onConfirm()">
          {{ data.confirmText || 'ยืนยัน' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      min-width: 320px;
      max-width: 500px;
    }
    
    .dialog-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }
    
    .dialog-content {
      margin-bottom: 16px;
      line-height: 1.5;
    }
    
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    
    .dialog-warning .mat-icon { color: #ff9800; }
    .dialog-danger .mat-icon { color: #f44336; }
    .dialog-info .mat-icon { color: #2196f3; }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {
    this.data.type = this.data.type || 'info';
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}