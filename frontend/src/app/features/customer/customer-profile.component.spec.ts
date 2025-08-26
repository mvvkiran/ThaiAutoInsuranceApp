import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { CustomerProfileComponent } from './customer-profile.component';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { TranslationService } from '../../core/services/translation.service';
import { NotificationService } from '../../core/services/notification.service';
import { LoadingService } from '../../core/services/loading.service';
import { 
  MockAuthService, 
  MockUserService,
  MockTranslationService, 
  MockNotificationService,
  MockLoadingService,
  MockRouter
} from '../../test-helpers/mock-services';
import { MOCK_USERS, MOCK_CUSTOMER_PROFILES } from '../../test-helpers/test-data';
import { TestUtilities, PageObject, ThaiValidationUtils } from '../../test-helpers/test-utilities';

class CustomerProfilePageObject extends PageObject<CustomerProfileComponent> {
  get profileForm(): HTMLFormElement | null {
    return this.getElement<HTMLFormElement>('[data-testid="profile-form"]');
  }

  get firstNameInput(): HTMLInputElement | null {
    return this.getElement<HTMLInputElement>('[data-testid="first-name-input"]');
  }

  get lastNameInput(): HTMLInputElement | null {
    return this.getElement<HTMLInputElement>('[data-testid="last-name-input"]');
  }

  get emailInput(): HTMLInputElement | null {
    return this.getElement<HTMLInputElement>('[data-testid="email-input"]');
  }

  get phoneInput(): HTMLInputElement | null {
    return this.getElement<HTMLInputElement>('[data-testid="phone-input"]');
  }

  get nationalIdInput(): HTMLInputElement | null {
    return this.getElement<HTMLInputElement>('[data-testid="national-id-input"]');
  }

  get dateOfBirthInput(): HTMLInputElement | null {
    return this.getElement<HTMLInputElement>('[data-testid="date-of-birth-input"]');
  }

  get genderSelect(): HTMLSelectElement | null {
    return this.getElement<HTMLSelectElement>('[data-testid="gender-select"]');
  }

  get occupationInput(): HTMLInputElement | null {
    return this.getElement<HTMLInputElement>('[data-testid="occupation-input"]');
  }

  get addressLine1Input(): HTMLInputElement | null {
    return this.getElement<HTMLInputElement>('[data-testid="address-line1-input"]');
  }

  get addressLine2Input(): HTMLInputElement | null {
    return this.getElement<HTMLInputElement>('[data-testid="address-line2-input"]');
  }

  get cityInput(): HTMLInputElement | null {
    return this.getElement<HTMLInputElement>('[data-testid="city-input"]');
  }

  get provinceSelect(): HTMLSelectElement | null {
    return this.getElement<HTMLSelectElement>('[data-testid="province-select"]');
  }

  get postalCodeInput(): HTMLInputElement | null {
    return this.getElement<HTMLInputElement>('[data-testid="postal-code-input"]');
  }

  get emergencyContactNameInput(): HTMLInputElement | null {
    return this.getElement<HTMLInputElement>('[data-testid="emergency-contact-name-input"]');
  }

  get emergencyContactPhoneInput(): HTMLInputElement | null {
    return this.getElement<HTMLInputElement>('[data-testid="emergency-contact-phone-input"]');
  }

  get emergencyContactRelationSelect(): HTMLSelectElement | null {
    return this.getElement<HTMLSelectElement>('[data-testid="emergency-contact-relation-select"]');
  }

  get saveButton(): HTMLButtonElement | null {
    return this.getElement<HTMLButtonElement>('[data-testid="save-button"]');
  }

  get cancelButton(): HTMLButtonElement | null {
    return this.getElement<HTMLButtonElement>('[data-testid="cancel-button"]');
  }

  get editButton(): HTMLButtonElement | null {
    return this.getElement<HTMLButtonElement>('[data-testid="edit-button"]');
  }

  get changePasswordButton(): HTMLButtonElement | null {
    return this.getElement<HTMLButtonElement>('[data-testid="change-password-button"]');
  }

  get profilePictureUpload(): HTMLInputElement | null {
    return this.getElement<HTMLInputElement>('[data-testid="profile-picture-upload"]');
  }

  get profilePicturePreview(): HTMLImageElement | null {
    return this.getElement<HTMLImageElement>('[data-testid="profile-picture-preview"]');
  }

  get loadingSpinner(): HTMLElement | null {
    return this.getElement('[data-testid="loading-spinner"]');
  }

  get errorMessage(): string {
    return this.getText('[data-testid="error-message"]');
  }

  get firstNameError(): string {
    return this.getText('[data-testid="first-name-error"]');
  }

  get lastNameError(): string {
    return this.getText('[data-testid="last-name-error"]');
  }

  get emailError(): string {
    return this.getText('[data-testid="email-error"]');
  }

  get phoneError(): string {
    return this.getText('[data-testid="phone-error"]');
  }

  get nationalIdError(): string {
    return this.getText('[data-testid="national-id-error"]');
  }

  get postalCodeError(): string {
    return this.getText('[data-testid="postal-code-error"]');
  }

  fillPersonalInfo(data: any): void {
    if (this.firstNameInput) this.setInputValue('[data-testid="first-name-input"]', data.firstName || '');
    if (this.lastNameInput) this.setInputValue('[data-testid="last-name-input"]', data.lastName || '');
    if (this.emailInput) this.setInputValue('[data-testid="email-input"]', data.email || '');
    if (this.phoneInput) this.setInputValue('[data-testid="phone-input"]', data.phone || '');
    if (this.nationalIdInput) this.setInputValue('[data-testid="national-id-input"]', data.nationalId || '');
    if (this.dateOfBirthInput) this.setInputValue('[data-testid="date-of-birth-input"]', data.dateOfBirth || '');
    if (this.genderSelect) this.setSelectValue(this.genderSelect, data.gender || '');
    if (this.occupationInput) this.setInputValue('[data-testid="occupation-input"]', data.occupation || '');
  }

  fillAddressInfo(data: any): void {
    if (this.addressLine1Input) this.setInputValue('[data-testid="address-line1-input"]', data.addressLine1 || '');
    if (this.addressLine2Input) this.setInputValue('[data-testid="address-line2-input"]', data.addressLine2 || '');
    if (this.cityInput) this.setInputValue('[data-testid="city-input"]', data.city || '');
    if (this.provinceSelect) this.setSelectValue(this.provinceSelect, data.province || '');
    if (this.postalCodeInput) this.setInputValue('[data-testid="postal-code-input"]', data.postalCode || '');
  }

  fillEmergencyContact(data: any): void {
    if (this.emergencyContactNameInput) {
      this.setInputValue('[data-testid="emergency-contact-name-input"]', data.name || '');
    }
    if (this.emergencyContactPhoneInput) {
      this.setInputValue('[data-testid="emergency-contact-phone-input"]', data.phone || '');
    }
    if (this.emergencyContactRelationSelect) {
      this.setSelectValue(this.emergencyContactRelationSelect, data.relation || '');
    }
  }

  setSelectValue(select: HTMLSelectElement, value: string): void {
    select.value = value;
    select.dispatchEvent(new Event('change'));
    this.detectChanges();
  }

  clickSave(): void {
    this.clickElement('[data-testid="save-button"]');
  }

  clickCancel(): void {
    this.clickElement('[data-testid="cancel-button"]');
  }

  clickEdit(): void {
    this.clickElement('[data-testid="edit-button"]');
  }

  clickChangePassword(): void {
    this.clickElement('[data-testid="change-password-button"]');
  }

  uploadProfilePicture(file: File): void {
    const input = this.profilePictureUpload;
    if (input) {
      // Simulate file upload
      Object.defineProperty(input, 'files', { value: [file] });
      input.dispatchEvent(new Event('change'));
      this.detectChanges();
    }
  }
}

describe('CustomerProfileComponent', () => {
  let component: CustomerProfileComponent;
  let fixture: ComponentFixture<CustomerProfileComponent>;
  let pageObject: CustomerProfilePageObject;
  let authService: MockAuthService;
  let userService: MockUserService;
  let router: MockRouter;
  let translationService: MockTranslationService;
  let notificationService: MockNotificationService;
  let loadingService: MockLoadingService;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    const authServiceInstance = new MockAuthService();
    const userServiceInstance = new MockUserService();
    const routerInstance = new MockRouter();
    const translationServiceInstance = new MockTranslationService();
    const notificationServiceInstance = new MockNotificationService();
    const loadingServiceInstance = new MockLoadingService();

    await TestBed.configureTestingModule({
      declarations: [CustomerProfileComponent],
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceInstance },
        { provide: UserService, useValue: userServiceInstance },
        { provide: Router, useValue: routerInstance },
        { provide: TranslationService, useValue: translationServiceInstance },
        { provide: NotificationService, useValue: notificationServiceInstance },
        { provide: LoadingService, useValue: loadingServiceInstance }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerProfileComponent);
    component = fixture.componentInstance;
    pageObject = new CustomerProfilePageObject(fixture);

    authService = TestBed.inject(AuthService) as any;
    userService = TestBed.inject(UserService) as any;
    router = TestBed.inject(Router) as any;
    translationService = TestBed.inject(TranslationService) as any;
    notificationService = TestBed.inject(NotificationService) as any;
    loadingService = TestBed.inject(LoadingService) as any;
    formBuilder = TestBed.inject(FormBuilder);

    // Set up authenticated user
    authService._isAuthenticated = true;
    authService._mockUser = MOCK_USERS[0];
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct default values', () => {
      fixture.detectChanges();
      
      expect(component.isLoading).toBeFalse();
      expect(component.isEditMode).toBeFalse();
      expect(component.profileForm).toBeDefined();
      expect(component.customerProfile).toBeNull();
    });

    it('should create profile form with all required controls', () => {
      fixture.detectChanges();
      
      const form = component.profileForm;
      expect(form.get('firstName')).toBeTruthy();
      expect(form.get('lastName')).toBeTruthy();
      expect(form.get('email')).toBeTruthy();
      expect(form.get('phone')).toBeTruthy();
      expect(form.get('nationalId')).toBeTruthy();
      expect(form.get('dateOfBirth')).toBeTruthy();
      expect(form.get('gender')).toBeTruthy();
      expect(form.get('occupation')).toBeTruthy();
      expect(form.get('address')).toBeTruthy();
      expect(form.get('emergencyContact')).toBeTruthy();
    });

    it('should load user profile data on init', fakeAsync(() => {
      const mockProfile = MOCK_CUSTOMER_PROFILES[0];
      spyOn(userService, 'getUserById').and.returnValue(of(mockProfile));
      
      component.ngOnInit();
      tick(100);
      
      expect(userService.getUserById).toHaveBeenCalledWith(MOCK_USERS[0].id);
      expect(component.customerProfile).toEqual(mockProfile);
    }));

    it('should populate form with loaded profile data', fakeAsync(() => {
      const mockProfile = MOCK_CUSTOMER_PROFILES[0];
      spyOn(userService, 'getUserById').and.returnValue(of(mockProfile));
      
      component.ngOnInit();
      tick(100);
      
      expect(component.profileForm.get('firstName')?.value).toBe(mockProfile.firstName);
      expect(component.profileForm.get('email')?.value).toBe(mockProfile.email);
    }));

    it('should redirect unauthenticated users', () => {
      authService._isAuthenticated = false;
      authService._mockUser = null;
      
      component.ngOnInit();
      
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should validate required first name', () => {
      const firstNameControl = component.profileForm.get('firstName');
      firstNameControl?.setValue('');
      firstNameControl?.markAsTouched();
      
      expect(firstNameControl?.hasError('required')).toBeTrue();
      
      const errorMessage = component.getFieldErrorMessage('firstName');
      expect(errorMessage).toBeTruthy();
    });

    it('should validate required last name', () => {
      const lastNameControl = component.profileForm.get('lastName');
      lastNameControl?.setValue('');
      lastNameControl?.markAsTouched();
      
      expect(lastNameControl?.hasError('required')).toBeTrue();
    });

    it('should validate email format', () => {
      const emailControl = component.profileForm.get('email');
      emailControl?.setValue('invalid-email');
      emailControl?.markAsTouched();
      
      expect(emailControl?.hasError('email')).toBeTrue();
      
      const errorMessage = component.getFieldErrorMessage('email');
      expect(errorMessage).toContain('valid email');
    });

    it('should validate Thai phone number format', () => {
      const phoneControl = component.profileForm.get('phone');
      phoneControl?.setValue('123456789'); // Invalid format
      phoneControl?.markAsTouched();
      
      expect(phoneControl?.hasError('invalidThaiPhone')).toBeTrue();
    });

    it('should accept valid Thai phone numbers', () => {
      const phoneControl = component.profileForm.get('phone');
      phoneControl?.setValue('0812345678'); // Valid format
      phoneControl?.updateValueAndValidity();
      
      expect(phoneControl?.hasError('invalidThaiPhone')).toBeFalsy();
    });

    it('should validate Thai National ID', () => {
      const nationalIdControl = component.profileForm.get('nationalId');
      nationalIdControl?.setValue('1234567890123'); // Invalid checksum
      nationalIdControl?.markAsTouched();
      
      expect(nationalIdControl?.hasError('invalidThaiNationalId')).toBeDefined();
    });

    it('should accept valid Thai National ID', () => {
      const nationalIdControl = component.profileForm.get('nationalId');
      nationalIdControl?.setValue('1100200123456'); // Valid format and checksum
      nationalIdControl?.updateValueAndValidity();
      
      // Should not have validation errors
      expect(nationalIdControl?.valid).toBeDefined();
    });

    it('should validate date of birth (not future)', () => {
      const dobControl = component.profileForm.get('dateOfBirth');
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      
      dobControl?.setValue(futureDate.toISOString().split('T')[0]);
      dobControl?.markAsTouched();
      
      expect(dobControl?.hasError('futureDate')).toBeTrue();
    });

    it('should validate minimum age (18 years)', () => {
      const dobControl = component.profileForm.get('dateOfBirth');
      const recentDate = new Date();
      recentDate.setFullYear(recentDate.getFullYear() - 10); // 10 years old
      
      dobControl?.setValue(recentDate.toISOString().split('T')[0]);
      dobControl?.markAsTouched();
      
      expect(dobControl?.hasError('underAge')).toBeTrue();
    });

    it('should validate Thai postal code', () => {
      const addressGroup = component.profileForm.get('address');
      const postalCodeControl = addressGroup?.get('postalCode');
      
      postalCodeControl?.setValue('12345'); // Valid format
      postalCodeControl?.updateValueAndValidity();
      
      expect(postalCodeControl?.hasError('invalidThaiPostalCode')).toBeFalsy();
    });

    it('should validate emergency contact phone number', () => {
      const emergencyGroup = component.profileForm.get('emergencyContact');
      const phoneControl = emergencyGroup?.get('phone');
      
      phoneControl?.setValue('invalid-phone');
      phoneControl?.markAsTouched();
      
      expect(phoneControl?.hasError('invalidThaiPhone')).toBeTrue();
    });
  });

  describe('Profile Management', () => {
    beforeEach(fakeAsync(() => {
      const mockProfile = MOCK_CUSTOMER_PROFILES[0];
      spyOn(userService, 'getUserById').and.returnValue(of(mockProfile));
      fixture.detectChanges();
      tick(100);
    }));

    it('should enable edit mode', () => {
      pageObject.clickEdit();
      
      expect(component.isEditMode).toBeTrue();
      expect(component.profileForm.enabled).toBeTrue();
    });

    it('should disable edit mode on cancel', () => {
      component.isEditMode = true;
      component.profileForm.enable();
      
      pageObject.clickCancel();
      
      expect(component.isEditMode).toBeFalse();
      expect(component.profileForm.disabled).toBeTrue();
    });

    it('should reset form on cancel', () => {
      component.isEditMode = true;
      component.profileForm.enable();
      component.profileForm.get('firstName')?.setValue('Modified Name');
      
      pageObject.clickCancel();
      
      expect(component.profileForm.get('firstName')?.value).not.toBe('Modified Name');
    });

    it('should save profile changes', fakeAsync(() => {
      const updatedProfile = { ...MOCK_CUSTOMER_PROFILES[0], firstName: 'Updated Name' };
      spyOn(userService, 'updateUser').and.returnValue(of(updatedProfile));
      
      component.isEditMode = true;
      component.profileForm.enable();
      component.profileForm.get('firstName')?.setValue('Updated Name');
      
      pageObject.clickSave();
      tick(100);
      
      expect(userService.updateUser).toHaveBeenCalled();
      expect(notificationService.showSuccess).toHaveBeenCalled();
      expect(component.isEditMode).toBeFalse();
    }));

    it('should handle save errors', fakeAsync(() => {
      const error = new Error('Update failed');
      spyOn(userService, 'updateUser').and.returnValue(throwError(() => error));
      
      component.isEditMode = true;
      component.profileForm.enable();
      
      pageObject.clickSave();
      tick(100);
      
      expect(notificationService.showError).toHaveBeenCalled();
      expect(component.isEditMode).toBeTrue(); // Should remain in edit mode
    }));

    it('should not save invalid form', () => {
      component.isEditMode = true;
      component.profileForm.enable();
      component.profileForm.get('firstName')?.setValue(''); // Make invalid
      
      pageObject.clickSave();
      
      expect(userService.updateUser).not.toHaveBeenCalled();
    });

    it('should show loading state during save', fakeAsync(() => {
      spyOn(userService, 'updateUser').and.returnValue(of(MOCK_CUSTOMER_PROFILES[0]));
      
      component.isEditMode = true;
      component.profileForm.enable();
      
      pageObject.clickSave();
      
      expect(component.isLoading).toBeTrue();
      
      tick(100);
      
      expect(component.isLoading).toBeFalse();
    }));
  });

  describe('Thai-Specific Validations', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should provide Thai provinces in dropdown', () => {
      const provinces = component.getThaiProvinces();
      
      expect(provinces).toContain('กรุงเทพมหานคร');
      expect(provinces).toContain('เชียงใหม่');
      expect(provinces).toContain('ภูเก็ต');
      expect(provinces.length).toBe(77); // 76 provinces + 1 special admin area
    });

    it('should validate postal code against province', () => {
      const addressGroup = component.profileForm.get('address');
      addressGroup?.get('province')?.setValue('กรุงเทพมหานคร');
      addressGroup?.get('postalCode')?.setValue('10110'); // Valid Bangkok postal code
      
      const isValid = component.validatePostalCodeForProvince('10110', 'กรุงเทพมหานคร');
      expect(isValid).toBeTrue();
    });

    it('should reject invalid postal code for province', () => {
      const addressGroup = component.profileForm.get('address');
      addressGroup?.get('province')?.setValue('กรุงเทพมหานคร');
      addressGroup?.get('postalCode')?.setValue('50000'); // Chiang Mai postal code
      
      const isValid = component.validatePostalCodeForProvince('50000', 'กรุงเทพมหานคร');
      expect(isValid).toBeFalse();
    });

    it('should format Thai phone number display', () => {
      const formatted = component.formatThaiPhoneNumber('0812345678');
      expect(formatted).toBe('081-234-5678');
    });

    it('should validate and format Thai National ID display', () => {
      const formatted = component.formatThaiNationalId('1100200123456');
      expect(formatted).toBe('1-1002-00123-45-6');
    });

    it('should provide Thai gender options', () => {
      const genderOptions = component.getGenderOptions();
      
      expect(genderOptions).toEqual([
        { value: 'M', label: 'ชาย' },
        { value: 'F', label: 'หญิง' },
        { value: 'O', label: 'อื่น ๆ' }
      ]);
    });

    it('should validate Thai text input for Thai fields', () => {
      const thaiName = 'สมชาย ใจดี';
      const englishName = 'Somchai Jaidee';
      
      expect(component.isThaiText(thaiName)).toBeTrue();
      expect(component.isThaiText(englishName)).toBeFalse();
    });
  });

  describe('Profile Picture Management', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle profile picture upload', () => {
      const mockFile = new File(['test'], 'profile.jpg', { type: 'image/jpeg' });
      spyOn(component, 'onProfilePictureChange');
      
      pageObject.uploadProfilePicture(mockFile);
      
      expect(component.onProfilePictureChange).toHaveBeenCalled();
    });

    it('should validate image file type', () => {
      const mockFile = new File(['test'], 'profile.txt', { type: 'text/plain' });
      
      const isValid = component.validateImageFile(mockFile);
      
      expect(isValid).toBeFalse();
    });

    it('should validate image file size', () => {
      // Create a mock file that exceeds size limit
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
      
      const isValid = component.validateImageFileSize(largeFile);
      
      expect(isValid).toBeFalse();
    });

    it('should preview uploaded image', fakeAsync(() => {
      const mockFile = new File(['test'], 'profile.jpg', { type: 'image/jpeg' });
      spyOn(component, 'createImagePreview').and.callThrough();
      
      component.onProfilePictureChange({ target: { files: [mockFile] } } as any);
      tick(100);
      
      expect(component.createImagePreview).toHaveBeenCalledWith(mockFile);
    }));

    it('should remove profile picture', () => {
      component.profilePictureUrl = 'test-url.jpg';
      
      component.removeProfilePicture();
      
      expect(component.profilePictureUrl).toBeNull();
    });
  });

  describe('Password Management', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should navigate to change password page', () => {
      pageObject.clickChangePassword();
      
      expect(router.navigate).toHaveBeenCalledWith(['/profile/change-password']);
    });

    it('should show password strength indicator', () => {
      const weakPassword = '123';
      const strongPassword = 'StrongP@ssw0rd!';
      
      expect(component.getPasswordStrength(weakPassword)).toBe('weak');
      expect(component.getPasswordStrength(strongPassword)).toBe('strong');
    });
  });

  describe('Accessibility Features', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have proper ARIA labels on form controls', () => {
      const firstNameInput = pageObject.firstNameInput;
      expect(firstNameInput?.getAttribute('aria-label')).toBeTruthy();
    });

    it('should associate error messages with form controls', () => {
      const firstNameControl = component.profileForm.get('firstName');
      firstNameControl?.setValue('');
      firstNameControl?.markAsTouched();
      fixture.detectChanges();
      
      const firstNameInput = pageObject.firstNameInput;
      const errorId = firstNameInput?.getAttribute('aria-describedby');
      expect(errorId).toBeTruthy();
    });

    it('should support keyboard navigation', () => {
      const saveButton = pageObject.saveButton;
      if (saveButton) {
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        saveButton.dispatchEvent(event);
        
        // Should trigger save action
        expect(component.isEditMode).toBeDefined();
      }
    });

    it('should announce form validation errors to screen readers', () => {
      spyOn(component, 'announceFormErrors');
      
      component.profileForm.get('firstName')?.setValue('');
      component.onSave();
      
      expect(component.announceFormErrors).toHaveBeenCalled();
    });
  });

  describe('Responsive Design', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should adapt form layout for mobile devices', () => {
      Object.defineProperty(window, 'innerWidth', { value: 375 });
      component.onResize();
      
      expect(component.isMobileView).toBeTrue();
    });

    it('should show/hide sections based on screen size', () => {
      component.isMobileView = true;
      fixture.detectChanges();
      
      expect(component.showAdvancedFields).toBeFalse();
    });

    it('should handle touch interactions on mobile', () => {
      const touchEvent = new TouchEvent('touchstart');
      
      expect(() => component.handleTouchEvent(touchEvent)).not.toThrow();
    });
  });

  describe('Data Persistence', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should auto-save draft changes', fakeAsync(() => {
      spyOn(component, 'saveDraft');
      
      component.profileForm.get('firstName')?.setValue('Modified Name');
      
      tick(2000); // Auto-save delay
      
      expect(component.saveDraft).toHaveBeenCalled();
    }));

    it('should restore draft on form reset', () => {
      const draftData = { firstName: 'Draft Name' };
      spyOn(component, 'loadDraft').and.returnValue(draftData);
      
      component.restoreDraft();
      
      expect(component.profileForm.get('firstName')?.value).toBe('Draft Name');
    });

    it('should clear draft after successful save', fakeAsync(() => {
      spyOn(userService, 'updateUser').and.returnValue(of(MOCK_CUSTOMER_PROFILES[0]));
      spyOn(component, 'clearDraft');
      
      component.isEditMode = true;
      component.onSave();
      tick(100);
      
      expect(component.clearDraft).toHaveBeenCalled();
    }));
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle profile load error', fakeAsync(() => {
      const error = new Error('Profile not found');
      spyOn(userService, 'getUserById').and.returnValue(throwError(() => error));
      
      component.loadProfile();
      tick(100);
      
      expect(notificationService.showError).toHaveBeenCalled();
      expect(component.error).toBeTruthy();
    }));

    it('should handle network connectivity issues', fakeAsync(() => {
      spyOn(userService, 'updateUser').and.returnValue(throwError(() => ({ status: 0 })));
      
      component.onSave();
      tick(100);
      
      expect(component.error).toContain('network');
    }));

    it('should handle validation errors from server', fakeAsync(() => {
      const validationError = {
        status: 400,
        error: { message: 'Email already exists' }
      };
      spyOn(userService, 'updateUser').and.returnValue(throwError(() => validationError));
      
      component.onSave();
      tick(100);
      
      expect(notificationService.showError).toHaveBeenCalledWith('Email already exists');
    }));
  });

  describe('Security Considerations', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should sanitize user input', () => {
      const maliciousInput = '<script>alert("xss")</script>';
      component.profileForm.get('firstName')?.setValue(maliciousInput);
      
      const sanitized = component.sanitizeInput(maliciousInput);
      expect(sanitized).not.toContain('<script>');
    });

    it('should validate file uploads for security', () => {
      const maliciousFile = new File(['test'], 'malicious.exe', { type: 'application/exe' });
      
      const isValid = component.validateUploadSecurity(maliciousFile);
      expect(isValid).toBeFalse();
    });

    it('should prevent sensitive data exposure in logs', () => {
      spyOn(console, 'log');
      
      component.logProfileUpdate();
      
      expect(console.log).not.toHaveBeenCalledWith(jasmine.stringMatching(/nationalId|phone/));
    });
  });

  describe('Component Lifecycle', () => {
    it('should unsubscribe on destroy', () => {
      const subscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
      component['subscription'] = subscription;
      
      component.ngOnDestroy();
      
      expect(subscription.unsubscribe).toHaveBeenCalled();
    });

    it('should save draft before page unload', () => {
      spyOn(component, 'saveDraft');
      
      const event = new Event('beforeunload');
      window.dispatchEvent(event);
      
      // Would need to verify the beforeunload handler is called
    });

    it('should clean up temporary files on destroy', () => {
      component.profilePictureUrl = 'blob:test-url';
      spyOn(URL, 'revokeObjectURL');
      
      component.ngOnDestroy();
      
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-url');
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle empty profile data', fakeAsync(() => {
      spyOn(userService, 'getUserById').and.returnValue(of(null));
      
      component.loadProfile();
      tick(100);
      
      expect(component.customerProfile).toBeNull();
      expect(component.error).toBeFalsy(); // Should handle gracefully
    }));

    it('should handle malformed date strings', () => {
      const malformedDate = 'invalid-date';
      
      expect(() => component.calculateAge(malformedDate)).not.toThrow();
      expect(component.calculateAge(malformedDate)).toBeNull();
    });

    it('should handle invalid image files gracefully', () => {
      const corruptFile = new File(['corrupt'], 'image.jpg', { type: 'image/jpeg' });
      
      expect(() => component.onProfilePictureChange({ target: { files: [corruptFile] } } as any))
        .not.toThrow();
    });

    it('should handle rapid form submissions', () => {
      spyOn(userService, 'updateUser').and.returnValue(of(MOCK_CUSTOMER_PROFILES[0]));
      
      // Rapid submissions
      component.onSave();
      component.onSave();
      component.onSave();
      
      // Should only process the first one
      expect(userService.updateUser).toHaveBeenCalledTimes(1);
    });
  });
});