import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Dashboard Page Object for Thai Auto Insurance Application
 * 
 * Handles main dashboard functionality:
 * - Policy overview
 * - Recent claims
 * - Quick actions
 * - Navigation to other sections
 * - Thai language content
 */
export class DashboardPage extends BasePage {
  // Dashboard sections
  readonly welcomeMessage: Locator;
  readonly policyOverviewSection: Locator;
  readonly recentClaimsSection: Locator;
  readonly quickActionsSection: Locator;
  readonly notificationsSection: Locator;
  
  // Policy overview elements
  readonly activePoliciesCount: Locator;
  readonly totalPremiumAmount: Locator;
  readonly nextRenewalDate: Locator;
  readonly policyStatusIndicator: Locator;
  
  // Quick action buttons
  readonly newPolicyButton: Locator;
  readonly submitClaimButton: Locator;
  readonly renewPolicyButton: Locator;
  readonly contactAgentButton: Locator;
  readonly viewAllPoliciesButton: Locator;
  
  // Recent activities
  readonly recentActivitiesList: Locator;
  readonly claimStatusUpdates: Locator;
  readonly paymentReminders: Locator;
  
  // Navigation elements
  readonly mainNavigation: Locator;
  readonly profileDropdown: Locator;
  readonly settingsLink: Locator;
  
  constructor(page: Page) {
    super(page);
    
    // Dashboard sections
    this.welcomeMessage = page.locator('[data-testid="welcome-message"]');
    this.policyOverviewSection = page.locator('[data-testid="policy-overview-section"]');
    this.recentClaimsSection = page.locator('[data-testid="recent-claims-section"]');
    this.quickActionsSection = page.locator('[data-testid="quick-actions-section"]');
    this.notificationsSection = page.locator('[data-testid="notifications-section"]');
    
    // Policy overview
    this.activePoliciesCount = page.locator('[data-testid="active-policies-count"]');
    this.totalPremiumAmount = page.locator('[data-testid="total-premium-amount"]');
    this.nextRenewalDate = page.locator('[data-testid="next-renewal-date"]');
    this.policyStatusIndicator = page.locator('[data-testid="policy-status-indicator"]');
    
    // Quick actions
    this.newPolicyButton = page.locator('[data-testid="new-policy-button"]');
    this.submitClaimButton = page.locator('[data-testid="submit-claim-button"]');
    this.renewPolicyButton = page.locator('[data-testid="renew-policy-button"]');
    this.contactAgentButton = page.locator('[data-testid="contact-agent-button"]');
    this.viewAllPoliciesButton = page.locator('[data-testid="view-all-policies-button"]');
    
    // Activities
    this.recentActivitiesList = page.locator('[data-testid="recent-activities-list"]');
    this.claimStatusUpdates = page.locator('[data-testid="claim-status-updates"]');
    this.paymentReminders = page.locator('[data-testid="payment-reminders"]');
    
    // Navigation
    this.mainNavigation = page.locator('[data-testid="main-navigation"]');
    this.profileDropdown = page.locator('[data-testid="profile-dropdown"]');
    this.settingsLink = page.locator('[data-testid="settings-link"]');
  }

  /**
   * Navigate to dashboard and verify it loads
   */
  async navigate(): Promise<void> {
    await this.goto('/dashboard');
    await this.verifyPageLoaded();
  }

  /**
   * Verify dashboard page is properly loaded
   */
  async verifyPageLoaded(): Promise<void> {
    await expect(this.welcomeMessage).toBeVisible();
    await expect(this.policyOverviewSection).toBeVisible();
    await expect(this.quickActionsSection).toBeVisible();
    
    // Verify page title
    await expect(this.page).toHaveTitle(/แดชบอร์ด|Dashboard/);
    
    // Wait for data to load
    await this.waitForApiResponse('/api/dashboard');
  }

  /**
   * Get welcome message text (useful for personalization testing)
   */
  async getWelcomeMessage(): Promise<string> {
    return await this.welcomeMessage.textContent() || '';
  }

  /**
   * Get policy overview data
   */
  async getPolicyOverview(): Promise<{
    activePolicies: number;
    totalPremium: string;
    nextRenewal: string;
    status: string;
  }> {
    return {
      activePolicies: parseInt(await this.activePoliciesCount.textContent() || '0'),
      totalPremium: await this.totalPremiumAmount.textContent() || '',
      nextRenewal: await this.nextRenewalDate.textContent() || '',
      status: await this.policyStatusIndicator.textContent() || ''
    };
  }

  /**
   * Initiate new policy creation
   */
  async createNewPolicy(): Promise<void> {
    await this.newPolicyButton.click();
    await this.page.waitForURL('**/policies/new');
    await this.waitForPageLoad();
  }

  /**
   * Submit a new claim
   */
  async submitNewClaim(): Promise<void> {
    await this.submitClaimButton.click();
    await this.page.waitForURL('**/claims/new');
    await this.waitForPageLoad();
  }

  /**
   * Initiate policy renewal
   */
  async renewPolicy(): Promise<void> {
    await this.renewPolicyButton.click();
    
    // Should open renewal dialog or navigate to renewal page
    const renewalDialog = this.page.locator('[data-testid="renewal-dialog"]');
    if (await this.isElementVisible(renewalDialog)) {
      // Handle in-page renewal
      const confirmRenewalButton = this.page.locator('[data-testid="confirm-renewal-button"]');
      await confirmRenewalButton.click();
      await this.waitForSuccessMessage();
    } else {
      // Navigate to renewal page
      await this.page.waitForURL('**/policies/renew');
    }
  }

  /**
   * Contact insurance agent
   */
  async contactAgent(): Promise<void> {
    await this.contactAgentButton.click();
    
    // Could open chat, phone dialer, or contact form
    const contactModal = this.page.locator('[data-testid="contact-modal"]');
    await expect(contactModal).toBeVisible();
  }

  /**
   * Navigate to all policies view
   */
  async viewAllPolicies(): Promise<void> {
    await this.viewAllPoliciesButton.click();
    await this.page.waitForURL('**/policies');
    await this.waitForPageLoad();
  }

  /**
   * Get recent activities list
   */
  async getRecentActivities(): Promise<string[]> {
    const activities = await this.recentActivitiesList.locator('li').all();
    const activityTexts: string[] = [];
    
    for (const activity of activities) {
      const text = await activity.textContent();
      if (text) {
        activityTexts.push(text);
      }
    }
    
    return activityTexts;
  }

  /**
   * Check for notifications
   */
  async checkNotifications(): Promise<{
    count: number;
    hasUnread: boolean;
  }> {
    const notificationBadge = this.page.locator('[data-testid="notification-badge"]');
    const unreadIndicator = this.page.locator('[data-testid="unread-notifications"]');
    
    let count = 0;
    if (await this.isElementVisible(notificationBadge)) {
      const countText = await notificationBadge.textContent();
      count = parseInt(countText || '0');
    }
    
    const hasUnread = await this.isElementVisible(unreadIndicator);
    
    return { count, hasUnread };
  }

  /**
   * Verify Thai currency formatting in dashboard
   */
  async verifyThaiCurrencyFormatting(): Promise<void> {
    const premiumText = await this.totalPremiumAmount.textContent();
    
    // Should contain Thai Baht symbol (฿) or "บาท"
    expect(premiumText).toMatch(/[฿บาท]/);
    
    // Should use Thai number formatting
    expect(premiumText).toMatch(/\d{1,3}(,\d{3})*/);
  }

  /**
   * Verify Thai date formatting in dashboard
   */
  async verifyThaiDateFormatting(): Promise<void> {
    const renewalText = await this.nextRenewalDate.textContent();
    
    // Should contain Thai month names or Buddhist era
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    
    const hasThaiMonth = thaiMonths.some(month => renewalText?.includes(month));
    const hasBuddhistEra = /25\d{2}/.test(renewalText || '');
    
    expect(hasThaiMonth || hasBuddhistEra).toBe(true);
  }

  /**
   * Access user profile settings
   */
  async accessProfileSettings(): Promise<void> {
    await this.profileDropdown.click();
    await this.settingsLink.click();
    await this.page.waitForURL('**/profile');
    await this.waitForPageLoad();
  }

  /**
   * Navigate using main navigation menu
   */
  async navigateToSection(section: 'policies' | 'claims' | 'payments' | 'documents'): Promise<void> {
    const navigationLink = this.page.locator(`[data-testid="nav-${section}"]`);
    await navigationLink.click();
    await this.page.waitForURL(`**/${section}`);
    await this.waitForPageLoad();
  }

  /**
   * Check dashboard loading performance
   */
  async checkDashboardPerformance(): Promise<{
    loadTime: number;
    apiResponseTime: number;
  }> {
    const startTime = Date.now();
    
    // Navigate to dashboard
    await this.navigate();
    
    // Wait for main content to load
    await this.verifyPageLoaded();
    
    const loadTime = Date.now() - startTime;
    
    // Measure API response time
    const apiStartTime = Date.now();
    await this.waitForApiResponse('/api/dashboard');
    const apiResponseTime = Date.now() - apiStartTime;
    
    return { loadTime, apiResponseTime };
  }

  /**
   * Verify responsive design on different screen sizes
   */
  async verifyResponsiveDesign(): Promise<void> {
    // Test mobile view
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.page.waitForTimeout(1000);
    
    // Verify mobile navigation is visible
    const mobileMenu = this.page.locator('[data-testid="mobile-menu"]');
    await expect(mobileMenu).toBeVisible();
    
    // Test tablet view
    await this.page.setViewportSize({ width: 768, height: 1024 });
    await this.page.waitForTimeout(1000);
    
    // Verify tablet layout
    await expect(this.policyOverviewSection).toBeVisible();
    
    // Test desktop view
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    await this.page.waitForTimeout(1000);
    
    // Verify desktop layout
    await expect(this.quickActionsSection).toBeVisible();
  }

  /**
   * Simulate user interaction flow on dashboard
   */
  async simulateUserFlow(): Promise<void> {
    // User logs in and lands on dashboard
    await this.verifyPageLoaded();
    
    // User checks their policy overview
    const overview = await this.getPolicyOverview();
    expect(overview.activePolicies).toBeGreaterThan(0);
    
    // User checks notifications
    const notifications = await this.checkNotifications();
    
    // User views recent activities
    const activities = await this.getRecentActivities();
    expect(activities.length).toBeGreaterThanOrEqual(0);
    
    // User might navigate to policies section
    await this.viewAllPolicies();
    
    // Navigate back to dashboard
    await this.navigate();
    
    await this.takeScreenshot('dashboard-user-flow-complete');
  }

  /**
   * Verify all dashboard widgets are functioning
   */
  async verifyAllWidgets(): Promise<void> {
    const widgets = [
      this.policyOverviewSection,
      this.recentClaimsSection,
      this.quickActionsSection,
      this.notificationsSection
    ];
    
    for (const widget of widgets) {
      await expect(widget).toBeVisible();
      
      // Verify widget has content (not just empty containers)
      const hasContent = await widget.locator('*').count() > 0;
      expect(hasContent).toBe(true);
    }
  }
}