import { Page, expect } from '@playwright/test';

export class TestHelpers {
  
  /**
   * Login with agent credentials
   */
  static async loginAsAgent(page: Page) {
    await page.goto('/auth/login');
    await page.fill('input[formControlName="username"]', 'agent');
    await page.fill('input[formControlName="password"]', 'agent123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
  }

  /**
   * Login with admin credentials (if available)
   */
  static async loginAsAdmin(page: Page) {
    await page.goto('/auth/login');
    await page.fill('input[formControlName="username"]', 'admin');
    await page.fill('input[formControlName="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
  }

  /**
   * Logout current user
   */
  static async logout(page: Page) {
    // Clear storage
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Navigate to login
    await page.goto('/auth/login');
    await expect(page).toHaveURL(/.*auth\/login/);
  }

  /**
   * Wait for page to load completely
   */
  static async waitForPageLoad(page: Page) {
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('body');
  }

  /**
   * Fill form field by label
   */
  static async fillFieldByLabel(page: Page, label: string, value: string) {
    const field = page.locator(`label:has-text("${label}")`).locator('..').locator('input, textarea, select');
    await field.fill(value);
  }

  /**
   * Click button by text content
   */
  static async clickButtonByText(page: Page, text: string) {
    const button = page.locator(`button:has-text("${text}"), a:has-text("${text}")`);
    await button.first().click();
  }

  /**
   * Check if element contains text (case insensitive)
   */
  static async expectElementToContainText(page: Page, selector: string, text: string) {
    const element = page.locator(selector);
    await expect(element).toBeVisible();
    
    const content = await element.textContent();
    expect(content?.toLowerCase()).toContain(text.toLowerCase());
  }

  /**
   * Wait for element to appear with timeout
   */
  static async waitForElement(page: Page, selector: string, timeout: number = 5000) {
    await page.waitForSelector(selector, { timeout });
  }

  /**
   * Take screenshot for debugging
   */
  static async takeScreenshot(page: Page, name: string) {
    await page.screenshot({ 
      path: `screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  /**
   * Check if page has error messages
   */
  static async checkForErrors(page: Page) {
    const errorSelectors = [
      '.error', 
      '.mat-error', 
      '.alert-danger', 
      '[role="alert"]',
      '.error-message'
    ];
    
    for (const selector of errorSelectors) {
      const errorElement = page.locator(selector);
      if (await errorElement.count() > 0) {
        const errorText = await errorElement.textContent();
        console.log(`Found error: ${errorText}`);
      }
    }
  }

  /**
   * Check if page is responsive
   */
  static async checkResponsive(page: Page) {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    // Check if page is still usable
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    await expect(body).toBeVisible();
    
    // Reset to desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(1000);
  }

  /**
   * Verify navigation works
   */
  static async verifyNavigation(page: Page, routes: string[]) {
    for (const route of routes) {
      await page.goto(route);
      await expect(page).toHaveURL(new RegExp(route.replace('/', '\\/')));
      
      // Should show content
      const headings = page.locator('h1, h2, h3');
      await expect(headings.first()).toBeVisible();
    }
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(page: Page): Promise<boolean> {
    const currentUrl = page.url();
    return !currentUrl.includes('/auth/login');
  }

  /**
   * Get current user info from page
   */
  static async getCurrentUser(page: Page): Promise<any> {
    return await page.evaluate(() => {
      const userItem = localStorage.getItem('auth_user');
      return userItem ? JSON.parse(userItem) : null;
    });
  }

  /**
   * Clean up test data
   */
  static async cleanup(page: Page) {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }
}