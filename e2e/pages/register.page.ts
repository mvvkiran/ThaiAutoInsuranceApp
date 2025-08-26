import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { CustomerData } from '../utils/thai-data-generator';

/**
 * Registration Page Object for Thai Auto Insurance Application
 * 
 * Handles user registration process:
 * - Customer registration
 * - Form validation
 * - Thai ID card validation
 * - Phone number validation
 * - Terms and conditions
 * - Email verification
 */
export class RegisterPage extends BasePage {
  // Personal Information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly thaiIdInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly birthDateInput: Locator;
  readonly genderSelect: Locator;

  // Address Information
  readonly addressLine1Input: Locator;
  readonly addressLine2Input: Locator;
  readonly districtSelect: Locator;
  readonly provinceSelect: Locator;
  readonly postalCodeInput: Locator;
  
  // Account Information
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly termsCheckbox: Locator;
  readonly privacyCheckbox: Locator;
  readonly marketingCheckbox: Locator;
  
  // Form Controls
  readonly registerButton: Locator;
  readonly backToLoginLink: Locator;
  readonly formContainer: Locator;
  readonly stepIndicator: Locator;
  
  constructor(page: Page) {
    super(page);
    
    // Personal information fields
    this.firstNameInput = page.locator('[data-testid="first-name-input"]');
    this.lastNameInput = page.locator('[data-testid="last-name-input"]');
    this.thaiIdInput = page.locator('[data-testid="thai-id-input"]');
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.phoneInput = page.locator('[data-testid="phone-input"]');
    this.birthDateInput = page.locator('[data-testid="birth-date-input"]');
    this.genderSelect = page.locator('[data-testid="gender-select"]');
    
    // Address fields
    this.addressLine1Input = page.locator('[data-testid="address-line1-input"]');
    this.addressLine2Input = page.locator('[data-testid="address-line2-input"]');
    this.districtSelect = page.locator('[data-testid="district-select"]');
    this.provinceSelect = page.locator('[data-testid="province-select"]');
    this.postalCodeInput = page.locator('[data-testid="postal-code-input"]');
    
    // Account fields
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.confirmPasswordInput = page.locator('[data-testid="confirm-password-input"]');
    this.termsCheckbox = page.locator('[data-testid="terms-checkbox"]');
    this.privacyCheckbox = page.locator('[data-testid="privacy-checkbox"]');
    this.marketingCheckbox = page.locator('[data-testid="marketing-checkbox"]');
    
    // Form controls
    this.registerButton = page.locator('[data-testid="register-button"]');
    this.backToLoginLink = page.locator('[data-testid="back-to-login-link"]');
    this.formContainer = page.locator('[data-testid="registration-form"]');
    this.stepIndicator = page.locator('[data-testid="step-indicator"]');
  }

  /**
   * Navigate to registration page
   */
  async navigate(): Promise<void> {
    await this.goto('/register');
    await this.verifyPageLoaded();
  }

  /**
   * Verify registration page is loaded
   */
  async verifyPageLoaded(): Promise<void> {
    await expect(this.formContainer).toBeVisible();
    await expect(this.registerButton).toBeVisible();
    await expect(this.page).toHaveTitle(/สมัครสมาชิก|Register/);
  }

  /**
   * Complete customer registration with generated Thai data
   */
  async registerCustomer(customerData: CustomerData, password: string = 'TestPassword123!'): Promise<void> {
    // Step 1: Personal Information
    await this.fillPersonalInformation(customerData);
    
    // Step 2: Address Information  
    await this.fillAddressInformation(customerData);
    
    // Step 3: Account Information
    await this.fillAccountInformation(customerData.email, password);
    
    // Step 4: Accept terms and submit
    await this.acceptTermsAndSubmit();
    
    // Verify registration success
    await this.verifyRegistrationSuccess();
  }

  /**
   * Fill personal information section
   */
  async fillPersonalInformation(customerData: CustomerData): Promise<void> {
    await this.fillField(this.firstNameInput, customerData.firstName);
    await this.fillField(this.lastNameInput, customerData.lastName);
    await this.fillField(this.thaiIdInput, customerData.thaiId);
    await this.fillField(this.emailInput, customerData.email);
    await this.fillField(this.phoneInput, customerData.phone);
    
    // Handle birth date (Thai Buddhist calendar support)
    await this.fillField(this.birthDateInput, customerData.birthDate);
    
    // Select gender
    await this.selectOption(this.genderSelect, customerData.gender);
    
    // Take screenshot after personal info
    await this.takeScreenshot('registration-personal-info-completed');
  }

  /**
   * Fill address information section
   */
  async fillAddressInformation(customerData: CustomerData): Promise<void> {
    await this.fillField(this.addressLine1Input, customerData.address.line1);
    
    if (customerData.address.line2) {
      await this.fillField(this.addressLine2Input, customerData.address.line2);
    }
    
    // Select province first (this will populate districts)
    await this.selectOption(this.provinceSelect, customerData.address.province);
    
    // Wait for districts to load
    await this.page.waitForTimeout(1000);
    
    // Select district
    await this.selectOption(this.districtSelect, customerData.address.district);
    
    await this.fillField(this.postalCodeInput, customerData.address.postalCode);
    
    await this.takeScreenshot('registration-address-info-completed');
  }

  /**
   * Fill account information section
   */
  async fillAccountInformation(email: string, password: string): Promise<void> {
    // Email might already be filled from personal info
    if (await this.emailInput.inputValue() !== email) {
      await this.fillField(this.emailInput, email);
    }
    
    await this.fillField(this.passwordInput, password);
    await this.fillField(this.confirmPasswordInput, password);
    
    await this.takeScreenshot('registration-account-info-completed');
  }

  /**
   * Accept terms and conditions and submit
   */
  async acceptTermsAndSubmit(): Promise<void> {
    // Accept required terms
    await this.termsCheckbox.check();
    await this.privacyCheckbox.check();
    
    // Marketing consent is optional
    await this.marketingCheckbox.check();
    
    await this.takeScreenshot('registration-before-submit');
    
    // Submit registration
    await this.registerButton.click();
  }

  /**
   * Verify registration was successful
   */
  async verifyRegistrationSuccess(): Promise<void> {
    // Should redirect to email verification or welcome page
    await this.page.waitForURL('**/verify-email', { timeout: 15000 });
    
    // Verify success message
    await this.waitForSuccessMessage();
    
    // Check for verification email instruction
    await expect(this.page.locator('text=ตรวจสอบอีเมลของคุณ')).toBeVisible();
    
    await this.takeScreenshot('registration-success');
  }

  /**
   * Test registration with invalid Thai ID
   */
  async testInvalidThaiId(invalidId: string): Promise<void> {
    await this.fillField(this.thaiIdInput, invalidId);
    await this.thaiIdInput.blur();
    
    // Should show validation error
    const idError = this.page.locator('[data-testid="thai-id-error"]');
    await expect(idError).toBeVisible();
    await expect(idError).toContainText('หมายเลขบัตรประชาชนไม่ถูกต้อง');
  }

  /**
   * Test registration with invalid phone number
   */
  async testInvalidPhoneNumber(invalidPhone: string): Promise<void> {
    await this.fillField(this.phoneInput, invalidPhone);
    await this.phoneInput.blur();
    
    const phoneError = this.page.locator('[data-testid="phone-error"]');
    await expect(phoneError).toBeVisible();
  }

  /**
   * Test password strength validation
   */
  async testPasswordStrength(): Promise<void> {
    const weakPasswords = ['123', 'password', '12345678'];
    
    for (const password of weakPasswords) {
      await this.fillField(this.passwordInput, password);
      await this.passwordInput.blur();
      
      const passwordError = this.page.locator('[data-testid="password-error"]');
      await expect(passwordError).toBeVisible();
      
      // Clear for next test
      await this.passwordInput.clear();
    }
  }

  /**
   * Test email format validation
   */
  async testEmailValidation(invalidEmail: string): Promise<void> {
    await this.fillField(this.emailInput, invalidEmail);
    await this.emailInput.blur();
    
    const emailError = this.page.locator('[data-testid="email-error"]');
    await expect(emailError).toBeVisible();
  }

  /**
   * Test duplicate email registration
   */
  async testDuplicateEmailRegistration(existingEmail: string): Promise<void> {
    const customerData: CustomerData = {
      firstName: 'สมชาย',
      lastName: 'ใจดี',
      thaiId: '1234567890123',
      email: existingEmail,
      phone: '0812345678',
      birthDate: '1990-01-01',
      gender: 'male',
      address: {
        line1: '123 ถนนสุขุมวิท',
        line2: '',
        district: 'วัฒนา',
        province: 'กรุงเทพมหานคร',
        postalCode: '10110'
      }
    };
    
    await this.registerCustomer(customerData);
    
    // Should show duplicate email error
    await this.waitForErrorMessage('อีเมลนี้ถูกใช้งานแล้ว');
  }

  /**
   * Test terms and conditions requirement
   */
  async testTermsRequirement(): Promise<void> {
    // Fill form but don't accept terms
    const customerData: CustomerData = {
      firstName: 'สมชาย',
      lastName: 'ใจดี',
      thaiId: '1234567890123',
      email: 'test@example.com',
      phone: '0812345678',
      birthDate: '1990-01-01',
      gender: 'male',
      address: {
        line1: '123 ถนนสุขุมวิท',
        line2: '',
        district: 'วัฒนา',
        province: 'กรุงเทพมหานคร',
        postalCode: '10110'
      }
    };
    
    await this.fillPersonalInformation(customerData);
    await this.fillAddressInformation(customerData);
    await this.fillAccountInformation(customerData.email, 'TestPassword123!');
    
    // Try to submit without accepting terms
    await this.registerButton.click();
    
    // Should show terms error
    const termsError = this.page.locator('[data-testid="terms-error"]');
    await expect(termsError).toBeVisible();
  }

  /**
   * Navigate back to login
   */
  async goBackToLogin(): Promise<void> {
    await this.backToLoginLink.click();
    await this.page.waitForURL('**/login');
  }

  /**
   * Get current registration step
   */
  async getCurrentStep(): Promise<number> {
    const stepText = await this.stepIndicator.textContent();
    const match = stepText?.match(/(\d+)/);
    return match ? parseInt(match[1]) : 1;
  }

  /**
   * Verify Thai language elements on registration form
   */
  async verifyThaiLanguageElements(): Promise<void> {
    const thaiElements = [
      'ชื่อ',
      'นามสกุล',
      'หมายเลขบัตรประชาชน',
      'เบอร์โทรศัพท์',
      'ที่อยู่',
      'จังหวัด',
      'อำเภอ',
      'รหัสไปรษณีย์'
    ];
    
    for (const element of thaiElements) {
      await expect(this.page.locator(`text=${element}`)).toBeVisible();
    }
  }

  /**
   * Fill form with Thai Buddhist calendar date
   */
  async fillBuddhistCalendarDate(buddhistYear: number, month: number, day: number): Promise<void> {
    const gregorianYear = buddhistYear - 543;
    const dateString = `${gregorianYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    await this.fillField(this.birthDateInput, dateString);
  }
}