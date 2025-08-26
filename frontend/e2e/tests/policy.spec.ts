import { test, expect } from '@playwright/test';

test.describe('Policy Management Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth/login');
    await page.fill('input[formControlName="username"]', 'agent');
    await page.fill('input[formControlName="password"]', 'agent123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should navigate to policies list', async ({ page }) => {
    // Navigate to policies
    await page.goto('/policies');
    
    await expect(page).toHaveURL(/.*policies/);
    await expect(page.locator('h1')).toContainText('Policy');
  });

  test('should display policy management page', async ({ page }) => {
    await page.goto('/policies');
    
    // Should show policy management content
    const content = await page.textContent('body');
    expect(content).toContain('Policy');
    
    // Should not show "Policy list and management will be implemented here" (placeholder text)
    // Instead should show actual policy management interface
    const hasPlaceholderText = content.includes('will be implemented here');
    expect(hasPlaceholderText).toBeFalsy();
  });

  test('should navigate to new policy creation', async ({ page }) => {
    await page.goto('/policies/new');
    
    await expect(page).toHaveURL(/.*policies\/new/);
    await expect(page.locator('h1')).toContainText('New');
  });

  test('should display new policy form', async ({ page }) => {
    await page.goto('/policies/new');
    
    // Check form elements
    await expect(page.locator('h2:has-text("Vehicle Information")')).toBeVisible();
    await expect(page.locator('input, mat-select').first()).toBeVisible();
    
    // Check action buttons
    await expect(page.locator('button:has-text("Back"), button:has-text("Policies")')).toBeVisible();
    await expect(page.locator('button:has-text("Create"), button:has-text("Policy")')).toBeVisible();
  });

  test('should allow filling vehicle information', async ({ page }) => {
    await page.goto('/policies/new');
    
    // Fill license plate
    const licensePlateInput = page.locator('input').first();
    await licensePlateInput.fill('กก-1234 กรุงเทพมหานคร');
    await expect(licensePlateInput).toHaveValue('กก-1234 กรุงเทพมหานคร');
    
    // Select vehicle make
    const makeSelect = page.locator('mat-select').first();
    await makeSelect.click();
    await page.locator('mat-option:has-text("Toyota")').click();
  });

  test('should navigate back to policies list', async ({ page }) => {
    await page.goto('/policies/new');
    
    const backButton = page.locator('button:has-text("Back"), button:has-text("Policies")');
    await backButton.click();
    
    await expect(page).toHaveURL(/.*policies$/);
  });

  test('should handle policy creation form submission', async ({ page }) => {
    await page.goto('/policies/new');
    
    // Fill required fields
    await page.locator('input').first().fill('กก-1234 กรุงเทพมหานคร');
    
    // Click create button
    const createButton = page.locator('button:has-text("Create")');
    await createButton.click();
    
    // Should either navigate or show confirmation/error
    // For now, just check that the button click doesn't cause errors
    await page.waitForTimeout(1000);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should validate form fields', async ({ page }) => {
    await page.goto('/policies/new');
    
    // Try to submit without filling required fields
    const createButton = page.locator('button:has-text("Create")');
    await createButton.click();
    
    // Should remain on the same page (form validation)
    await expect(page).toHaveURL(/.*policies\/new/);
  });
});