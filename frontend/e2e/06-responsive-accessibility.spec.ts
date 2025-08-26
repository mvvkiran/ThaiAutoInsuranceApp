import { test, expect } from '@playwright/test';
import { TestHelpers } from './test-helpers';

/**
 * EPIC 6: Responsive Design and Accessibility
 * Comprehensive test suite for responsive design and accessibility compliance
 */

test.describe('Responsive Design and Accessibility', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.login();
  });

  test('US-061: Mobile responsive navigation (320px - 768px)', async ({ page }) => {
    // Test mobile viewports
    const mobileViewports = [
      { width: 320, height: 568, name: 'iPhone SE' },
      { width: 375, height: 667, name: 'iPhone 8' },
      { width: 414, height: 896, name: 'iPhone 11' }
    ];

    for (const viewport of mobileViewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForLoadState('networkidle');
      
      // Navigation should be collapsed to hamburger menu
      const hamburgerMenu = page.locator('[data-testid="mobile-menu-toggle"], .hamburger-menu, .menu-toggle');
      await expect(hamburgerMenu).toBeVisible();
      
      // Sidebar should be hidden
      const sidebar = page.locator('[data-testid="sidebar"], .sidebar');
      const isVisible = await sidebar.isVisible();
      expect(isVisible).toBeFalsy();
      
      // Open mobile menu
      await hamburgerMenu.click();
      
      // Mobile navigation should appear
      const mobileNav = page.locator('[data-testid="mobile-nav"], .mobile-navigation, .drawer');
      await expect(mobileNav).toBeVisible();
      
      // Navigation items should be accessible
      const navItems = ['Dashboard', 'Policies', 'Claims'];
      for (const item of navItems) {
        const navItem = page.locator(`[data-testid="nav-${item.toLowerCase()}"], text="${item}"`).first();
        if (await navItem.isVisible()) {
          await expect(navItem).toBeVisible();
          
          // Test navigation works
          await navItem.click();
          await page.waitForLoadState('networkidle');
          
          // Should close mobile menu after navigation
          const isMenuVisible = await mobileNav.isVisible();
          expect(isMenuVisible).toBeFalsy();
          
          // Reopen menu for next test
          await hamburgerMenu.click();
        }
      }
      
      // Close mobile menu
      const closeButton = page.locator('[data-testid="close-menu"], .close-drawer');
      if (await closeButton.isVisible()) {
        await closeButton.click();
      } else {
        // Click outside to close
        await page.click('body', { position: { x: 50, y: 50 } });
      }
    }
  });

  test('US-062: Tablet responsive layout (768px - 1024px)', async ({ page }) => {
    const tabletViewports = [
      { width: 768, height: 1024, name: 'iPad Portrait' },
      { width: 1024, height: 768, name: 'iPad Landscape' }
    ];

    for (const viewport of tabletViewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForLoadState('networkidle');
      
      // Should have sidebar visible or collapsible
      const sidebar = page.locator('[data-testid="sidebar"], .sidebar');
      const hamburger = page.locator('[data-testid="mobile-menu-toggle"], .hamburger-menu');
      
      const sidebarVisible = await sidebar.isVisible();
      const hamburgerVisible = await hamburger.isVisible();
      
      // Either sidebar is visible OR hamburger is available
      expect(sidebarVisible || hamburgerVisible).toBeTruthy();
      
      // Test table responsiveness in policies page
      await helpers.navigateToSection('policies');
      
      const policiesTable = page.locator('.policies-table, [data-testid="policies-table"]');
      if (await policiesTable.isVisible()) {
        // Table should be scrollable horizontally if needed
        const tableContainer = page.locator('.table-container, .mat-table-container');
        
        if (await tableContainer.isVisible()) {
          const hasHorizontalScroll = await tableContainer.evaluate(el => 
            el.scrollWidth > el.clientWidth
          );
          
          if (hasHorizontalScroll) {
            // Should be able to scroll horizontally
            await tableContainer.hover();
            await page.mouse.wheel(50, 0); // Horizontal scroll
          }
        }
        
        // Important columns should remain visible
        const importantColumns = ['Policy Number', 'Status', 'Actions'];
        for (const column of importantColumns) {
          const columnHeader = page.locator(`th:has-text("${column}")`);
          if (await columnHeader.count() > 0) {
            await expect(columnHeader).toBeVisible();
          }
        }
      }
      
      // Test form layout
      await page.click('[data-testid="new-policy-button"]');
      await page.waitForURL('**/policies/new');
      
      // Form fields should stack or resize appropriately
      const formRows = page.locator('.form-row, .form-group');
      if (await formRows.count() > 0) {
        for (let i = 0; i < Math.min(3, await formRows.count()); i++) {
          const formRow = formRows.nth(i);
          const boundingBox = await formRow.boundingBox();
          
          // Form row should fit within viewport width
          expect(boundingBox?.width).toBeLessThanOrEqual(viewport.width);
        }
      }
    }
  });

  test('US-063: Desktop responsive layout (1024px+)', async ({ page }) => {
    const desktopViewports = [
      { width: 1024, height: 768, name: 'Small Desktop' },
      { width: 1366, height: 768, name: 'Medium Desktop' },
      { width: 1920, height: 1080, name: 'Large Desktop' }
    ];

    for (const viewport of desktopViewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForLoadState('networkidle');
      
      // Sidebar should be fully visible
      const sidebar = page.locator('[data-testid="sidebar"], .sidebar');
      await expect(sidebar).toBeVisible();
      
      // Hamburger menu should not be visible
      const hamburger = page.locator('[data-testid="mobile-menu-toggle"], .hamburger-menu');
      const isHamburgerVisible = await hamburger.isVisible();
      expect(isHamburgerVisible).toBeFalsy();
      
      // Test full table visibility
      await helpers.navigateToSection('policies');
      
      const policiesTable = page.locator('.policies-table');
      if (await policiesTable.isVisible()) {
        // All columns should be visible without horizontal scrolling
        const expectedColumns = ['Policy Number', 'Vehicle', 'Coverage', 'Premium', 'Status', 'Policy Period', 'Actions'];
        
        for (const column of expectedColumns) {
          const columnHeader = page.locator(`th:has-text("${column}")`);
          if (await columnHeader.count() > 0) {
            await expect(columnHeader).toBeVisible();
          }
        }
        
        // Table should not have horizontal scroll
        const tableContainer = page.locator('.table-container');
        if (await tableContainer.isVisible()) {
          const hasHorizontalScroll = await tableContainer.evaluate(el => 
            el.scrollWidth > el.clientWidth
          );
          expect(hasHorizontalScroll).toBeFalsy();
        }
      }
      
      // Test form layout in two-column format
      await page.click('[data-testid="new-policy-button"]');
      await page.waitForURL('**/policies/new');
      
      const formContainer = page.locator('.policy-new-container, .form-container');
      if (await formContainer.isVisible()) {
        // Form should have reasonable max-width and be centered
        const boundingBox = await formContainer.boundingBox();
        const maxWidth = Math.min(800, viewport.width * 0.8);
        
        expect(boundingBox?.width).toBeLessThanOrEqual(maxWidth);
      }
      
      // Form rows should display side-by-side
      const formRows = page.locator('.form-row');
      if (await formRows.count() > 0) {
        const firstRow = formRows.first();
        const fields = firstRow.locator('mat-form-field');
        
        if (await fields.count() > 1) {
          // Fields should be arranged horizontally
          const firstFieldBox = await fields.first().boundingBox();
          const secondFieldBox = await fields.nth(1).boundingBox();
          
          if (firstFieldBox && secondFieldBox) {
            // Second field should be to the right of first field
            expect(secondFieldBox.x).toBeGreaterThan(firstFieldBox.x);
            // Should be roughly on the same horizontal line
            expect(Math.abs(secondFieldBox.y - firstFieldBox.y)).toBeLessThan(50);
          }
        }
      }
    }
  });

  test('US-064: Touch-friendly interface on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Test button sizes are touch-friendly (minimum 44px)
    const buttons = page.locator('button, .mat-raised-button, .mat-fab');
    const buttonCount = Math.min(5, await buttons.count());
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const boundingBox = await button.boundingBox();
        
        // Should be at least 44px in height or width for touch accessibility
        const isTouchFriendly = (boundingBox?.height || 0) >= 44 || (boundingBox?.width || 0) >= 44;
        expect(isTouchFriendly).toBeTruthy();
      }
    }
    
    // Test form fields are touch-friendly
    await helpers.navigateToSection('policies');
    await page.click('[data-testid="new-policy-button"]');
    
    const formFields = page.locator('input, .mat-select, .mat-form-field');
    const fieldCount = Math.min(3, await formFields.count());
    
    for (let i = 0; i < fieldCount; i++) {
      const field = formFields.nth(i);
      if (await field.isVisible()) {
        const boundingBox = await field.boundingBox();
        
        // Form fields should have adequate height for touch
        expect(boundingBox?.height || 0).toBeGreaterThanOrEqual(40);
      }
    }
    
    // Test that interactive elements have adequate spacing
    const interactiveElements = page.locator('button, a, input, .mat-select');
    const elementCount = Math.min(3, await interactiveElements.count());
    
    for (let i = 0; i < elementCount - 1; i++) {
      const current = interactiveElements.nth(i);
      const next = interactiveElements.nth(i + 1);
      
      if (await current.isVisible() && await next.isVisible()) {
        const currentBox = await current.boundingBox();
        const nextBox = await next.boundingBox();
        
        if (currentBox && nextBox) {
          // Elements should have some spacing between them
          const verticalGap = Math.abs(nextBox.y - (currentBox.y + currentBox.height));
          const horizontalGap = Math.abs(nextBox.x - (currentBox.x + currentBox.width));
          
          // Should have at least 8px gap
          const hasAdequateSpacing = verticalGap >= 8 || horizontalGap >= 8;
          expect(hasAdequateSpacing).toBeTruthy();
        }
      }
    }
  });

  test('US-065: Keyboard navigation accessibility', async ({ page }) => {
    // Test tab navigation through interface
    await page.keyboard.press('Tab');
    
    // Should focus on first interactive element
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Tab through navigation
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
      
      const currentFocus = page.locator(':focus');
      if (await currentFocus.isVisible()) {
        // Focused element should be clearly visible
        const outline = await currentFocus.evaluate(el => 
          window.getComputedStyle(el).outline || window.getComputedStyle(el).boxShadow
        );
        expect(outline).toBeTruthy();
      }
    }
    
    // Test Enter key on buttons
    const firstButton = page.locator('button').first();
    if (await firstButton.isVisible()) {
      await firstButton.focus();
      await expect(firstButton).toBeFocused();
      
      // Enter should activate button (test depends on button function)
      // await page.keyboard.press('Enter');
    }
    
    // Test Escape key functionality
    await helpers.navigateToSection('policies');
    const firstPolicyRow = page.locator('mat-row').first();
    
    if (await firstPolicyRow.isVisible()) {
      await firstPolicyRow.locator('[data-testid="policy-actions-menu"]').click();
      
      const menu = page.locator('.mat-menu-panel');
      if (await menu.isVisible()) {
        // Escape should close menu
        await page.keyboard.press('Escape');
        await expect(menu).not.toBeVisible();
      }
    }
    
    // Test arrow key navigation in select dropdowns
    const selectField = page.locator('.mat-select').first();
    if (await selectField.isVisible()) {
      await selectField.focus();
      await page.keyboard.press('Space'); // Open dropdown
      
      const options = page.locator('.mat-option');
      if (await options.count() > 0) {
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter'); // Select option
        
        // Dropdown should close
        const isOpen = await page.locator('.mat-select-panel').isVisible();
        expect(isOpen).toBeFalsy();
      }
    }
  });

  test('US-066: Screen reader accessibility', async ({ page }) => {
    // Test heading hierarchy
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    
    expect(headingCount).toBeGreaterThan(0);
    
    // Should have one main h1
    const h1Elements = page.locator('h1');
    const h1Count = await h1Elements.count();
    expect(h1Count).toBe(1);
    
    // Test ARIA labels and descriptions
    const buttons = page.locator('button');
    const buttonCount = Math.min(5, await buttons.count());
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      const ariaDescribedBy = await button.getAttribute('aria-describedby');
      
      // Button should have accessible label (aria-label, text content, or aria-describedby)
      const hasAccessibleLabel = ariaLabel || (text && text.trim()) || ariaDescribedBy;
      expect(hasAccessibleLabel).toBeTruthy();
    }
    
    // Test form labels
    await helpers.navigateToSection('policies');
    await page.click('[data-testid="new-policy-button"]');
    
    const formInputs = page.locator('input, select, textarea');
    const inputCount = Math.min(3, await formInputs.count());
    
    for (let i = 0; i < inputCount; i++) {
      const input = formInputs.nth(i);
      const id = await input.getAttribute('id');
      
      if (id) {
        // Should have associated label
        const label = page.locator(`label[for="${id}"], mat-label`);
        const labelCount = await label.count();
        
        if (labelCount === 0) {
          // Check for aria-label or aria-labelledby
          const ariaLabel = await input.getAttribute('aria-label');
          const ariaLabelledBy = await input.getAttribute('aria-labelledby');
          
          expect(ariaLabel || ariaLabelledBy).toBeTruthy();
        }
      }
    }
    
    // Test table accessibility
    await helpers.navigateToSection('policies');
    const table = page.locator('table');
    
    if (await table.isVisible()) {
      // Table should have caption or aria-label
      const caption = table.locator('caption');
      const ariaLabel = await table.getAttribute('aria-label');
      
      const hasTableLabel = (await caption.count() > 0) || ariaLabel;
      expect(hasTableLabel).toBeTruthy();
      
      // Headers should be properly associated
      const th = table.locator('th');
      const thCount = Math.min(3, await th.count());
      
      for (let i = 0; i < thCount; i++) {
        const header = th.nth(i);
        const scope = await header.getAttribute('scope');
        
        // Column headers should have scope="col"
        if (scope !== null) {
          expect(scope).toBe('col');
        }
      }
    }
  });

  test('US-067: Color contrast and visual accessibility', async ({ page }) => {
    // Test that text has sufficient contrast
    const textElements = page.locator('h1, h2, h3, p, span, .mat-button, .stat-label');
    const elementCount = Math.min(5, await textElements.count());
    
    for (let i = 0; i < elementCount; i++) {
      const element = textElements.nth(i);
      
      if (await element.isVisible()) {
        const styles = await element.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
            fontSize: computed.fontSize
          };
        });
        
        // Basic checks (full contrast calculation would require color parsing)
        expect(styles.color).toBeTruthy();
        expect(styles.fontSize).toBeTruthy();
        
        // Text should not be too small
        const fontSize = parseFloat(styles.fontSize);
        expect(fontSize).toBeGreaterThanOrEqual(12); // Minimum readable size
      }
    }
    
    // Test focus indicators
    const interactiveElements = page.locator('button, a, input, .mat-select');
    const interactive = interactiveElements.first();
    
    if (await interactive.isVisible()) {
      await interactive.focus();
      
      const focusStyles = await interactive.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          outline: computed.outline,
          outlineColor: computed.outlineColor,
          outlineWidth: computed.outlineWidth,
          boxShadow: computed.boxShadow
        };
      });
      
      // Should have visible focus indicator
      const hasFocusIndicator = 
        focusStyles.outline !== 'none' || 
        focusStyles.boxShadow !== 'none' ||
        focusStyles.outlineWidth !== '0px';
      
      expect(hasFocusIndicator).toBeTruthy();
    }
    
    // Test that interactive elements are distinguishable
    const buttons = page.locator('button, .mat-button');
    if (await buttons.count() >= 2) {
      const primaryButton = buttons.first();
      const secondaryButton = buttons.nth(1);
      
      const primaryStyles = await primaryButton.evaluate(el => ({
        backgroundColor: window.getComputedStyle(el).backgroundColor,
        color: window.getComputedStyle(el).color,
        border: window.getComputedStyle(el).border
      }));
      
      const secondaryStyles = await secondaryButton.evaluate(el => ({
        backgroundColor: window.getComputedStyle(el).backgroundColor,
        color: window.getComputedStyle(el).color,
        border: window.getComputedStyle(el).border
      }));
      
      // Buttons should have visual distinction
      const areDifferent = 
        primaryStyles.backgroundColor !== secondaryStyles.backgroundColor ||
        primaryStyles.color !== secondaryStyles.color ||
        primaryStyles.border !== secondaryStyles.border;
      
      expect(areDifferent).toBeTruthy();
    }
  });

  test('US-068: Form accessibility features', async ({ page }) => {
    await helpers.navigateToSection('policies');
    await page.click('[data-testid="new-policy-button"]');
    
    // Submit form to trigger validation errors
    await page.click('[data-testid="create-policy-button"]');
    
    // Test error announcement
    const errorMessages = page.locator('mat-error');
    const errorCount = Math.min(3, await errorMessages.count());
    
    for (let i = 0; i < errorCount; i++) {
      const error = errorMessages.nth(i);
      
      // Error should have appropriate ARIA attributes
      const ariaLive = await error.getAttribute('aria-live');
      const role = await error.getAttribute('role');
      
      // Should announce errors to screen readers
      const hasAnnouncement = ariaLive || role === 'alert';
      expect(hasAnnouncement).toBeTruthy();
    }
    
    // Test required field indicators
    const requiredFields = page.locator('input[required], .mat-form-field.mat-form-field-required');
    const requiredCount = Math.min(3, await requiredFields.count());
    
    for (let i = 0; i < requiredCount; i++) {
      const field = requiredFields.nth(i);
      
      // Should indicate required status
      const ariaRequired = await field.getAttribute('aria-required');
      const hasRequiredIndicator = ariaRequired === 'true';
      
      expect(hasRequiredIndicator).toBeTruthy();
      
      // Visual indicator should be present
      const requiredIndicator = page.locator('.mat-form-field-required-marker, .required-asterisk');
      if (await requiredIndicator.count() > 0) {
        await expect(requiredIndicator.first()).toBeVisible();
      }
    }
    
    // Test field help text
    const fieldHelp = page.locator('mat-hint, .field-help, .help-text');
    if (await fieldHelp.count() > 0) {
      const helpElement = fieldHelp.first();
      const helpId = await helpElement.getAttribute('id');
      
      if (helpId) {
        // Associated field should reference help text
        const associatedField = page.locator(`[aria-describedby*="${helpId}"]`);
        const associatedCount = await associatedField.count();
        expect(associatedCount).toBeGreaterThan(0);
      }
    }
  });

  test('US-069: Data table accessibility', async ({ page }) => {
    await helpers.navigateToSection('policies');
    
    const table = page.locator('.policies-table, table');
    
    if (await table.isVisible()) {
      // Table should have accessible name
      const caption = table.locator('caption');
      const ariaLabel = await table.getAttribute('aria-label');
      const ariaLabelledBy = await table.getAttribute('aria-labelledby');
      
      const hasAccessibleName = (await caption.count() > 0) || ariaLabel || ariaLabelledBy;
      expect(hasAccessibleName).toBeTruthy();
      
      // Test sortable columns
      const sortableHeaders = table.locator('th[aria-sort], .mat-sort-header');
      const sortableCount = await sortableHeaders.count();
      
      for (let i = 0; i < Math.min(2, sortableCount); i++) {
        const header = sortableHeaders.nth(i);
        
        // Should have sorting attributes
        const ariaSort = await header.getAttribute('aria-sort');
        const role = await header.getAttribute('role');
        
        expect(ariaSort || role).toBeTruthy();
        
        // Test keyboard sorting
        await header.focus();
        await page.keyboard.press('Enter');
        await page.waitForTimeout(500);
        
        // Sorting state should change
        const newAriaSort = await header.getAttribute('aria-sort');
        expect(newAriaSort).toBeTruthy();
      }
      
      // Test row navigation
      const rows = table.locator('tbody tr, mat-row');
      if (await rows.count() > 0) {
        const firstRow = rows.first();
        
        // Rows should be focusable or have focusable content
        const rowTabIndex = await firstRow.getAttribute('tabindex');
        const focusableInRow = firstRow.locator('button, a, input, [tabindex]');
        
        const isRowAccessible = rowTabIndex !== null || (await focusableInRow.count() > 0);
        expect(isRowAccessible).toBeTruthy();
      }
      
      // Test action buttons in table
      const actionButtons = table.locator('button, .mat-menu-trigger');
      const actionCount = Math.min(2, await actionButtons.count());
      
      for (let i = 0; i < actionCount; i++) {
        const button = actionButtons.nth(i);
        
        // Should have accessible label
        const ariaLabel = await button.getAttribute('aria-label');
        const text = await button.textContent();
        
        const hasLabel = ariaLabel || (text && text.trim());
        expect(hasLabel).toBeTruthy();
      }
    }
  });

  test('US-070: Print stylesheet and media queries', async ({ page }) => {
    // Test print styles
    await page.emulateMedia({ media: 'print' });
    
    // Navigation should be hidden in print
    const sidebar = page.locator('[data-testid="sidebar"], .sidebar');
    if (await sidebar.isVisible()) {
      const display = await sidebar.evaluate(el => 
        window.getComputedStyle(el).display
      );
      
      // Sidebar should be hidden for print
      expect(display).toBe('none');
    }
    
    // Action buttons should be hidden in print
    const actionButtons = page.locator('.mat-menu-trigger, .actions-menu');
    if (await actionButtons.count() > 0) {
      const firstButton = actionButtons.first();
      const display = await firstButton.evaluate(el => 
        window.getComputedStyle(el).display
      );
      
      expect(display).toBe('none');
    }
    
    // Main content should be optimized for print
    const mainContent = page.locator('main, .main-content, .page-content');
    if (await mainContent.isVisible()) {
      const styles = await mainContent.evaluate(el => ({
        margin: window.getComputedStyle(el).margin,
        padding: window.getComputedStyle(el).padding,
        width: window.getComputedStyle(el).width
      }));
      
      // Should use full width for print
      expect(styles.width).toBe('100%');
    }
    
    // Reset to screen media
    await page.emulateMedia({ media: 'screen' });
    
    // Test high contrast media query if supported
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(500);
    
    // Some elements should adapt to dark mode if supported
    const bodyStyles = await page.evaluate(() => ({
      backgroundColor: window.getComputedStyle(document.body).backgroundColor,
      color: window.getComputedStyle(document.body).color
    }));
    
    // Should have appropriate colors (exact values depend on theme implementation)
    expect(bodyStyles.backgroundColor).toBeTruthy();
    expect(bodyStyles.color).toBeTruthy();
    
    // Reset color scheme
    await page.emulateMedia({ colorScheme: 'light' });
  });
});