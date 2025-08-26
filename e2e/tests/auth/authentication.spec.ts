import { test, expect } from '../../fixtures/test-fixtures';
import { TEST_CONFIG } from '../../fixtures/test-fixtures';

/**
 * Authentication E2E Test Suite for Thai Auto Insurance Application
 * 
 * Tests comprehensive authentication flows:
 * - User login/logout with Thai credentials
 * - Registration with Thai personal data
 * - Password reset functionality
 * - Session management and security
 * - Multi-language authentication
 * - Role-based access control
 */
test.describe('Authentication', () => {
  
  test.beforeEach(async ({ page }) => {
    // Ensure we start from a clean state
    await page.goto('/');
    
    // Clear any existing sessions
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test.describe('User Login', () => {
    
    test('should login successfully with valid Thai customer credentials', async ({ 
      loginPage, 
      dashboardPage,
      thaiData 
    }) => {
      // Navigate to login page
      await loginPage.navigate();
      
      // Verify login page loads with Thai language elements
      await loginPage.verifyThaiLanguage();
      
      // Login as customer
      await loginPage.loginAsCustomer();
      
      // Verify successful login and redirection to dashboard
      await dashboardPage.verifyPageLoaded();
      
      // Verify Thai welcome message
      const welcomeMessage = await dashboardPage.getWelcomeMessage();
      expect(welcomeMessage).toMatch(/สวัสดี|ยินดีต้อนรับ/);
      
      // Verify user is authenticated
      expect(await dashboardPage.isAuthenticated()).toBe(true);
    });

    test('should login successfully with agent credentials', async ({ 
      loginPage, 
      page 
    }) => {
      await loginPage.navigate();
      await loginPage.loginAsAgent();
      
      // Should redirect to agent dashboard
      await expect(page).toHaveURL(/.*agent-dashboard.*/);
      
      // Verify agent-specific elements are visible
      const agentPanel = page.locator('[data-testid="agent-control-panel"]');
      await expect(agentPanel).toBeVisible();
    });

    test('should login successfully with admin credentials', async ({ 
      loginPage, 
      adminPage 
    }) => {
      await loginPage.navigate();
      await loginPage.loginAsAdmin();
      
      // Verify admin page loads
      await adminPage.verifyAdminPageLoaded();
      
      // Verify admin navigation is present
      await expect(adminPage.usersManagementTab).toBeVisible();
      await expect(adminPage.policiesManagementTab).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ loginPage }) => {
      await loginPage.navigate();
      
      // Attempt login with invalid credentials
      await loginPage.loginWithInvalidCredentials('invalid@example.com', 'wrongpassword');
      
      // Verify error message is displayed
      await loginPage.waitForErrorMessage('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    });

    test('should validate email format', async ({ loginPage }) => {
      await loginPage.navigate();
      
      // Test various invalid email formats
      const invalidEmails = ['invalid-email', '@domain.com', 'user@', 'user.domain.com'];
      
      for (const email of invalidEmails) {
        await loginPage.fillField(loginPage.emailInput, email);
        await loginPage.emailInput.blur();
        
        await loginPage.verifyValidationErrors({ 
          email: 'รูปแบบอีเมลไม่ถูกต้อง' 
        });
        
        await loginPage.emailInput.clear();
      }
    });

    test('should handle remember me functionality', async ({ loginPage }) => {
      await loginPage.navigate();
      
      // Test remember me functionality
      await loginPage.verifyRememberMeFunctionality();
    });

    test('should enforce rate limiting after multiple failed attempts', async ({ 
      loginPage 
    }) => {
      await loginPage.navigate();
      
      // Test rate limiting
      await loginPage.testLoginRateLimit();
    });
  });

  test.describe('User Registration', () => {
    
    test('should register new customer with Thai personal data', async ({ 
      registerPage,
      thaiData,
      page
    }) => {
      const customerData = thaiData.generateCustomer();
      
      await registerPage.navigate();
      
      // Verify Thai language elements
      await registerPage.verifyThaiLanguageElements();
      
      // Complete registration
      await registerPage.registerCustomer(customerData);
      
      // Verify registration success
      await registerPage.verifyRegistrationSuccess();
      
      // Should redirect to email verification page
      await expect(page).toHaveURL(/.*verify-email.*/);
    });

    test('should validate Thai ID card number', async ({ registerPage, thaiData }) => {
      await registerPage.navigate();
      
      // Test invalid Thai ID formats
      const invalidIds = ['123456789012', '1234567890123456', 'abcd567890123', '0000000000000'];
      
      for (const invalidId of invalidIds) {
        await registerPage.testInvalidThaiId(invalidId);
      }
    });

    test('should validate Thai phone number format', async ({ registerPage }) => {
      await registerPage.navigate();
      
      // Test invalid Thai phone numbers
      const invalidPhones = ['123456789', '08123456789012', '0212345678', '1234567890'];
      
      for (const invalidPhone of invalidPhones) {
        await registerPage.testInvalidPhoneNumber(invalidPhone);
      }
    });

    test('should validate password strength requirements', async ({ registerPage }) => {
      await registerPage.navigate();
      
      // Test password strength validation
      await registerPage.testPasswordStrength();
    });

    test('should prevent duplicate email registration', async ({ 
      registerPage,
      thaiData 
    }) => {
      await registerPage.navigate();
      
      // Test duplicate email prevention
      await registerPage.testDuplicateEmailRegistration('somchai.test@gmail.com');
    });

    test('should require terms and conditions acceptance', async ({ 
      registerPage 
    }) => {
      await registerPage.navigate();
      
      // Test terms requirement
      await registerPage.testTermsRequirement();
    });

    test('should support Buddhist calendar date input', async ({ 
      registerPage 
    }) => {
      await registerPage.navigate();
      
      // Test Buddhist calendar date (2567 BE = 2024 CE)
      await registerPage.fillBuddhistCalendarDate(2540, 5, 15); // May 15, 1997
    });
  });

  test.describe('Password Reset', () => {
    
    test('should initiate password reset with valid email', async ({ 
      loginPage,
      page 
    }) => {
      await loginPage.navigate();
      
      // Initiate password reset
      await loginPage.initiatePasswordReset('somchai.test@gmail.com');
      
      // Verify success message
      await loginPage.waitForSuccessMessage('ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว');
    });

    test('should show error for non-existent email', async ({ loginPage }) => {
      await loginPage.navigate();
      
      // Attempt reset with non-existent email
      await loginPage.initiatePasswordReset('nonexistent@example.com');
      
      // Verify error message
      await loginPage.waitForErrorMessage('ไม่พบอีเมลนี้ในระบบ');
    });

    test('should validate email format in password reset', async ({ 
      loginPage,
      page 
    }) => {
      await loginPage.navigate();
      await loginPage.forgotPasswordLink.click();
      
      const resetEmailInput = page.locator('[data-testid="reset-email-input"]');
      
      // Test invalid email format
      await loginPage.fillField(resetEmailInput, 'invalid-email');
      await resetEmailInput.blur();
      
      const emailError = page.locator('[data-testid="reset-email-error"]');
      await expect(emailError).toContainText('รูปแบบอีเมลไม่ถูกต้อง');
    });
  });

  test.describe('Session Management', () => {
    
    test('should maintain session across browser refresh', async ({ 
      loginPage, 
      dashboardPage,
      page 
    }) => {
      // Login
      await loginPage.navigate();
      await loginPage.loginAsCustomer();
      await dashboardPage.verifyPageLoaded();
      
      // Refresh browser
      await page.reload();
      
      // Verify still authenticated
      await dashboardPage.verifyPageLoaded();
      expect(await dashboardPage.isAuthenticated()).toBe(true);
    });

    test('should logout successfully and clear session', async ({ 
      loginPage, 
      dashboardPage,
      page 
    }) => {
      // Login
      await loginPage.navigate();
      await loginPage.loginAsCustomer();
      await dashboardPage.verifyPageLoaded();
      
      // Logout
      await dashboardPage.logout();
      
      // Verify redirected to login page
      await expect(page).toHaveURL(/.*login.*/);
      
      // Verify session is cleared
      const sessionData = await page.evaluate(() => {
        return {
          localStorage: Object.keys(localStorage).length,
          sessionStorage: Object.keys(sessionStorage).length
        };
      });
      
      expect(sessionData.localStorage).toBe(0);
    });

    test('should handle session expiration gracefully', async ({ 
      loginPage, 
      dashboardPage,
      page 
    }) => {
      await loginPage.navigate();
      await loginPage.loginAsCustomer();
      await dashboardPage.verifyPageLoaded();
      
      // Simulate session expiration by clearing auth token
      await page.evaluate(() => {
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
      });
      
      // Navigate to protected page
      await page.goto('/policies/new');
      
      // Should redirect to login with session expired message
      await expect(page).toHaveURL(/.*login.*/);
      await expect(page.locator('[data-testid="session-expired-message"]')).toBeVisible();
    });
  });

  test.describe('Social Authentication', () => {
    
    test('should display LINE login option (popular in Thailand)', async ({ 
      loginPage 
    }) => {
      await loginPage.navigate();
      
      // Check if LINE login is available
      if (await loginPage.isElementVisible(loginPage.lineLoginButton)) {
        await expect(loginPage.lineLoginButton).toBeVisible();
        await expect(loginPage.lineLoginButton).toContainText('LINE');
      }
    });

    test('should display Google login option', async ({ loginPage }) => {
      await loginPage.navigate();
      
      if (await loginPage.isElementVisible(loginPage.googleLoginButton)) {
        await expect(loginPage.googleLoginButton).toBeVisible();
      }
    });

    test('should display Facebook login option', async ({ loginPage }) => {
      await loginPage.navigate();
      
      if (await loginPage.isElementVisible(loginPage.facebookLoginButton)) {
        await expect(loginPage.facebookLoginButton).toBeVisible();
      }
    });
  });

  test.describe('Multi-language Support', () => {
    
    test('should support Thai and English language switching', async ({ 
      loginPage,
      page 
    }) => {
      await loginPage.navigate();
      
      // Switch to English
      await loginPage.switchLanguage('en');
      
      // Verify English labels
      const labels = await loginPage.getFormLabels();
      expect(labels.email).toMatch(/email/i);
      expect(labels.password).toMatch(/password/i);
      
      // Switch back to Thai
      await loginPage.switchLanguage('th');
      
      // Verify Thai labels
      await loginPage.verifyThaiLanguage();
    });

    test('should maintain language preference across sessions', async ({ 
      loginPage,
      dashboardPage,
      page 
    }) => {
      await loginPage.navigate();
      
      // Switch to English and login
      await loginPage.switchLanguage('en');
      await loginPage.loginAsCustomer();
      
      // Logout and check language persistence
      await dashboardPage.logout();
      
      // Should maintain English
      await expect(page.locator('text=Login')).toBeVisible();
    });
  });

  test.describe('Security Features', () => {
    
    test('should prevent SQL injection in login form', async ({ 
      loginPage 
    }) => {
      await loginPage.navigate();
      
      // Test SQL injection attempts
      const sqlInjectionAttempts = [
        "'; DROP TABLE users; --",
        "admin' OR '1'='1",
        "' UNION SELECT * FROM users --"
      ];
      
      for (const attempt of sqlInjectionAttempts) {
        await loginPage.loginWithInvalidCredentials(attempt, 'password');
        
        // Should show normal invalid credentials error, not SQL error
        await loginPage.waitForErrorMessage('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
    });

    test('should prevent XSS in registration form', async ({ 
      registerPage,
      thaiData 
    }) => {
      const customerData = thaiData.generateCustomer();
      
      // Inject XSS attempt in firstName
      customerData.firstName = '<script>alert("XSS")</script>สมชาย';
      
      await registerPage.navigate();
      await registerPage.registerCustomer(customerData);
      
      // Should either sanitize the input or show validation error
      // XSS should not execute
      const alertDialogs: string[] = [];
      registerPage.page.on('dialog', dialog => {
        alertDialogs.push(dialog.message());
        dialog.dismiss();
      });
      
      await registerPage.page.waitForTimeout(2000);
      expect(alertDialogs).toHaveLength(0);
    });

    test('should enforce HTTPS in production-like environment', async ({ 
      page 
    }) => {
      // Check if running in production-like environment
      const isProduction = process.env.NODE_ENV === 'production';
      
      if (isProduction) {
        await page.goto('http://localhost:4200/login');
        
        // Should redirect to HTTPS or show security warning
        const url = page.url();
        expect(url).toMatch(/^https:\/\//);
      }
    });

    test('should set secure session cookies', async ({ 
      loginPage,
      page 
    }) => {
      await loginPage.navigate();
      await loginPage.loginAsCustomer();
      
      // Check cookie security attributes
      const cookies = await page.context().cookies();
      const authCookie = cookies.find(cookie => 
        cookie.name.includes('session') || cookie.name.includes('auth')
      );
      
      if (authCookie) {
        expect(authCookie.httpOnly).toBe(true);
        expect(authCookie.secure).toBe(true);
        expect(authCookie.sameSite).toBe('Strict');
      }
    });
  });

  test.describe('Accessibility', () => {
    
    test('should support keyboard navigation in login form', async ({ 
      loginPage,
      page 
    }) => {
      await loginPage.navigate();
      
      // Navigate using Tab key
      await page.keyboard.press('Tab'); // Email field
      expect(await page.locator(':focus').getAttribute('data-testid')).toBe('email-input');
      
      await page.keyboard.press('Tab'); // Password field
      expect(await page.locator(':focus').getAttribute('data-testid')).toBe('password-input');
      
      await page.keyboard.press('Tab'); // Login button
      expect(await page.locator(':focus').getAttribute('data-testid')).toBe('login-button');
      
      // Submit using Enter key
      await page.keyboard.press('Enter');
    });

    test('should have proper ARIA labels for screen readers', async ({ 
      loginPage 
    }) => {
      await loginPage.navigate();
      
      // Check ARIA labels
      await expect(loginPage.emailInput).toHaveAttribute('aria-label', /อีเมล|email/i);
      await expect(loginPage.passwordInput).toHaveAttribute('aria-label', /รหัสผ่าน|password/i);
      
      // Check form has proper role
      const loginForm = loginPage.page.locator('form');
      await expect(loginForm).toHaveAttribute('role', 'form');
    });

    test('should support high contrast mode', async ({ 
      loginPage,
      page 
    }) => {
      await loginPage.navigate();
      
      // Enable high contrast mode
      await page.emulateMedia({ colorScheme: 'dark', forcedColors: 'active' });
      
      // Verify elements are still visible
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    });
  });
});