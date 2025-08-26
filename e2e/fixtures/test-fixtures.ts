import { test as base, expect, Page, BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';
import { DashboardPage } from '../pages/dashboard.page';
import { PolicyPage } from '../pages/policy.page';
import { ClaimsPage } from '../pages/claims.page';
import { AdminPage } from '../pages/admin.page';
import { ThaiDataGenerator } from '../utils/thai-data-generator';
import { ApiHelpers } from '../utils/api-helpers';

/**
 * Extended test fixtures for Thai Auto Insurance App
 * 
 * Provides:
 * - Page object instances
 * - Thai test data generation
 * - API helpers
 * - Authentication states
 * - Test isolation
 */
export interface TestFixtures {
  // Page Objects
  loginPage: LoginPage;
  registerPage: RegisterPage;
  dashboardPage: DashboardPage;
  policyPage: PolicyPage;
  claimsPage: ClaimsPage;
  adminPage: AdminPage;
  
  // Utilities
  thaiData: ThaiDataGenerator;
  apiHelpers: ApiHelpers;
  
  // Authentication states
  authenticatedCustomerContext: BrowserContext;
  authenticatedAgentContext: BrowserContext;
  authenticatedAdminContext: BrowserContext;
}

export interface WorkerFixtures {
  // Worker-scoped fixtures
  testDataCleanup: void;
}

export const test = base.extend<TestFixtures, WorkerFixtures>({
  // Page Object Fixtures
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    await use(registerPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  policyPage: async ({ page }, use) => {
    const policyPage = new PolicyPage(page);
    await use(policyPage);
  },

  claimsPage: async ({ page }, use) => {
    const claimsPage = new ClaimsPage(page);
    await use(claimsPage);
  },

  adminPage: async ({ page }, use) => {
    const adminPage = new AdminPage(page);
    await use(adminPage);
  },

  // Utility Fixtures
  thaiData: async ({ page }, use) => {
    const thaiData = new ThaiDataGenerator();
    await use(thaiData);
  },

  apiHelpers: async ({ page }, use) => {
    const apiHelpers = new ApiHelpers(page);
    await use(apiHelpers);
  },

  // Authenticated Context Fixtures
  authenticatedCustomerContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'auth-states/customer-auth.json'
    });
    
    // Setup customer authentication if not exists
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    const thaiData = new ThaiDataGenerator();
    
    await page.goto('/login');
    
    // Check if already authenticated
    if (await page.url().includes('/dashboard')) {
      await use(context);
      await context.close();
      return;
    }

    // Perform login for customer
    const customerData = thaiData.generateCustomer();
    await loginPage.login(customerData.email, 'TestPassword123!');
    
    // Wait for authentication
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Save auth state
    await page.context().storageState({ path: 'auth-states/customer-auth.json' });
    
    await use(context);
    await context.close();
  },

  authenticatedAgentContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'auth-states/agent-auth.json'
    });
    
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    
    await page.goto('/login');
    
    if (await page.url().includes('/agent-dashboard')) {
      await use(context);
      await context.close();
      return;
    }

    // Agent login
    await loginPage.login('agent@thaiinsurance.co.th', 'AgentPass123!');
    await page.waitForURL('**/agent-dashboard', { timeout: 10000 });
    await page.context().storageState({ path: 'auth-states/agent-auth.json' });
    
    await use(context);
    await context.close();
  },

  authenticatedAdminContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'auth-states/admin-auth.json'
    });
    
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    
    await page.goto('/login');
    
    if (await page.url().includes('/admin-dashboard')) {
      await use(context);
      await context.close();
      return;
    }

    // Admin login
    await loginPage.login('admin@thaiinsurance.co.th', 'AdminPass123!');
    await page.waitForURL('**/admin-dashboard', { timeout: 10000 });
    await page.context().storageState({ path: 'auth-states/admin-auth.json' });
    
    await use(context);
    await context.close();
  },

  // Worker-scoped test data cleanup
  testDataCleanup: [async ({ }, use) => {
    // Setup: Create test data directory
    const fs = require('fs');
    const path = require('path');
    
    const authDir = path.join(__dirname, '..', 'auth-states');
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }
    
    await use();
    
    // Cleanup: Remove temporary test data
    // Note: Keep auth states for reuse across tests
    console.log('Worker cleanup completed');
  }, { scope: 'worker' }]
});

/**
 * Test configuration constants
 */
export const TEST_CONFIG = {
  timeouts: {
    short: 5000,
    medium: 10000,
    long: 30000,
    navigation: 60000
  },
  
  urls: {
    base: 'http://localhost:4200',
    api: 'http://localhost:8080/api',
    login: '/login',
    register: '/register',
    dashboard: '/dashboard',
    policies: '/policies',
    claims: '/claims',
    admin: '/admin'
  },
  
  testUsers: {
    customer: {
      email: 'somchai.test@gmail.com',
      password: 'TestPassword123!',
      role: 'CUSTOMER'
    },
    agent: {
      email: 'agent@thaiinsurance.co.th',
      password: 'AgentPass123!',
      role: 'AGENT'
    },
    admin: {
      email: 'admin@thaiinsurance.co.th',
      password: 'AdminPass123!',
      role: 'ADMIN'
    }
  }
};

/**
 * Custom expect matchers for Thai insurance domain
 */
export const customExpect = {
  // Thai currency formatting
  async toBeThaiCurrency(received: string, expected: number) {
    const formatter = new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    });
    const expectedFormatted = formatter.format(expected);
    return received === expectedFormatted;
  },

  // Thai phone number validation
  async toBeValidThaiPhone(received: string) {
    const thaiPhoneRegex = /^(\+66|0)[0-9]{8,9}$/;
    return thaiPhoneRegex.test(received);
  },

  // Thai ID card validation
  async toBeValidThaiId(received: string) {
    const thaiIdRegex = /^[0-9]{13}$/;
    return thaiIdRegex.test(received);
  }
};

export { expect };