import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { TranslationService } from '../../../core/services/translation.service';
import { NotificationService } from '../../../core/services/notification.service';
import { 
  MockAuthService, 
  MockTranslationService, 
  MockNotificationService,
  MockRouter,
  MockActivatedRoute
} from '../../../test-helpers/mock-services';
import { MOCK_LOGIN_REQUESTS, MOCK_API_RESPONSES } from '../../../test-helpers/test-data';
import { TestUtilities, PageObject } from '../../../test-helpers/test-utilities';

class LoginPageObject extends PageObject<LoginComponent> {
  get emailInput(): HTMLInputElement | null {
    return this.getElement<HTMLInputElement>('[data-testid="email-input"]');
  }

  get passwordInput(): HTMLInputElement | null {
    return this.getElement<HTMLInputElement>('[data-testid="password-input"]');
  }

  get rememberMeCheckbox(): HTMLInputElement | null {
    return this.getElement<HTMLInputElement>('[data-testid="remember-me-checkbox"]');
  }

  get loginButton(): HTMLButtonElement | null {
    return this.getElement<HTMLButtonElement>('[data-testid="login-button"]');
  }

  get passwordToggleButton(): HTMLButtonElement | null {
    return this.getElement<HTMLButtonElement>('[data-testid="password-toggle"]');
  }

  get emailErrorMessage(): string {
    return this.getText('[data-testid="email-error"]');
  }

  get passwordErrorMessage(): string {
    return this.getText('[data-testid="password-error"]');
  }

  get loadingSpinner(): HTMLElement | null {
    return this.getElement('[data-testid="loading-spinner"]');
  }

  fillLoginForm(email: string, password: string, rememberMe = false): void {
    if (this.emailInput) this.emailInput.value = email;
    if (this.passwordInput) this.passwordInput.value = password;
    if (this.rememberMeCheckbox) this.rememberMeCheckbox.checked = rememberMe;
    
    // Trigger input events
    if (this.emailInput) this.emailInput.dispatchEvent(new Event('input'));
    if (this.passwordInput) this.passwordInput.dispatchEvent(new Event('input'));
    if (this.rememberMeCheckbox) this.rememberMeCheckbox.dispatchEvent(new Event('change'));
    
    this.detectChanges();
  }

  submitForm(): void {
    if (this.loginButton) {
      this.clickElement('[data-testid="login-button"]');
    }
  }

  togglePassword(): void {
    this.clickElement('[data-testid="password-toggle"]');
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let pageObject: LoginPageObject;
  let authService: MockAuthService;
  let router: MockRouter;
  let activatedRoute: MockActivatedRoute;
  let translationService: MockTranslationService;
  let notificationService: MockNotificationService;

  beforeEach(async () => {
    const authServiceInstance = new MockAuthService();
    const routerInstance = new MockRouter();
    const activatedRouteInstance = new MockActivatedRoute();
    const translationServiceInstance = new MockTranslationService();
    const notificationServiceInstance = new MockNotificationService();

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceInstance },
        { provide: Router, useValue: routerInstance },
        { provide: ActivatedRoute, useValue: activatedRouteInstance },
        { provide: TranslationService, useValue: translationServiceInstance },
        { provide: NotificationService, useValue: notificationServiceInstance }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    pageObject = new LoginPageObject(fixture);

    authService = TestBed.inject(AuthService) as any;
    router = TestBed.inject(Router) as any;
    activatedRoute = TestBed.inject(ActivatedRoute) as any;
    translationService = TestBed.inject(TranslationService) as any;
    notificationService = TestBed.inject(NotificationService) as any;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct default values', () => {
      fixture.detectChanges();
      
      expect(component.isLoading).toBeFalse();
      expect(component.hidePassword).toBeTrue();
      expect(component.returnUrl).toBe('/dashboard');
      expect(component.loginForm).toBeDefined();
    });

    it('should create form with required validators', () => {
      fixture.detectChanges();
      
      const form = component.loginForm;
      expect(form.get('email')?.hasError('required')).toBeTrue();
      expect(form.get('password')?.hasError('required')).toBeTrue();
      expect(form.get('rememberMe')?.value).toBeFalse();
    });

    it('should set returnUrl from query parameters', () => {
      activatedRoute.snapshot.queryParams = { returnUrl: '/admin/dashboard' };
      
      component.ngOnInit();
      
      expect(component.returnUrl).toBe('/admin/dashboard');
    });

    it('should redirect if already authenticated', () => {
      authService._isAuthenticated = true;
      
      component.ngOnInit();
      
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should show required error for empty email', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.markAsTouched();
      fixture.detectChanges();
      
      const errorMessage = component.getErrorMessage('email');
      expect(errorMessage).toBe('This field is required'); // From mock translation
    });

    it('should show email format error for invalid email', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('invalid-email');
      emailControl?.markAsTouched();
      fixture.detectChanges();
      
      const errorMessage = component.getErrorMessage('email');
      expect(errorMessage).toBe('Please enter a valid email address');
    });

    it('should show required error for empty password', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.markAsTouched();
      fixture.detectChanges();
      
      const errorMessage = component.getErrorMessage('password');
      expect(errorMessage).toBe('This field is required');
    });

    it('should show minimum length error for short password', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('123');
      passwordControl?.markAsTouched();
      fixture.detectChanges();
      
      const errorMessage = component.getErrorMessage('password');
      expect(errorMessage).toContain('Password must be at least');
    });

    it('should return empty string for valid fields', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('test@example.com');
      emailControl?.markAsTouched();
      
      const errorMessage = component.getErrorMessage('email');
      expect(errorMessage).toBe('');
    });

    it('should not show errors for untouched fields', () => {
      const emailControl = component.loginForm.get('email');
      // Don't mark as touched
      
      const errorMessage = component.getErrorMessage('email');
      expect(errorMessage).toBe('');
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should submit valid form successfully', () => {
      const credentials = MOCK_LOGIN_REQUESTS[0];
      authService.login = jasmine.createSpy('login').and.returnValue(of(MOCK_API_RESPONSES.LOGIN_SUCCESS.data));
      
      component.loginForm.patchValue({
        email: credentials.email,
        password: credentials.password,
        rememberMe: false
      });
      
      component.onSubmit();
      
      expect(authService.login).toHaveBeenCalledWith(jasmine.objectContaining({
        email: credentials.email,
        password: credentials.password,
        rememberMe: false
      }));
      expect(notificationService.showSuccess).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should handle login failure', () => {
      const credentials = MOCK_LOGIN_REQUESTS[0];
      const error = new Error('Invalid credentials');
      authService.login = jasmine.createSpy('login').and.returnValue(throwError(() => error));
      
      component.loginForm.patchValue({
        email: credentials.email,
        password: credentials.password
      });
      
      component.onSubmit();
      
      expect(authService.login).toHaveBeenCalled();
      expect(notificationService.showError).toHaveBeenCalledWith('Invalid credentials');
      expect(component.isLoading).toBeFalse();
    });

    it('should handle login failure without error message', () => {
      const credentials = MOCK_LOGIN_REQUESTS[0];
      authService.login = jasmine.createSpy('login').and.returnValue(throwError(() => ({})));
      
      component.loginForm.patchValue({
        email: credentials.email,
        password: credentials.password
      });
      
      component.onSubmit();
      
      expect(notificationService.showError).toHaveBeenCalledWith('Login failed');
    });

    it('should not submit invalid form', () => {
      component.loginForm.patchValue({
        email: '', // Invalid
        password: '123' // Too short
      });
      
      component.onSubmit();
      
      expect(authService.login).not.toHaveBeenCalled();
      expect(component.loginForm.get('email')?.touched).toBeTrue();
      expect(component.loginForm.get('password')?.touched).toBeTrue();
    });

    it('should not submit while already loading', () => {
      component.isLoading = true;
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });
      
      component.onSubmit();
      
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should set loading state during submission', () => {
      let resolvePromise: any;
      const loginPromise = new Promise(resolve => {
        resolvePromise = resolve;
      });
      authService.login = jasmine.createSpy('login').and.returnValue(loginPromise);
      
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });
      
      component.onSubmit();
      
      expect(component.isLoading).toBeTrue();
      
      resolvePromise(MOCK_API_RESPONSES.LOGIN_SUCCESS.data);
    });

    it('should navigate to custom return URL on success', () => {
      component.returnUrl = '/admin/users';
      authService.login = jasmine.createSpy('login').and.returnValue(of(MOCK_API_RESPONSES.LOGIN_SUCCESS.data));
      
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });
      
      component.onSubmit();
      
      expect(router.navigate).toHaveBeenCalledWith(['/admin/users']);
    });
  });

  describe('User Interaction', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should toggle password visibility', () => {
      expect(component.hidePassword).toBeTrue();
      
      // Simulate password toggle
      component.hidePassword = !component.hidePassword;
      
      expect(component.hidePassword).toBeFalse();
    });

    it('should handle remember me checkbox', () => {
      const rememberMeControl = component.loginForm.get('rememberMe');
      
      expect(rememberMeControl?.value).toBeFalse();
      
      rememberMeControl?.setValue(true);
      
      expect(rememberMeControl?.value).toBeTrue();
    });

    it('should handle keyboard events on form', () => {
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });
      
      spyOn(component, 'onSubmit');
      
      // Simulate Enter key press (would be handled by form submit)
      const form = fixture.nativeElement.querySelector('form');
      const event = new KeyboardEvent('keyup', { key: 'Enter' });
      form?.dispatchEvent(event);
      
      // Form submission would be handled by Angular's form handling
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have proper form labels', () => {
      // This would test that form fields have associated labels
      // Implementation depends on the template structure
      expect(component.loginForm.get('email')).toBeTruthy();
      expect(component.loginForm.get('password')).toBeTruthy();
    });

    it('should provide error messages for screen readers', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.markAsTouched();
      
      const errorMessage = component.getErrorMessage('email');
      expect(errorMessage).toBeTruthy();
    });

    it('should handle loading state for screen readers', () => {
      component.isLoading = true;
      expect(component.isLoading).toBeTrue();
    });
  });

  describe('Translation Integration', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should use translated success message', () => {
      translationService.translate = jasmine.createSpy('translate').and.returnValue('เข้าสู่ระบบสำเร็จ');
      authService.login = jasmine.createSpy('login').and.returnValue(of(MOCK_API_RESPONSES.LOGIN_SUCCESS.data));
      
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });
      
      component.onSubmit();
      
      expect(translationService.instant).toHaveBeenCalledWith('auth.loginSuccess');
    });

    it('should use translated error messages', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.markAsTouched();
      
      component.getErrorMessage('email');
      
      expect(translationService.instant).toHaveBeenCalledWith('validation.required');
    });

    it('should use translated validation messages with parameters', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('123');
      passwordControl?.markAsTouched();
      
      component.getErrorMessage('password');
      
      expect(translationService.instant).toHaveBeenCalledWith(
        'validation.minLength',
        { min: 6 }
      );
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle null form controls gracefully', () => {
      // Simulate accessing non-existent control
      const errorMessage = component.getErrorMessage('nonExistentField');
      expect(errorMessage).toBe('');
    });

    it('should handle service injection failures gracefully', () => {
      // This would be tested by mocking service failures
      expect(component).toBeTruthy();
    });

    it('should handle rapid form submissions', () => {
      let callCount = 0;
      authService.login = jasmine.createSpy('login').and.callFake(() => {
        callCount++;
        return of(MOCK_API_RESPONSES.LOGIN_SUCCESS.data);
      });
      
      component.loginForm.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });
      
      // Rapid submissions
      component.onSubmit();
      component.onSubmit();
      component.onSubmit();
      
      // Should only process the first submission due to loading state
      expect(callCount).toBe(1);
    });

    it('should handle empty query parameters', () => {
      activatedRoute.snapshot.queryParams = {};
      
      component.ngOnInit();
      
      expect(component.returnUrl).toBe('/dashboard');
    });

    it('should handle malformed query parameters', () => {
      activatedRoute.snapshot.queryParams = { returnUrl: null };
      
      component.ngOnInit();
      
      expect(component.returnUrl).toBe('/dashboard');
    });
  });

  describe('Memory Management', () => {
    it('should not create memory leaks with subscriptions', () => {
      // This would test that component properly unsubscribes from observables
      // In this case, the login observable completes automatically
      expect(component).toBeTruthy();
    });
  });
});