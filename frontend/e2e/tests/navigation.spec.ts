import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth/login');
    await page.fill('input[formControlName="username"]', 'agent');
    await page.fill('input[formControlName="password"]', 'agent123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should have working navigation menu', async ({ page }) => {
    // Check if navigation menu exists
    const nav = page.locator('nav, .navigation, .menu, .toolbar');
    await expect(nav).toBeVisible();
  });

  test('should navigate between main sections', async ({ page }) => {
    // Test dashboard navigation
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('h1')).toContainText('Welcome');
    
    // Test policies navigation
    await page.goto('/policies');
    await expect(page).toHaveURL(/.*policies/);
    await expect(page.locator('h1')).toContainText('Policy');
    
    // Test claims navigation
    await page.goto('/claims');
    await expect(page).toHaveURL(/.*claims/);
    await expect(page.locator('h1')).toContainText('Claims');
    
    // Test profile navigation
    await page.goto('/profile');
    await expect(page).toHaveURL(/.*profile/);
    await expect(page.locator('h1')).toContainText('Profile');
  });

  test('should have working navigation links in menu', async ({ page }) => {
    // Look for navigation links
    const dashboardLink = page.locator('a:has-text("Dashboard"), button:has-text("Dashboard")');
    const policiesLink = page.locator('a:has-text("Policies"), button:has-text("Policies")');
    const claimsLink = page.locator('a:has-text("Claims"), button:has-text("Claims")');
    const profileLink = page.locator('a:has-text("Profile"), button:has-text("Profile")');
    
    // Test dashboard link if it exists
    if (await dashboardLink.count() > 0) {
      await dashboardLink.first().click();
      await expect(page).toHaveURL(/.*dashboard/);
    }
    
    // Test policies link if it exists
    if (await policiesLink.count() > 0) {
      await policiesLink.first().click();
      await expect(page).toHaveURL(/.*policies/);
    }
    
    // Test claims link if it exists  
    if (await claimsLink.count() > 0) {
      await claimsLink.first().click();
      await expect(page).toHaveURL(/.*claims/);
    }
  });

  test('should handle direct URL navigation', async ({ page }) => {
    // Test direct navigation to each route
    const routes = [
      '/dashboard',
      '/policies', 
      '/policies/new',
      '/claims',
      '/claims/new', 
      '/profile'
    ];
    
    for (const route of routes) {
      await page.goto(route);
      await expect(page).toHaveURL(new RegExp(route.replace('/', '\\/')));
      
      // Should not redirect to login (user is authenticated)
      await expect(page).not.toHaveURL(/.*auth\/login/);
      
      // Should show page content, not error
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      // Should have a heading
      const headings = page.locator('h1, h2');
      await expect(headings.first()).toBeVisible();
    }
  });

  test('should protect routes when not authenticated', async ({ page }) => {
    // Logout first
    await page.evaluate(() => localStorage.clear());
    await page.evaluate(() => sessionStorage.clear());
    
    // Try to access protected routes
    const protectedRoutes = ['/dashboard', '/policies', '/claims', '/profile'];
    
    for (const route of protectedRoutes) {
      await page.goto(route);
      
      // Should redirect to login
      await expect(page).toHaveURL(/.*auth\/login/);
    }
  });

  test('should show proper page titles', async ({ page }) => {
    const routeTests = [
      { url: '/dashboard', expectedTitle: /dashboard|welcome|home/i },
      { url: '/policies', expectedTitle: /policy|policies/i },
      { url: '/claims', expectedTitle: /claim|claims/i },
      { url: '/profile', expectedTitle: /profile|customer/i }
    ];
    
    for (const { url, expectedTitle } of routeTests) {
      await page.goto(url);
      
      const title = await page.title();
      expect(title.toLowerCase()).toMatch(expectedTitle);
    }
  });

  test('should handle browser back/forward buttons', async ({ page }) => {
    // Navigate through pages
    await page.goto('/dashboard');
    await page.goto('/policies');  
    await page.goto('/claims');
    
    // Test back button
    await page.goBack();
    await expect(page).toHaveURL(/.*policies/);
    
    await page.goBack();
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Test forward button
    await page.goForward();
    await expect(page).toHaveURL(/.*policies/);
  });

  test('should handle 404 routes', async ({ page }) => {
    // Try to access a non-existent route
    await page.goto('/non-existent-page');
    
    // Should redirect to dashboard (catch-all route)
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should maintain authentication state across navigation', async ({ page }) => {
    // Navigate to different pages
    await page.goto('/dashboard');
    await page.goto('/policies');
    await page.goto('/claims');
    await page.goto('/profile');
    
    // Should still be authenticated on each page
    for (const route of ['/dashboard', '/policies', '/claims', '/profile']) {
      await page.goto(route);
      await expect(page).not.toHaveURL(/.*auth\/login/);
      
      // Should show authenticated content
      const body = await page.textContent('body');
      expect(body).not.toContain('Login');
      expect(body).not.toContain('Sign in');
    }
  });
});