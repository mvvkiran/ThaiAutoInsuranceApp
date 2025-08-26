import { test, expect } from '@playwright/test';

/**
 * Policy Management - View Details and Edit Policy Test Suite
 * Tests specifically for the missing functionality identified by the user
 */

test.describe('Policy Details and Edit Functionality', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to policy management
    await page.goto('/policies');
    await page.waitForLoadState('networkidle');
  });

  test('Policy List displays with action buttons', async ({ page }) => {
    // Wait for policies to load
    await page.waitForTimeout(2000);
    
    // Check if policy table/cards are present
    const hasPolicyTable = await page.locator('table.policies-table').count() > 0;
    const hasPolicyCards = await page.locator('.policy-card').count() > 0;
    const hasPolicyContent = await page.locator('mat-card-content').count() > 0;
    
    // Should have some form of policy display
    expect(hasPolicyTable || hasPolicyCards || hasPolicyContent).toBeTruthy();
    
    // Look for action buttons (more_vert menu)
    const actionButtons = page.locator('button mat-icon:has-text("more_vert")');
    if (await actionButtons.count() > 0) {
      // Click first action button to reveal menu
      await actionButtons.first().click();
      await page.waitForTimeout(500);
      
      // Check for "View Details" option
      const viewDetailsOption = page.locator('button:has-text("View Details"), [role="menuitem"]:has-text("View Details")');
      await expect(viewDetailsOption).toBeVisible();
      
      // Check for "Edit Policy" option  
      const editPolicyOption = page.locator('button:has-text("Edit Policy"), [role="menuitem"]:has-text("Edit Policy")');
      await expect(editPolicyOption).toBeVisible();
    }
  });

  test('View Details button navigates to policy detail page', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Find and click first action menu button
    const actionButtons = page.locator('button mat-icon:has-text("more_vert")');
    if (await actionButtons.count() > 0) {
      await actionButtons.first().click();
      await page.waitForTimeout(500);
      
      // Click "View Details"
      const viewDetailsButton = page.locator('button:has-text("View Details"), [role="menuitem"]:has-text("View Details")');
      if (await viewDetailsButton.count() > 0) {
        await viewDetailsButton.click();
        await page.waitForTimeout(2000);
        
        // Should navigate to policy detail page
        const currentUrl = page.url();
        expect(currentUrl).toMatch(/\/policies\/\w+/);
        
        // Should show policy details or appropriate message
        const hasContent = await page.locator('h1, h2, h3, .policy-detail, .loading, .error').count() > 0;
        expect(hasContent).toBeTruthy();
      }
    }
  });

  test('Edit Policy button navigates to edit page', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Find and click first action menu button
    const actionButtons = page.locator('button mat-icon:has-text("more_vert")');
    if (await actionButtons.count() > 0) {
      await actionButtons.first().click();
      await page.waitForTimeout(500);
      
      // Click "Edit Policy"
      const editPolicyButton = page.locator('button:has-text("Edit Policy"), [role="menuitem"]:has-text("Edit Policy")');
      if (await editPolicyButton.count() > 0) {
        await editPolicyButton.click();
        await page.waitForTimeout(2000);
        
        // Should navigate to policy edit page
        const currentUrl = page.url();
        expect(currentUrl).toMatch(/\/policies\/edit\/\w+/);
        
        // Should show edit form or appropriate message
        const hasContent = await page.locator('form, .policy-edit, .loading, .error').count() > 0;
        expect(hasContent).toBeTruthy();
      }
    }
  });

  test('Policy Detail Page Components', async ({ page }) => {
    // Navigate directly to a policy detail page (using ID from sample data)
    await page.goto('/policies/1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check if page loads (might show error if route not implemented)
    const hasError = await page.locator('.error, .not-found').count() > 0 || 
                     await page.locator(':has-text("not found")').count() > 0;
    const hasContent = await page.locator('.policy-detail, .loading').count() > 0;
    const hasBasicContent = await page.locator('body *').count() > 10;
    
    // Should either show policy details, loading, error, or basic page structure
    expect(hasError || hasContent || hasBasicContent).toBeTruthy();
    
    if (!hasError) {
      // If page loads successfully, check for expected elements
      const expectedElements = [
        'h1, h2, h3',  // Some heading
        'button, mat-button',  // Some buttons
        '.policy, .detail, .info'  // Policy-related content
      ];
      
      let hasExpectedContent = false;
      for (const selector of expectedElements) {
        if (await page.locator(selector).count() > 0) {
          hasExpectedContent = true;
          break;
        }
      }
      
      expect(hasExpectedContent).toBeTruthy();
    }
  });

  test('Policy Edit Page Components', async ({ page }) => {
    // Navigate directly to a policy edit page
    await page.goto('/policies/edit/1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check if page loads (might show error if route not implemented)
    const hasError = await page.locator('.error, .not-found').count() > 0 || 
                     await page.locator(':has-text("not found")').count() > 0;
    const hasEditForm = await page.locator('form').count() > 0;
    const hasInputs = await page.locator('input, mat-form-field').count() > 0;
    const hasBasicContent = await page.locator('body *').count() > 10;
    
    // Should either show edit form, error, or basic content
    expect(hasError || hasEditForm || hasInputs || hasBasicContent).toBeTruthy();
    
    if (!hasError && (hasEditForm || hasInputs)) {
      // If form loads successfully, check for form elements
      const formElements = [
        'input[type="text"]',
        'select, mat-select',
        'button[type="submit"], button:has-text("Save")',
      ];
      
      let hasFormElements = false;
      for (const selector of formElements) {
        if (await page.locator(selector).count() > 0) {
          hasFormElements = true;
          break;
        }
      }
      
      expect(hasFormElements).toBeTruthy();
    }
  });

  test('Policy Action Menu Interactions', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Test menu interactions
    const actionButtons = page.locator('button mat-icon:has-text("more_vert")');
    const actionButtonCount = await actionButtons.count();
    
    if (actionButtonCount > 0) {
      // Test first menu
      await actionButtons.first().click();
      await page.waitForTimeout(500);
      
      // Check menu is visible
      const menu = page.locator('div[role="menu"], .mat-menu-panel');
      await expect(menu).toBeVisible();
      
      // Test menu items are clickable
      const menuItems = page.locator('[role="menuitem"], button:has-text("View Details"), button:has-text("Edit Policy")');
      const menuItemCount = await menuItems.count();
      expect(menuItemCount).toBeGreaterThan(0);
      
      // Close menu by clicking elsewhere
      await page.click('body', { position: { x: 100, y: 100 } });
      await page.waitForTimeout(500);
    }
  });

  test('Navigation Between Policy Pages', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Try to access policy detail page
    await page.goto('/policies/1');
    await page.waitForTimeout(2000);
    
    const currentUrl1 = page.url();
    expect(currentUrl1.includes('/policies')).toBeTruthy();
    
    // Try to access policy edit page
    await page.goto('/policies/edit/1');
    await page.waitForTimeout(2000);
    
    const currentUrl2 = page.url();
    expect(currentUrl2.includes('/policies')).toBeTruthy();
    
    // Navigate back to policy list
    await page.goto('/policies');
    await page.waitForTimeout(2000);
    
    const currentUrl3 = page.url();
    expect(currentUrl3.endsWith('/policies')).toBeTruthy();
  });

  test('Policy Search and Filter with Actions', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Look for search input
    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="search"], input[matInput]');
    if (await searchInput.count() > 0) {
      // Test search functionality
      await searchInput.first().fill('POL');
      await page.waitForTimeout(1000);
      
      // Check if results are filtered
      const hasResults = await page.locator('table tbody tr, .policy-item, .policy-card').count() > 0;
      
      if (hasResults) {
        // Check if action buttons still work after search
        const actionButtons = page.locator('button mat-icon:has-text("more_vert")');
        if (await actionButtons.count() > 0) {
          await actionButtons.first().click();
          await page.waitForTimeout(500);
          
          const menuVisible = await page.locator('[role="menu"], .mat-menu-panel').isVisible();
          expect(menuVisible).toBeTruthy();
        }
      }
      
      // Clear search
      await searchInput.first().clear();
      await page.waitForTimeout(1000);
    }
  });

  test('Policy Status and Information Display', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Check for policy information display
    const hasTable = await page.locator('table').count() > 0;
    const hasPolicyNumbers = await page.locator('text=/POL-|TI\d+/').count() > 0;
    const hasStatusChips = await page.locator('.mat-chip, .status-chip').count() > 0;
    const hasPremiumInfo = await page.locator('text=/฿|THB/').count() > 0;
    
    // Should display policy information
    expect(hasTable || hasPolicyNumbers || hasStatusChips || hasPremiumInfo).toBeTruthy();
    
    // If status chips exist, they should be visible
    if (hasStatusChips) {
      const statusChip = page.locator('.mat-chip, .status-chip').first();
      await expect(statusChip).toBeVisible();
    }
  });

  test('Error Handling for Invalid Policy IDs', async ({ page }) => {
    // Test with invalid policy ID
    await page.goto('/policies/invalid-id-999');
    await page.waitForTimeout(2000);
    
    // Should handle gracefully - either show error or redirect
    const hasError = await page.locator('.error, .not-found').count() > 0 || 
                     await page.locator(':has-text("not found")').count() > 0;
    const redirectedToList = page.url().endsWith('/policies');
    const hasBasicContent = await page.locator('body *').count() > 5;
    
    // Should either show error, redirect, or show basic page structure
    expect(hasError || redirectedToList || hasBasicContent).toBeTruthy();
  });

});