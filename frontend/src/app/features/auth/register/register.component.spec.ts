import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoadingService } from '../../../core/services/loading.service';
import { TranslationService } from '../../../core/services/translation.service';

// Page Object for Register Component
class RegisterPageObject {
  constructor(
    private fixture: ComponentFixture<RegisterComponent>,
    private loader: HarnessLoader
  ) {}

  get component(): RegisterComponent {
    return this.fixture.componentInstance;
  }

  get compiled(): HTMLElement {
    return this.fixture.nativeElement;
  }

  // Input field getters
  async getFirstNameInput(): Promise<MatInputHarness> {
    return this.loader.getHarness(MatInputHarness.with({ placeholder: 'ชื่อ' }));
  }

  async getLastNameInput(): Promise<MatInputHarness> {
    return this.loader.getHarness(MatInputHarness.with({ placeholder: 'นามสกุล' }));
  }

  async getEmailInput(): Promise<MatInputHarness> {
    return this.loader.getHarness(MatInputHarness.with({ placeholder: 'อีเมล' }));
  }

  async getPhoneInput(): Promise<MatInputHarness> {
    return this.loader.getHarness(MatInputHarness.with({ placeholder: 'เบอร์โทรศัพท์' }));
  }

  async getNationalIdInput(): Promise<MatInputHarness> {
    return this.loader.getHarness(MatInputHarness.with({ placeholder: 'เลขบัตรประชาชน' }));
  }

  async getPasswordInput(): Promise<MatInputHarness> {
    return this.loader.getHarness(MatInputHarness.with({ placeholder: 'รหัสผ่าน' }));
  }

  async getConfirmPasswordInput(): Promise<MatInputHarness> {
    return this.loader.getHarness(MatInputHarness.with({ placeholder: 'ยืนยันรหัสผ่าน' }));
  }

  // Button getters
  async getRegisterButton(): Promise<MatButtonHarness> {
    return this.loader.getHarness(MatButtonHarness.with({ text: 'สมัครสมาชิก' }));
  }

  async getLoginLinkButton(): Promise<MatButtonHarness> {
    return this.loader.getHarness(MatButtonHarness.with({ text: 'เข้าสู่ระบบ' }));
  }

  // Checkbox getters
  async getTermsCheckbox(): Promise<MatCheckboxHarness> {
    return this.loader.getHarness(MatCheckboxHarness.with({ selector: '[data-testid="terms-checkbox"]' }));
  }

  async getMarketingCheckbox(): Promise<MatCheckboxHarness> {
    return this.loader.getHarness(MatCheckboxHarness.with({ selector: '[data-testid="marketing-checkbox"]' }));
  }

  // Helper methods
  getErrorMessage(fieldName: string): string | null {
    const errorElement = this.compiled.querySelector(`[data-testid="${fieldName}-error"]`);
    return errorElement ? errorElement.textContent?.trim() || null : null;
  }

  getSuccessMessage(): string | null {
    const successElement = this.compiled.querySelector('[data-testid="success-message"]');
    return successElement ? successElement.textContent?.trim() || null : null;
  }

  isLoadingSpinnerVisible(): boolean {
    return !!this.compiled.querySelector('mat-spinner');
  }

  isFormDisabled(): boolean {
    return this.component.registerForm.disabled;
  }

  async fillValidForm(): Promise<void> {
    const firstNameInput = await this.getFirstNameInput();
    const lastNameInput = await this.getLastNameInput();
    const emailInput = await this.getEmailInput();
    const phoneInput = await this.getPhoneInput();
    const nationalIdInput = await this.getNationalIdInput();
    const passwordInput = await this.getPasswordInput();
    const confirmPasswordInput = await this.getConfirmPasswordInput();
    const termsCheckbox = await this.getTermsCheckbox();

    await firstNameInput.setValue('สมชาย');
    await lastNameInput.setValue('ใจดี');
    await emailInput.setValue('somchai@test.com');
    await phoneInput.setValue('0812345678');
    await nationalIdInput.setValue('1234567890123');
    await passwordInput.setValue('Password123!');
    await confirmPasswordInput.setValue('Password123!');
    await termsCheckbox.check();

    this.fixture.detectChanges();
  }

  async submitForm(): Promise<void> {
    const registerButton = await this.getRegisterButton();
    await registerButton.click();
    this.fixture.detectChanges();
  }
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let pageObject: RegisterPageObject;
  let loader: HarnessLoader;
  
  // Mock services
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let mockTranslationService: jasmine.SpyObj<TranslationService>;

  // Test data
  const validUserData = {
    firstName: 'สมชาย',
    lastName: 'ใจดี',
    email: 'somchai@test.com',
    phoneNumber: '0812345678',
    nationalId: '1234567890123',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    acceptTerms: true,
    acceptMarketing: false
  };

  beforeEach(async () => {
    // Create mock services
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'register',
      'checkEmailExists',
      'checkPhoneExists',
      'checkNationalIdExists'
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockNotificationService = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError',
      'showWarning'
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
    mockAuthService.register.and.returnValue(of({ success: true, user: validUserData }));
    mockAuthService.checkEmailExists.and.returnValue(of(false));
    mockAuthService.checkPhoneExists.and.returnValue(of(false));
    mockAuthService.checkNationalIdExists.and.returnValue(of(false));
    mockTranslationService.translate.and.returnValue('Translated text');
    mockTranslationService.getTranslation.and.returnValue(of('Translated text'));

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
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

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    pageObject = new RegisterPageObject(fixture, loader);
    
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize reactive form with correct structure', () => {
      expect(component.registerForm).toBeTruthy();
      expect(component.registerForm.get('firstName')).toBeTruthy();
      expect(component.registerForm.get('lastName')).toBeTruthy();
      expect(component.registerForm.get('email')).toBeTruthy();
      expect(component.registerForm.get('phoneNumber')).toBeTruthy();
      expect(component.registerForm.get('nationalId')).toBeTruthy();
      expect(component.registerForm.get('password')).toBeTruthy();
      expect(component.registerForm.get('confirmPassword')).toBeTruthy();
      expect(component.registerForm.get('acceptTerms')).toBeTruthy();
      expect(component.registerForm.get('acceptMarketing')).toBeTruthy();
    });

    it('should initialize with empty form values', () => {
      expect(component.registerForm.get('firstName')?.value).toBe('');
      expect(component.registerForm.get('lastName')?.value).toBe('');
      expect(component.registerForm.get('email')?.value).toBe('');
      expect(component.registerForm.get('phoneNumber')?.value).toBe('');
      expect(component.registerForm.get('nationalId')?.value).toBe('');
      expect(component.registerForm.get('password')?.value).toBe('');
      expect(component.registerForm.get('confirmPassword')?.value).toBe('');
      expect(component.registerForm.get('acceptTerms')?.value).toBe(false);
      expect(component.registerForm.get('acceptMarketing')?.value).toBe(false);
    });

    it('should initialize form as invalid', () => {
      expect(component.registerForm.invalid).toBe(true);
    });

    it('should set initial loading state to false', () => {
      expect(component.isLoading).toBe(false);
    });

    it('should set password visibility to false initially', () => {
      expect(component.hidePassword).toBe(true);
      expect(component.hideConfirmPassword).toBe(true);
    });
  });

  describe('Form Validation - Required Fields', () => {
    it('should show required error for empty first name', async () => {
      const firstNameInput = await pageObject.getFirstNameInput();
      await firstNameInput.focus();
      await firstNameInput.blur();
      
      fixture.detectChanges();
      
      expect(component.registerForm.get('firstName')?.hasError('required')).toBe(true);
      expect(pageObject.getErrorMessage('firstName')).toContain('ชื่อ');
    });

    it('should show required error for empty last name', async () => {
      const lastNameInput = await pageObject.getLastNameInput();
      await lastNameInput.focus();
      await lastNameInput.blur();
      
      fixture.detectChanges();
      
      expect(component.registerForm.get('lastName')?.hasError('required')).toBe(true);
      expect(pageObject.getErrorMessage('lastName')).toContain('นามสกุล');
    });

    it('should show required error for empty email', async () => {
      const emailInput = await pageObject.getEmailInput();
      await emailInput.focus();
      await emailInput.blur();
      
      fixture.detectChanges();
      
      expect(component.registerForm.get('email')?.hasError('required')).toBe(true);
      expect(pageObject.getErrorMessage('email')).toContain('อีเมล');
    });

    it('should show required error for empty phone number', async () => {
      const phoneInput = await pageObject.getPhoneInput();
      await phoneInput.focus();
      await phoneInput.blur();
      
      fixture.detectChanges();
      
      expect(component.registerForm.get('phoneNumber')?.hasError('required')).toBe(true);
      expect(pageObject.getErrorMessage('phoneNumber')).toContain('เบอร์โทรศัพท์');
    });

    it('should show required error for empty national ID', async () => {
      const nationalIdInput = await pageObject.getNationalIdInput();
      await nationalIdInput.focus();
      await nationalIdInput.blur();
      
      fixture.detectChanges();
      
      expect(component.registerForm.get('nationalId')?.hasError('required')).toBe(true);
      expect(pageObject.getErrorMessage('nationalId')).toContain('เลขบัตรประชาชน');
    });

    it('should show required error for empty password', async () => {
      const passwordInput = await pageObject.getPasswordInput();
      await passwordInput.focus();
      await passwordInput.blur();
      
      fixture.detectChanges();
      
      expect(component.registerForm.get('password')?.hasError('required')).toBe(true);
      expect(pageObject.getErrorMessage('password')).toContain('รหัสผ่าน');
    });

    it('should show required error for empty confirm password', async () => {
      const confirmPasswordInput = await pageObject.getConfirmPasswordInput();
      await confirmPasswordInput.focus();
      await confirmPasswordInput.blur();
      
      fixture.detectChanges();
      
      expect(component.registerForm.get('confirmPassword')?.hasError('required')).toBe(true);
      expect(pageObject.getErrorMessage('confirmPassword')).toContain('ยืนยันรหัสผ่าน');
    });

    it('should show required error when terms are not accepted', async () => {
      await pageObject.fillValidForm();
      const termsCheckbox = await pageObject.getTermsCheckbox();
      await termsCheckbox.uncheck();
      
      fixture.detectChanges();
      
      expect(component.registerForm.get('acceptTerms')?.hasError('required')).toBe(true);
    });
  });

  describe('Form Validation - Field Formats', () => {
    it('should validate email format correctly', async () => {
      const emailInput = await pageObject.getEmailInput();
      
      // Test invalid email
      await emailInput.setValue('invalid-email');
      fixture.detectChanges();
      
      expect(component.registerForm.get('email')?.hasError('email')).toBe(true);
      expect(pageObject.getErrorMessage('email')).toContain('รูปแบบอีเมลไม่ถูกต้อง');
      
      // Test valid email
      await emailInput.setValue('valid@email.com');
      fixture.detectChanges();
      
      expect(component.registerForm.get('email')?.hasError('email')).toBe(false);
    });

    it('should validate Thai phone number format', async () => {
      const phoneInput = await pageObject.getPhoneInput();
      
      // Test invalid phone formats
      const invalidPhones = ['123', '12345678901', 'abcd', '0123456789a'];
      
      for (const invalidPhone of invalidPhones) {
        await phoneInput.setValue(invalidPhone);
        fixture.detectChanges();
        
        expect(component.registerForm.get('phoneNumber')?.hasError('pattern')).toBe(true);
        expect(pageObject.getErrorMessage('phoneNumber')).toContain('เบอร์โทรศัพท์ไม่ถูกต้อง');
      }
      
      // Test valid phone formats
      const validPhones = ['0812345678', '0912345678', '0623456789'];
      
      for (const validPhone of validPhones) {
        await phoneInput.setValue(validPhone);
        fixture.detectChanges();
        
        expect(component.registerForm.get('phoneNumber')?.hasError('pattern')).toBe(false);
      }
    });

    it('should validate Thai national ID format', async () => {
      const nationalIdInput = await pageObject.getNationalIdInput();
      
      // Test invalid national ID formats
      const invalidIds = ['123', '12345678901234', 'abcdefghijklm', '123456789012a'];
      
      for (const invalidId of invalidIds) {
        await nationalIdInput.setValue(invalidId);
        fixture.detectChanges();
        
        expect(component.registerForm.get('nationalId')?.hasError('pattern')).toBe(true);
        expect(pageObject.getErrorMessage('nationalId')).toContain('เลขบัตรประชาชนไม่ถูกต้อง');
      }
      
      // Test valid national ID format
      await nationalIdInput.setValue('1234567890123');
      fixture.detectChanges();
      
      expect(component.registerForm.get('nationalId')?.hasError('pattern')).toBe(false);
    });

    it('should validate password strength', async () => {
      const passwordInput = await pageObject.getPasswordInput();
      
      // Test weak passwords
      const weakPasswords = ['123', 'password', 'PASSWORD', 'Password', '12345678'];
      
      for (const weakPassword of weakPasswords) {
        await passwordInput.setValue(weakPassword);
        fixture.detectChanges();
        
        expect(component.registerForm.get('password')?.hasError('pattern')).toBe(true);
        expect(pageObject.getErrorMessage('password')).toContain('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
      }
      
      // Test strong password
      await passwordInput.setValue('Password123!');
      fixture.detectChanges();
      
      expect(component.registerForm.get('password')?.hasError('pattern')).toBe(false);
    });

    it('should validate password confirmation match', async () => {
      const passwordInput = await pageObject.getPasswordInput();
      const confirmPasswordInput = await pageObject.getConfirmPasswordInput();
      
      // Test mismatched passwords
      await passwordInput.setValue('Password123!');
      await confirmPasswordInput.setValue('DifferentPassword123!');
      fixture.detectChanges();
      
      expect(component.registerForm.hasError('passwordMismatch')).toBe(true);
      expect(pageObject.getErrorMessage('confirmPassword')).toContain('รหัสผ่านไม่ตรงกัน');
      
      // Test matched passwords
      await confirmPasswordInput.setValue('Password123!');
      fixture.detectChanges();
      
      expect(component.registerForm.hasError('passwordMismatch')).toBe(false);
    });
  });

  describe('Form Validation - Thai Language Support', () => {
    it('should accept Thai characters in first name', async () => {
      const firstNameInput = await pageObject.getFirstNameInput();
      
      const thaiNames = ['สมชาย', 'อนุชา', 'วิทยา', 'กิตติ์'];
      
      for (const thaiName of thaiNames) {
        await firstNameInput.setValue(thaiName);
        fixture.detectChanges();
        
        expect(component.registerForm.get('firstName')?.valid).toBe(true);
      }
    });

    it('should accept Thai characters in last name', async () => {
      const lastNameInput = await pageObject.getLastNameInput();
      
      const thaiLastNames = ['ใจดี', 'สุขใจ', 'วงศ์ดี', 'จันทร์'];
      
      for (const thaiLastName of thaiLastNames) {
        await lastNameInput.setValue(thaiLastName);
        fixture.detectChanges();
        
        expect(component.registerForm.get('lastName')?.valid).toBe(true);
      }
    });

    it('should reject invalid characters in name fields', async () => {
      const firstNameInput = await pageObject.getFirstNameInput();
      
      const invalidNames = ['John123', 'สมชาย@', 'Test!Name'];
      
      for (const invalidName of invalidNames) {
        await firstNameInput.setValue(invalidName);
        fixture.detectChanges();
        
        expect(component.registerForm.get('firstName')?.hasError('pattern')).toBe(true);
      }
    });
  });

  describe('Async Validation', () => {
    it('should check email availability asynchronously', fakeAsync(() => {
      mockAuthService.checkEmailExists.and.returnValue(of(true));
      
      const emailControl = component.registerForm.get('email');
      emailControl?.setValue('existing@test.com');
      
      tick(500); // Wait for debounce
      fixture.detectChanges();
      
      expect(mockAuthService.checkEmailExists).toHaveBeenCalledWith('existing@test.com');
      expect(emailControl?.hasError('emailExists')).toBe(true);
    }));

    it('should check phone number availability asynchronously', fakeAsync(() => {
      mockAuthService.checkPhoneExists.and.returnValue(of(true));
      
      const phoneControl = component.registerForm.get('phoneNumber');
      phoneControl?.setValue('0812345678');
      
      tick(500); // Wait for debounce
      fixture.detectChanges();
      
      expect(mockAuthService.checkPhoneExists).toHaveBeenCalledWith('0812345678');
      expect(phoneControl?.hasError('phoneExists')).toBe(true);
    }));

    it('should check national ID availability asynchronously', fakeAsync(() => {
      mockAuthService.checkNationalIdExists.and.returnValue(of(true));
      
      const nationalIdControl = component.registerForm.get('nationalId');
      nationalIdControl?.setValue('1234567890123');
      
      tick(500); // Wait for debounce
      fixture.detectChanges();
      
      expect(mockAuthService.checkNationalIdExists).toHaveBeenCalledWith('1234567890123');
      expect(nationalIdControl?.hasError('nationalIdExists')).toBe(true);
    }));

    it('should handle async validation errors gracefully', fakeAsync(() => {
      mockAuthService.checkEmailExists.and.returnValue(throwError('Network error'));
      
      const emailControl = component.registerForm.get('email');
      emailControl?.setValue('test@test.com');
      
      tick(500);
      fixture.detectChanges();
      
      expect(emailControl?.hasError('asyncValidationError')).toBe(true);
    }));
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility', () => {
      expect(component.hidePassword).toBe(true);
      
      component.togglePasswordVisibility();
      
      expect(component.hidePassword).toBe(false);
    });

    it('should toggle confirm password visibility', () => {
      expect(component.hideConfirmPassword).toBe(true);
      
      component.toggleConfirmPasswordVisibility();
      
      expect(component.hideConfirmPassword).toBe(false);
    });

    it('should update password input type when toggling visibility', async () => {
      const passwordInput = await pageObject.getPasswordInput();
      
      expect(await passwordInput.getType()).toBe('password');
      
      component.togglePasswordVisibility();
      fixture.detectChanges();
      
      expect(await passwordInput.getType()).toBe('text');
    });
  });

  describe('Form Submission', () => {
    it('should disable submit button when form is invalid', async () => {
      const registerButton = await pageObject.getRegisterButton();
      
      expect(await registerButton.isDisabled()).toBe(true);
    });

    it('should enable submit button when form is valid', async () => {
      await pageObject.fillValidForm();
      
      const registerButton = await pageObject.getRegisterButton();
      
      expect(await registerButton.isDisabled()).toBe(false);
    });

    it('should submit form with correct data when valid', async () => {
      await pageObject.fillValidForm();
      
      mockAuthService.register.and.returnValue(of({ 
        success: true, 
        user: validUserData,
        token: 'mock-token' 
      }));
      
      await pageObject.submitForm();
      
      expect(mockAuthService.register).toHaveBeenCalledWith(jasmine.objectContaining({
        firstName: 'สมชาย',
        lastName: 'ใจดี',
        email: 'somchai@test.com',
        phoneNumber: '0812345678',
        nationalId: '1234567890123',
        password: 'Password123!',
        acceptTerms: true,
        acceptMarketing: false
      }));
    });

    it('should show loading spinner during registration', fakeAsync(() => {
      pageObject.fillValidForm();
      tick();
      
      mockAuthService.register.and.returnValue(of({ success: true }).pipe());
      
      pageObject.submitForm();
      tick();
      
      expect(component.isLoading).toBe(true);
      expect(pageObject.isLoadingSpinnerVisible()).toBe(true);
    }));

    it('should disable form during registration', async () => {
      await pageObject.fillValidForm();
      
      mockAuthService.register.and.returnValue(of({ success: true }).pipe());
      
      await pageObject.submitForm();
      
      expect(pageObject.isFormDisabled()).toBe(true);
    });

    it('should navigate to login page on successful registration', fakeAsync(() => {
      pageObject.fillValidForm();
      tick();
      
      mockAuthService.register.and.returnValue(of({ 
        success: true, 
        user: validUserData 
      }));
      
      pageObject.submitForm();
      tick();
      
      expect(mockNotificationService.showSuccess).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
    }));

    it('should show error message on registration failure', fakeAsync(() => {
      pageObject.fillValidForm();
      tick();
      
      mockAuthService.register.and.returnValue(throwError({
        error: { message: 'Registration failed' }
      }));
      
      pageObject.submitForm();
      tick();
      
      expect(mockNotificationService.showError).toHaveBeenCalledWith('Registration failed');
      expect(component.isLoading).toBe(false);
    }));

    it('should handle network errors gracefully', fakeAsync(() => {
      pageObject.fillValidForm();
      tick();
      
      mockAuthService.register.and.returnValue(throwError('Network error'));
      
      pageObject.submitForm();
      tick();
      
      expect(mockNotificationService.showError).toHaveBeenCalledWith('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
      expect(component.isLoading).toBe(false);
    }));
  });

  describe('Navigation', () => {
    it('should navigate to login page when login link is clicked', async () => {
      const loginLink = await pageObject.getLoginLinkButton();
      await loginLink.click();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels on form controls', () => {
      const formControls = fixture.debugElement.queryAll(By.css('input, mat-checkbox'));
      
      formControls.forEach(control => {
        const element = control.nativeElement;
        expect(element.getAttribute('aria-label') || element.getAttribute('aria-labelledby')).toBeTruthy();
      });
    });

    it('should have proper form validation ARIA attributes', async () => {
      const firstNameInput = await pageObject.getFirstNameInput();
      await firstNameInput.focus();
      await firstNameInput.blur();
      
      fixture.detectChanges();
      
      const inputElement = await firstNameInput.host();
      expect(await inputElement.getAttribute('aria-invalid')).toBe('true');
      expect(await inputElement.getAttribute('aria-describedby')).toBeTruthy();
    });

    it('should announce form errors to screen readers', async () => {
      const emailInput = await pageObject.getEmailInput();
      await emailInput.setValue('invalid-email');
      await emailInput.blur();
      
      fixture.detectChanges();
      
      const errorElement = fixture.debugElement.query(By.css('[data-testid="email-error"]'));
      expect(errorElement.nativeElement.getAttribute('role')).toBe('alert');
      expect(errorElement.nativeElement.getAttribute('aria-live')).toBe('polite');
    });

    it('should support keyboard navigation', () => {
      const formElements = fixture.debugElement.queryAll(By.css('input, button, mat-checkbox'));
      
      formElements.forEach(element => {
        expect(element.nativeElement.tabIndex).not.toBe(-1);
      });
    });

    it('should have focus indicators on interactive elements', () => {
      const interactiveElements = fixture.debugElement.queryAll(By.css('button, input, mat-checkbox'));
      
      interactiveElements.forEach(element => {
        element.nativeElement.focus();
        fixture.detectChanges();
        
        const computedStyle = window.getComputedStyle(element.nativeElement);
        expect(computedStyle.outline).not.toBe('none');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle service unavailable error', fakeAsync(() => {
      pageObject.fillValidForm();
      tick();
      
      mockAuthService.register.and.returnValue(throwError({
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
      pageObject.fillValidForm();
      tick();
      
      mockAuthService.register.and.returnValue(throwError({
        status: 400,
        error: { 
          message: 'Validation failed',
          errors: {
            email: 'Email already exists',
            phoneNumber: 'Phone number already exists'
          }
        }
      }));
      
      pageObject.submitForm();
      tick();
      
      expect(component.registerForm.get('email')?.hasError('serverError')).toBe(true);
      expect(component.registerForm.get('phoneNumber')?.hasError('serverError')).toBe(true);
    }));

    it('should clear server errors when user modifies field', async () => {
      // Set server error
      component.registerForm.get('email')?.setErrors({ serverError: 'Email already exists' });
      fixture.detectChanges();
      
      // User modifies field
      const emailInput = await pageObject.getEmailInput();
      await emailInput.setValue('newemail@test.com');
      
      fixture.detectChanges();
      
      expect(component.registerForm.get('email')?.hasError('serverError')).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty space values correctly', async () => {
      const firstNameInput = await pageObject.getFirstNameInput();
      await firstNameInput.setValue('   ');
      fixture.detectChanges();
      
      expect(component.registerForm.get('firstName')?.hasError('required')).toBe(true);
    });

    it('should trim whitespace from inputs before submission', async () => {
      const firstNameInput = await pageObject.getFirstNameInput();
      const lastNameInput = await pageObject.getLastNameInput();
      const emailInput = await pageObject.getEmailInput();
      
      await firstNameInput.setValue('  สมชาย  ');
      await lastNameInput.setValue('  ใจดี  ');
      await emailInput.setValue('  test@email.com  ');
      
      // Fill other required fields
      const phoneInput = await pageObject.getPhoneInput();
      const nationalIdInput = await pageObject.getNationalIdInput();
      const passwordInput = await pageObject.getPasswordInput();
      const confirmPasswordInput = await pageObject.getConfirmPasswordInput();
      const termsCheckbox = await pageObject.getTermsCheckbox();
      
      await phoneInput.setValue('0812345678');
      await nationalIdInput.setValue('1234567890123');
      await passwordInput.setValue('Password123!');
      await confirmPasswordInput.setValue('Password123!');
      await termsCheckbox.check();
      
      fixture.detectChanges();
      
      await pageObject.submitForm();
      
      expect(mockAuthService.register).toHaveBeenCalledWith(jasmine.objectContaining({
        firstName: 'สมชาย',
        lastName: 'ใจดี',
        email: 'test@email.com'
      }));
    });

    it('should handle very long input values', async () => {
      const firstNameInput = await pageObject.getFirstNameInput();
      const longName = 'ก'.repeat(100);
      
      await firstNameInput.setValue(longName);
      fixture.detectChanges();
      
      expect(component.registerForm.get('firstName')?.hasError('maxlength')).toBe(true);
    });

    it('should handle special characters appropriately', async () => {
      const emailInput = await pageObject.getEmailInput();
      
      const specialEmails = [
        'test+tag@example.com',
        'user.name@example.co.th',
        'test-email@sub.domain.com'
      ];
      
      for (const email of specialEmails) {
        await emailInput.setValue(email);
        fixture.detectChanges();
        
        expect(component.registerForm.get('email')?.hasError('email')).toBe(false);
      }
    });
  });

  describe('Performance', () => {
    it('should debounce async validation calls', fakeAsync(() => {
      const emailControl = component.registerForm.get('email');
      
      emailControl?.setValue('test1@email.com');
      tick(100);
      emailControl?.setValue('test2@email.com');
      tick(100);
      emailControl?.setValue('test3@email.com');
      tick(500);
      
      expect(mockAuthService.checkEmailExists).toHaveBeenCalledTimes(1);
      expect(mockAuthService.checkEmailExists).toHaveBeenCalledWith('test3@email.com');
    }));

    it('should not make unnecessary API calls for invalid emails', fakeAsync(() => {
      const emailControl = component.registerForm.get('email');
      
      emailControl?.setValue('invalid-email');
      tick(500);
      
      expect(mockAuthService.checkEmailExists).not.toHaveBeenCalled();
    }));
  });

  describe('Security', () => {
    it('should not log sensitive information', () => {
      spyOn(console, 'log');
      spyOn(console, 'error');
      spyOn(console, 'warn');
      
      component.registerForm.get('password')?.setValue('Password123!');
      fixture.detectChanges();
      
      expect(console.log).not.toHaveBeenCalledWith(jasmine.stringMatching(/Password123!/));
      expect(console.error).not.toHaveBeenCalledWith(jasmine.stringMatching(/Password123!/));
      expect(console.warn).not.toHaveBeenCalledWith(jasmine.stringMatching(/Password123!/));
    });

    it('should clear password fields on navigation away', () => {
      component.registerForm.get('password')?.setValue('Password123!');
      component.registerForm.get('confirmPassword')?.setValue('Password123!');
      
      component.ngOnDestroy();
      
      expect(component.registerForm.get('password')?.value).toBe('');
      expect(component.registerForm.get('confirmPassword')?.value).toBe('');
    });
  });

  describe('Internationalization', () => {
    it('should use translation service for error messages', async () => {
      const firstNameInput = await pageObject.getFirstNameInput();
      await firstNameInput.focus();
      await firstNameInput.blur();
      
      fixture.detectChanges();
      
      expect(mockTranslationService.translate).toHaveBeenCalledWith('validation.required.firstName');
    });

    it('should support RTL languages', () => {
      component.currentLanguage = 'ar';
      fixture.detectChanges();
      
      const formElement = fixture.debugElement.query(By.css('form'));
      expect(formElement.nativeElement.dir).toBe('rtl');
    });

    it('should update form labels when language changes', () => {
      mockTranslationService.getTranslation.and.returnValue(of('New Label'));
      
      component.changeLanguage('en');
      fixture.detectChanges();
      
      expect(mockTranslationService.getTranslation).toHaveBeenCalled();
    });
  });
});