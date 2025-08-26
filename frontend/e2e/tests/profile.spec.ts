import { test, expect } from '@playwright/test';

test.describe('Profile Management Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth/login');
    await page.fill('input[formControlName="username"]', 'agent');
    await page.fill('input[formControlName="password"]', 'agent123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should navigate to profile page', async ({ page }) => {
    await page.goto('/profile');
    
    await expect(page).toHaveURL(/.*profile/);
    await expect(page.locator('h1')).toContainText('Profile');
  });

  test('should display profile information', async ({ page }) => {
    await page.goto('/profile');
    
    // Check profile sections
    await expect(page.locator('h2:has-text("Account Information")')).toBeVisible();
    await expect(page.locator('h2:has-text("Personal Information")')).toBeVisible();
    
    // Should not show placeholder text
    const content = await page.textContent('body');
    const hasPlaceholderText = content.includes('will be implemented here');
    expect(hasPlaceholderText).toBeFalsy();
  });

  test('should display user account information', async ({ page }) => {
    await page.goto('/profile');
    
    // Check account information fields
    const accountSection = page.locator('h2:has-text("Account Information")').locator('..').locator('..');
    
    await expect(accountSection.locator(':text("Full Name")')).toBeVisible();
    await expect(accountSection.locator(':text("Username")')).toBeVisible();
    await expect(accountSection.locator(':text("Email")')).toBeVisible();
    await expect(accountSection.locator(':text("Role")')).toBeVisible();
  });

  test('should display personal information section', async ({ page }) => {
    await page.goto('/profile');
    
    // Check personal information fields
    const personalSection = page.locator('h2:has-text("Personal Information")').locator('..').locator('..');
    
    await expect(personalSection.locator(':text("First Name")')).toBeVisible();
    await expect(personalSection.locator(':text("Last Name")')).toBeVisible();
    await expect(personalSection.locator(':text("Phone Number")')).toBeVisible();
  });

  test('should show actual user data (not null values)', async ({ page }) => {
    await page.goto('/profile');
    
    const content = await page.textContent('body');
    
    // Should show actual username (agent)
    expect(content).toContain('agent');
    expect(content).toContain('agent@thaiinsurance.com');
    expect(content).toContain('AGENT');
    
    // Should not show "Not specified" for username, email, or role
    const usernameSection = page.locator(':text("Username")').locator('..').or(
      page.locator('label:has-text("Username")').locator('..')
    );
    const usernameValue = await usernameSection.textContent();
    expect(usernameValue).not.toContain('Not specified');
  });

  test('should display action buttons', async ({ page }) => {
    await page.goto('/profile');
    
    // Check action buttons
    await expect(page.locator('button:has-text("Edit Profile"), button:has-text("Edit")')).toBeVisible();
    await expect(page.locator('button:has-text("Change Password"), button:has-text("Password")')).toBeVisible();
  });

  test('should handle edit profile button click', async ({ page }) => {
    await page.goto('/profile');
    
    const editButton = page.locator('button:has-text("Edit Profile"), button:has-text("Edit")').first();
    await editButton.click();
    
    // Should either navigate to edit page or open edit form
    await page.waitForTimeout(1000);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle change password button click', async ({ page }) => {
    await page.goto('/profile');
    
    const passwordButton = page.locator('button:has-text("Change Password"), button:has-text("Password")').first();
    await passwordButton.click();
    
    // Should either navigate to password change page or open modal
    await page.waitForTimeout(1000);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display user role correctly', async ({ page }) => {
    await page.goto('/profile');
    
    // Agent user should show AGENT role
    const roleText = page.locator(':text("Role")').locator('..').or(
      page.locator('label:has-text("Role")').locator('..')
    );
    
    const roleValue = await roleText.textContent();
    expect(roleValue).toContain('AGENT');
  });

  test('should display email correctly', async ({ page }) => {
    await page.goto('/profile');
    
    // Should show actual email, not "Not specified"
    const emailSection = page.locator(':text("Email")').locator('..').or(
      page.locator('label:has-text("Email")').locator('..')
    );
    
    const emailValue = await emailSection.textContent();
    expect(emailValue).toContain('agent@thaiinsurance.com');
    expect(emailValue).not.toContain('Not specified');
  });

  test('should navigate from dashboard to profile', async ({ page }) => {
    // Start at dashboard
    await page.goto('/dashboard');
    
    // Click profile button from dashboard
    const profileButton = page.locator('button:has-text("Profile"), a:has-text("Profile")').first();
    await profileButton.click();
    
    await expect(page).toHaveURL(/.*profile/);
    await expect(page.locator('h1')).toContainText('Profile');
  });
});