import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

import { ResetPasswordComponent } from './reset-password.component';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoadingService } from '../../../core/services/loading.service';
import { TranslationService } from '../../../core/services/translation.service';

// Page Object for ResetPassword Component
class ResetPasswordPageObject {
  constructor(
    private fixture: ComponentFixture<ResetPasswordComponent>,
    private loader: HarnessLoader
  ) {}

  get component(): ResetPasswordComponent {
    return this.fixture.componentInstance;
  }

  get compiled(): HTMLElement {
    return this.fixture.nativeElement;
  }

  // Input field getters
  async getPasswordInput(): Promise<MatInputHarness> {
    return this.loader.getHarness(MatInputHarness.with({ placeholder: 'รหัสผ่านใหม่' }));
  }

  async getConfirmPasswordInput(): Promise<MatInputHarness> {
    return this.loader.getHarness(MatInputHarness.with({ placeholder: 'ยืนยันรหัสผ่านใหม่' }));
  }

  // Button getters
  async getResetPasswordButton(): Promise<MatButtonHarness> {
    return this.loader.getHarness(MatButtonHarness.with({ text: 'รีเซ็ตรหัสผ่าน' }));
  }

  async getBackToLoginButton(): Promise<MatButtonHarness> {
    return this.loader.getHarness(MatButtonHarness.with({ text: 'กลับไปหน้าเข้าสู่ระบบ' }));
  }

  async getShowPasswordButton(): Promise<MatButtonHarness> {
    return this.loader.getHarness(MatButtonHarness.with({ selector: '[data-testid="show-password-button"]' }));
  }

  async getShowConfirmPasswordButton(): Promise<MatButtonHarness> {
    return this.loader.getHarness(MatButtonHarness.with({ selector: '[data-testid="show-confirm-password-button"]' }));
  }

  // Helper methods
  getErrorMessage(fieldName: string): string | null {
    const errorElement = this.compiled.querySelector(`[data-testid="${fieldName}-error"]`);
    return errorElement ? errorElement.textContent?.trim() || null : null;
  }

  getGeneralErrorMessage(): string | null {
    const errorElement = this.compiled.querySelector('[data-testid="general-error"]');
    return errorElement ? errorElement.textContent?.trim() || null : null;
  }

  getSuccessMessage(): string | null {
    const successElement = this.compiled.querySelector('[data-testid="success-message"]');
    return successElement ? successElement.textContent?.trim() || null : null;
  }

  getTokenExpiredMessage(): string | null {
    const expiredElement = this.compiled.querySelector('[data-testid="token-expired-message"]');
    return expiredElement ? expiredElement.textContent?.trim() || null : null;
  }

  isLoadingSpinnerVisible(): boolean {
    return !!this.compiled.querySelector('mat-spinner');
  }

  isFormDisabled(): boolean {
    return this.component.resetPasswordForm.disabled;
  }

  isSuccessStateVisible(): boolean {
    return !!this.compiled.querySelector('[data-testid="success-state"]');
  }

  isTokenExpiredStateVisible(): boolean {
    return !!this.compiled.querySelector('[data-testid="token-expired-state"]');
  }

  isPasswordStrengthIndicatorVisible(): boolean {
    return !!this.compiled.querySelector('[data-testid="password-strength"]');
  }

  getPasswordStrengthText(): string | null {
    const strengthElement = this.compiled.querySelector('[data-testid="password-strength-text"]');
    return strengthElement ? strengthElement.textContent?.trim() || null : null;
  }

  getPasswordStrengthScore(): number {
    return this.component.passwordStrength.score;
  }

  async fillValidPasswords(password: string = 'NewPassword123!'): Promise<void> {
    const passwordInput = await this.getPasswordInput();
    const confirmPasswordInput = await this.getConfirmPasswordInput();
    
    await passwordInput.setValue(password);
    await confirmPasswordInput.setValue(password);
    
    this.fixture.detectChanges();
  }

  async submitForm(): Promise<void> {
    const resetButton = await this.getResetPasswordButton();
    await resetButton.click();
    this.fixture.detectChanges();
  }
}

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let pageObject: ResetPasswordPageObject;
  let loader: HarnessLoader;
  
  // Mock services
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let mockTranslationService: jasmine.SpyObj<TranslationService>;

  const validToken = 'valid-reset-token-12345';
  const expiredToken = 'expired-reset-token-67890';

  beforeEach(async () => {
    // Create mock services
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'resetPassword',
      'validateResetToken'
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      queryParams: of({ token: validToken })
    });
    mockNotificationService = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError',
      'showWarning',
      'showInfo'
    ]);
    mockLoadingService = jasmine.createSpyObj('LoadingService', [
      'show',
      'hide',
      'setLoading'
    ]);
    mockTranslationService = jasmine.createSpyObj('TranslationService', [
      'translate',
      'getTranslation'
    ]);

    // Setup default mock returns
    mockAuthService.resetPassword.and.returnValue(of({ success: true, message: 'Password reset successfully' }));
    mockAuthService.validateResetToken.and.returnValue(of({ valid: true }));
    mockTranslationService.translate.and.returnValue('Translated text');
    mockTranslationService.getTranslation.and.returnValue(of('Translated text'));

    await TestBed.configureTestingModule({
      declarations: [ResetPasswordComponent],
      imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatCardModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: TranslationService, useValue: mockTranslationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    pageObject = new ResetPasswordPageObject(fixture, loader);
    
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize reactive form with password fields', () => {
      expect(component.resetPasswordForm).toBeTruthy();
      expect(component.resetPasswordForm.get('password')).toBeTruthy();
      expect(component.resetPasswordForm.get('confirmPassword')).toBeTruthy();
    });

    it('should initialize with empty password values', () => {
      expect(component.resetPasswordForm.get('password')?.value).toBe('');
      expect(component.resetPasswordForm.get('confirmPassword')?.value).toBe('');
    });

    it('should initialize form as invalid', () => {
      expect(component.resetPasswordForm.invalid).toBe(true);
    });

    it('should set initial states correctly', () => {
      expect(component.isLoading).toBe(false);
      expect(component.isTokenValid).toBe(false);
      expect(component.isPasswordReset).toBe(false);
      expect(component.hidePassword).toBe(true);
      expect(component.hideConfirmPassword).toBe(true);
    });

    it('should extract token from query parameters', () => {
      expect(component.resetToken).toBe(validToken);
    });

    it('should validate token on initialization', fakeAsync(() => {
      tick();
      expect(mockAuthService.validateResetToken).toHaveBeenCalledWith(validToken);
      expect(component.isTokenValid).toBe(true);
    }));

    it('should display correct title', () => {
      component.isTokenValid = true;
      fixture.detectChanges();
      
      const titleElement = fixture.debugElement.query(By.css('h2'));
      expect(titleElement.nativeElement.textContent.trim()).toBe('รีเซ็ตรหัสผ่าน');
    });
  });

  describe('Token Validation', () => {
    it('should handle valid token', fakeAsync(() => {
      mockAuthService.validateResetToken.and.returnValue(of({ valid: true }));
      
      component.validateToken();
      tick();
      
      expect(component.isTokenValid).toBe(true);
      expect(component.tokenError).toBe('');
    }));

    it('should handle invalid token', fakeAsync(() => {
      mockAuthService.validateResetToken.and.returnValue(of({ 
        valid: false, 
        message: 'Invalid token' 
      }));
      
      component.validateToken();
      tick();
      
      expect(component.isTokenValid).toBe(false);
      expect(component.tokenError).toBe('Invalid token');
      expect(pageObject.isTokenExpiredStateVisible()).toBe(true);
    }));

    it('should handle expired token', fakeAsync(() => {
      mockAuthService.validateResetToken.and.returnValue(of({ 
        valid: false, 
        message: 'Token expired',
        expired: true 
      }));
      
      component.validateToken();
      tick();
      
      expect(component.isTokenValid).toBe(false);
      expect(component.tokenError).toContain('หมดอายุ');
      expect(pageObject.getTokenExpiredMessage()).toContain('ลิงก์รีเซ็ตรหัสผ่านหมดอายุแล้ว');
    }));

    it('should handle token validation network errors', fakeAsync(() => {
      mockAuthService.validateResetToken.and.returnValue(throwError('Network error'));
      
      component.validateToken();
      tick();
      
      expect(component.isTokenValid).toBe(false);
      expect(component.tokenError).toContain('เกิดข้อผิดพลาด');
    }));

    it('should show request new link button for expired token', fakeAsync(() => {
      mockAuthService.validateResetToken.and.returnValue(of({ 
        valid: false, 
        expired: true 
      }));
      
      component.validateToken();
      tick();
      fixture.detectChanges();
      
      const requestNewLinkButton = fixture.debugElement.query(By.css('[data-testid="request-new-link"]'));
      expect(requestNewLinkButton).toBeTruthy();
    }));

    it('should navigate to forgot password when requesting new link', async () => {
      component.isTokenValid = false;
      component.tokenError = 'expired';
      fixture.detectChanges();
      
      const requestNewLinkButton = fixture.debugElement.query(By.css('[data-testid="request-new-link"]'));
      requestNewLinkButton.nativeElement.click();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/forgot-password']);
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      component.isTokenValid = true;
      fixture.detectChanges();
    });

    it('should show required error for empty password', async () => {
      const passwordInput = await pageObject.getPasswordInput();
      await passwordInput.focus();
      await passwordInput.blur();
      
      fixture.detectChanges();
      
      expect(component.resetPasswordForm.get('password')?.hasError('required')).toBe(true);
      expect(pageObject.getErrorMessage('password')).toContain('กรุณากรอกรหัสผ่าน');
    });

    it('should show required error for empty confirm password', async () => {
      const confirmPasswordInput = await pageObject.getConfirmPasswordInput();
      await confirmPasswordInput.focus();
      await confirmPasswordInput.blur();
      
      fixture.detectChanges();
      
      expect(component.resetPasswordForm.get('confirmPassword')?.hasError('required')).toBe(true);
      expect(pageObject.getErrorMessage('confirmPassword')).toContain('กรุณายืนยันรหัสผ่าน');
    });

    it('should validate password strength', async () => {
      const passwordInput = await pageObject.getPasswordInput();
      
      // Test weak passwords
      const weakPasswords = ['123', 'password', 'PASSWORD', 'Password', '12345678'];
      
      for (const weakPassword of weakPasswords) {
        await passwordInput.setValue(weakPassword);
        fixture.detectChanges();
        
        expect(component.resetPasswordForm.get('password')?.hasError('pattern')).toBe(true);
        expect(pageObject.getErrorMessage('password')).toContain('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
      }
    });

    it('should accept strong passwords', async () => {
      const passwordInput = await pageObject.getPasswordInput();
      
      const strongPasswords = [
        'Password123!',
        'MySecure@Pass1',
        'Strong#Password123',
        'Secure$Pass2024'
      ];
      
      for (const strongPassword of strongPasswords) {
        await passwordInput.setValue(strongPassword);
        fixture.detectChanges();
        
        expect(component.resetPasswordForm.get('password')?.hasError('pattern')).toBe(false);
      }
    });

    it('should validate password confirmation match', async () => {
      const passwordInput = await pageObject.getPasswordInput();
      const confirmPasswordInput = await pageObject.getConfirmPasswordInput();
      
      // Test mismatched passwords
      await passwordInput.setValue('Password123!');
      await confirmPasswordInput.setValue('DifferentPassword123!');
      fixture.detectChanges();
      
      expect(component.resetPasswordForm.hasError('passwordMismatch')).toBe(true);
      expect(pageObject.getErrorMessage('confirmPassword')).toContain('รหัสผ่านไม่ตรงกัน');
    });

    it('should accept matched passwords', async () => {
      const passwordInput = await pageObject.getPasswordInput();
      const confirmPasswordInput = await pageObject.getConfirmPasswordInput();
      
      // Test matched passwords
      await passwordInput.setValue('Password123!');
      await confirmPasswordInput.setValue('Password123!');
      fixture.detectChanges();
      
      expect(component.resetPasswordForm.hasError('passwordMismatch')).toBe(false);
      expect(pageObject.getErrorMessage('confirmPassword')).toBeNull();
    });

    it('should validate minimum password length', async () => {
      const passwordInput = await pageObject.getPasswordInput();
      
      await passwordInput.setValue('Pass1!'); // Too short
      fixture.detectChanges();
      
      expect(component.resetPasswordForm.get('password')?.hasError('minlength')).toBe(true);
      expect(pageObject.getErrorMessage('password')).toContain('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
    });

    it('should validate maximum password length', async () => {
      const passwordInput = await pageObject.getPasswordInput();
      const longPassword = 'Password123!' + 'a'.repeat(100); // Too long
      
      await passwordInput.setValue(longPassword);
      fixture.detectChanges();
      
      expect(component.resetPasswordForm.get('password')?.hasError('maxlength')).toBe(true);
      expect(pageObject.getErrorMessage('password')).toContain('รหัสผ่านต้องไม่เกิน 50 ตัวอักษร');
    });
  });

  describe('Password Strength Indicator', () => {
    beforeEach(() => {
      component.isTokenValid = true;
      fixture.detectChanges();
    });

    it('should show password strength indicator', async () => {
      const passwordInput = await pageObject.getPasswordInput();
      await passwordInput.setValue('a');
      
      fixture.detectChanges();
      
      expect(pageObject.isPasswordStrengthIndicatorVisible()).toBe(true);
    });

    it('should calculate weak password strength', async () => {
      const passwordInput = await pageObject.getPasswordInput();
      await passwordInput.setValue('weak');
      
      fixture.detectChanges();
      
      expect(pageObject.getPasswordStrengthScore()).toBe(0);
      expect(pageObject.getPasswordStrengthText()).toContain('อ่อนมาก');
    });

    it('should calculate fair password strength', async () => {
      const passwordInput = await pageObject.getPasswordInput();
      await passwordInput.setValue('password123');
      
      fixture.detectChanges();
      
      expect(pageObject.getPasswordStrengthScore()).toBe(1);
      expect(pageObject.getPasswordStrengthText()).toContain('อ่อน');
    });

    it('should calculate good password strength', async () => {
      const passwordInput = await pageObject.getPasswordInput();
      await passwordInput.setValue('Password123');
      
      fixture.detectChanges();
      
      expect(pageObject.getPasswordStrengthScore()).toBe(2);
      expect(pageObject.getPasswordStrengthText()).toContain('พอใช้');
    });

    it('should calculate strong password strength', async () => {
      const passwordInput = await pageObject.getPasswordInput();
      await passwordInput.setValue('Password123!');
      
      fixture.detectChanges();
      
      expect(pageObject.getPasswordStrengthScore()).toBe(3);
      expect(pageObject.getPasswordStrengthText()).toContain('ดี');
    });

    it('should calculate very strong password strength', async () => {
      const passwordInput = await pageObject.getPasswordInput();
      await passwordInput.setValue('MyVerySecure@Password123!');
      
      fixture.detectChanges();
      
      expect(pageObject.getPasswordStrengthScore()).toBe(4);
      expect(pageObject.getPasswordStrengthText()).toContain('แข็งแรงมาก');
    });

    it('should update strength indicator color based on score', async () => {
      const passwordInput = await pageObject.getPasswordInput();
      
      await passwordInput.setValue('weak');
      fixture.detectChanges();
      
      const strengthIndicator = fixture.debugElement.query(By.css('[data-testid="password-strength-bar"]'));
      expect(strengthIndicator.nativeElement.classList).toContain('strength-0');
      
      await passwordInput.setValue('Password123!');
      fixture.detectChanges();
      
      expect(strengthIndicator.nativeElement.classList).toContain('strength-3');
    });
  });

  describe('Password Visibility Toggle', () => {
    beforeEach(() => {
      component.isTokenValid = true;
      fixture.detectChanges();
    });

    it('should toggle password visibility', async () => {
      expect(component.hidePassword).toBe(true);
      
      const showPasswordButton = await pageObject.getShowPasswordButton();
      await showPasswordButton.click();
      
      expect(component.hidePassword).toBe(false);
    });

    it('should toggle confirm password visibility', async () => {
      expect(component.hideConfirmPassword).toBe(true);
      
      const showConfirmPasswordButton = await pageObject.getShowConfirmPasswordButton();
      await showConfirmPasswordButton.click();
      
      expect(component.hideConfirmPassword).toBe(false);
    });

    it('should update password input type when toggling visibility', async () => {
      const passwordInput = await pageObject.getPasswordInput();
      
      expect(await passwordInput.getType()).toBe('password');
      
      component.togglePasswordVisibility();
      fixture.detectChanges();
      
      expect(await passwordInput.getType()).toBe('text');
    });

    it('should update confirm password input type when toggling visibility', async () => {
      const confirmPasswordInput = await pageObject.getConfirmPasswordInput();
      
      expect(await confirmPasswordInput.getType()).toBe('password');
      
      component.toggleConfirmPasswordVisibility();
      fixture.detectChanges();
      
      expect(await confirmPasswordInput.getType()).toBe('text');
    });

    it('should update visibility icon when toggling', async () => {
      const showPasswordButton = await pageObject.getShowPasswordButton();
      
      expect(await showPasswordButton.getText()).toContain('visibility');
      
      await showPasswordButton.click();
      
      expect(await showPasswordButton.getText()).toContain('visibility_off');
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.isTokenValid = true;
      fixture.detectChanges();
    });

    it('should disable submit button when form is invalid', async () => {
      const resetButton = await pageObject.getResetPasswordButton();
      expect(await resetButton.isDisabled()).toBe(true);
    });

    it('should enable submit button when form is valid', async () => {
      await pageObject.fillValidPasswords('Password123!');
      
      const resetButton = await pageObject.getResetPasswordButton();
      expect(await resetButton.isDisabled()).toBe(false);
    });

    it('should call resetPassword service with correct data', async () => {
      await pageObject.fillValidPasswords('Password123!');
      
      mockAuthService.resetPassword.and.returnValue(of({ 
        success: true, 
        message: 'Password reset successfully' 
      }));
      
      await pageObject.submitForm();
      
      expect(mockAuthService.resetPassword).toHaveBeenCalledWith({
        token: validToken,
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });
    });

    it('should show loading spinner during submission', fakeAsync(() => {
      pageObject.fillValidPasswords('Password123!');
      tick();
      
      mockAuthService.resetPassword.and.returnValue(of({ success: true }));
      
      pageObject.submitForm();
      tick();
      
      expect(component.isLoading).toBe(true);
      expect(pageObject.isLoadingSpinnerVisible()).toBe(true);
    }));

    it('should disable form during submission', async () => {
      await pageObject.fillValidPasswords('Password123!');
      
      mockAuthService.resetPassword.and.returnValue(of({ success: true }));
      
      await pageObject.submitForm();
      
      expect(pageObject.isFormDisabled()).toBe(true);
    });

    it('should show success state after successful reset', fakeAsync(() => {
      pageObject.fillValidPasswords('Password123!');
      tick();
      
      mockAuthService.resetPassword.and.returnValue(of({ 
        success: true, 
        message: 'Password reset successfully' 
      }));
      
      pageObject.submitForm();
      tick();
      
      expect(component.isPasswordReset).toBe(true);
      expect(pageObject.isSuccessStateVisible()).toBe(true);
      expect(pageObject.getSuccessMessage()).toContain('รีเซ็ตรหัสผ่านสำเร็จ');
    }));

    it('should show success notification on successful reset', fakeAsync(() => {
      pageObject.fillValidPasswords('Password123!');
      tick();
      
      mockAuthService.resetPassword.and.returnValue(of({ 
        success: true, 
        message: 'Password reset successfully' 
      }));
      
      pageObject.submitForm();
      tick();
      
      expect(mockNotificationService.showSuccess).toHaveBeenCalledWith(
        'รีเซ็ตรหัสผ่านสำเร็จ คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้แล้ว'
      );
    }));

    it('should auto-navigate to login after successful reset', fakeAsync(() => {
      pageObject.fillValidPasswords('Password123!');
      tick();
      
      mockAuthService.resetPassword.and.returnValue(of({ 
        success: true, 
        message: 'Password reset successfully' 
      }));
      
      pageObject.submitForm();
      tick(3000); // Wait for auto-navigation timer
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
    }));

    it('should handle reset password errors gracefully', fakeAsync(() => {
      pageObject.fillValidPasswords('Password123!');
      tick();
      
      mockAuthService.resetPassword.and.returnValue(throwError({
        error: { message: 'Password reset failed' }
      }));
      
      pageObject.submitForm();
      tick();
      
      expect(mockNotificationService.showError).toHaveBeenCalledWith('Password reset failed');
      expect(component.isLoading).toBe(false);
      expect(component.isPasswordReset).toBe(false);
    }));

    it('should handle network errors gracefully', fakeAsync(() => {
      pageObject.fillValidPasswords('Password123!');
      tick();
      
      mockAuthService.resetPassword.and.returnValue(throwError('Network error'));
      
      pageObject.submitForm();
      tick();
      
      expect(mockNotificationService.showError).toHaveBeenCalledWith(
        'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง'
      );
      expect(component.isLoading).toBe(false);
    }));

    it('should handle token expired during reset', fakeAsync(() => {
      pageObject.fillValidPasswords('Password123!');
      tick();
      
      mockAuthService.resetPassword.and.returnValue(throwError({
        status: 401,
        error: { message: 'Token expired' }
      }));
      
      pageObject.submitForm();
      tick();
      
      expect(component.isTokenValid).toBe(false);
      expect(component.tokenError).toContain('หมดอายุ');
      expect(pageObject.isTokenExpiredStateVisible()).toBe(true);
    }));
  });

  describe('Success State', () => {
    beforeEach(fakeAsync(() => {
      component.isTokenValid = true;
      fixture.detectChanges();
      
      pageObject.fillValidPasswords('Password123!');
      tick();
      
      mockAuthService.resetPassword.and.returnValue(of({ 
        success: true, 
        message: 'Password reset successfully' 
      }));
      
      pageObject.submitForm();
      tick();
    }));

    it('should display success message', () => {
      expect(pageObject.getSuccessMessage()).toContain('รีเซ็ตรหัสผ่านสำเร็จ');
      expect(pageObject.getSuccessMessage()).toContain('เข้าสู่ระบบด้วยรหัสผ่านใหม่');
    });

    it('should show success icon', () => {
      const iconElement = fixture.debugElement.query(By.css('[data-testid="success-icon"]'));
      expect(iconElement).toBeTruthy();
      expect(iconElement.nativeElement.textContent.trim()).toBe('check_circle');
    });

    it('should hide the reset form', () => {
      const formElement = fixture.debugElement.query(By.css('[data-testid="reset-password-form"]'));
      expect(formElement.nativeElement.style.display).toBe('none');
    });

    it('should show countdown timer for auto-navigation', fakeAsync(() => {
      tick(1000);
      fixture.detectChanges();
      
      const countdownElement = fixture.debugElement.query(By.css('[data-testid="countdown"]'));
      expect(countdownElement.nativeElement.textContent).toContain('2');
    }));

    it('should allow manual navigation to login', async () => {
      const loginButton = await pageObject.getBackToLoginButton();
      await loginButton.click();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });

  describe('Navigation', () => {
    it('should navigate to login page when back button is clicked', async () => {
      component.isTokenValid = true;
      fixture.detectChanges();
      
      const backButton = await pageObject.getBackToLoginButton();
      await backButton.click();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
    });

    it('should navigate to forgot password for expired token', async () => {
      component.isTokenValid = false;
      component.tokenError = 'expired';
      fixture.detectChanges();
      
      const requestNewButton = fixture.debugElement.query(By.css('[data-testid="request-new-link"]'));
      requestNewButton.nativeElement.click();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/forgot-password']);
    });

    it('should preserve navigation state during loading', async () => {
      component.isTokenValid = true;
      component.isLoading = true;
      fixture.detectChanges();
      
      const backButton = await pageObject.getBackToLoginButton();
      expect(await backButton.isDisabled()).toBe(true);
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      component.isTokenValid = true;
      fixture.detectChanges();
    });

    it('should have proper ARIA labels on form controls', () => {
      const formControls = fixture.debugElement.queryAll(By.css('input, button'));
      
      formControls.forEach(control => {
        const element = control.nativeElement;
        expect(
          element.getAttribute('aria-label') || 
          element.getAttribute('aria-labelledby') ||
          element.getAttribute('aria-describedby')
        ).toBeTruthy();
      });
    });

    it('should have proper ARIA attributes for error states', async () => {
      const passwordInput = await pageObject.getPasswordInput();
      await passwordInput.focus();
      await passwordInput.blur();
      
      fixture.detectChanges();
      
      const inputElement = await passwordInput.host();
      expect(await inputElement.getAttribute('aria-invalid')).toBe('true');
      expect(await inputElement.getAttribute('aria-describedby')).toBeTruthy();
    });

    it('should announce form errors to screen readers', async () => {
      const passwordInput = await pageObject.getPasswordInput();
      await passwordInput.setValue('weak');
      await passwordInput.blur();
      
      fixture.detectChanges();
      
      const errorElement = fixture.debugElement.query(By.css('[data-testid="password-error"]'));
      expect(errorElement.nativeElement.getAttribute('role')).toBe('alert');
      expect(errorElement.nativeElement.getAttribute('aria-live')).toBe('polite');
    });

    it('should support keyboard navigation', () => {
      const formElements = fixture.debugElement.queryAll(By.css('input, button'));
      
      formElements.forEach(element => {
        expect(element.nativeElement.tabIndex).not.toBe(-1);
      });
    });

    it('should have focus indicators on interactive elements', () => {
      const interactiveElements = fixture.debugElement.queryAll(By.css('button, input'));
      
      interactiveElements.forEach(element => {
        element.nativeElement.focus();
        fixture.detectChanges();
        
        const computedStyle = window.getComputedStyle(element.nativeElement);
        expect(computedStyle.outline).not.toBe('none');
      });
    });

    it('should have proper form structure with fieldsets', () => {
      const formElement = fixture.debugElement.query(By.css('form'));
      expect(formElement.nativeElement.getAttribute('role')).toBe('form');
      
      const fieldsetElements = fixture.debugElement.queryAll(By.css('mat-form-field'));
      expect(fieldsetElements.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      component.isTokenValid = true;
      fixture.detectChanges();
    });

    it('should handle service unavailable error', fakeAsync(() => {
      pageObject.fillValidPasswords('Password123!');
      tick();
      
      mockAuthService.resetPassword.and.returnValue(throwError({
        status: 503,
        error: { message: 'Service unavailable' }
      }));
      
      pageObject.submitForm();
      tick();
      
      expect(mockNotificationService.showError).toHaveBeenCalledWith(
        'ระบบไม่พร้อมให้บริการในขณะนี้ กรุณาลองใหม่ภายหลัง'
      );
    }));

    it('should handle validation errors from server', fakeAsync(() => {
      pageObject.fillValidPasswords('Password123!');
      tick();
      
      mockAuthService.resetPassword.and.returnValue(throwError({
        status: 400,
        error: { 
          message: 'Validation failed',
          errors: {
            password: 'Password too weak',
            confirmPassword: 'Passwords do not match'
          }
        }
      }));
      
      pageObject.submitForm();
      tick();
      
      expect(component.resetPasswordForm.get('password')?.hasError('serverError')).toBe(true);
      expect(component.resetPasswordForm.get('confirmPassword')?.hasError('serverError')).toBe(true);
    }));

    it('should clear server errors when user modifies field', async () => {
      // Set server error
      component.resetPasswordForm.get('password')?.setErrors({ serverError: 'Server error' });
      fixture.detectChanges();
      
      // User modifies field
      const passwordInput = await pageObject.getPasswordInput();
      await passwordInput.setValue('NewPassword123!');
      
      fixture.detectChanges();
      
      expect(component.resetPasswordForm.get('password')?.hasError('serverError')).toBe(false);
    });

    it('should handle timeout errors', fakeAsync(() => {
      pageObject.fillValidPasswords('Password123!');
      tick();
      
      mockAuthService.resetPassword.and.returnValue(throwError({
        name: 'TimeoutError',
        message: 'Request timeout'
      }));
      
      pageObject.submitForm();
      tick();
      
      expect(mockNotificationService.showError).toHaveBeenCalledWith(
        'การเชื่อมต่อใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง'
      );
    }));
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      component.isTokenValid = true;
      fixture.detectChanges();
    });

    it('should handle empty space values correctly', async () => {
      const passwordInput = await pageObject.getPasswordInput();
      await passwordInput.setValue('   ');
      fixture.detectChanges();
      
      expect(component.resetPasswordForm.get('password')?.hasError('required')).toBe(true);
    });

    it('should trim whitespace from password inputs', async () => {
      const passwordInput = await pageObject.getPasswordInput();
      const confirmPasswordInput = await pageObject.getConfirmPasswordInput();
      
      await passwordInput.setValue('  Password123!  ');
      await confirmPasswordInput.setValue('  Password123!  ');
      
      fixture.detectChanges();
      
      expect(component.resetPasswordForm.get('password')?.value).toBe('Password123!');
      expect(component.resetPasswordForm.get('confirmPassword')?.value).toBe('Password123!');
    });

    it('should handle component destruction during async operations', fakeAsync(() => {
      pageObject.fillValidPasswords('Password123!');
      tick();
      
      // Start async operation
      mockAuthService.resetPassword.and.returnValue(of({ success: true }));
      pageObject.submitForm();
      
      // Destroy component before operation completes
      component.ngOnDestroy();
      tick();
      
      // Should not cause errors
      expect(component.isLoading).toBe(false);
    }));

    it('should handle special characters in passwords', async () => {
      const passwordInput = await pageObject.getPasswordInput();
      const confirmPasswordInput = await pageObject.getConfirmPasswordInput();
      
      const specialPassword = 'P@$$w0rd!#$%^&*()';
      
      await passwordInput.setValue(specialPassword);
      await confirmPasswordInput.setValue(specialPassword);
      
      fixture.detectChanges();
      
      expect(component.resetPasswordForm.valid).toBe(true);
    });
  });

  describe('Security', () => {
    it('should not log sensitive information', () => {
      spyOn(console, 'log');
      spyOn(console, 'error');
      spyOn(console, 'warn');
      
      component.resetPasswordForm.get('password')?.setValue('Password123!');
      fixture.detectChanges();
      
      expect(console.log).not.toHaveBeenCalledWith(jasmine.stringMatching(/Password123!/));
      expect(console.error).not.toHaveBeenCalledWith(jasmine.stringMatching(/Password123!/));
      expect(console.warn).not.toHaveBeenCalledWith(jasmine.stringMatching(/Password123!/));
    });

    it('should clear password fields on navigation away', () => {
      component.resetPasswordForm.get('password')?.setValue('Password123!');
      component.resetPasswordForm.get('confirmPassword')?.setValue('Password123!');
      
      component.ngOnDestroy();
      
      expect(component.resetPasswordForm.get('password')?.value).toBe('');
      expect(component.resetPasswordForm.get('confirmPassword')?.value).toBe('');
    });

    it('should validate token format on client side', () => {
      const invalidTokens = [
        '',
        'short',
        'token-with-spaces',
        '<script>alert("xss")</script>'
      ];
      
      for (const invalidToken of invalidTokens) {
        component.resetToken = invalidToken;
        expect(component.isValidTokenFormat()).toBe(false);
      }
    });

    it('should handle XSS attempts in error messages', fakeAsync(() => {
      pageObject.fillValidPasswords('Password123!');
      tick();
      
      mockAuthService.resetPassword.and.returnValue(throwError({
        error: { message: '<script>alert("xss")</script>' }
      }));
      
      pageObject.submitForm();
      tick();
      
      const errorMessage = pageObject.getGeneralErrorMessage();
      expect(errorMessage).not.toContain('<script>');
    }));
  });

  describe('Internationalization', () => {
    it('should use translation service for error messages', async () => {
      component.isTokenValid = true;
      fixture.detectChanges();
      
      const passwordInput = await pageObject.getPasswordInput();
      await passwordInput.focus();
      await passwordInput.blur();
      
      fixture.detectChanges();
      
      expect(mockTranslationService.translate).toHaveBeenCalledWith('validation.required.password');
    });

    it('should update text when language changes', () => {
      mockTranslationService.getTranslation.and.returnValue(of('New Text'));
      
      component.changeLanguage('en');
      fixture.detectChanges();
      
      expect(mockTranslationService.getTranslation).toHaveBeenCalled();
    });

    it('should support RTL languages', () => {
      component.currentLanguage = 'ar';
      fixture.detectChanges();
      
      const formElement = fixture.debugElement.query(By.css('form'));
      expect(formElement.nativeElement.dir).toBe('rtl');
    });
  });

  describe('Performance', () => {
    it('should debounce password strength calculation', fakeAsync(() => {
      spyOn(component, 'calculatePasswordStrength').and.callThrough();
      
      const passwordControl = component.resetPasswordForm.get('password');
      
      passwordControl?.setValue('P');
      tick(100);
      passwordControl?.setValue('Pa');
      tick(100);
      passwordControl?.setValue('Pass');
      tick(300);
      
      expect(component.calculatePasswordStrength).toHaveBeenCalledTimes(1);
    }));

    it('should cancel pending HTTP requests on component destroy', () => {
      spyOn(component, 'ngOnDestroy').and.callThrough();
      
      fixture.destroy();
      
      expect(component.ngOnDestroy).toHaveBeenCalled();
    });
  });
});