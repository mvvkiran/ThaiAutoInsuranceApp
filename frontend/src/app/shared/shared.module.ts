import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';

// NGX Mask for input formatting
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

// Shared Components
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { StatusChipComponent } from './components/status-chip/status-chip.component';

// Shared Pipes
import { TranslatePipe } from './pipes/translate.pipe';
import { ThaiDatePipe } from './pipes/thai-date.pipe';
import { ThaiCurrencyPipe } from './pipes/thai-currency.pipe';
import { ThaiNumberPipe } from './pipes/thai-number.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { FormatNationalIdPipe } from './pipes/format-national-id.pipe';
import { FormatPhonePipe } from './pipes/format-phone.pipe';

// Shared Directives
import { AutofocusDirective } from './directives/autofocus.directive';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { NumericOnlyDirective } from './directives/numeric-only.directive';
import { ThaiNationalIdDirective } from './directives/thai-national-id.directive';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatDialogModule,
  MatSelectModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatChipsModule,
  MatMenuModule,
  MatTooltipModule,
  MatProgressBarModule,
  MatDividerModule
];

const SHARED_COMPONENTS = [
  LoadingSpinnerComponent,
  ConfirmDialogComponent,
  FileUploadComponent,
  DataTableComponent,
  PageHeaderComponent,
  EmptyStateComponent,
  StatusChipComponent
];

const SHARED_PIPES = [
  TranslatePipe,
  ThaiDatePipe,
  ThaiCurrencyPipe,
  ThaiNumberPipe,
  SafeHtmlPipe,
  FormatNationalIdPipe,
  FormatPhonePipe
];

const SHARED_DIRECTIVES = [
  AutofocusDirective,
  ClickOutsideDirective,
  NumericOnlyDirective,
  ThaiNationalIdDirective
];

@NgModule({
  declarations: [
    ...SHARED_COMPONENTS,
    ...SHARED_PIPES,
    ...SHARED_DIRECTIVES
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxMaskDirective,
    NgxMaskPipe,
    ...MATERIAL_MODULES
  ],
  exports: [
    // Angular modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    
    // Material modules
    ...MATERIAL_MODULES,
    
    // NGX modules
    NgxMaskDirective,
    NgxMaskPipe,
    
    // Shared components, pipes, and directives
    ...SHARED_COMPONENTS,
    ...SHARED_PIPES,
    ...SHARED_DIRECTIVES
  ]
})
export class SharedModule { }