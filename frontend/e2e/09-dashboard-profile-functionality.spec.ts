import { test, expect } from '@playwright/test';

/**
 * Dashboard and Profile Functionality Test Suite
 * Tests the issues reported by the user:
 * - Dashboard active policies not updating when new policies are created
 * - Profile showing null null and user.role undefined
 */

test.describe('Dashboard and Profile Functionality Issues', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard (should auto-authenticate with mock user)
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('Dashboard displays current policy counts correctly', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Check that policy counts are displayed
    const activePoliciesCard = page.locator('.stat-card').first();
    const activePoliciesNumber = await activePoliciesCard.locator('.stat-number').textContent();
    
    // Should show actual count, not hardcoded "5"
    expect(activePoliciesNumber).toBeTruthy();
    expect(['0', '1', '2', '3']).toContain(activePoliciesNumber); // Should be real data
    
    // Navigate to policies page to verify count matches
    await page.click('text=Policy Management');
    await page.waitForTimeout(2000);
    
    // Count active policies in the table
    const activePolicyRows = await page.locator('mat-chip.status-active').count();
    
    // Navigate back to dashboard
    await page.click('text=Dashboard');
    await page.waitForTimeout(2000);
    
    // Verify the counts match
    const dashboardCount = await page.locator('.stat-card .stat-number').first().textContent();
    expect(dashboardCount).toBe(activePolicyRows.toString());
  });

  test('Dashboard updates when new policy is created', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Get initial policy count
    const initialCount = await page.locator('.stat-card .stat-number').first().textContent();
    const initialNumber = parseInt(initialCount || '0');
    
    // Navigate to create new policy
    await page.click('text=New Policy');
    await page.waitForTimeout(2000);
    
    // Fill out policy form (basic required fields)
    await page.fill('input[formControlName="licensePlate"]', 'ทด-9999 กรุงเทพมหานคร');
    await page.fill('input[formControlName="vehicleMake"]', 'Toyota');
    await page.fill('input[formControlName="vehicleModel"]', 'Camry');
    await page.fill('input[formControlName="year"]', '2023');
    await page.selectOption('select[formControlName="coverageType"]', 'comprehensive');
    await page.fill('input[formControlName="coverageAmount"]', '3000000');
    
    // Wait for premium calculation
    await page.waitForTimeout(1000);
    
    // Submit the form
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Navigate back to dashboard
    await page.click('text=Dashboard');
    await page.waitForTimeout(2000);
    
    // Check that policy count has increased
    const newCount = await page.locator('.stat-card .stat-number').first().textContent();
    const newNumber = parseInt(newCount || '0');
    
    // Should have one more policy (though it might be PENDING status)
    const pendingCount = await page.locator('.stat-card .stat-number').nth(1).textContent();
    const totalPolicies = newNumber + parseInt(pendingCount || '0');
    const previousTotal = initialNumber;
    
    expect(totalPolicies).toBeGreaterThanOrEqual(previousTotal + 1);
  });

  test('Profile section displays user information correctly', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Click on user profile menu
    const userMenuButton = page.locator('button.user-menu-btn');
    await userMenuButton.click();
    await page.waitForTimeout(500);
    
    // Check user display name is not null
    const userNameElement = page.locator('.user-info .user-name');
    const userName = await userNameElement.textContent();
    
    expect(userName).toBeTruthy();
    expect(userName).not.toBe('null null');
    expect(userName).not.toBe('');
    expect(userName?.trim().length).toBeGreaterThan(0);
    
    // Check user role is not undefined
    const userRoleElement = page.locator('.user-info .user-role');
    const userRole = await userRoleElement.textContent();
    
    expect(userRole).toBeTruthy();
    expect(userRole).not.toContain('undefined');
    expect(userRole).not.toBe('');
    expect(userRole?.trim().length).toBeGreaterThan(0);
    
    // Check user email exists
    const userEmailElement = page.locator('.user-info .user-email');
    const userEmail = await userEmailElement.textContent();
    
    expect(userEmail).toBeTruthy();
    expect(userEmail).toContain('@');
  });

  test('User profile menu shows all expected options', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Click on user profile menu
    const userMenuButton = page.locator('button.user-menu-btn');
    await userMenuButton.click();
    await page.waitForTimeout(500);
    
    // Check profile menu item exists and is clickable
    const profileMenuItem = page.locator('button[mat-menu-item]:has-text("Profile")');
    await expect(profileMenuItem).toBeVisible();
    
    // Check settings menu item exists
    const settingsMenuItem = page.locator('button[mat-menu-item]:has-text("Settings")');
    await expect(settingsMenuItem).toBeVisible();
    
    // Check logout menu item exists
    const logoutMenuItem = page.locator('button[mat-menu-item]:has-text("Logout")');
    await expect(logoutMenuItem).toBeVisible();
    
    // Close menu by clicking elsewhere
    await page.click('body', { position: { x: 100, y: 100 } });
  });

  test('Dashboard welcome message shows user name', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Check welcome message includes user name
    const welcomeTitle = page.locator('.welcome-title');
    const welcomeText = await welcomeTitle.textContent();
    
    expect(welcomeText).toBeTruthy();
    expect(welcomeText).not.toContain('null');
    expect(welcomeText).not.toContain('undefined');
    
    // Should contain some form of greeting
    const hasGreeting = welcomeText?.includes('Welcome') || 
                       welcomeText?.includes('สวัสดี') || 
                       welcomeText?.includes('ยินดีต้อนรับ');
    expect(hasGreeting).toBeTruthy();
  });

  test('Policy statistics reflect actual data', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Get all stat numbers from dashboard
    const statNumbers = await page.locator('.stat-number').allTextContents();
    
    expect(statNumbers).toHaveLength(3);
    
    // Each stat should be a valid number (not hardcoded text)
    for (const stat of statNumbers) {
      const number = parseInt(stat);
      expect(number).not.toBeNaN();
      expect(number).toBeGreaterThanOrEqual(0);
    }
    
    // Navigate to policies to verify the data
    await page.click('text=Policy Management');
    await page.waitForTimeout(2000);
    
    // Count policies by status
    const activeCount = await page.locator('mat-chip.status-active').count();
    const pendingCount = await page.locator('mat-chip.status-pending').count();
    
    // Go back to dashboard
    await page.click('text=Dashboard');
    await page.waitForTimeout(2000);
    
    // Verify dashboard numbers match policy page
    const dashboardActive = parseInt(await page.locator('.stat-number').first().textContent() || '0');
    const dashboardPending = parseInt(await page.locator('.stat-number').nth(1).textContent() || '0');
    
    expect(dashboardActive).toBe(activeCount);
    expect(dashboardPending).toBe(pendingCount);
  });

  test('Dashboard quick actions work correctly', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Test New Policy button
    const newPolicyBtn = page.locator('button:has-text("New Policy")');
    await expect(newPolicyBtn).toBeVisible();
    await newPolicyBtn.click();
    await page.waitForTimeout(1000);
    
    // Should navigate to policy creation page
    expect(page.url()).toContain('/policies/new');
    
    // Go back to dashboard
    await page.goBack();
    await page.waitForTimeout(1000);
    
    // Test Profile button
    const profileBtn = page.locator('button:has-text("Profile")');
    await expect(profileBtn).toBeVisible();
    await profileBtn.click();
    await page.waitForTimeout(1000);
    
    // Should navigate to profile page
    expect(page.url()).toContain('/profile');
  });

  test('Language switching affects user interface', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Click language toggle
    const languageBtn = page.locator('button mat-icon:has-text("translate")');
    await languageBtn.click();
    await page.waitForTimeout(1000);
    
    // Check if language indicator changed
    const languageIndicator = page.locator('.language-indicator');
    const currentLang = await languageIndicator.textContent();
    
    expect(currentLang).toBeTruthy();
    expect(['TH', 'EN']).toContain(currentLang?.toUpperCase());
    
    // Toggle again
    await languageBtn.click();
    await page.waitForTimeout(1000);
    
    // Language should have changed
    const newLang = await languageIndicator.textContent();
    expect(newLang).not.toBe(currentLang);
  });

  test('Navigation menu reflects user permissions', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Check main navigation items are visible
    const expectedNavItems = ['Dashboard', 'Policy Management', 'Claims Management', 'Profile'];
    
    for (const item of expectedNavItems) {
      const navItem = page.locator(`text=${item}`);
      await expect(navItem).toBeVisible();
    }
    
    // Admin section should be visible for admin users or hidden for regular users
    const adminSection = page.locator('text=Admin');
    const adminExists = await adminSection.count() > 0;
    
    // Based on mock user role, admin should be hidden
    expect(adminExists).toBeFalsy();
  });

});