import { test, expect } from '@playwright/test';

test.describe('Authentication Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should redirect to login page when not authenticated', async ({ page }) => {
    await expect(page).toHaveURL(/.*auth\/login/);
    await expect(page.locator('h1')).toContainText('Thai Auto Insurance');
  });

  test('should display login form elements', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Check form elements - Angular reactive forms use formControlName instead of name
    await expect(page.locator('input[formControlName="username"]')).toBeVisible();
    await expect(page.locator('input[formControlName="password"]')).toBeVisible();
    await expect(page.locator('input[type="checkbox"]')).toBeVisible(); // Remember me
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.fill('input[formControlName="username"]', 'invalid@user.com');
    await page.fill('input[formControlName="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Wait for error message
    await expect(page.locator('.error-message, .mat-error, .alert-danger')).toBeVisible();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Fill login form
    await page.fill('input[formControlName="username"]', 'agent');
    await page.fill('input[formControlName="password"]', 'agent123');
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('h1')).toContainText('Welcome');
    
    // Should display user name (not null)
    const welcomeText = await page.locator('h1').textContent();
    expect(welcomeText).not.toContain('null');
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/auth/login');
    await page.fill('input[formControlName="username"]', 'agent');
    await page.fill('input[formControlName="password"]', 'agent123');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Click logout
    await page.click('[data-testid="logout-button"], button:has-text("Logout"), .logout-button');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*auth\/login/);
  });

  test('should remember login state', async ({ page }) => {
    // Login with remember me checked
    await page.goto('/auth/login');
    await page.fill('input[formControlName="username"]', 'agent');
    await page.fill('input[formControlName="password"]', 'agent123');
    await page.check('input[type="checkbox"]');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Refresh the page
    await page.reload();
    
    // Should still be on dashboard (not redirected to login)
    await expect(page).toHaveURL(/.*dashboard/);
  });
});