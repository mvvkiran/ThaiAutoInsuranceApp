import { test, expect } from '@playwright/test';
import { TestHelpers } from './test-helpers';

/**
 * EPIC 2: Policy Management
 * Comprehensive test suite for insurance policy management functionality
 */

test.describe('Policy Management', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.login();
    await helpers.navigateToSection('policies');
  });

  test('US-011: View policy list with all existing policies', async ({ page }) => {
    // Verify policy list page loads
    await expect(page.locator('h1')).toContainText('Policy Management');
    
    // Verify policy table exists and has data
    const policyTable = page.locator('.policies-table');
    await expect(policyTable).toBeVisible();
    
    // Check for expected columns
    const expectedColumns = ['Policy Number', 'Vehicle', 'Coverage', 'Premium', 'Status', 'Policy Period', 'Actions'];
    for (const column of expectedColumns) {
      await expect(page.locator(`th:has-text("${column}")`)).toBeVisible();
    }
    
    // Verify at least one policy row exists
    const policyRows = page.locator('mat-row');
    await expect(policyRows).toHaveCountGreaterThan(0);
    
    // Verify statistics are displayed
    await expect(page.locator('.stat-item')).toHaveCountGreaterThan(0);
    await expect(page.locator('text="Active Policies"')).toBeVisible();
    await expect(page.locator('text="Pending"')).toBeVisible();
    await expect(page.locator('text="Total Premium"')).toBeVisible();
  });

  test('US-012: Search and filter policies', async ({ page }) => {
    // Test search functionality
    const searchInput = page.locator('[data-testid="policy-search"]');
    await expect(searchInput).toBeVisible();
    
    // Search by policy number
    await helpers.fillField('[data-testid="policy-search"]', 'POL-2024-001');
    await page.keyboard.press('Enter');
    
    // Verify filtered results
    const policyRows = page.locator('mat-row');
    const firstRow = policyRows.first();
    await expect(firstRow).toContainText('POL-2024-001');
    
    // Clear search and verify all policies return
    await page.fill('[data-testid="policy-search"]', '');
    await page.keyboard.press('Enter');
    await expect(policyRows).toHaveCountGreaterThan(1);
    
    // Search by license plate
    await helpers.fillField('[data-testid="policy-search"]', 'กก-1234');
    await page.keyboard.press('Enter');
    await expect(page.locator('mat-row')).toContainText('กก-1234');
    
    // Search by vehicle make
    await helpers.fillField('[data-testid="policy-search"]', 'Toyota');
    await page.keyboard.press('Enter');
    await expect(page.locator('mat-row')).toContainText('Toyota');
    
    // Test no results scenario
    await helpers.fillField('[data-testid="policy-search"]', 'NONEXISTENT');
    await page.keyboard.press('Enter');
    await expect(page.locator('.empty-state')).toBeVisible();
    await expect(page.locator('text="No policies match your search criteria"')).toBeVisible();
  });

  test('US-013: Create new insurance policy', async ({ page }) => {
    // Click New Policy button
    await page.click('[data-testid="new-policy-button"]');
    await page.waitForURL('/policies/new');
    
    // Verify new policy form
    await expect(page.locator('h1')).toContainText('New Insurance Policy');
    
    const testData = helpers.generateThaiTestData();
    
    // Fill vehicle information
    await helpers.fillField('[data-testid="license-plate"]', testData.policy.licensePlate);
    await helpers.selectMatOption('[data-testid="vehicle-make"]', testData.policy.vehicleMake);
    await helpers.fillField('[data-testid="vehicle-model"]', testData.policy.vehicleModel);
    await helpers.selectMatOption('[data-testid="vehicle-year"]', testData.policy.year.toString());
    
    // Fill coverage information
    await helpers.selectMatOption('[data-testid="coverage-type"]', testData.policy.coverageType);
    await helpers.selectMatOption('[data-testid="coverage-amount"]', testData.policy.coverageAmount.toLocaleString());
    
    // Verify premium calculation appears
    await expect(page.locator('.premium-section')).toBeVisible();
    await expect(page.locator('text="Premium Calculation"')).toBeVisible();
    await expect(page.locator('text="Base Premium"')).toBeVisible();
    await expect(page.locator('text="Coverage Premium"')).toBeVisible();
    await expect(page.locator('text="Total Annual Premium"')).toBeVisible();
    
    // Verify premium amount is calculated and displayed
    const premiumAmount = page.locator('.premium-row.total strong').last();
    const premiumText = await premiumAmount.textContent();
    expect(premiumText).toMatch(/฿[\d,]+/);
    
    // Submit the form
    await page.click('[data-testid="create-policy-button"]');
    
    // Verify loading state
    await expect(page.locator('mat-spinner')).toBeVisible();
    await expect(page.locator('button:has-text("Creating...")')).toBeVisible();
    
    // Verify success message
    await helpers.verifyToastMessage('Policy');
    await helpers.verifyToastMessage('created successfully');
    
    // Verify redirect back to policy list
    await page.waitForURL('/policies');
    
    // Verify new policy appears in list
    await expect(page.locator('.policies-table')).toContainText(testData.policy.licensePlate);
    await expect(page.locator('.policies-table')).toContainText(testData.policy.vehicleMake);
    await expect(page.locator('.policies-table')).toContainText('PENDING');
  });

  test('US-014: Form validation for new policy creation', async ({ page }) => {
    await page.click('[data-testid="new-policy-button"]');
    await page.waitForURL('/policies/new');
    
    // Test empty form submission
    await page.click('[data-testid="create-policy-button"]');
    
    // Verify validation errors appear
    await expect(page.locator('mat-error:has-text("License plate is required")')).toBeVisible();
    await expect(page.locator('mat-error:has-text("Vehicle make is required")')).toBeVisible();
    await expect(page.locator('mat-error:has-text("Vehicle model is required")')).toBeVisible();
    await expect(page.locator('mat-error:has-text("Year is required")')).toBeVisible();
    await expect(page.locator('mat-error:has-text("Coverage type is required")')).toBeVisible();
    await expect(page.locator('mat-error:has-text("Coverage amount is required")')).toBeVisible();
    
    // Test individual field validations
    // License plate format validation
    await helpers.fillField('[data-testid="license-plate"]', 'INVALID');
    await page.blur('[data-testid="license-plate"]');
    await expect(page.locator('mat-error:has-text("Invalid license plate format")')).toBeVisible();
    
    // Vehicle model validation
    await helpers.fillField('[data-testid="vehicle-model"]', 'AB');
    await page.blur('[data-testid="vehicle-model"]');
    await expect(page.locator('mat-error:has-text("Vehicle model must be at least 2 characters")')).toBeVisible();
    
    // Verify form cannot be submitted with errors
    const submitButton = page.locator('[data-testid="create-policy-button"]');
    await expect(submitButton).toBeDisabled();
  });

  test('US-015: View policy details', async ({ page }) => {
    // Find first policy in the list
    const firstPolicyRow = page.locator('mat-row').first();
    await expect(firstPolicyRow).toBeVisible();
    
    // Click on the actions menu
    await firstPolicyRow.locator('[data-testid="policy-actions-menu"]').click();
    
    // Click view details
    await page.click('[data-testid="view-policy-details"]');
    
    // Should open policy details modal or navigate to details page
    const detailsModal = page.locator('[data-testid="policy-details-modal"]');
    const detailsPage = page.locator('h1:has-text("Policy Details")');
    
    const isModal = await detailsModal.isVisible();
    const isPage = await detailsPage.isVisible();
    
    expect(isModal || isPage).toBeTruthy();
    
    if (isModal) {
      // Verify modal contains policy information
      await expect(detailsModal).toContainText('Policy Number');
      await expect(detailsModal).toContainText('License Plate');
      await expect(detailsModal).toContainText('Vehicle Information');
      await expect(detailsModal).toContainText('Coverage Details');
      await expect(detailsModal).toContainText('Premium');
    }
  });

  test('US-016: Edit policy information', async ({ page }) => {
    // Find an active policy
    const activePolicyRow = page.locator('mat-row:has(.status-active)').first();
    await expect(activePolicyRow).toBeVisible();
    
    // Click actions menu
    await activePolicyRow.locator('[data-testid="policy-actions-menu"]').click();
    
    // Click edit policy
    await page.click('[data-testid="edit-policy"]');
    
    // Should navigate to edit form or open edit modal
    const editModal = page.locator('[data-testid="edit-policy-modal"]');
    const editPage = page.locator('h1:has-text("Edit Policy")');
    
    const isModal = await editModal.isVisible();
    const isPage = await editPage.isVisible();
    
    expect(isModal || isPage).toBeTruthy();
    
    // Test editing coverage amount
    if (isModal) {
      await helpers.selectMatOption('[data-testid="coverage-amount"]', '5,000,000');
      await page.click('[data-testid="save-policy-button"]');
    } else {
      await helpers.selectMatOption('[data-testid="coverage-amount"]', '5,000,000');
      await page.click('[data-testid="update-policy-button"]');
    }
    
    // Verify success message
    await helpers.verifyToastMessage('Policy updated successfully');
    
    // Verify updated information appears in list
    await expect(page.locator('.policies-table')).toContainText('5,000,000');
  });

  test('US-017: Renew policy', async ({ page }) => {
    // Find a policy that can be renewed
    const renewablePolicyRow = page.locator('mat-row:has(.status-active)').first();
    await expect(renewablePolicyRow).toBeVisible();
    
    // Click actions menu
    await renewablePolicyRow.locator('[data-testid="policy-actions-menu"]').click();
    
    // Click renew policy
    await page.click('[data-testid="renew-policy"]');
    
    // Should show renewal confirmation
    const renewalModal = page.locator('[data-testid="renewal-confirmation-modal"]');
    await expect(renewalModal).toBeVisible();
    
    // Verify renewal details
    await expect(renewalModal).toContainText('Renew Policy');
    await expect(renewalModal).toContainText('New policy period');
    await expect(renewalModal).toContainText('Premium amount');
    
    // Confirm renewal
    await page.click('[data-testid="confirm-renewal-button"]');
    
    // Verify success message
    await helpers.verifyToastMessage('Policy renewed successfully');
    
    // Verify new end date in the policy list
    const updatedRow = page.locator('mat-row').first();
    const nextYear = new Date().getFullYear() + 2;
    await expect(updatedRow).toContainText(nextYear.toString());
  });

  test('US-018: Cancel policy', async ({ page }) => {
    // Find an active policy
    const activePolicyRow = page.locator('mat-row:has(.status-active)').first();
    await expect(activePolicyRow).toBeVisible();
    
    // Click actions menu
    await activePolicyRow.locator('[data-testid="policy-actions-menu"]').click();
    
    // Click cancel policy
    await page.click('[data-testid="cancel-policy"]');
    
    // Should show cancellation confirmation
    const cancelModal = page.locator('[data-testid="cancel-confirmation-modal"]');
    await expect(cancelModal).toBeVisible();
    
    await expect(cancelModal).toContainText('Cancel Policy');
    await expect(cancelModal).toContainText('Are you sure you want to cancel this policy?');
    
    // Confirm cancellation
    await page.click('[data-testid="confirm-cancel-button"]');
    
    // Verify success message
    await helpers.verifyToastMessage('Policy cancelled successfully');
    
    // Verify policy status changed to CANCELLED
    await expect(page.locator('.status-cancelled')).toHaveCountGreaterThan(0);
  });

  test('US-019: Policy expiration notifications', async ({ page }) => {
    // Check if there are expiring policies
    const expiringPoliciesCount = page.locator('.stat-item:has-text("Expiring Soon") .stat-number');
    const count = await expiringPoliciesCount.textContent();
    
    if (parseInt(count || '0') > 0) {
      // Should show notification or highlight expiring policies
      const expiringPolicies = page.locator('mat-row:has(.status-expiring)');
      await expect(expiringPolicies).toHaveCountGreaterThan(0);
      
      // Check for visual indicators (badges, colors, icons)
      await expect(page.locator('.expiring-soon-indicator')).toHaveCountGreaterThan(0);
    }
  });

  test('US-020: Policy premium calculation accuracy', async ({ page }) => {
    await page.click('[data-testid="new-policy-button"]');
    await page.waitForURL('/policies/new');
    
    // Fill form with specific values to test calculation
    await helpers.fillField('[data-testid="license-plate"]', 'ทท-1234 กรุงเทพมหานคร');
    await helpers.selectMatOption('[data-testid="vehicle-make"]', 'Toyota');
    await helpers.fillField('[data-testid="vehicle-model"]', 'Camry');
    await helpers.selectMatOption('[data-testid="vehicle-year"]', '2022'); // New car (age <= 3)
    await helpers.selectMatOption('[data-testid="coverage-type"]', 'Comprehensive');
    await helpers.selectMatOption('[data-testid="coverage-amount"]', '3,000,000');
    
    // Wait for calculation
    await page.waitForTimeout(1000);
    
    // Verify premium calculation components
    const basePremium = page.locator('.premium-row:has-text("Base Premium") span').last();
    const coveragePremium = page.locator('.premium-row:has-text("Coverage Premium") span').last();
    const totalPremium = page.locator('.premium-row.total strong').last();
    
    const basePremiumText = await basePremium.textContent();
    const coveragePremiumText = await coveragePremium.textContent();
    const totalPremiumText = await totalPremium.textContent();
    
    // Extract numbers for verification
    const baseAmount = parseInt(basePremiumText?.replace(/[฿,]/g, '') || '0');
    const coverageAmount = parseInt(coveragePremiumText?.replace(/[฿,]/g, '') || '0');
    const totalAmount = parseInt(totalPremiumText?.replace(/[฿,]/g, '') || '0');
    
    // Verify calculations are reasonable
    expect(baseAmount).toBeGreaterThan(0);
    expect(coverageAmount).toBeGreaterThan(0);
    expect(totalAmount).toBe(baseAmount + coverageAmount);
    
    // For comprehensive coverage of 3M on a 2022 car, base should be 8000
    expect(baseAmount).toBe(8000);
    // Coverage premium should be 1.5% of 3,000,000 = 45,000
    expect(coverageAmount).toBe(45000);
    // Total should be 53,000
    expect(totalAmount).toBe(53000);
  });

  test('US-021: Export policy data', async ({ page }) => {
    // Look for export functionality
    const exportButton = page.locator('[data-testid="export-policies"]');
    
    if (await exportButton.isVisible()) {
      // Test export functionality
      const downloadPromise = page.waitForEvent('download');
      await exportButton.click();
      const download = await downloadPromise;
      
      // Verify download occurred
      expect(download.suggestedFilename()).toMatch(/policies.*\.(csv|xlsx|pdf)$/);
    }
  });
});