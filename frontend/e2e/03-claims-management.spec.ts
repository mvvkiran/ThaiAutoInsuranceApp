import { test, expect } from '@playwright/test';
import { TestHelpers } from './test-helpers';

/**
 * EPIC 3: Claims Management
 * Comprehensive test suite for insurance claims processing functionality
 */

test.describe('Claims Management', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.login();
    await helpers.navigateToSection('claims');
  });

  test('US-022: View claims list with all existing claims', async ({ page }) => {
    // Verify claims list page loads
    await expect(page.locator('h1')).toContainText('Claims Management');
    
    // Verify claims table exists and has data
    const claimsTable = page.locator('.claims-table');
    await expect(claimsTable).toBeVisible();
    
    // Check for expected columns
    const expectedColumns = ['Claim Number', 'Policy & Vehicle', 'Incident', 'Damage Amount', 'Priority', 'Status', 'Submitted', 'Actions'];
    for (const column of expectedColumns) {
      await expect(page.locator(`th:has-text("${column}")`)).toBeVisible();
    }
    
    // Verify at least one claim row exists
    const claimRows = page.locator('mat-row');
    await expect(claimRows).toHaveCountGreaterThan(0);
    
    // Verify statistics are displayed
    await expect(page.locator('.stat-item')).toHaveCountGreaterThan(0);
    await expect(page.locator('text="Submitted"')).toBeVisible();
    await expect(page.locator('text="Under Review"')).toBeVisible();
    await expect(page.locator('text="Approved"')).toBeVisible();
    await expect(page.locator('text="Total Claims"')).toBeVisible();
  });

  test('US-023: Search and filter claims', async ({ page }) => {
    // Test search functionality
    const searchInput = page.locator('[data-testid="claims-search"]');
    await expect(searchInput).toBeVisible();
    
    // Search by claim number
    await helpers.fillField('[data-testid="claims-search"]', 'CLM-2024-001');
    await page.keyboard.press('Enter');
    
    // Verify filtered results
    const claimRows = page.locator('mat-row');
    const firstRow = claimRows.first();
    await expect(firstRow).toContainText('CLM-2024-001');
    
    // Clear search and verify all claims return
    await page.fill('[data-testid="claims-search"]', '');
    await page.keyboard.press('Enter');
    await expect(claimRows).toHaveCountGreaterThan(1);
    
    // Search by policy number
    await helpers.fillField('[data-testid="claims-search"]', 'POL-2024-001');
    await page.keyboard.press('Enter');
    await expect(page.locator('mat-row')).toContainText('POL-2024-001');
    
    // Search by vehicle plate
    await helpers.fillField('[data-testid="claims-search"]', 'กก-1234');
    await page.keyboard.press('Enter');
    await expect(page.locator('mat-row')).toContainText('กก-1234');
    
    // Search by claimant name
    await helpers.fillField('[data-testid="claims-search"]', 'สมชาย');
    await page.keyboard.press('Enter');
    await expect(page.locator('mat-row')).toContainText('สมชาย');
    
    // Test no results scenario
    await helpers.fillField('[data-testid="claims-search"]', 'NONEXISTENT');
    await page.keyboard.press('Enter');
    await expect(page.locator('.empty-state')).toBeVisible();
    await expect(page.locator('text="No claims match your search criteria"')).toBeVisible();
  });

  test('US-024: Create new insurance claim', async ({ page }) => {
    // Click New Claim button
    await page.click('[data-testid="new-claim-button"]');
    await page.waitForURL('/claims/new');
    
    // Verify new claim form
    await expect(page.locator('h1')).toContainText('Submit New Claim');
    
    const testData = helpers.generateThaiTestData();
    
    // Fill policy information
    await helpers.selectMatOption('[data-testid="policy-number"]', 'POL-2024-001');
    
    // Fill incident information
    await helpers.selectMatOption('[data-testid="incident-type"]', testData.claim.incidentType);
    
    // Set incident date
    await page.click('[data-testid="incident-date"]');
    const today = new Date();
    const todayStr = today.getDate().toString();
    await page.click(`[data-testid="calendar-day-${todayStr}"]`);
    
    await helpers.fillField('[data-testid="incident-location"]', testData.claim.location);
    await helpers.fillField('[data-testid="incident-description"]', testData.claim.description);
    
    // Fill damage information
    await helpers.fillField('[data-testid="damage-amount"]', testData.claim.damageAmount.toString());
    
    // Upload incident photos if available
    const photoUpload = page.locator('[data-testid="incident-photos"]');
    if (await photoUpload.isVisible()) {
      // Would need actual test image file
      // await photoUpload.setInputFiles('path/to/test-image.jpg');
    }
    
    // Set priority
    await helpers.selectMatOption('[data-testid="claim-priority"]', 'MEDIUM');
    
    // Submit the form
    await page.click('[data-testid="submit-claim-button"]');
    
    // Verify loading state
    await expect(page.locator('mat-spinner')).toBeVisible();
    await expect(page.locator('button:has-text("Submitting...")')).toBeVisible();
    
    // Verify success message
    await helpers.verifyToastMessage('Claim submitted successfully');
    
    // Verify redirect back to claims list
    await page.waitForURL('/claims');
    
    // Verify new claim appears in list
    await expect(page.locator('.claims-table')).toContainText(testData.claim.incidentType);
    await expect(page.locator('.claims-table')).toContainText(testData.claim.location);
    await expect(page.locator('.claims-table')).toContainText('SUBMITTED');
  });

  test('US-025: Form validation for new claim creation', async ({ page }) => {
    await page.click('[data-testid="new-claim-button"]');
    await page.waitForURL('/claims/new');
    
    // Test empty form submission
    await page.click('[data-testid="submit-claim-button"]');
    
    // Verify validation errors appear
    await expect(page.locator('mat-error:has-text("Policy number is required")')).toBeVisible();
    await expect(page.locator('mat-error:has-text("Incident type is required")')).toBeVisible();
    await expect(page.locator('mat-error:has-text("Incident date is required")')).toBeVisible();
    await expect(page.locator('mat-error:has-text("Location is required")')).toBeVisible();
    await expect(page.locator('mat-error:has-text("Description is required")')).toBeVisible();
    await expect(page.locator('mat-error:has-text("Damage amount is required")')).toBeVisible();
    
    // Test individual field validations
    // Damage amount validation
    await helpers.fillField('[data-testid="damage-amount"]', '-100');
    await page.blur('[data-testid="damage-amount"]');
    await expect(page.locator('mat-error:has-text("Damage amount must be positive")')).toBeVisible();
    
    await helpers.fillField('[data-testid="damage-amount"]', '10000000');
    await page.blur('[data-testid="damage-amount"]');
    await expect(page.locator('mat-error:has-text("Damage amount exceeds maximum limit")')).toBeVisible();
    
    // Description validation
    await helpers.fillField('[data-testid="incident-description"]', 'AB');
    await page.blur('[data-testid="incident-description"]');
    await expect(page.locator('mat-error:has-text("Description must be at least 10 characters")')).toBeVisible();
    
    // Incident date validation (future date)
    await page.click('[data-testid="incident-date"]');
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    await page.click(`[data-testid="calendar-day-15"]`);
    await expect(page.locator('mat-error:has-text("Incident date cannot be in the future")')).toBeVisible();
    
    // Verify form cannot be submitted with errors
    const submitButton = page.locator('[data-testid="submit-claim-button"]');
    await expect(submitButton).toBeDisabled();
  });

  test('US-026: View claim details', async ({ page }) => {
    // Find first claim in the list
    const firstClaimRow = page.locator('mat-row').first();
    await expect(firstClaimRow).toBeVisible();
    
    // Click on the actions menu
    await firstClaimRow.locator('[data-testid="claim-actions-menu"]').click();
    
    // Click view details
    await page.click('[data-testid="view-claim-details"]');
    
    // Should open claim details modal or navigate to details page
    const detailsModal = page.locator('[data-testid="claim-details-modal"]');
    const detailsPage = page.locator('h1:has-text("Claim Details")');
    
    const isModal = await detailsModal.isVisible();
    const isPage = await detailsPage.isVisible();
    
    expect(isModal || isPage).toBeTruthy();
    
    if (isModal) {
      // Verify modal contains claim information
      await expect(detailsModal).toContainText('Claim Number');
      await expect(detailsModal).toContainText('Policy Information');
      await expect(detailsModal).toContainText('Incident Details');
      await expect(detailsModal).toContainText('Damage Assessment');
      await expect(detailsModal).toContainText('Status');
      await expect(detailsModal).toContainText('Timeline');
    }
  });

  test('US-027: Edit claim information (for submitted claims)', async ({ page }) => {
    // Find a submitted claim
    const submittedClaimRow = page.locator('mat-row:has(.status-submitted)').first();
    
    if (await submittedClaimRow.isVisible()) {
      // Click actions menu
      await submittedClaimRow.locator('[data-testid="claim-actions-menu"]').click();
      
      // Click edit claim
      await page.click('[data-testid="edit-claim"]');
      
      // Should navigate to edit form or open edit modal
      const editModal = page.locator('[data-testid="edit-claim-modal"]');
      const editPage = page.locator('h1:has-text("Edit Claim")');
      
      const isModal = await editModal.isVisible();
      const isPage = await editPage.isVisible();
      
      expect(isModal || isPage).toBeTruthy();
      
      // Test editing description
      const newDescription = 'Updated incident description with more details';
      await helpers.fillField('[data-testid="incident-description"]', newDescription);
      
      if (isModal) {
        await page.click('[data-testid="save-claim-button"]');
      } else {
        await page.click('[data-testid="update-claim-button"]');
      }
      
      // Verify success message
      await helpers.verifyToastMessage('Claim updated successfully');
      
      // Verify updated information appears in list or details
      await expect(page.locator('.claims-table')).toContainText(newDescription);
    }
  });

  test('US-028: Process claim approval workflow', async ({ page }) => {
    // Find a claim under review
    const reviewClaimRow = page.locator('mat-row:has(.status-under-review)').first();
    await expect(reviewClaimRow).toBeVisible();
    
    // Click actions menu
    await reviewClaimRow.locator('[data-testid="claim-actions-menu"]').click();
    
    // Click approve claim
    await page.click('[data-testid="approve-claim"]');
    
    // Should show approval confirmation
    const approvalModal = page.locator('[data-testid="approval-confirmation-modal"]');
    await expect(approvalModal).toBeVisible();
    
    // May include additional fields for approval
    await expect(approvalModal).toContainText('Approve Claim');
    await expect(approvalModal).toContainText('Approved Amount');
    
    // Enter approved amount (could be different from claimed amount)
    const approvedAmountField = page.locator('[data-testid="approved-amount"]');
    if (await approvedAmountField.isVisible()) {
      await helpers.fillField('[data-testid="approved-amount"]', '20000');
    }
    
    // Add approval comments
    const commentsField = page.locator('[data-testid="approval-comments"]');
    if (await commentsField.isVisible()) {
      await helpers.fillField('[data-testid="approval-comments"]', 'Claim approved after review of documentation and assessment');
    }
    
    // Confirm approval
    await page.click('[data-testid="confirm-approval-button"]');
    
    // Verify success message
    await helpers.verifyToastMessage('Claim approved successfully');
    
    // Verify claim status changed to APPROVED
    await expect(page.locator('.status-approved')).toHaveCountGreaterThan(0);
  });

  test('US-029: Process claim rejection workflow', async ({ page }) => {
    // Find a claim under review
    const reviewClaimRow = page.locator('mat-row:has(.status-under-review)').first();
    
    if (await reviewClaimRow.isVisible()) {
      // Click actions menu
      await reviewClaimRow.locator('[data-testid="claim-actions-menu"]').click();
      
      // Click reject claim
      await page.click('[data-testid="reject-claim"]');
      
      // Should show rejection confirmation
      const rejectionModal = page.locator('[data-testid="rejection-confirmation-modal"]');
      await expect(rejectionModal).toBeVisible();
      
      await expect(rejectionModal).toContainText('Reject Claim');
      await expect(rejectionModal).toContainText('Reason for rejection');
      
      // Select rejection reason
      await helpers.selectMatOption('[data-testid="rejection-reason"]', 'Insufficient documentation');
      
      // Add rejection comments
      await helpers.fillField('[data-testid="rejection-comments"]', 'Missing required documents and evidence for the incident');
      
      // Confirm rejection
      await page.click('[data-testid="confirm-rejection-button"]');
      
      // Verify success message
      await helpers.verifyToastMessage('Claim rejected');
      
      // Verify claim status changed to REJECTED
      await expect(page.locator('.status-rejected')).toHaveCountGreaterThan(0);
    }
  });

  test('US-030: Claim priority management', async ({ page }) => {
    // Verify different priority levels are displayed
    const priorities = ['HIGH', 'MEDIUM', 'LOW'];
    
    for (const priority of priorities) {
      const priorityChips = page.locator(`.priority-${priority.toLowerCase()}`);
      if (await priorityChips.count() > 0) {
        await expect(priorityChips.first()).toContainText(priority);
        
        // Verify color coding
        const color = await priorityChips.first().evaluate(el => 
          window.getComputedStyle(el).backgroundColor
        );
        expect(color).toBeDefined();
      }
    }
    
    // Test sorting by priority
    const prioritySortButton = page.locator('[data-testid="sort-by-priority"]');
    if (await prioritySortButton.isVisible()) {
      await prioritySortButton.click();
      
      // Verify high priority claims appear first
      const firstRow = page.locator('mat-row').first();
      await expect(firstRow).toContainText('HIGH');
    }
  });

  test('US-031: Claim status workflow progression', async ({ page }) => {
    // Verify all claim statuses are represented
    const statuses = ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PAID'];
    
    for (const status of statuses) {
      const statusChips = page.locator(`.status-${status.toLowerCase().replace('_', '-')}`);
      if (await statusChips.count() > 0) {
        await expect(statusChips.first()).toBeVisible();
        
        // Verify proper color coding
        const statusChip = statusChips.first();
        const classList = await statusChip.getAttribute('class');
        expect(classList).toContain(`status-${status.toLowerCase().replace('_', '-')}`);
      }
    }
    
    // Test status-based filtering if available
    const statusFilter = page.locator('[data-testid="status-filter"]');
    if (await statusFilter.isVisible()) {
      await helpers.selectMatOption('[data-testid="status-filter"]', 'SUBMITTED');
      
      // All visible claims should have SUBMITTED status
      const visibleRows = page.locator('mat-row');
      const count = await visibleRows.count();
      
      for (let i = 0; i < count; i++) {
        await expect(visibleRows.nth(i)).toContainText('SUBMITTED');
      }
    }
  });

  test('US-032: Claims statistics and reporting', async ({ page }) => {
    // Verify statistics section
    const statsSection = page.locator('.stats-row');
    await expect(statsSection).toBeVisible();
    
    // Check for individual stats
    const submittedCount = page.locator('.stat-item:has-text("Submitted") .stat-number');
    const reviewCount = page.locator('.stat-item:has-text("Under Review") .stat-number');
    const approvedCount = page.locator('.stat-item:has-text("Approved") .stat-number');
    const totalAmount = page.locator('.stat-item:has-text("Total Claims") .stat-number');
    
    // Verify numbers are displayed and reasonable
    const submitted = await submittedCount.textContent();
    const review = await reviewCount.textContent();
    const approved = await approvedCount.textContent();
    const total = await totalAmount.textContent();
    
    expect(parseInt(submitted || '0')).toBeGreaterThanOrEqual(0);
    expect(parseInt(review || '0')).toBeGreaterThanOrEqual(0);
    expect(parseInt(approved || '0')).toBeGreaterThanOrEqual(0);
    expect(total).toMatch(/฿[\d,]+/); // Thai Baht currency format
    
    // Test if statistics update when claims are processed
    const initialSubmittedCount = parseInt(submitted || '0');
    const initialReviewCount = parseInt(review || '0');
    
    // If there's a submitted claim, move it to review
    const submittedClaim = page.locator('mat-row:has(.status-submitted)').first();
    if (await submittedClaim.isVisible()) {
      await submittedClaim.locator('[data-testid="claim-actions-menu"]').click();
      await page.click('[data-testid="move-to-review"]');
      
      // Verify statistics updated
      await expect(submittedCount).not.toContainText(initialSubmittedCount.toString());
      await expect(reviewCount).not.toContainText(initialReviewCount.toString());
    }
  });

  test('US-033: Document upload and management', async ({ page }) => {
    // Navigate to claim details that supports documents
    const firstClaimRow = page.locator('mat-row').first();
    await firstClaimRow.locator('[data-testid="claim-actions-menu"]').click();
    await page.click('[data-testid="view-claim-details"]');
    
    // Look for document management section
    const documentsSection = page.locator('[data-testid="claim-documents"]');
    
    if (await documentsSection.isVisible()) {
      // Test document upload
      const uploadButton = page.locator('[data-testid="upload-document"]');
      await expect(uploadButton).toBeVisible();
      
      // Test document types
      await uploadButton.click();
      const documentTypeSelect = page.locator('[data-testid="document-type"]');
      
      if (await documentTypeSelect.isVisible()) {
        const expectedDocTypes = ['Police Report', 'Photos', 'Repair Estimate', 'Medical Report'];
        
        await documentTypeSelect.click();
        for (const docType of expectedDocTypes) {
          await expect(page.locator(`mat-option:has-text("${docType}")`)).toBeVisible();
        }
      }
    }
  });

  test('US-034: Export claims data', async ({ page }) => {
    // Look for export functionality
    const exportButton = page.locator('[data-testid="export-claims"]');
    
    if (await exportButton.isVisible()) {
      // Test export functionality
      const downloadPromise = page.waitForEvent('download');
      await exportButton.click();
      const download = await downloadPromise;
      
      // Verify download occurred
      expect(download.suggestedFilename()).toMatch(/claims.*\.(csv|xlsx|pdf)$/);
    }
    
    // Test export with filters
    const exportFilteredButton = page.locator('[data-testid="export-filtered-claims"]');
    if (await exportFilteredButton.isVisible()) {
      // First apply a filter
      await helpers.fillField('[data-testid="claims-search"]', 'SUBMITTED');
      await page.keyboard.press('Enter');
      
      // Then export filtered results
      const downloadPromise = page.waitForEvent('download');
      await exportFilteredButton.click();
      const download = await downloadPromise;
      
      expect(download.suggestedFilename()).toMatch(/claims-filtered.*\.(csv|xlsx|pdf)$/);
    }
  });
});