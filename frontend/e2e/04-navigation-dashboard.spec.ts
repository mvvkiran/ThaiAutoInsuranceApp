import { test, expect } from '@playwright/test';
import { TestHelpers } from './test-helpers';

/**
 * EPIC 4: Navigation and Dashboard
 * Comprehensive test suite for navigation and dashboard functionality
 */

test.describe('Navigation and Dashboard', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.login();
  });

  test('US-035: Dashboard displays overview statistics', async ({ page }) => {
    // Should be on dashboard after login
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Verify statistics cards are present
    const statsCards = page.locator('.stats-card, .stat-card, .dashboard-card');
    await expect(statsCards).toHaveCountGreaterThan(0);
    
    // Check for key metrics
    const expectedMetrics = [
      'Total Policies',
      'Active Policies', 
      'Total Claims',
      'Pending Claims',
      'Monthly Premium',
      'Claims This Month'
    ];
    
    for (const metric of expectedMetrics) {
      // Look for either exact text or partial matches
      const metricElement = page.locator(`text="${metric}"`).or(page.locator(`*:has-text("${metric.split(' ')[0]}")`));
      if (await metricElement.count() > 0) {
        await expect(metricElement.first()).toBeVisible();
      }
    }
    
    // Verify numbers are displayed (should be numeric values)
    const statNumbers = page.locator('.stat-number, .metric-value, .dashboard-number');
    const count = await statNumbers.count();
    
    for (let i = 0; i < count; i++) {
      const statValue = await statNumbers.nth(i).textContent();
      expect(statValue).toMatch(/[\d,฿%]+/); // Numbers, commas, Thai Baht, or percentages
    }
  });

  test('US-036: Navigation menu functionality', async ({ page }) => {
    // Verify sidebar navigation is present
    const sidebar = page.locator('[data-testid="sidebar"], .sidebar, nav');
    await expect(sidebar).toBeVisible();
    
    // Test navigation to each major section
    const navigationItems = [
      { name: 'Dashboard', url: '/dashboard', text: 'Dashboard' },
      { name: 'Policies', url: '/policies', text: 'Policy Management' },
      { name: 'Claims', url: '/claims', text: 'Claims Management' },
      { name: 'Customers', url: '/customers', text: 'Customer' },
      { name: 'Reports', url: '/reports', text: 'Reports' }
    ];
    
    for (const item of navigationItems) {
      // Click navigation item
      const navButton = page.locator(`[data-testid="nav-${item.name.toLowerCase()}"], text="${item.name}"`).first();
      
      if (await navButton.isVisible()) {
        await navButton.click();
        
        // Verify URL changed
        await page.waitForURL(`**${item.url}**`);
        expect(page.url()).toContain(item.url);
        
        // Verify page content loaded
        await expect(page.locator('h1')).toContainText(item.text);
        
        // Verify navigation item is highlighted/active
        await expect(navButton).toHaveClass(/active|selected|current/);
      }
    }
  });

  test('US-037: Responsive navigation behavior', async ({ page }) => {
    await helpers.testResponsiveDesign();
    
    // Test mobile navigation specifically
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Should show mobile menu button
    const mobileMenuButton = page.locator('[data-testid="mobile-menu"], .mobile-menu-toggle, .hamburger-menu');
    if (await mobileMenuButton.isVisible()) {
      // Open mobile menu
      await mobileMenuButton.click();
      
      // Verify navigation items are accessible
      const mobileNav = page.locator('.mobile-nav, .drawer, .side-menu');
      await expect(mobileNav).toBeVisible();
      
      // Test navigation still works in mobile
      const policiesLink = page.locator('text="Policies"').first();
      if (await policiesLink.isVisible()) {
        await policiesLink.click();
        await page.waitForURL('**/policies');
      }
      
      // Close mobile menu
      const closeButton = page.locator('[data-testid="close-mobile-menu"], .close-drawer');
      if (await closeButton.isVisible()) {
        await closeButton.click();
        await expect(mobileNav).not.toBeVisible();
      }
    }
  });

  test('US-038: User profile and settings access', async ({ page }) => {
    // Find user menu
    const userMenu = page.locator('[data-testid="user-menu"], .user-profile, .account-menu');
    await expect(userMenu).toBeVisible();
    
    // Open user menu
    await userMenu.click();
    
    // Verify menu options
    const expectedMenuItems = [
      'Profile',
      'Settings', 
      'Change Password',
      'Logout'
    ];
    
    for (const item of expectedMenuItems) {
      const menuItem = page.locator(`text="${item}"`);
      if (await menuItem.count() > 0) {
        await expect(menuItem.first()).toBeVisible();
      }
    }
    
    // Test profile access
    const profileLink = page.locator('[data-testid="profile-link"], text="Profile"').first();
    if (await profileLink.isVisible()) {
      await profileLink.click();
      
      // Should navigate to profile page or open profile modal
      const profilePage = page.locator('h1:has-text("Profile")');
      const profileModal = page.locator('[data-testid="profile-modal"]');
      
      const hasProfile = await profilePage.isVisible();
      const hasModal = await profileModal.isVisible();
      
      expect(hasProfile || hasModal).toBeTruthy();
    }
  });

  test('US-039: Recent activity and notifications', async ({ page }) => {
    // Look for recent activity section on dashboard
    const recentActivity = page.locator('[data-testid="recent-activity"], .recent-items, .activity-feed');
    
    if (await recentActivity.isVisible()) {
      // Verify activity items are present
      const activityItems = page.locator('.activity-item, .recent-item');
      await expect(activityItems).toHaveCountGreaterThan(0);
      
      // Verify activity items contain relevant information
      const firstItem = activityItems.first();
      await expect(firstItem).toContainText(/(Policy|Claim|Customer)/);
      
      // Check for timestamps
      const timestamp = page.locator('.timestamp, .activity-time, .time-ago');
      if (await timestamp.count() > 0) {
        await expect(timestamp.first()).toBeVisible();
      }
    }
    
    // Check for notifications
    const notificationBell = page.locator('[data-testid="notifications"], .notification-bell');
    if (await notificationBell.isVisible()) {
      // Check for notification badge
      const notificationBadge = page.locator('.notification-badge, .badge');
      
      await notificationBell.click();
      
      // Should open notifications dropdown or modal
      const notificationsList = page.locator('[data-testid="notifications-list"], .notifications-dropdown');
      if (await notificationsList.isVisible()) {
        await expect(notificationsList).toContainText(/(notification|alert|update|reminder)/i);
      }
    }
  });

  test('US-040: Quick actions from dashboard', async ({ page }) => {
    // Look for quick action buttons or cards
    const quickActions = page.locator('[data-testid="quick-actions"], .quick-actions, .action-buttons');
    
    if (await quickActions.isVisible()) {
      // Common quick actions in insurance dashboard
      const expectedActions = [
        'New Policy',
        'New Claim', 
        'Search Customer',
        'View Reports'
      ];
      
      for (const action of expectedActions) {
        const actionButton = page.locator(`button:has-text("${action}"), a:has-text("${action}")`);
        
        if (await actionButton.count() > 0) {
          const button = actionButton.first();
          await expect(button).toBeVisible();
          
          // Test that clicking leads to expected page
          await button.click();
          
          if (action === 'New Policy') {
            await page.waitForURL('**/policies/new');
            expect(page.url()).toContain('/policies/new');
          } else if (action === 'New Claim') {
            await page.waitForURL('**/claims/new');
            expect(page.url()).toContain('/claims/new');
          }
          
          // Go back to dashboard for next test
          await helpers.navigateToSection('dashboard');
        }
      }
    }
  });

  test('US-041: Dashboard data refresh and real-time updates', async ({ page }) => {
    // Verify initial dashboard state
    const initialStats = {};
    const statElements = page.locator('.stat-number, .metric-value');
    const count = await statElements.count();
    
    for (let i = 0; i < count; i++) {
      const value = await statElements.nth(i).textContent();
      initialStats[i] = value;
    }
    
    // Look for refresh button
    const refreshButton = page.locator('[data-testid="refresh-dashboard"], .refresh-button');
    if (await refreshButton.isVisible()) {
      await refreshButton.click();
      
      // Should show loading state
      const loadingIndicator = page.locator('.loading, mat-spinner, .spinner');
      if (await loadingIndicator.count() > 0) {
        await expect(loadingIndicator.first()).toBeVisible();
        await expect(loadingIndicator.first()).not.toBeVisible({ timeout: 10000 });
      }
    }
    
    // Test auto-refresh if available
    const autoRefreshToggle = page.locator('[data-testid="auto-refresh"]');
    if (await autoRefreshToggle.isVisible()) {
      await autoRefreshToggle.check();
      
      // Wait for potential auto-refresh
      await page.waitForTimeout(5000);
      
      // Verify page is still functional
      await expect(page.locator('h1')).toContainText('Dashboard');
    }
  });

  test('US-042: Dashboard customization', async ({ page }) => {
    // Look for dashboard customization options
    const customizeButton = page.locator('[data-testid="customize-dashboard"], .customize-btn');
    
    if (await customizeButton.isVisible()) {
      await customizeButton.click();
      
      // Should open customization panel
      const customizationPanel = page.locator('[data-testid="customization-panel"], .dashboard-settings');
      await expect(customizationPanel).toBeVisible();
      
      // Test widget visibility toggles
      const widgetToggles = page.locator('.widget-toggle, .dashboard-widget-setting');
      if (await widgetToggles.count() > 0) {
        const firstToggle = widgetToggles.first();
        const initialState = await firstToggle.isChecked();
        
        // Toggle widget visibility
        await firstToggle.click();
        await page.click('[data-testid="save-customization"]');
        
        // Verify dashboard layout changed
        await page.waitForTimeout(1000);
        await expect(page.locator('.dashboard-widgets')).toBeVisible();
        
        // Restore original state
        await customizeButton.click();
        if (initialState) {
          await firstToggle.check();
        } else {
          await firstToggle.uncheck();
        }
        await page.click('[data-testid="save-customization"]');
      }
    }
  });

  test('US-043: Charts and data visualization', async ({ page }) => {
    // Look for charts on dashboard
    const charts = page.locator('canvas, .chart, .graph, svg');
    
    if (await charts.count() > 0) {
      // Verify charts are rendered
      for (let i = 0; i < Math.min(3, await charts.count()); i++) {
        const chart = charts.nth(i);
        await expect(chart).toBeVisible();
        
        // Check if chart has data (non-zero dimensions)
        const boundingBox = await chart.boundingBox();
        expect(boundingBox?.width).toBeGreaterThan(0);
        expect(boundingBox?.height).toBeGreaterThan(0);
      }
      
      // Test chart interactions if available
      const firstChart = charts.first();
      
      // Try hovering over chart for tooltips
      await firstChart.hover();
      await page.waitForTimeout(500);
      
      const tooltip = page.locator('.tooltip, .chart-tooltip');
      if (await tooltip.count() > 0) {
        await expect(tooltip.first()).toBeVisible();
      }
      
      // Test chart legend if present
      const legend = page.locator('.legend, .chart-legend');
      if (await legend.count() > 0) {
        await expect(legend.first()).toBeVisible();
        
        // Try clicking legend items
        const legendItems = page.locator('.legend-item');
        if (await legendItems.count() > 0) {
          await legendItems.first().click();
          await page.waitForTimeout(500);
        }
      }
    }
  });

  test('US-044: Breadcrumb navigation', async ({ page }) => {
    // Navigate to a deep page
    await helpers.navigateToSection('policies');
    await page.click('[data-testid="new-policy-button"]');
    await page.waitForURL('**/policies/new');
    
    // Look for breadcrumbs
    const breadcrumbs = page.locator('[data-testid="breadcrumbs"], .breadcrumb');
    
    if (await breadcrumbs.isVisible()) {
      // Should show navigation path
      await expect(breadcrumbs).toContainText('Dashboard');
      await expect(breadcrumbs).toContainText('Policies');
      await expect(breadcrumbs).toContainText('New');
      
      // Test clicking on breadcrumb links
      const policiesLink = page.locator('.breadcrumb a:has-text("Policies")');
      if (await policiesLink.isVisible()) {
        await policiesLink.click();
        await page.waitForURL('**/policies');
        expect(page.url()).toContain('/policies');
      }
    }
  });

  test('US-045: Thai language localization in navigation', async ({ page }) => {
    // Test language switching if available
    const languageSelector = page.locator('[data-testid="language-selector"], .language-toggle');
    
    if (await languageSelector.isVisible()) {
      await languageSelector.click();
      
      // Select Thai language
      const thaiOption = page.locator('mat-option:has-text("ไทย"), option:has-text("Thai")');
      if (await thaiOption.isVisible()) {
        await thaiOption.click();
        
        // Verify Thai text appears in navigation
        const expectedThaiTerms = [
          'แดชบอร์ด', // Dashboard
          'กรมธรรม์', // Policy
          'การเรียกร้อง', // Claims
          'ลูกค้า', // Customer
          'รายงาน' // Reports
        ];
        
        for (const term of expectedThaiTerms) {
          const thaiElement = page.locator(`text="${term}"`);
          if (await thaiElement.count() > 0) {
            await expect(thaiElement.first()).toBeVisible();
          }
        }
        
        // Switch back to English
        await languageSelector.click();
        const englishOption = page.locator('mat-option:has-text("English"), option:has-text("English")');
        if (await englishOption.isVisible()) {
          await englishOption.click();
        }
      }
    }
  });

  test('US-046: Search functionality from header', async ({ page }) => {
    // Look for global search in header
    const globalSearch = page.locator('[data-testid="global-search"], .header-search, .search-input');
    
    if (await globalSearch.isVisible()) {
      // Test searching for policy
      await helpers.fillField('[data-testid="global-search"]', 'POL-2024-001');
      await page.keyboard.press('Enter');
      
      // Should show search results
      const searchResults = page.locator('[data-testid="search-results"], .search-dropdown');
      await expect(searchResults).toBeVisible();
      await expect(searchResults).toContainText('POL-2024-001');
      
      // Test search suggestions/autocomplete
      await globalSearch.clear();
      await globalSearch.type('CLM');
      await page.waitForTimeout(500);
      
      const suggestions = page.locator('[data-testid="search-suggestions"], .autocomplete-options');
      if (await suggestions.isVisible()) {
        await expect(suggestions).toContainText('CLM');
      }
      
      // Clear search
      await globalSearch.clear();
    }
  });
});