import { test, expect } from '@playwright/test';

test.describe('Dashboard Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth/login');
    await page.fill('input[formControlName="username"]', 'agent');
    await page.fill('input[formControlName="password"]', 'agent123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should display dashboard elements', async ({ page }) => {
    // Check welcome section
    await expect(page.locator('h1')).toContainText('Welcome');
    const welcomeText = await page.locator('h1').textContent();
    expect(welcomeText).not.toContain('null null'); // Should show actual user name
    
    // Check stats cards
    await expect(page.locator('.stat-card, .stats-grid .mat-card')).toHaveCount(3);
    await expect(page.locator(':text("Active Policies")')).toBeVisible();
    await expect(page.locator(':text("Pending Claims")')).toBeVisible();
    await expect(page.locator(':text("Notifications")')).toBeVisible();
  });

  test('should display quick actions', async ({ page }) => {
    await expect(page.locator(':text("Quick Actions")')).toBeVisible();
    
    // Check action buttons
    const newPolicyButton = page.locator('button:has-text("New Policy"), a:has-text("New Policy")');
    const newClaimButton = page.locator('button:has-text("New Claim"), a:has-text("New Claim")');
    const profileButton = page.locator('button:has-text("Profile"), a:has-text("Profile")');
    
    await expect(newPolicyButton).toBeVisible();
    await expect(newClaimButton).toBeVisible();
    await expect(profileButton).toBeVisible();
  });

  test('should display recent activity', async ({ page }) => {
    await expect(page.locator(':text("Recent Activity")')).toBeVisible();
    
    // Check activity items
    const activityItems = page.locator('.activity-item, .recent-activity .mat-card');
    await expect(activityItems.first()).toBeVisible();
  });

  test('should navigate to new policy page', async ({ page }) => {
    const newPolicyButton = page.locator('button:has-text("New Policy"), a:has-text("New Policy")').first();
    await newPolicyButton.click();
    
    await expect(page).toHaveURL(/.*policies\/new/);
    await expect(page.locator('h1')).toContainText('New');
  });

  test('should navigate to new claim page', async ({ page }) => {
    const newClaimButton = page.locator('button:has-text("New Claim"), a:has-text("New Claim")').first();
    await newClaimButton.click();
    
    await expect(page).toHaveURL(/.*claims\/new/);
    await expect(page.locator('h1')).toContainText('New Claim');
  });

  test('should navigate to profile page', async ({ page }) => {
    const profileButton = page.locator('button:has-text("Profile"), a:has-text("Profile")').first();
    await profileButton.click();
    
    await expect(page).toHaveURL(/.*profile/);
    await expect(page.locator('h1')).toContainText('Profile');
  });

  test('should display user information correctly', async ({ page }) => {
    const welcomeMessage = page.locator('h1');
    await expect(welcomeMessage).toBeVisible();
    
    const text = await welcomeMessage.textContent();
    // Should contain "Welcome" and actual username (not null values)
    expect(text).toContain('Welcome');
    expect(text).not.toContain('null null');
    expect(text).not.toContain(', !'); // Should have actual user name before exclamation
  });
});