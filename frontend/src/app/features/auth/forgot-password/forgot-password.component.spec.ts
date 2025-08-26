import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoadingService } from '../../../core/services/loading.service';
import { TranslationService } from '../../../core/services/translation.service';

// Page Object for ForgotPassword Component
class ForgotPasswordPageObject {
  constructor(
    private fixture: ComponentFixture<ForgotPasswordComponent>,
    private loader: HarnessLoader
  ) {}

  get component(): ForgotPasswordComponent {
    return this.fixture.componentInstance;
  }

  get compiled(): HTMLElement {
    return this.fixture.nativeElement;
  }

  // Input field getters
  async getEmailInput(): Promise<MatInputHarness> {
    return this.loader.getHarness(MatInputHarness.with({ placeholder: 'อีเมลที่ลงทะเบียน' }));
  }

  // Button getters
  async getSendResetButton(): Promise<MatButtonHarness> {
    return this.loader.getHarness(MatButtonHarness.with({ text: 'ส่งลิงก์รีเซ็ตรหัสผ่าน' }));
  }

  async getBackToLoginButton(): Promise<MatButtonHarness> {
    return this.loader.getHarness(MatButtonHarness.with({ text: 'กลับไปหน้าเข้าสู่ระบบ' }));
  }

  async getResendButton(): Promise<MatButtonHarness | null> {
    try {
      return this.loader.getHarness(MatButtonHarness.with({ text: 'ส่งอีกครั้ง' }));
    } catch {
      return null;
    }
  }

  // Helper methods
  getErrorMessage(): string | null {
    const errorElement = this.compiled.querySelector('[data-testid="email-error"]');
    return errorElement ? errorElement.textContent?.trim() || null : null;
  }

  getSuccessMessage(): string | null {
    const successElement = this.compiled.querySelector('[data-testid="success-message"]');
    return successElement ? successElement.textContent?.trim() || null : null;
  }

  getInfoMessage(): string | null {
    const infoElement = this.compiled.querySelector('[data-testid="info-message"]');
    return infoElement ? infoElement.textContent?.trim() || null : null;
  }

  isLoadingSpinnerVisible(): boolean {
    return !!this.compiled.querySelector('mat-spinner');
  }

  isFormDisabled(): boolean {
    return this.component.forgotPasswordForm.disabled;
  }

  isSuccessStateVisible(): boolean {
    return !!this.compiled.querySelector('[data-testid="success-state"]');
  }

  isResendTimerVisible(): boolean {
    return !!this.compiled.querySelector('[data-testid="resend-timer"]');
  }

  getResendTimerValue(): string | null {
    const timerElement = this.compiled.querySelector('[data-testid="resend-timer"]');
    return timerElement ? timerElement.textContent?.trim() || null : null;
  }

  async submitForm(): Promise<void> {
    const sendButton = await this.getSendResetButton();
    await sendButton.click();
    this.fixture.detectChanges();
  }

  async fillValidEmail(email: string = 'test@example.com'): Promise<void> {
    const emailInput = await this.getEmailInput();
    await emailInput.setValue(email);
    this.fixture.detectChanges();
  }
}

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let pageObject: ForgotPasswordPageObject;
  let loader: HarnessLoader;
  
  // Mock services
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let mockTranslationService: jasmine.SpyObj<TranslationService>;

  beforeEach(async () => {
    // Create mock services
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'forgotPassword',
      'checkEmailExists'
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
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
    mockAuthService.forgotPassword.and.returnValue(of({ success: true, message: 'Reset link sent' }));
    mockAuthService.checkEmailExists.and.returnValue(of(true));
    mockTranslationService.translate.and.returnValue('Translated text');
    mockTranslationService.getTranslation.and.returnValue(of('Translated text'));

    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordComponent],
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
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: TranslationService, useValue: mockTranslationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    pageObject = new ForgotPasswordPageObject(fixture, loader);
    
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize reactive form with email field', () => {
      expect(component.forgotPasswordForm).toBeTruthy();
      expect(component.forgotPasswordForm.get('email')).toBeTruthy();
    });

    it('should initialize with empty email value', () => {
      expect(component.forgotPasswordForm.get('email')?.value).toBe('');
    });

    it('should initialize form as invalid', () => {
      expect(component.forgotPasswordForm.invalid).toBe(true);
    });

    it('should set initial states correctly', () => {
      expect(component.isLoading).toBe(false);
      expect(component.isEmailSent).toBe(false);
      expect(component.canResend).toBe(true);
      expect(component.resendTimer).toBe(0);
    });

    it('should display correct initial title', () => {
      const titleElement = fixture.debugElement.query(By.css('h2'));
      expect(titleElement.nativeElement.textContent.trim()).toBe('ลืมรหัสผ่าน?');
    });

    it('should display initial instructions', () => {
      const instructionElement = fixture.debugElement.query(By.css('[data-testid="instructions"]'));
      expect(instructionElement.nativeElement.textContent).toContain('กรอกอีเมลที่คุณใช้ลงทะเบียน');
    });
  });

  describe('Form Validation', () => {
    it('should show required error for empty email', async () => {
      const emailInput = await pageObject.getEmailInput();
      await emailInput.focus();
      await emailInput.blur();
      
      fixture.detectChanges();
      
      expect(component.forgotPasswordForm.get('email')?.hasError('required')).toBe(true);
      expect(pageObject.getErrorMessage()).toContain('กรุณากรอกอีเมล');
    });

    it('should validate email format', async () => {
      const emailInput = await pageObject.getEmailInput();
      
      // Test invalid email formats
      const invalidEmails = ['invalid-email', 'test@', '@domain.com', 'test..test@domain.com'];
      
      for (const invalidEmail of invalidEmails) {
        await emailInput.setValue(invalidEmail);
        fixture.detectChanges();
        
        expect(component.forgotPasswordForm.get('email')?.hasError('email')).toBe(true);
        expect(pageObject.getErrorMessage()).toContain('รูปแบบอีเมลไม่ถูกต้อง');
      }
    });

    it('should accept valid email formats', async () => {
      const emailInput = await pageObject.getEmailInput();
      
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.th',
        'test+tag@example.org',
        'valid.email123@sub.domain.com'
      ];
      
      for (const validEmail of validEmails) {
        await emailInput.setValue(validEmail);
        fixture.detectChanges();
        
        expect(component.forgotPasswordForm.get('email')?.hasError('email')).toBe(false);
      }
    });

    it('should trim whitespace from email input', async () => {
      const emailInput = await pageObject.getEmailInput();
      await emailInput.setValue('  test@example.com  ');
      
      fixture.detectChanges();
      
      expect(component.forgotPasswordForm.get('email')?.value).toBe('test@example.com');
    });

    it('should convert email to lowercase', async () => {
      const emailInput = await pageObject.getEmailInput();
      await emailInput.setValue('TEST@EXAMPLE.COM');
      
      fixture.detectChanges();
      
      expect(component.forgotPasswordForm.get('email')?.value).toBe('test@example.com');
    });
  });

  describe('Email Existence Validation', () => {
    it('should check if email exists before sending reset link', fakeAsync(() => {
      mockAuthService.checkEmailExists.and.returnValue(of(true));
      
      const emailControl = component.forgotPasswordForm.get('email');
      emailControl?.setValue('existing@test.com');
      
      tick(500); // Wait for debounce
      fixture.detectChanges();
      
      expect(mockAuthService.checkEmailExists).toHaveBeenCalledWith('existing@test.com');
      expect(emailControl?.hasError('emailNotFound')).toBe(false);
    }));

    it('should show error if email does not exist', fakeAsync(() => {
      mockAuthService.checkEmailExists.and.returnValue(of(false));
      
      const emailControl = component.forgotPasswordForm.get('email');
      emailControl?.setValue('nonexistent@test.com');
      
      tick(500); // Wait for debounce
      fixture.detectChanges();
      
      expect(emailControl?.hasError('emailNotFound')).toBe(true);
      expect(pageObject.getErrorMessage()).toContain('ไม่พบอีเมลนี้ในระบบ');
    }));

    it('should handle email check API errors gracefully', fakeAsync(() => {
      mockAuthService.checkEmailExists.and.returnValue(throwError('Network error'));
      
      const emailControl = component.forgotPasswordForm.get('email');
      emailControl?.setValue('test@test.com');
      
      tick(500);
      fixture.detectChanges();
      
      expect(emailControl?.hasError('emailCheckError')).toBe(true);
      expect(pageObject.getErrorMessage()).toContain('ไม่สามารถตรวจสอบอีเมลได้');
    }));

    it('should debounce email existence check', fakeAsync(() => {
      const emailControl = component.forgotPasswordForm.get('email');
      
      emailControl?.setValue('test1@example.com');
      tick(100);
      emailControl?.setValue('test2@example.com');
      tick(100);
      emailControl?.setValue('test3@example.com');
      tick(500);
      
      expect(mockAuthService.checkEmailExists).toHaveBeenCalledTimes(1);
      expect(mockAuthService.checkEmailExists).toHaveBeenCalledWith('test3@example.com');
    }));
  });

  describe('Form Submission', () => {
    it('should disable submit button when form is invalid', async () => {
      const sendButton = await pageObject.getSendResetButton();
      expect(await sendButton.isDisabled()).toBe(true);
    });

    it('should enable submit button when form is valid', async () => {
      await pageObject.fillValidEmail('test@example.com');
      
      const sendButton = await pageObject.getSendResetButton();
      expect(await sendButton.isDisabled()).toBe(false);
    });

    it('should call forgotPassword service with correct email', async () => {
      await pageObject.fillValidEmail('test@example.com');
      
      mockAuthService.forgotPassword.and.returnValue(of({ 
        success: true, 
        message: 'Reset link sent successfully' 
      }));
      
      await pageObject.submitForm();
      
      expect(mockAuthService.forgotPassword).toHaveBeenCalledWith('test@example.com');
    });

    it('should show loading spinner during submission', fakeAsync(() => {
      pageObject.fillValidEmail('test@example.com');
      tick();
      
      mockAuthService.forgotPassword.and.returnValue(of({ success: true }));
      
      pageObject.submitForm();
      tick();
      
      expect(component.isLoading).toBe(true);
      expect(pageObject.isLoadingSpinnerVisible()).toBe(true);
    }));

    it('should disable form during submission', async () => {
      await pageObject.fillValidEmail('test@example.com');
      
      mockAuthService.forgotPassword.and.returnValue(of({ success: true }));
      
      await pageObject.submitForm();
      
      expect(pageObject.isFormDisabled()).toBe(true);
    });

    it('should show success state after successful submission', fakeAsync(() => {
      pageObject.fillValidEmail('test@example.com');
      tick();
      
      mockAuthService.forgotPassword.and.returnValue(of({ 
        success: true, 
        message: 'Reset link sent successfully' 
      }));
      
      pageObject.submitForm();
      tick();
      
      expect(component.isEmailSent).toBe(true);
      expect(pageObject.isSuccessStateVisible()).toBe(true);
      expect(pageObject.getSuccessMessage()).toContain('ส่งลิงก์รีเซ็ตรหัสผ่านแล้ว');
    }));

    it('should show success notification on successful submission', fakeAsync(() => {
      pageObject.fillValidEmail('test@example.com');
      tick();
      
      mockAuthService.forgotPassword.and.returnValue(of({ 
        success: true, 
        message: 'Reset link sent successfully' 
      }));
      
      pageObject.submitForm();
      tick();
      
      expect(mockNotificationService.showSuccess).toHaveBeenCalledWith(
        'ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว'
      );
    }));

    it('should handle submission errors gracefully', fakeAsync(() => {
      pageObject.fillValidEmail('test@example.com');
      tick();
      
      mockAuthService.forgotPassword.and.returnValue(throwError({
        error: { message: 'Failed to send reset link' }
      }));
      
      pageObject.submitForm();
      tick();
      
      expect(mockNotificationService.showError).toHaveBeenCalledWith('Failed to send reset link');
      expect(component.isLoading).toBe(false);
      expect(component.isEmailSent).toBe(false);
    }));

    it('should handle network errors gracefully', fakeAsync(() => {
      pageObject.fillValidEmail('test@example.com');
      tick();
      
      mockAuthService.forgotPassword.and.returnValue(throwError('Network error'));
      
      pageObject.submitForm();
      tick();
      
      expect(mockNotificationService.showError).toHaveBeenCalledWith(
        'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง'
      );
      expect(component.isLoading).toBe(false);
    }));
  });

  describe('Success State', () => {
    beforeEach(fakeAsync(() => {
      pageObject.fillValidEmail('test@example.com');
      tick();
      
      mockAuthService.forgotPassword.and.returnValue(of({ 
        success: true, 
        message: 'Reset link sent successfully' 
      }));
      
      pageObject.submitForm();
      tick();
    }));

    it('should display success message with email', () => {
      expect(pageObject.getSuccessMessage()).toContain('test@example.com');
      expect(pageObject.getSuccessMessage()).toContain('ตรวจสอบอีเมลของคุณ');
    });

    it('should show email sent icon', () => {
      const iconElement = fixture.debugElement.query(By.css('[data-testid="email-sent-icon"]'));
      expect(iconElement).toBeTruthy();
      expect(iconElement.nativeElement.textContent.trim()).toBe('mark_email_read');
    });

    it('should display additional instructions', () => {
      const instructionsElement = fixture.debugElement.query(By.css('[data-testid="success-instructions"]'));
      expect(instructionsElement.nativeElement.textContent).toContain('คลิกลิงก์ในอีเมลเพื่อรีเซ็ตรหัสผ่าน');
      expect(instructionsElement.nativeElement.textContent).toContain('ตรวจสอบโฟลเดอร์สแปมด้วย');
    });

    it('should hide the original form', () => {
      const formElement = fixture.debugElement.query(By.css('[data-testid="forgot-password-form"]'));
      expect(formElement.nativeElement.style.display).toBe('none');
    });
  });

  describe('Resend Functionality', () => {
    beforeEach(fakeAsync(() => {
      // First submission
      pageObject.fillValidEmail('test@example.com');
      tick();
      
      mockAuthService.forgotPassword.and.returnValue(of({ 
        success: true, 
        message: 'Reset link sent successfully' 
      }));
      
      pageObject.submitForm();
      tick();
    }));

    it('should start resend timer after successful submission', fakeAsync(() => {
      expect(component.canResend).toBe(false);
      expect(component.resendTimer).toBe(60);
      expect(pageObject.isResendTimerVisible()).toBe(true);
      
      tick(1000);
      fixture.detectChanges();
      
      expect(component.resendTimer).toBe(59);
    }));

    it('should enable resend button after timer expires', fakeAsync(() => {
      tick(60000); // Wait for 60 seconds
      fixture.detectChanges();
      
      expect(component.canResend).toBe(true);
      expect(component.resendTimer).toBe(0);
      
      const resendButton = await pageObject.getResendButton();
      expect(resendButton).toBeTruthy();
      expect(await resendButton!.isDisabled()).toBe(false);
    }));

    it('should show countdown timer text', fakeAsync(() => {
      tick(1000);
      fixture.detectChanges();
      
      expect(pageObject.getResendTimerValue()).toContain('59');
      expect(pageObject.getResendTimerValue()).toContain('วินาที');
    }));

    it('should resend email when resend button is clicked', fakeAsync(() => {
      // Wait for timer to expire
      tick(60000);
      fixture.detectChanges();
      
      const resendButton = await pageObject.getResendButton();
      mockAuthService.forgotPassword.and.returnValue(of({ success: true }));
      
      await resendButton!.click();
      
      expect(mockAuthService.forgotPassword).toHaveBeenCalledWith('test@example.com');
      expect(component.canResend).toBe(false);
      expect(component.resendTimer).toBe(60);
    }));

    it('should handle resend errors gracefully', fakeAsync(() => {
      // Wait for timer to expire
      tick(60000);
      fixture.detectChanges();
      
      const resendButton = await pageObject.getResendButton();
      mockAuthService.forgotPassword.and.returnValue(throwError('Resend failed'));
      
      await resendButton!.click();
      
      expect(mockNotificationService.showError).toHaveBeenCalledWith(
        'เกิดข้อผิดพลาดในการส่งอีเมล กรุณาลองใหม่อีกครั้ง'
      );
    }));

    it('should limit number of resend attempts', fakeAsync(() => {
      // Simulate multiple resend attempts
      for (let i = 0; i < 5; i++) {
        tick(60000); // Wait for timer
        fixture.detectChanges();
        
        const resendButton = await pageObject.getResendButton();
        mockAuthService.forgotPassword.and.returnValue(of({ success: true }));
        
        if (resendButton) {
          await resendButton.click();
        }
      }
      
      // After maximum attempts, resend should be disabled
      expect(component.maxResendAttempts).toBe(3);
      expect(component.resendAttempts).toBe(3);
    }));
  });

  describe('Navigation', () => {
    it('should navigate to login page when back button is clicked', async () => {
      const backButton = await pageObject.getBackToLoginButton();
      await backButton.click();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
    });

    it('should navigate to login from success state', fakeAsync(async () => {
      // Get to success state
      pageObject.fillValidEmail('test@example.com');
      tick();
      mockAuthService.forgotPassword.and.returnValue(of({ success: true }));
      pageObject.submitForm();
      tick();
      fixture.detectChanges();
      
      const backButton = await pageObject.getBackToLoginButton();
      await backButton.click();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
    }));

    it('should preserve navigation state during loading', async () => {
      await pageObject.fillValidEmail('test@example.com');
      
      mockAuthService.forgotPassword.and.returnValue(of({ success: true }));
      
      // Try to navigate while loading
      component.isLoading = true;
      fixture.detectChanges();
      
      const backButton = await pageObject.getBackToLoginButton();
      expect(await backButton.isDisabled()).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels on form controls', () => {
      const emailInput = fixture.debugElement.query(By.css('input[type="email"]'));
      expect(emailInput.nativeElement.getAttribute('aria-label')).toBeTruthy();
    });

    it('should have proper ARIA attributes for error states', async () => {
      const emailInput = await pageObject.getEmailInput();
      await emailInput.focus();
      await emailInput.blur();
      
      fixture.detectChanges();
      
      const inputElement = await emailInput.host();
      expect(await inputElement.getAttribute('aria-invalid')).toBe('true');
      expect(await inputElement.getAttribute('aria-describedby')).toBeTruthy();
    });

    it('should announce success state to screen readers', fakeAsync(() => {
      pageObject.fillValidEmail('test@example.com');
      tick();
      mockAuthService.forgotPassword.and.returnValue(of({ success: true }));
      pageObject.submitForm();
      tick();
      fixture.detectChanges();
      
      const successElement = fixture.debugElement.query(By.css('[data-testid="success-message"]'));
      expect(successElement.nativeElement.getAttribute('role')).toBe('status');
      expect(successElement.nativeElement.getAttribute('aria-live')).toBe('polite');
    }));

    it('should have focus indicators on interactive elements', () => {
      const interactiveElements = fixture.debugElement.queryAll(By.css('button, input'));
      
      interactiveElements.forEach(element => {
        element.nativeElement.focus();
        fixture.detectChanges();
        
        const computedStyle = window.getComputedStyle(element.nativeElement);
        expect(computedStyle.outline).not.toBe('none');
      });
    });

    it('should support keyboard navigation', () => {
      const formElements = fixture.debugElement.queryAll(By.css('input, button'));
      
      formElements.forEach(element => {
        expect(element.nativeElement.tabIndex).not.toBe(-1);
      });
    });

    it('should have descriptive button text', async () => {
      const sendButton = await pageObject.getSendResetButton();
      const buttonText = await sendButton.getText();
      
      expect(buttonText).toContain('ส่งลิงก์รีเซ็ตรหัสผ่าน');
    });
  });

  describe('Error Handling', () => {
    it('should handle service unavailable error', fakeAsync(() => {
      pageObject.fillValidEmail('test@example.com');
      tick();
      
      mockAuthService.forgotPassword.and.returnValue(throwError({
        status: 503,
        error: { message: 'Service unavailable' }
      }));
      
      pageObject.submitForm();
      tick();
      
      expect(mockNotificationService.showError).toHaveBeenCalledWith(
        'ระบบไม่พร้อมให้บริการในขณะนี้ กรุณาลองใหม่ภายหลัง'
      );
    }));

    it('should handle rate limiting error', fakeAsync(() => {
      pageObject.fillValidEmail('test@example.com');
      tick();
      
      mockAuthService.forgotPassword.and.returnValue(throwError({
        status: 429,
        error: { message: 'Too many requests' }
      }));
      
      pageObject.submitForm();
      tick();
      
      expect(mockNotificationService.showError).toHaveBeenCalledWith(
        'คุณได้ร้องขอรีเซ็ตรหัสผ่านบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่'
      );
    }));

    it('should clear form errors when user modifies email', async () => {
      // Set form error
      component.forgotPasswordForm.get('email')?.setErrors({ serverError: 'Server error' });
      fixture.detectChanges();
      
      // User modifies email
      const emailInput = await pageObject.getEmailInput();
      await emailInput.setValue('newemail@test.com');
      
      fixture.detectChanges();
      
      expect(component.forgotPasswordForm.get('email')?.hasError('serverError')).toBe(false);
    });

    it('should handle timeout errors', fakeAsync(() => {
      pageObject.fillValidEmail('test@example.com');
      tick();
      
      mockAuthService.forgotPassword.and.returnValue(throwError({
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
    it('should handle very long email addresses', async () => {
      const longEmail = 'a'.repeat(60) + '@' + 'b'.repeat(60) + '.com';
      const emailInput = await pageObject.getEmailInput();
      
      await emailInput.setValue(longEmail);
      fixture.detectChanges();
      
      expect(component.forgotPasswordForm.get('email')?.hasError('maxlength')).toBe(true);
    });

    it('should handle special characters in email', async () => {
      const emailInput = await pageObject.getEmailInput();
      
      const specialEmails = [
        'test+tag@example.com',
        'user.name@example.co.th',
        'test-email@sub.domain.com',
        'user_name@domain.org'
      ];
      
      for (const email of specialEmails) {
        await emailInput.setValue(email);
        fixture.detectChanges();
        
        expect(component.forgotPasswordForm.get('email')?.hasError('email')).toBe(false);
      }
    });

    it('should handle component destruction during async operations', fakeAsync(() => {
      pageObject.fillValidEmail('test@example.com');
      tick();
      
      // Start async operation
      mockAuthService.forgotPassword.and.returnValue(of({ success: true }).pipe());
      pageObject.submitForm();
      
      // Destroy component before operation completes
      component.ngOnDestroy();
      tick();
      
      // Should not cause errors
      expect(component.isLoading).toBe(false);
    }));
  });

  describe('Performance', () => {
    it('should debounce email validation calls', fakeAsync(() => {
      const emailControl = component.forgotPasswordForm.get('email');
      
      emailControl?.setValue('test1@email.com');
      tick(100);
      emailControl?.setValue('test2@email.com');
      tick(100);
      emailControl?.setValue('test3@email.com');
      tick(500);
      
      expect(mockAuthService.checkEmailExists).toHaveBeenCalledTimes(1);
      expect(mockAuthService.checkEmailExists).toHaveBeenCalledWith('test3@email.com');
    }));

    it('should cancel pending HTTP requests on component destroy', () => {
      spyOn(component, 'ngOnDestroy').and.callThrough();
      
      fixture.destroy();
      
      expect(component.ngOnDestroy).toHaveBeenCalled();
    });
  });

  describe('Internationalization', () => {
    it('should use translation service for error messages', async () => {
      const emailInput = await pageObject.getEmailInput();
      await emailInput.focus();
      await emailInput.blur();
      
      fixture.detectChanges();
      
      expect(mockTranslationService.translate).toHaveBeenCalledWith('validation.required.email');
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

  describe('Security', () => {
    it('should not log sensitive information', () => {
      spyOn(console, 'log');
      spyOn(console, 'error');
      
      component.forgotPasswordForm.get('email')?.setValue('sensitive@email.com');
      fixture.detectChanges();
      
      expect(console.log).not.toHaveBeenCalledWith(jasmine.stringMatching(/sensitive@email\.com/));
    });

    it('should clear form data on navigation away', () => {
      component.forgotPasswordForm.get('email')?.setValue('test@email.com');
      
      component.ngOnDestroy();
      
      expect(component.forgotPasswordForm.get('email')?.value).toBe('');
    });

    it('should validate email format on client side', async () => {
      const emailInput = await pageObject.getEmailInput();
      
      await emailInput.setValue('<script>alert("xss")</script>@test.com');
      fixture.detectChanges();
      
      expect(component.forgotPasswordForm.get('email')?.hasError('email')).toBe(true);
    });
  });
});