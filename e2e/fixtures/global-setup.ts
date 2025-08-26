import { chromium, FullConfig } from '@playwright/test';
import { ApiHelpers } from '../utils/api-helpers';
import { ThaiDataGenerator } from '../utils/thai-data-generator';

/**
 * Global Setup for Thai Auto Insurance E2E Tests
 * 
 * Prepares the testing environment:
 * - Creates test users and data
 * - Sets up authentication states
 * - Initializes database with test data
 * - Configures Thai locale settings
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting Global Setup for Thai Auto Insurance Tests...');
  
  const browser = await chromium.launch();
  const context = await browser.newContext({
    locale: 'th-TH',
    timezoneId: 'Asia/Bangkok'
  });
  const page = await context.newPage();
  
  try {
    // Wait for backend to be ready
    await waitForBackend(page);
    
    // Setup test data
    await setupTestData(page);
    
    // Create authentication states
    await createAuthenticationStates(page);
    
    console.log('✅ Global Setup completed successfully');
    
  } catch (error) {
    console.error('❌ Global Setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function waitForBackend(page: any) {
  console.log('⏳ Waiting for backend to be ready...');
  
  let retries = 30;
  while (retries > 0) {
    try {
      const response = await page.request.get('http://localhost:8080/api/health');
      if (response.status() === 200) {
        console.log('✅ Backend is ready');
        return;
      }
    } catch (error) {
      // Backend not ready, continue waiting
    }
    
    retries--;
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  throw new Error('Backend failed to start within timeout period');
}

async function setupTestData(page: any) {
  console.log('📊 Setting up test data...');
  
  const apiHelpers = new ApiHelpers(page);
  const thaiData = new ThaiDataGenerator();
  
  // Create test customers
  const testCustomers = [
    thaiData.generateCustomer(),
    thaiData.generateCustomer(),
    thaiData.generateCustomer()
  ];
  
  for (const customer of testCustomers) {
    await apiHelpers.createUser(customer, 'TestPassword123!');
  }
  
  // Create test vehicles
  const testVehicles = [
    thaiData.generateVehicle(),
    thaiData.generateVehicle(),
    thaiData.generateVehicle()
  ];
  
  for (const vehicle of testVehicles) {
    await apiHelpers.createVehicle(vehicle);
  }
  
  // Create test policies
  const testPolicies = [
    thaiData.generatePolicy(),
    thaiData.generatePolicy()
  ];
  
  for (const policy of testPolicies) {
    await apiHelpers.createPolicy(policy);
  }
  
  console.log('✅ Test data setup completed');
}

async function createAuthenticationStates(page: any) {
  console.log('🔐 Creating authentication states...');
  
  const fs = require('fs');
  const path = require('path');
  
  // Ensure auth-states directory exists
  const authDir = path.join(__dirname, '..', 'auth-states');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }
  
  // Create customer authentication state
  await page.goto('http://localhost:4200/login');
  await page.fill('[data-testid="email-input"]', 'somchai.test@gmail.com');
  await page.fill('[data-testid="password-input"]', 'TestPassword123!');
  await page.click('[data-testid="login-button"]');
  await page.waitForURL('**/dashboard', { timeout: 10000 });
  await page.context().storageState({ path: path.join(authDir, 'customer-auth.json') });
  
  // Create agent authentication state
  await page.goto('http://localhost:4200/login');
  await page.fill('[data-testid="email-input"]', 'agent@thaiinsurance.co.th');
  await page.fill('[data-testid="password-input"]', 'AgentPass123!');
  await page.click('[data-testid="login-button"]');
  await page.waitForURL('**/agent-dashboard', { timeout: 10000 });
  await page.context().storageState({ path: path.join(authDir, 'agent-auth.json') });
  
  // Create admin authentication state
  await page.goto('http://localhost:4200/login');
  await page.fill('[data-testid="email-input"]', 'admin@thaiinsurance.co.th');
  await page.fill('[data-testid="password-input"]', 'AdminPass123!');
  await page.click('[data-testid="login-button"]');
  await page.waitForURL('**/admin-dashboard', { timeout: 10000 });
  await page.context().storageState({ path: path.join(authDir, 'admin-auth.json') });
  
  console.log('✅ Authentication states created');
}

export default globalSetup;