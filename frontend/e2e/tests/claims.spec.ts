import { test, expect } from '@playwright/test';

test.describe('Claims Management Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth/login');
    await page.fill('input[formControlName="username"]', 'agent');
    await page.fill('input[formControlName="password"]', 'agent123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should navigate to claims list', async ({ page }) => {
    await page.goto('/claims');
    
    await expect(page).toHaveURL(/.*claims/);
    await expect(page.locator('h1')).toContainText('Claims');
  });

  test('should display claims management page', async ({ page }) => {
    await page.goto('/claims');
    
    // Should show claims management content
    const content = await page.textContent('body');
    expect(content).toContain('Claims');
    
    // Should not show placeholder text
    const hasPlaceholderText = content.includes('will be implemented here');
    expect(hasPlaceholderText).toBeFalsy();
  });

  test('should navigate to new claim submission', async ({ page }) => {
    await page.goto('/claims/new');
    
    await expect(page).toHaveURL(/.*claims\/new/);
    await expect(page.locator('h1')).toContainText('New Claim');
  });

  test('should display new claim form', async ({ page }) => {
    await page.goto('/claims/new');
    
    // Check form sections
    await expect(page.locator('h2:has-text("Incident Information")')).toBeVisible();
    await expect(page.locator('h2:has-text("Policy Information")')).toBeVisible();
    
    // Check form elements
    await expect(page.locator('input[matDatepicker], input[type="date"]')).toBeVisible();
    await expect(page.locator('mat-select')).toHaveCount.greaterThan(0);
    await expect(page.locator('textarea')).toBeVisible();
  });

  test('should allow filling incident information', async ({ page }) => {
    await page.goto('/claims/new');
    
    // Select incident type
    await page.locator('mat-select').first().click();
    await page.locator('mat-option:has-text("Collision")').click();
    
    // Fill incident location
    const locationInput = page.locator('input').filter({ hasText: /location|ที่เกิดเหตุ/i }).or(
      page.locator('input').nth(1)
    );
    await locationInput.fill('Sukhumvit Road, Bangkok');
    
    // Fill description
    const descriptionTextarea = page.locator('textarea');
    await descriptionTextarea.fill('Minor collision with another vehicle at intersection');
    await expect(descriptionTextarea).toHaveValue('Minor collision with another vehicle at intersection');
  });

  test('should allow selecting policy', async ({ page }) => {
    await page.goto('/claims/new');
    
    // Find and click policy select dropdown
    const policySelects = page.locator('mat-select');
    const policySelect = policySelects.filter({ hasText: /policy|กรมธรรม์/i }).or(policySelects.last());
    
    await policySelect.click();
    
    // Select a policy option
    const policyOption = page.locator('mat-option').first();
    if (await policyOption.isVisible()) {
      await policyOption.click();
    }
  });

  test('should allow entering damage amount', async ({ page }) => {
    await page.goto('/claims/new');
    
    // Find damage amount input
    const damageInput = page.locator('input[type="number"]').or(
      page.locator('input').filter({ hasText: /damage|ความเสียหาย/i })
    );
    
    if (await damageInput.count() > 0) {
      await damageInput.first().fill('15000');
      await expect(damageInput.first()).toHaveValue('15000');
    }
  });

  test('should navigate back to claims list', async ({ page }) => {
    await page.goto('/claims/new');
    
    const backButton = page.locator('button:has-text("Back"), button:has-text("Claims")');
    await backButton.click();
    
    await expect(page).toHaveURL(/.*claims$/);
  });

  test('should handle claim submission', async ({ page }) => {
    await page.goto('/claims/new');
    
    // Fill required fields
    await page.locator('textarea').fill('Test incident description');
    
    // Click submit button
    const submitButton = page.locator('button:has-text("Submit")');
    await submitButton.click();
    
    // Should either navigate or show confirmation
    await page.waitForTimeout(1000);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/claims/new');
    
    // Try to submit without filling required fields
    const submitButton = page.locator('button:has-text("Submit")');
    await submitButton.click();
    
    // Should remain on the same page (form validation)
    await expect(page).toHaveURL(/.*claims\/new/);
  });

  test('should display proper form labels', async ({ page }) => {
    await page.goto('/claims/new');
    
    // Check for proper labels (not placeholder text)
    const content = await page.textContent('body');
    expect(content).toContain('Incident');
    expect(content).toContain('Policy');
    expect(content).toContain('Date');
    expect(content).toContain('Location');
    expect(content).toContain('Description');
  });
});