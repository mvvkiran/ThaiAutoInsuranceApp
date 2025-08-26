import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Login Page Object for Thai Auto Insurance Application
 * 
 * Handles all login-related interactions:
 * - User authentication
 * - Password reset
 * - Remember me functionality
 * - Social login (if available)
 * - Thai language support
 */
export class LoginPage extends BasePage {
  // Login form elements
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;
  
  // Social login elements
  readonly googleLoginButton: Locator;
  readonly facebookLoginButton: Locator;
  readonly lineLoginButton: Locator;
  
  // Page elements
  readonly loginFormTitle: Locator;
  readonly loginFormContainer: Locator;
  readonly thaiWelcomeText: Locator;
  
  constructor(page: Page) {
    super(page);
    
    // Form elements
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.loginButton = page.locator('[data-testid="login-button"]');
    this.rememberMeCheckbox = page.locator('[data-testid="remember-me-checkbox"]');
    this.forgotPasswordLink = page.locator('[data-testid="forgot-password-link"]');
    this.registerLink = page.locator('[data-testid="register-link"]');
    
    // Social login
    this.googleLoginButton = page.locator('[data-testid="google-login-button"]');
    this.facebookLoginButton = page.locator('[data-testid="facebook-login-button"]');
    this.lineLoginButton = page.locator('[data-testid="line-login-button"]');
    
    // Page elements
    this.loginFormTitle = page.locator('[data-testid="login-form-title"]');
    this.loginFormContainer = page.locator('[data-testid="login-form-container"]');
    this.thaiWelcomeText = page.locator('[data-testid="thai-welcome-text"]');
  }

  /**
   * Navigate to login page
   */
  async navigate(): Promise<void> {
    await this.goto('/login');
    await this.verifyPageLoaded();
  }

  /**
   * Verify login page is properly loaded
   */
  async verifyPageLoaded(): Promise<void> {
    await expect(this.loginFormContainer).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    
    // Verify Thai language elements
    await expect(this.page).toHaveTitle(/เข้าสู่ระบบ|Login/);
  }

  /**
   * Perform standard login
   */
  async login(email: string, password: string, options?: {
    rememberMe?: boolean;
    expectSuccess?: boolean;
  }): Promise<void> {
    await this.fillField(this.emailInput, email);
    await this.fillField(this.passwordInput, password);
    
    if (options?.rememberMe) {
      await this.rememberMeCheckbox.check();
    }
    
    // Take screenshot before login attempt
    await this.takeScreenshot(`login-attempt-${email.split('@')[0]}`);
    
    await this.loginButton.click();
    
    if (options?.expectSuccess !== false) {
      // Wait for navigation to dashboard or appropriate page
      await this.page.waitForURL('**/dashboard', { timeout: 15000 });
      await this.waitForPageLoad();
    }
  }

  /**
   * Login with invalid credentials (for negative testing)
   */
  async loginWithInvalidCredentials(email: string, password: string): Promise<void> {
    await this.fillField(this.emailInput, email);
    await this.fillField(this.passwordInput, password);
    await this.loginButton.click();
    
    // Expect error message
    await this.waitForErrorMessage();
  }

  /**
   * Login as customer (test data)
   */
  async loginAsCustomer(): Promise<void> {
    await this.login('somchai.test@gmail.com', 'TestPassword123!');
    await this.page.waitForURL('**/dashboard');
  }

  /**
   * Login as agent (test data)
   */
  async loginAsAgent(): Promise<void> {
    await this.login('agent@thaiinsurance.co.th', 'AgentPass123!');
    await this.page.waitForURL('**/agent-dashboard');
  }

  /**
   * Login as admin (test data)
   */
  async loginAsAdmin(): Promise<void> {
    await this.login('admin@thaiinsurance.co.th', 'AdminPass123!');
    await this.page.waitForURL('**/admin-dashboard');
  }

  /**
   * Initiate password reset
   */
  async initiatePasswordReset(email: string): Promise<void> {
    await this.forgotPasswordLink.click();
    
    // Should navigate to password reset page
    await this.page.waitForURL('**/forgot-password');
    
    const resetEmailInput = this.page.locator('[data-testid="reset-email-input"]');
    const resetButton = this.page.locator('[data-testid="reset-button"]');
    
    await this.fillField(resetEmailInput, email);
    await resetButton.click();
    
    await this.waitForSuccessMessage();
  }

  /**
   * Navigate to registration page
   */
  async goToRegistration(): Promise<void> {
    await this.registerLink.click();
    await this.page.waitForURL('**/register');
  }

  /**
   * Login with Google (if available)
   */
  async loginWithGoogle(): Promise<void> {
    if (await this.isElementVisible(this.googleLoginButton)) {
      await this.googleLoginButton.click();
      
      // Handle Google OAuth popup
      // Note: In real tests, you might need to handle OAuth differently
      await this.page.waitForURL('**/dashboard', { timeout: 20000 });
    }
  }

  /**
   * Login with Facebook (if available)
   */
  async loginWithFacebook(): Promise<void> {
    if (await this.isElementVisible(this.facebookLoginButton)) {
      await this.facebookLoginButton.click();
      await this.page.waitForURL('**/dashboard', { timeout: 20000 });
    }
  }

  /**
   * Login with LINE (popular in Thailand)
   */
  async loginWithLine(): Promise<void> {
    if (await this.isElementVisible(this.lineLoginButton)) {
      await this.lineLoginButton.click();
      await this.page.waitForURL('**/dashboard', { timeout: 20000 });
    }
  }

  /**
   * Verify form validation errors
   */
  async verifyValidationErrors(expectedErrors: { 
    email?: string;
    password?: string;
  }): Promise<void> {
    if (expectedErrors.email) {
      const emailError = this.page.locator('[data-testid="email-error"]');
      await expect(emailError).toContainText(expectedErrors.email);
    }
    
    if (expectedErrors.password) {
      const passwordError = this.page.locator('[data-testid="password-error"]');
      await expect(passwordError).toContainText(expectedErrors.password);
    }
  }

  /**
   * Check if login form is in Thai language
   */
  async verifyThaiLanguage(): Promise<void> {
    // Check for Thai text elements
    await expect(this.page.locator('text=เข้าสู่ระบบ')).toBeVisible();
    await expect(this.page.locator('text=อีเมล')).toBeVisible();
    await expect(this.page.locator('text=รหัสผ่าน')).toBeVisible();
  }

  /**
   * Check if remember me is working
   */
  async verifyRememberMeFunctionality(): Promise<void> {
    // Login with remember me
    await this.login('somchai.test@gmail.com', 'TestPassword123!', { 
      rememberMe: true 
    });
    
    // Logout and verify session persistence
    await this.logout();
    
    // Navigate back to login and check if remembered
    await this.navigate();
    
    // In a real app, this might pre-fill email or auto-login
    // Implementation depends on how remember me is implemented
    const emailValue = await this.emailInput.inputValue();
    expect(emailValue).toBe('somchai.test@gmail.com');
  }

  /**
   * Test login rate limiting (security feature)
   */
  async testLoginRateLimit(): Promise<void> {
    // Attempt multiple failed logins
    for (let i = 0; i < 5; i++) {
      await this.loginWithInvalidCredentials('test@example.com', 'wrongpassword');
      await this.page.waitForTimeout(1000);
    }
    
    // Should show rate limit error
    const rateLimitError = this.page.locator('[data-testid="rate-limit-error"]');
    await expect(rateLimitError).toBeVisible();
  }

  /**
   * Get login form labels (useful for internationalization testing)
   */
  async getFormLabels(): Promise<{
    email: string;
    password: string;
    loginButton: string;
    rememberMe: string;
  }> {
    return {
      email: await this.page.locator('label[for="email"]').textContent() || '',
      password: await this.page.locator('label[for="password"]').textContent() || '',
      loginButton: await this.loginButton.textContent() || '',
      rememberMe: await this.page.locator('label[for="remember-me"]').textContent() || ''
    };
  }
}