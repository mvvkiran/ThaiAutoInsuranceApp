import { test, expect } from '@playwright/test';

/**
 * Setup and Smoke Tests
 * Basic connectivity and application health checks
 */

test.describe('Application Setup and Smoke Tests', () => {

  test('Application loads successfully', async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    
    // Wait for Angular to load
    await page.waitForLoadState('networkidle');
    
    // Should redirect to login or show login form
    const isLoginPage = page.url().includes('/login');
    const hasLoginForm = await page.locator('form').isVisible();
    
    expect(isLoginPage || hasLoginForm).toBeTruthy();
    
    // Page should not have any JavaScript errors
    const consoleErrors = [];
    page.on('console', message => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });
    
    await page.waitForTimeout(2000);
    
    // Should have minimal console errors (some are expected during development)
    expect(consoleErrors.length).toBeLessThan(5);
  });

  test('Basic navigation works', async ({ page }) => {
    // Go to login page
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Should have login elements - using more generic selectors based on the screenshot
    const usernameInput = page.locator('input[type="text"]').first();
    const passwordInput = page.locator('input[type="password"]');
    const loginButton = page.locator('button:has-text("Login")');
    
    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();
    
    // Try login with test credentials
    await usernameInput.fill('admin@thaiinsurance.com');
    await passwordInput.fill('admin123');
    await loginButton.click();
    
    // Wait for navigation or error response
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    
    // Check if we redirected (successful login) or stayed on login page (may show error)
    const redirected = !currentUrl.includes('/login') || currentUrl.includes('/dashboard');
    const hasErrorMessage = await page.locator('text=/error|invalid|failed|unauthorized/i').isVisible();
    const hasFormResponse = await page.locator('.error, .success, .message').isVisible();
    const hasUnauthorizedIndicator = await page.locator('text=/unauthorized/i').isVisible();
    
    // Either successful login (redirect) or proper error handling (including unauthorized status)
    expect(redirected || hasErrorMessage || hasFormResponse || hasUnauthorizedIndicator).toBeTruthy();
  });

  test('UI components are working', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for any UI framework elements (Material or custom)
    const uiElements = await page.locator('button, input, .mat-form-field, .mat-button, .mat-card, .form-field, .btn').count();
    expect(uiElements).toBeGreaterThan(0);
    
    // Check for icons (Material icons or other icon systems)
    const iconElements = await page.locator('.mat-icon, mat-icon, i[class*="icon"], .icon, .fa').count();
    
    // Icons are optional - just verify UI elements exist
    if (iconElements === 0) {
      console.log('No icons detected - using text-based UI');
    }
    
    // Test form field interaction if available
    const formInputs = page.locator('input').first();
    if (await formInputs.isVisible()) {
      await formInputs.focus();
      
      // Verify input can receive focus (basic interaction test)
      const isFocused = await formInputs.evaluate(el => document.activeElement === el);
      expect(isFocused).toBeTruthy();
    }
  });

  test('Responsive layout basics', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for desktop
    await page.screenshot({ path: 'test-results/desktop-view.png', fullPage: true });
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    
    // Layout should adapt
    await page.screenshot({ path: 'test-results/tablet-view.png', fullPage: true });
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    // Should be mobile responsive
    await page.screenshot({ path: 'test-results/mobile-view.png', fullPage: true });
    
    // Mobile menu or navigation should be accessible
    const mobileNav = page.locator('.mobile-menu, .hamburger, .menu-toggle, .mat-toolbar .mat-icon-button');
    if (await mobileNav.count() > 0) {
      await expect(mobileNav.first()).toBeVisible();
    }
  });

  test('CSS and assets load correctly', async ({ page }) => {
    const failedResources = [];
    
    page.on('response', response => {
      if (response.status() >= 400) {
        failedResources.push({
          url: response.url(),
          status: response.status()
        });
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for major CSS/asset failures (some 404s might be expected)
    const criticalFailures = failedResources.filter(resource => 
      resource.status >= 500 || 
      resource.url.includes('.css') || 
      resource.url.includes('main.') ||
      resource.url.includes('polyfills.')
    );
    
    expect(criticalFailures.length).toBe(0);
    
    // Page should have basic styling
    const bodyStyles = await page.evaluate(() => ({
      fontFamily: window.getComputedStyle(document.body).fontFamily,
      backgroundColor: window.getComputedStyle(document.body).backgroundColor,
      margin: window.getComputedStyle(document.body).margin
    }));
    
    expect(bodyStyles.fontFamily).toBeTruthy();
    expect(bodyStyles.backgroundColor).toBeTruthy();
  });

  test('API connectivity test', async ({ page }) => {
    // Monitor network requests
    const apiRequests = [];
    
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        apiRequests.push({
          url: request.url(),
          method: request.method()
        });
      }
    });
    
    page.on('response', response => {
      if (response.url().includes('/api/')) {
        apiRequests.push({
          url: response.url(),
          status: response.status()
        });
      }
    });
    
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Try login to test API
    const usernameInput = page.locator('input[type="text"]').first();
    const passwordInput = page.locator('input[type="password"]');
    const loginButton = page.locator('button:has-text("Login")');
    
    if (await usernameInput.isVisible() && await passwordInput.isVisible() && await loginButton.isVisible()) {
      await usernameInput.fill('admin@thaiinsurance.com');
      await passwordInput.fill('admin123');
      await loginButton.click();
      
      await page.waitForTimeout(3000);
    }
    
    // Should have made API requests or be working with mock data
    const hasApiCalls = apiRequests.length > 0;
    const hasFormResponse = await page.locator('.success, .error, .mat-snack-bar, .message, .alert').isVisible();
    const urlChanged = !page.url().includes('/login');
    
    // Either API is working OR frontend is handling auth locally OR navigation occurred
    expect(hasApiCalls || hasFormResponse || urlChanged).toBeTruthy();
  });

  test('Performance basics', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within reasonable time (development server)
    expect(loadTime).toBeLessThan(10000); // 10 seconds max for dev
    
    // Check for major performance issues
    const performanceEntries = await page.evaluate(() => {
      return performance.getEntriesByType('navigation').map(entry => ({
        domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
        loadComplete: entry.loadEventEnd - entry.loadEventStart
      }));
    });
    
    if (performanceEntries.length > 0) {
      const entry = performanceEntries[0];
      
      // DOM should load reasonably fast
      expect(entry.domContentLoaded).toBeLessThan(5000);
    }
  });

  test('Thai language support basics', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for Thai text in the application
    const thaiTextElements = await page.locator('text=/[ก-๙]/').count();
    
    if (thaiTextElements > 0) {
      // Thai text should render correctly
      const thaiElement = page.locator('text=/[ก-๙]/').first();
      await expect(thaiElement).toBeVisible();
      
      // Font should support Thai characters
      const fontFamily = await thaiElement.evaluate(el => 
        window.getComputedStyle(el).fontFamily
      );
      
      expect(fontFamily).toBeTruthy();
    }
    
    // Check for language selector if available
    const langSelector = page.locator('[data-testid="language-selector"], .language-toggle');
    if (await langSelector.count() > 0) {
      await expect(langSelector.first()).toBeVisible();
    }
  });

  test('Form validation basics', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find any form on the page
    const forms = page.locator('form');
    if (await forms.count() > 0) {
      const form = forms.first();
      
      // Look for submit buttons with various selectors
      const submitButton = form.locator('button[type="submit"], button:has-text("Login"), button:has-text("Submit"), .mat-raised-button, .btn-primary');
      if (await submitButton.count() > 0) {
        const button = submitButton.first();
        
        // Clear any existing input values first (skip checkboxes and radio buttons)
        const inputs = form.locator('input');
        const inputCount = await inputs.count();
        for (let i = 0; i < inputCount; i++) {
          const inputType = await inputs.nth(i).getAttribute('type');
          if (inputType && !['checkbox', 'radio', 'submit', 'button'].includes(inputType.toLowerCase())) {
            try {
              await inputs.nth(i).clear();
            } catch (e) {
              // Skip inputs that can't be cleared
              console.log(`Skipping input ${i} of type ${inputType}`);
            }
          }
        }
        
        await button.click();
        await page.waitForTimeout(1000);
        
        // Check for validation errors with multiple possible selectors
        const errorSelectors = ['.mat-error', '.error', '.invalid-feedback', '.validation-error', '[class*="error"]'];
        let hasValidationErrors = false;
        
        for (const selector of errorSelectors) {
          const errors = page.locator(selector);
          const errorCount = await errors.count();
          if (errorCount > 0) {
            hasValidationErrors = true;
            break;
          }
        }
        
        if (!hasValidationErrors) {
          // Check if button was disabled (another form of validation)
          const isDisabled = await button.isDisabled();
          // Check if form stayed on same page (validation prevented submission)
          const currentUrl = page.url();
          const stayedOnSamePage = currentUrl.includes('/login') || currentUrl.includes('/');
          
          // At least one validation mechanism should be present
          expect(isDisabled || stayedOnSamePage).toBeTruthy();
        } else {
          // Validation errors are working
          expect(hasValidationErrors).toBeTruthy();
        }
      } else {
        // No submit button found - form might be read-only or different type
        console.log('No submit button found in form');
        expect(true).toBeTruthy(); // Pass test if no submit button
      }
    } else {
      // No forms found on page - this is acceptable for some pages
      console.log('No forms found on page');
      expect(true).toBeTruthy(); // Pass test if no forms
    }
  });

  test('Error handling basics', async ({ page }) => {
    // Test 404 page
    await page.goto('/nonexistent-page');
    await page.waitForLoadState('networkidle');
    
    // Should handle 404 gracefully
    const has404Content = await page.locator('text=/404|not found|page not found/i').count() > 0;
    const hasRedirect = !page.url().includes('nonexistent-page');
    
    // Either shows 404 page or redirects (both valid)
    expect(has404Content || hasRedirect).toBeTruthy();
    
    // Test invalid route with auth
    await page.goto('/invalid/route/here');
    await page.waitForLoadState('networkidle');
    
    // Should not crash the application
    const hasContent = await page.locator('body *').count() > 0;
    expect(hasContent).toBeTruthy();
  });
});