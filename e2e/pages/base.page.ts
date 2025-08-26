import { Page, Locator, expect } from '@playwright/test';

/**
 * Base Page Object for Thai Auto Insurance Application
 * 
 * Provides common functionality and utilities for all page objects:
 * - Navigation helpers
 * - Common UI interactions
 * - Thai locale support
 * - Waiting mechanisms
 * - Screenshot utilities
 */
export abstract class BasePage {
  readonly page: Page;
  
  // Common locators present on all pages
  readonly loadingSpinner: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly navigationMenu: Locator;
  readonly userMenu: Locator;
  readonly languageSelector: Locator;
  readonly breadcrumb: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Common UI elements
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.successMessage = page.locator('[data-testid="success-message"]');
    this.navigationMenu = page.locator('[data-testid="navigation-menu"]');
    this.userMenu = page.locator('[data-testid="user-menu"]');
    this.languageSelector = page.locator('[data-testid="language-selector"]');
    this.breadcrumb = page.locator('[data-testid="breadcrumb"]');
  }

  /**
   * Navigate to a specific URL
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    // Wait for network to be idle
    await this.page.waitForLoadState('networkidle');
    
    // Wait for loading spinner to disappear if present
    if (await this.loadingSpinner.isVisible()) {
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
    }
    
    // Wait for main content to be visible
    await this.page.waitForSelector('[data-testid="main-content"], main, .content', {
      state: 'visible',
      timeout: 10000
    });
  }

  /**
   * Switch language to Thai or English
   */
  async switchLanguage(language: 'th' | 'en'): Promise<void> {
    if (await this.languageSelector.isVisible()) {
      await this.languageSelector.click();
      await this.page.click(`[data-testid="lang-${language}"]`);
      await this.waitForPageLoad();
    }
  }

  /**
   * Take screenshot with Thai context
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true
    });
  }

  /**
   * Handle alert dialogs
   */
  async handleAlert(action: 'accept' | 'dismiss', text?: string): Promise<void> {
    this.page.once('dialog', async dialog => {
      if (text) {
        expect(dialog.message()).toContain(text);
      }
      
      if (action === 'accept') {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
  }

  /**
   * Fill form field with Thai text support
   */
  async fillField(locator: Locator, value: string, options?: {
    clear?: boolean;
    force?: boolean;
  }): Promise<void> {
    if (options?.clear) {
      await locator.clear();
    }
    
    await locator.fill(value, { force: options?.force });
    
    // Verify the value was entered correctly (important for Thai text)
    await expect(locator).toHaveValue(value);
  }

  /**
   * Select option from dropdown with Thai text support
   */
  async selectOption(selectLocator: Locator, optionValue: string | { label?: string; value?: string }): Promise<void> {
    await selectLocator.click();
    
    if (typeof optionValue === 'string') {
      await this.page.click(`[data-testid="option-${optionValue}"], option[value="${optionValue}"]`);
    } else {
      if (optionValue.label) {
        await this.page.click(`text="${optionValue.label}"`);
      } else if (optionValue.value) {
        await this.page.click(`option[value="${optionValue.value}"]`);
      }
    }
  }

  /**
   * Wait for and verify success message
   */
  async waitForSuccessMessage(expectedText?: string): Promise<void> {
    await this.successMessage.waitFor({ state: 'visible', timeout: 10000 });
    
    if (expectedText) {
      await expect(this.successMessage).toContainText(expectedText);
    }
  }

  /**
   * Wait for and verify error message
   */
  async waitForErrorMessage(expectedText?: string): Promise<void> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 10000 });
    
    if (expectedText) {
      await expect(this.errorMessage).toContainText(expectedText);
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      await this.userMenu.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    if (await this.isAuthenticated()) {
      await this.userMenu.click();
      await this.page.click('[data-testid="logout-button"]');
      await this.page.waitForURL('**/login');
    }
  }

  /**
   * Navigate using breadcrumb
   */
  async navigateByBreadcrumb(item: string): Promise<void> {
    await this.breadcrumb.locator(`text="${item}"`).click();
    await this.waitForPageLoad();
  }

  /**
   * Scroll element into view
   */
  async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500); // Small delay for smooth scrolling
  }

  /**
   * Wait for API response
   */
  async waitForApiResponse(urlPattern: string | RegExp, timeout: number = 10000): Promise<void> {
    await this.page.waitForResponse(
      response => {
        const url = response.url();
        if (typeof urlPattern === 'string') {
          return url.includes(urlPattern);
        }
        return urlPattern.test(url);
      },
      { timeout }
    );
  }

  /**
   * Check if element exists and is visible
   */
  async isElementVisible(locator: Locator, timeout: number = 5000): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Format Thai currency for display
   */
  formatThaiCurrency(amount: number): string {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Format Thai date for display
   */
  formatThaiDate(date: Date): string {
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Bangkok'
    }).format(date);
  }

  /**
   * Get current page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Verify page title contains expected text
   */
  async verifyPageTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(new RegExp(expectedTitle, 'i'));
  }

  /**
   * Verify current URL matches pattern
   */
  async verifyCurrentUrl(urlPattern: string | RegExp): Promise<void> {
    if (typeof urlPattern === 'string') {
      expect(this.page.url()).toContain(urlPattern);
    } else {
      expect(this.page.url()).toMatch(urlPattern);
    }
  }
}