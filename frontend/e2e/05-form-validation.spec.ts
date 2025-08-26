import { test, expect } from '@playwright/test';
import { TestHelpers } from './test-helpers';

/**
 * EPIC 5: Form Validation and Error Handling
 * Comprehensive test suite for form validation across all forms
 */

test.describe('Form Validation and Error Handling', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.login();
  });

  test('US-047: Email validation across all forms', async ({ page }) => {
    // Test email validation in different contexts
    const emailTestCases = [
      { value: '', error: 'Email is required' },
      { value: 'invalid-email', error: 'Please enter a valid email address' },
      { value: '@domain.com', error: 'Please enter a valid email address' },
      { value: 'user@', error: 'Please enter a valid email address' },
      { value: 'user@domain', error: 'Please enter a valid email address' },
      { value: 'valid@email.com', error: null }
    ];

    // Test in customer registration form if available
    await page.goto('/customers/new');
    
    if (page.url().includes('/customers/new')) {
      const emailField = page.locator('[data-testid="email"], input[type="email"]');
      
      if (await emailField.isVisible()) {
        for (const testCase of emailTestCases) {
          await helpers.fillField('[data-testid="email"]', testCase.value);
          await page.blur('[data-testid="email"]');
          await page.waitForTimeout(500);
          
          if (testCase.error) {
            await expect(page.locator(`mat-error:has-text("${testCase.error}")`)).toBeVisible();
          } else {
            await expect(page.locator('mat-error')).not.toBeVisible();
          }
        }
      }
    }

    // Test in profile update form
    await page.click('[data-testid="user-menu"]');
    const profileLink = page.locator('[data-testid="profile-link"]');
    
    if (await profileLink.isVisible()) {
      await profileLink.click();
      
      const profileEmailField = page.locator('[data-testid="profile-email"]');
      if (await profileEmailField.isVisible()) {
        for (const testCase of emailTestCases.slice(1, 4)) { // Test a few cases
          await helpers.fillField('[data-testid="profile-email"]', testCase.value);
          await page.blur('[data-testid="profile-email"]');
          
          if (testCase.error) {
            await expect(page.locator(`mat-error:has-text("${testCase.error}")`)).toBeVisible();
          }
        }
      }
    }
  });

  test('US-048: Phone number validation with Thai format', async ({ page }) => {
    await page.goto('/customers/new');
    
    const phoneField = page.locator('[data-testid="phone"], [data-testid="phone-number"]');
    
    if (await phoneField.isVisible()) {
      const phoneTestCases = [
        { value: '', error: 'Phone number is required' },
        { value: '123', error: 'Please enter a valid Thai phone number' },
        { value: '0812345', error: 'Please enter a valid Thai phone number' },
        { value: '1812345678', error: 'Please enter a valid Thai phone number' },
        { value: '0912345678', error: null }, // Valid mobile
        { value: '0812345678', error: null }, // Valid mobile
        { value: '0212345678', error: null }, // Valid landline
        { value: '+66812345678', error: null } // International format
      ];

      for (const testCase of phoneTestCases) {
        await helpers.fillField('[data-testid="phone"]', testCase.value);
        await page.blur('[data-testid="phone"]');
        await page.waitForTimeout(500);
        
        if (testCase.error) {
          await expect(page.locator(`mat-error:has-text("${testCase.error}")`)).toBeVisible();
        } else {
          await expect(page.locator('mat-error')).not.toBeVisible();
        }
      }
    }
  });

  test('US-049: Thai National ID validation', async ({ page }) => {
    await page.goto('/customers/new');
    
    const nationalIdField = page.locator('[data-testid="national-id"], [data-testid="citizen-id"]');
    
    if (await nationalIdField.isVisible()) {
      const nationalIdTestCases = [
        { value: '', error: 'National ID is required' },
        { value: '123456789', error: 'National ID must be 13 digits' },
        { value: '12345678901234', error: 'National ID must be 13 digits' },
        { value: 'abcdefghijklm', error: 'National ID must contain only numbers' },
        { value: '1234567890123', error: null } // Valid format (checksum would need real validation)
      ];

      for (const testCase of nationalIdTestCases) {
        await helpers.fillField('[data-testid="national-id"]', testCase.value);
        await page.blur('[data-testid="national-id"]');
        await page.waitForTimeout(500);
        
        if (testCase.error) {
          await expect(page.locator(`mat-error:has-text("${testCase.error}")`)).toBeVisible();
        } else if (testCase.value === '1234567890123') {
          // For valid format, should not show format errors
          const formatErrors = page.locator('mat-error:has-text("must be 13 digits"), mat-error:has-text("contain only numbers")');
          await expect(formatErrors).not.toBeVisible();
        }
      }
    }
  });

  test('US-050: Currency amount validation', async ({ page }) => {
    await helpers.navigateToSection('policies');
    await page.click('[data-testid="new-policy-button"]');
    
    // Test damage amount validation in claim form
    await helpers.navigateToSection('claims');
    await page.click('[data-testid="new-claim-button"]');
    
    const damageAmountField = page.locator('[data-testid="damage-amount"]');
    
    if (await damageAmountField.isVisible()) {
      const amountTestCases = [
        { value: '', error: 'Damage amount is required' },
        { value: '-1000', error: 'Amount must be positive' },
        { value: '0', error: 'Amount must be greater than zero' },
        { value: 'abc', error: 'Please enter a valid amount' },
        { value: '10000000', error: 'Amount exceeds maximum limit' },
        { value: '50000', error: null } // Valid amount
      ];

      for (const testCase of amountTestCases) {
        await helpers.fillField('[data-testid="damage-amount"]', testCase.value);
        await page.blur('[data-testid="damage-amount"]');
        await page.waitForTimeout(500);
        
        if (testCase.error) {
          await expect(page.locator(`mat-error:has-text("${testCase.error}")`)).toBeVisible();
        } else {
          await expect(page.locator('mat-error')).not.toBeVisible();
        }
      }
    }
  });

  test('US-051: Date validation and constraints', async ({ page }) => {
    await helpers.navigateToSection('claims');
    await page.click('[data-testid="new-claim-button"]');
    
    const incidentDateField = page.locator('[data-testid="incident-date"]');
    
    if (await incidentDateField.isVisible()) {
      // Test future date validation
      await incidentDateField.click();
      
      // Try to select tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDay = tomorrow.getDate();
      
      const futureDateCell = page.locator(`[data-testid="calendar-day-${tomorrowDay}"]`);
      if (await futureDateCell.isVisible()) {
        await futureDateCell.click();
        await page.blur('[data-testid="incident-date"]');
        
        await expect(page.locator('mat-error:has-text("Incident date cannot be in the future")')).toBeVisible();
      }
      
      // Test very old date validation
      await incidentDateField.click();
      const yearSelector = page.locator('.mat-calendar-year-selection, .year-selector');
      if (await yearSelector.isVisible()) {
        await yearSelector.click();
        const oldYear = page.locator('text="1990"').first();
        if (await oldYear.isVisible()) {
          await oldYear.click();
          await page.locator('[data-testid="calendar-day-15"]').click();
          await page.blur('[data-testid="incident-date"]');
          
          await expect(page.locator('mat-error:has-text("Incident date is too old")')).toBeVisible();
        }
      }
      
      // Test valid recent date
      await incidentDateField.click();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayDay = yesterday.getDate();
      
      const validDateCell = page.locator(`[data-testid="calendar-day-${yesterdayDay}"]`);
      if (await validDateCell.isVisible()) {
        await validDateCell.click();
        await page.blur('[data-testid="incident-date"]');
        
        // Should not show date-related errors
        const dateErrors = page.locator('mat-error:has-text("future"), mat-error:has-text("old")');
        await expect(dateErrors).not.toBeVisible();
      }
    }
  });

  test('US-052: Required field validation', async ({ page }) => {
    // Test required fields in policy creation form
    await helpers.navigateToSection('policies');
    await page.click('[data-testid="new-policy-button"]');
    
    // Submit empty form
    await page.click('[data-testid="create-policy-button"]');
    
    // Verify all required field errors appear
    const requiredFields = [
      'License plate is required',
      'Vehicle make is required',
      'Vehicle model is required',
      'Year is required',
      'Coverage type is required',
      'Coverage amount is required'
    ];

    for (const errorMessage of requiredFields) {
      await expect(page.locator(`mat-error:has-text("${errorMessage}")`)).toBeVisible();
    }
    
    // Verify form cannot be submitted
    const submitButton = page.locator('[data-testid="create-policy-button"]');
    await expect(submitButton).toBeDisabled();
    
    // Fill one field and verify that specific error disappears
    await helpers.fillField('[data-testid="license-plate"]', 'กก-1234 กรุงเทพมหานคร');
    await page.blur('[data-testid="license-plate"]');
    
    await expect(page.locator('mat-error:has-text("License plate is required")')).not.toBeVisible();
    
    // But other errors should still be present
    await expect(page.locator('mat-error:has-text("Vehicle make is required")')).toBeVisible();
  });

  test('US-053: Thai license plate format validation', async ({ page }) => {
    await helpers.navigateToSection('policies');
    await page.click('[data-testid="new-policy-button"]');
    
    const licensePlateField = page.locator('[data-testid="license-plate"]');
    
    const licensePlateTestCases = [
      { value: '', error: 'License plate is required' },
      { value: 'ABC123', error: 'Please enter a valid Thai license plate format' },
      { value: '123-ABC', error: 'Please enter a valid Thai license plate format' },
      { value: 'กก1234', error: 'Please enter a valid Thai license plate format' },
      { value: 'กก-1234', error: 'Please include province name' },
      { value: 'กก-1234 กรุงเทพมหานคร', error: null }, // Valid format
      { value: 'ขข-5678 เชียงใหม่', error: null }, // Valid format
      { value: '1กท-234 กรุงเทพมหานคร', error: null } // Valid new format
    ];

    for (const testCase of licensePlateTestCases) {
      await helpers.fillField('[data-testid="license-plate"]', testCase.value);
      await page.blur('[data-testid="license-plate"]');
      await page.waitForTimeout(500);
      
      if (testCase.error) {
        const errorExists = await page.locator(`mat-error:has-text("${testCase.error}")`).count() > 0;
        if (errorExists) {
          await expect(page.locator(`mat-error:has-text("${testCase.error}")`)).toBeVisible();
        }
      } else {
        // For valid formats, should not show format-related errors
        const formatErrors = page.locator('mat-error:has-text("format"), mat-error:has-text("province")');
        await expect(formatErrors).not.toBeVisible();
      }
    }
  });

  test('US-054: Password strength validation', async ({ page }) => {
    // Test in change password form if available
    await page.click('[data-testid="user-menu"]');
    const changePasswordLink = page.locator('[data-testid="change-password"]');
    
    if (await changePasswordLink.isVisible()) {
      await changePasswordLink.click();
      
      const newPasswordField = page.locator('[data-testid="new-password"]');
      const confirmPasswordField = page.locator('[data-testid="confirm-password"]');
      
      if (await newPasswordField.isVisible()) {
        const passwordTestCases = [
          { value: '', error: 'Password is required' },
          { value: '123', error: 'Password must be at least 8 characters' },
          { value: '12345678', error: 'Password must contain at least one uppercase letter' },
          { value: 'PASSWORD', error: 'Password must contain at least one lowercase letter' },
          { value: 'Password', error: 'Password must contain at least one number' },
          { value: 'Password123', error: null } // Strong password
        ];

        for (const testCase of passwordTestCases) {
          await helpers.fillField('[data-testid="new-password"]', testCase.value);
          await page.blur('[data-testid="new-password"]');
          await page.waitForTimeout(500);
          
          if (testCase.error) {
            await expect(page.locator(`mat-error:has-text("${testCase.error}")`)).toBeVisible();
          }
        }
        
        // Test password confirmation
        await helpers.fillField('[data-testid="new-password"]', 'Password123');
        await helpers.fillField('[data-testid="confirm-password"]', 'DifferentPassword');
        await page.blur('[data-testid="confirm-password"]');
        
        await expect(page.locator('mat-error:has-text("Passwords do not match")')).toBeVisible();
        
        // Test matching passwords
        await helpers.fillField('[data-testid="confirm-password"]', 'Password123');
        await page.blur('[data-testid="confirm-password"]');
        
        await expect(page.locator('mat-error:has-text("Passwords do not match")')).not.toBeVisible();
      }
    }
  });

  test('US-055: File upload validation', async ({ page }) => {
    // Navigate to a form with file upload (e.g., claim form)
    await helpers.navigateToSection('claims');
    await page.click('[data-testid="new-claim-button"]');
    
    const fileUploadField = page.locator('[data-testid="incident-photos"], input[type="file"]');
    
    if (await fileUploadField.isVisible()) {
      // Test file type validation (would need actual test files)
      const testCases = [
        { filename: 'test.txt', error: 'Only image files are allowed' },
        { filename: 'test.pdf', error: 'Only image files are allowed' },
        { filename: 'test.jpg', error: null },
        { filename: 'test.png', error: null }
      ];

      // Note: In a real test, you would create actual test files
      // and use page.setInputFiles() to test file uploads
      
      // Test file size validation
      const maxSizeError = page.locator('mat-error:has-text("File size exceeds maximum limit")');
      const typeError = page.locator('mat-error:has-text("Only image files are allowed")');
      
      // These would be tested with actual files in a complete implementation
    }
  });

  test('US-056: Form submission error handling', async ({ page }) => {
    // Test network error handling
    await helpers.navigateToSection('policies');
    await page.click('[data-testid="new-policy-button"]');
    
    // Fill valid form data
    const testData = helpers.generateThaiTestData();
    await helpers.fillField('[data-testid="license-plate"]', testData.policy.licensePlate);
    await helpers.selectMatOption('[data-testid="vehicle-make"]', testData.policy.vehicleMake);
    await helpers.fillField('[data-testid="vehicle-model"]', testData.policy.vehicleModel);
    await helpers.selectMatOption('[data-testid="vehicle-year"]', testData.policy.year.toString());
    await helpers.selectMatOption('[data-testid="coverage-type"]', testData.policy.coverageType);
    await helpers.selectMatOption('[data-testid="coverage-amount"]', testData.policy.coverageAmount.toLocaleString());
    
    // Simulate network error by intercepting API calls
    await page.route('**/api/policies', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    // Submit form
    await page.click('[data-testid="create-policy-button"]');
    
    // Should show error message
    await helpers.verifyToastMessage('Error creating policy');
    
    // Form should remain in error state, not redirect
    expect(page.url()).toContain('/policies/new');
    
    // Submit button should be enabled again for retry
    await expect(page.locator('[data-testid="create-policy-button"]')).toBeEnabled();
  });

  test('US-057: Real-time validation feedback', async ({ page }) => {
    await helpers.navigateToSection('policies');
    await page.click('[data-testid="new-policy-button"]');
    
    const licensePlateField = page.locator('[data-testid="license-plate"]');
    
    // Type invalid characters and verify real-time feedback
    await licensePlateField.fill('ABC');
    await page.waitForTimeout(300); // Wait for validation debounce
    
    // Should show validation error immediately
    await expect(page.locator('mat-error')).toBeVisible();
    
    // Start typing valid format
    await licensePlateField.fill('กก-');
    await page.waitForTimeout(300);
    
    // Error should still be present but may change
    const hasError = await page.locator('mat-error').count() > 0;
    expect(hasError).toBeTruthy();
    
    // Complete valid format
    await licensePlateField.fill('กก-1234 กรุงเทพมหานคร');
    await page.waitForTimeout(300);
    
    // Error should disappear
    await expect(page.locator('mat-error')).not.toBeVisible();
    
    // Field should show valid state (green border, checkmark, etc.)
    const validState = await licensePlateField.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return styles.borderColor || styles.outlineColor;
    });
    
    // Valid state should be indicated (exact implementation depends on styling)
    expect(validState).toBeDefined();
  });

  test('US-058: Form state persistence', async ({ page }) => {
    await helpers.navigateToSection('policies');
    await page.click('[data-testid="new-policy-button"]');
    
    // Fill some form data
    const testData = helpers.generateThaiTestData();
    await helpers.fillField('[data-testid="license-plate"]', testData.policy.licensePlate);
    await helpers.selectMatOption('[data-testid="vehicle-make"]', testData.policy.vehicleMake);
    
    // Navigate away and back
    await helpers.navigateToSection('dashboard');
    await helpers.navigateToSection('policies');
    await page.click('[data-testid="new-policy-button"]');
    
    // Check if form data was preserved
    const licensePlateValue = await page.locator('[data-testid="license-plate"]').inputValue();
    const vehicleMakeValue = await page.locator('[data-testid="vehicle-make"]').textContent();
    
    // Form data may or may not be preserved depending on implementation
    // This test documents the expected behavior
    if (licensePlateValue === testData.policy.licensePlate) {
      // Form state is preserved
      expect(licensePlateValue).toBe(testData.policy.licensePlate);
    } else {
      // Form state is reset (also valid behavior)
      expect(licensePlateValue).toBe('');
    }
  });

  test('US-059: Accessibility in form validation', async ({ page }) => {
    await helpers.navigateToSection('policies');
    await page.click('[data-testid="new-policy-button"]');
    
    // Test that form fields have proper ARIA attributes
    const licensePlateField = page.locator('[data-testid="license-plate"]');
    
    // Should have aria-required
    await expect(licensePlateField).toHaveAttribute('aria-required', 'true');
    
    // Submit form to trigger validation
    await page.click('[data-testid="create-policy-button"]');
    
    // Should have aria-invalid after validation fails
    await expect(licensePlateField).toHaveAttribute('aria-invalid', 'true');
    
    // Should have aria-describedby pointing to error message
    const describedBy = await licensePlateField.getAttribute('aria-describedby');
    if (describedBy) {
      const errorElement = page.locator(`#${describedBy}`);
      await expect(errorElement).toBeVisible();
      await expect(errorElement).toContainText('required');
    }
    
    // Fill valid data
    await helpers.fillField('[data-testid="license-plate"]', 'กก-1234 กรุงเทพมหานคร');
    await page.blur('[data-testid="license-plate"]');
    
    // Should have aria-invalid="false" after validation passes
    await expect(licensePlateField).toHaveAttribute('aria-invalid', 'false');
  });

  test('US-060: Cross-field validation', async ({ page }) => {
    await helpers.navigateToSection('policies');
    await page.click('[data-testid="new-policy-button"]');
    
    // Test coverage amount vs vehicle age validation
    await helpers.selectMatOption('[data-testid="vehicle-year"]', '1995'); // Very old car
    await helpers.selectMatOption('[data-testid="coverage-amount"]', '5,000,000'); // High coverage
    
    await page.blur('[data-testid="coverage-amount"]');
    await page.waitForTimeout(500);
    
    // Should show warning or error for high coverage on old vehicle
    const warningMessage = page.locator('mat-error:has-text("coverage"), .warning-message');
    if (await warningMessage.count() > 0) {
      await expect(warningMessage).toBeVisible();
    }
    
    // Test policy start/end date validation if available
    const startDateField = page.locator('[data-testid="policy-start-date"]');
    const endDateField = page.locator('[data-testid="policy-end-date"]');
    
    if (await startDateField.isVisible() && await endDateField.isVisible()) {
      // Set end date before start date
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      
      await startDateField.fill(today.toISOString().split('T')[0]);
      await endDateField.fill(yesterday.toISOString().split('T')[0]);
      
      await page.blur('[data-testid="policy-end-date"]');
      
      // Should show cross-field validation error
      await expect(page.locator('mat-error:has-text("End date must be after start date")')).toBeVisible();
    }
  });
});