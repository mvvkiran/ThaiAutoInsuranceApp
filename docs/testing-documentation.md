# Testing Documentation - Thai Auto Insurance Application

## Table of Contents
1. [Testing Overview](#testing-overview)
2. [Testing Strategy](#testing-strategy)
3. [Test Environment Setup](#test-environment-setup)
4. [Test Types and Coverage](#test-types-and-coverage)
5. [Test Cases](#test-cases)
6. [Test Execution Guide](#test-execution-guide)
7. [Test Automation](#test-automation)
8. [Test Reports](#test-reports)
9. [Bug Reporting](#bug-reporting)
10. [Testing Best Practices](#testing-best-practices)

---

## Testing Overview

This document provides comprehensive testing guidelines, procedures, and documentation for the Thai Auto Insurance Application. It covers all aspects of testing including unit tests, integration tests, API tests, and end-to-end tests.

### Testing Objectives
- Ensure application functionality meets requirements
- Validate system reliability and performance
- Identify and document defects
- Verify security and data integrity
- Ensure cross-browser and responsive design compatibility
- Validate Thai and English language support

### Testing Scope
- **In Scope**: All customer, agent, and admin functionalities
- **Out of Scope**: Third-party payment gateway internal operations
- **Browsers**: Chrome, Firefox, Safari, Edge
- **Devices**: Desktop, Tablet, Mobile
- **Languages**: Thai, English

---

## Testing Strategy

### Testing Levels

#### 1. Unit Testing
- **Frontend**: Component-level testing with Karma/Jasmine
- **Backend**: Service and repository testing with JUnit
- **Coverage Target**: Minimum 80%

#### 2. Integration Testing
- API endpoint testing
- Database integration validation
- Service layer integration

#### 3. System Testing
- End-to-end user workflows
- Cross-functional scenarios
- Performance testing

#### 4. Acceptance Testing
- User acceptance criteria validation
- Business requirement verification
- Regulatory compliance checks

### Testing Approach
```
Development → Unit Tests → Integration Tests → System Tests → UAT → Production
     ↑             ↓              ↓                ↓            ↓
     ←─────── Defect Feedback Loop ────────────────────────────↓
```

---

## Test Environment Setup

### Frontend Testing Environment

```bash
# Install dependencies
cd frontend
npm install

# Install testing libraries
npm install --save-dev @angular/cli karma karma-chrome-launcher
npm install --save-dev karma-jasmine jasmine-core
npm install --save-dev @types/jasmine
```

### Backend Testing Environment

```bash
# Install dependencies
cd backend
mvn clean install

# Test dependencies in pom.xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <scope>test</scope>
</dependency>
```

### E2E Testing Environment

```bash
# Install Playwright
npm install --save-dev @playwright/test
npx playwright install

# Configuration file: playwright.config.ts
```

### Test Data Setup

```sql
-- Test Users
INSERT INTO users (email, password, role) VALUES
('test.customer@test.com', 'Test@123', 'CUSTOMER'),
('test.agent@test.com', 'Test@123', 'AGENT'),
('test.admin@test.com', 'Test@123', 'ADMIN');

-- Test Vehicles
INSERT INTO vehicles (make, model, year, registration) VALUES
('Toyota', 'Camry', 2022, 'กข-1234'),
('Honda', 'Civic', 2021, 'คง-5678');
```

---

## Test Types and Coverage

### Unit Test Coverage

| Module | Component/Service | Coverage | Test Files |
|--------|------------------|----------|------------|
| Frontend | LoginComponent | 95% | login.component.spec.ts |
| Frontend | PolicyService | 90% | policy.service.spec.ts |
| Frontend | ClaimComponent | 88% | claim.component.spec.ts |
| Backend | PolicyService | 92% | PolicyServiceTest.java |
| Backend | ClaimController | 85% | ClaimControllerTest.java |
| Backend | UserRepository | 90% | UserRepositoryTest.java |

### Integration Test Coverage

| API Endpoint | Test Coverage | Test File |
|--------------|---------------|-----------|
| /api/auth/* | 100% | AuthenticationIT.java |
| /api/policies/* | 95% | PolicyIntegrationTest.java |
| /api/claims/* | 90% | ClaimIntegrationTest.java |
| /api/customers/* | 88% | CustomerIntegrationTest.java |

### E2E Test Coverage

| User Flow | Coverage | Test File |
|-----------|----------|-----------|
| Customer Registration | ✅ | registration.spec.ts |
| Policy Purchase | ✅ | policy-purchase.spec.ts |
| Claim Submission | ✅ | claim-submission.spec.ts |
| Agent Workflow | ✅ | agent-workflow.spec.ts |
| Admin Operations | ✅ | admin-operations.spec.ts |

---

## Test Cases

### Authentication Test Cases

#### TC001: User Login - Valid Credentials
```yaml
Test Case ID: TC001
Title: User Login with Valid Credentials
Priority: High
Preconditions: User account exists in system
Test Steps:
  1. Navigate to login page
  2. Enter valid email: customer@insurance.com
  3. Enter valid password: Customer@123
  4. Click Login button
Expected Result: User successfully logged in and redirected to dashboard
Actual Result: [To be filled during execution]
Status: [Pass/Fail]
```

#### TC002: User Login - Invalid Credentials
```yaml
Test Case ID: TC002
Title: User Login with Invalid Credentials
Priority: High
Preconditions: None
Test Steps:
  1. Navigate to login page
  2. Enter invalid email: wrong@email.com
  3. Enter invalid password: WrongPass
  4. Click Login button
Expected Result: Error message "Invalid credentials" displayed
Actual Result: [To be filled during execution]
Status: [Pass/Fail]
```

### Policy Management Test Cases

#### TC010: Create New Policy
```yaml
Test Case ID: TC010
Title: Create New Auto Insurance Policy
Priority: High
Preconditions: User logged in as customer
Test Steps:
  1. Click "Get Quote" button
  2. Fill vehicle details:
     - Make: Toyota
     - Model: Camry
     - Year: 2022
     - Registration: กข-1234
  3. Select coverage type: Comprehensive
  4. Enter driver details
  5. Review quote
  6. Click "Purchase Policy"
  7. Complete payment
Expected Result: Policy created successfully with policy number displayed
Actual Result: [To be filled during execution]
Status: [Pass/Fail]
```

#### TC011: View Policy Details
```yaml
Test Case ID: TC011
Title: View Existing Policy Details
Priority: Medium
Preconditions: User has at least one active policy
Test Steps:
  1. Navigate to "My Policies"
  2. Click on policy number
  3. Verify policy details displayed
Expected Result: All policy details correctly displayed
Actual Result: [To be filled during execution]
Status: [Pass/Fail]
```

### Claims Test Cases

#### TC020: Submit New Claim
```yaml
Test Case ID: TC020
Title: Submit Auto Insurance Claim
Priority: High
Preconditions: User has active policy
Test Steps:
  1. Navigate to "File Claim"
  2. Select policy number
  3. Enter incident details:
     - Date: [Current Date]
     - Location: Bangkok
     - Description: Minor accident
  4. Upload photos (3 images)
  5. Submit claim
Expected Result: Claim submitted successfully, claim number generated
Actual Result: [To be filled during execution]
Status: [Pass/Fail]
```

#### TC021: Track Claim Status
```yaml
Test Case ID: TC021
Title: Track Existing Claim Status
Priority: Medium
Preconditions: User has submitted claim
Test Steps:
  1. Navigate to "My Claims"
  2. Enter claim number
  3. Click "Track Status"
Expected Result: Current claim status and timeline displayed
Actual Result: [To be filled during execution]
Status: [Pass/Fail]
```

### Agent Workflow Test Cases

#### TC030: Agent Process Claim
```yaml
Test Case ID: TC030
Title: Agent Reviews and Processes Claim
Priority: High
Preconditions: Logged in as agent, pending claims exist
Test Steps:
  1. Navigate to "Pending Claims"
  2. Select a claim
  3. Review claim details
  4. Add assessment notes
  5. Update status to "Approved"
  6. Enter approved amount
  7. Submit decision
Expected Result: Claim processed, customer notified
Actual Result: [To be filled during execution]
Status: [Pass/Fail]
```

### Language Testing

#### TC040: Language Switch - Thai to English
```yaml
Test Case ID: TC040
Title: Switch Language from Thai to English
Priority: Medium
Preconditions: Application in Thai language
Test Steps:
  1. Click language selector
  2. Select "English"
  3. Verify all UI elements translated
  4. Check date/currency formats
Expected Result: All text displayed in English, formats updated
Actual Result: [To be filled during execution]
Status: [Pass/Fail]
```

---

## Test Execution Guide

### Manual Test Execution

#### 1. Smoke Testing Checklist
- [ ] Application loads successfully
- [ ] Login functionality works
- [ ] Main navigation accessible
- [ ] Database connection active
- [ ] API endpoints responding

#### 2. Regression Testing
```bash
# Run regression test suite
npm run test:regression

# Execute specific test set
npm run test:policies
npm run test:claims
npm run test:auth
```

#### 3. Cross-Browser Testing

| Browser | Version | Windows | Mac | Linux | Mobile |
|---------|---------|---------|-----|-------|--------|
| Chrome | Latest | ✅ | ✅ | ✅ | ✅ |
| Firefox | Latest | ✅ | ✅ | ✅ | N/A |
| Safari | Latest | N/A | ✅ | N/A | ✅ |
| Edge | Latest | ✅ | ✅ | N/A | N/A |

### Automated Test Execution

#### Frontend Unit Tests
```bash
# Run all unit tests
cd frontend
ng test

# Run with coverage
ng test --code-coverage

# Run specific test file
ng test --include='**/policy.service.spec.ts'

# Run in headless mode
ng test --browsers=ChromeHeadless --watch=false
```

#### Backend Unit Tests
```bash
# Run all tests
cd backend
mvn test

# Run specific test class
mvn test -Dtest=PolicyServiceTest

# Run with coverage
mvn test jacoco:report

# Skip tests during build
mvn clean install -DskipTests
```

#### E2E Tests with Playwright
```bash
# Run all E2E tests
npx playwright test

# Run specific test file
npx playwright test tests/e2e/policy-purchase.spec.ts

# Run in headed mode
npx playwright test --headed

# Run with specific browser
npx playwright test --browser=firefox

# Generate HTML report
npx playwright show-report
```

#### API Tests
```bash
# Run Postman collection
newman run thai-insurance-api.postman_collection.json

# Run with environment variables
newman run collection.json -e thai-env.json

# Generate HTML report
newman run collection.json -r html
```

---

## Test Automation

### Continuous Integration Pipeline

```yaml
name: Test Pipeline
on: [push, pull_request]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: cd frontend && npm install
      - name: Run unit tests
        run: cd frontend && npm test -- --watch=false --browsers=ChromeHeadless
      - name: Generate coverage report
        run: cd frontend && npm run test:coverage

  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up JDK 21
        uses: actions/setup-java@v2
        with:
          java-version: '21'
      - name: Run tests
        run: cd backend && mvn test
      - name: Generate coverage report
        run: cd backend && mvn jacoco:report

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install Playwright
        run: npx playwright install
      - name: Run E2E tests
        run: npx playwright test
      - name: Upload test results
        uses: actions/upload-artifact@v2
        with:
          name: playwright-report
          path: playwright-report/
```

### Test Automation Framework

```typescript
// Page Object Model Example
export class PolicyPage {
  constructor(private page: Page) {}

  async navigateTo() {
    await this.page.goto('/policies');
  }

  async createPolicy(vehicleData: VehicleData) {
    await this.page.fill('#make', vehicleData.make);
    await this.page.fill('#model', vehicleData.model);
    await this.page.fill('#year', vehicleData.year);
    await this.page.click('#submit-button');
  }

  async getPolicyNumber(): Promise<string> {
    return await this.page.textContent('.policy-number');
  }
}

// Test using Page Object
test('Create new policy', async ({ page }) => {
  const policyPage = new PolicyPage(page);
  await policyPage.navigateTo();
  await policyPage.createPolicy({
    make: 'Toyota',
    model: 'Camry',
    year: '2022'
  });
  const policyNumber = await policyPage.getPolicyNumber();
  expect(policyNumber).toMatch(/^POL-\d{10}$/);
});
```

---

## Test Reports

### Test Execution Report Template

```markdown
# Test Execution Report
**Date**: [Execution Date]
**Version**: 1.0.0
**Environment**: Staging

## Summary
- Total Test Cases: 150
- Executed: 145
- Passed: 138
- Failed: 7
- Blocked: 5
- Pass Rate: 95.2%

## Test Coverage
| Module | Planned | Executed | Passed | Failed | Coverage |
|--------|---------|----------|--------|--------|----------|
| Authentication | 20 | 20 | 19 | 1 | 100% |
| Policy Management | 35 | 35 | 33 | 2 | 100% |
| Claims | 30 | 28 | 27 | 1 | 93.3% |
| Reports | 25 | 25 | 24 | 1 | 100% |
| Admin | 20 | 18 | 16 | 2 | 90% |
| Integration | 20 | 19 | 19 | 0 | 95% |

## Failed Test Cases
1. TC002 - Login with special characters in password
2. TC015 - Policy renewal with expired payment method
3. TC023 - Claim submission with files > 10MB
4. TC031 - Agent commission calculation for partial refunds
5. TC045 - Report generation for date range > 1 year
6. TC048 - Admin user deletion with active policies
7. TC050 - Concurrent policy updates

## Defects Summary
- Critical: 1
- High: 2
- Medium: 3
- Low: 1

## Recommendations
1. Fix critical defects before release
2. Increase timeout for file uploads
3. Add validation for special characters
4. Review commission calculation logic
```

### Coverage Report

```bash
# Frontend Coverage Report
==============================
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
All files           |   85.32 |    78.45 |   82.10 |   84.88 |
 components         |   88.50 |    81.20 |   85.30 |   87.90 |
  login.component   |   95.00 |    90.00 |   92.00 |   94.50 |
  policy.component  |   87.20 |    79.50 |   84.00 |   86.30 |
  claim.component   |   85.30 |    77.00 |   82.50 |   84.70 |
 services           |   83.70 |    76.30 |   80.20 |   82.90 |
  auth.service      |   90.50 |    85.00 |   88.00 |   89.70 |
  policy.service    |   82.30 |    74.50 |   78.90 |   81.20 |
  claim.service     |   79.80 |    71.20 |   76.50 |   78.90 |

# Backend Coverage Report
==============================
Package             | Class % | Method % | Line % |
--------------------|---------|----------|--------|
com.insurance       |   82.5  |   79.3   |  81.7  |
..controller        |   85.0  |   82.5   |  84.2  |
..service           |   88.3  |   85.7   |  87.1  |
..repository        |   78.5  |   75.0   |  77.3  |
..security          |   80.0  |   77.8   |  79.5  |
```

---

## Bug Reporting

### Bug Report Template

```markdown
# Bug Report

**Bug ID**: BUG-[Number]
**Date**: [Date]
**Reporter**: [Name]
**Severity**: [Critical/High/Medium/Low]
**Priority**: [P1/P2/P3/P4]

## Summary
[One line description of the bug]

## Environment
- Browser: [Chrome 118]
- OS: [Windows 11]
- Environment: [Staging]
- User Role: [Customer/Agent/Admin]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Expected Result
[What should happen]

## Actual Result
[What actually happened]

## Screenshots/Videos
[Attach evidence]

## Additional Information
- Console errors: [Any JavaScript errors]
- Network errors: [Failed API calls]
- Related test case: [TC Number]

## Workaround
[If any temporary solution exists]
```

### Defect Tracking

| Bug ID | Summary | Severity | Status | Assigned To | Fixed In |
|--------|---------|----------|--------|-------------|----------|
| BUG-001 | Login fails with Thai characters | High | Fixed | Dev Team | v1.0.1 |
| BUG-002 | Policy PDF not generating | Critical | In Progress | Backend Team | - |
| BUG-003 | Claim photos not uploading | Medium | Open | Frontend Team | - |
| BUG-004 | Report dates incorrect | Low | Fixed | Backend Team | v1.0.1 |

---

## Testing Best Practices

### 1. Test Planning
- Review requirements thoroughly before testing
- Create test cases for both positive and negative scenarios
- Prioritize test cases based on risk and importance
- Plan for edge cases and boundary conditions

### 2. Test Data Management
```javascript
// Use test data factories
const testDataFactory = {
  createCustomer: (overrides = {}) => ({
    email: 'test@example.com',
    password: 'Test@123',
    firstName: 'Test',
    lastName: 'User',
    phone: '0812345678',
    ...overrides
  }),
  
  createPolicy: (overrides = {}) => ({
    type: 'COMPREHENSIVE',
    vehicleMake: 'Toyota',
    vehicleModel: 'Camry',
    vehicleYear: 2022,
    ...overrides
  })
};
```

### 3. Test Isolation
- Each test should be independent
- Clean up test data after execution
- Use mocks for external dependencies
- Reset application state between tests

### 4. Test Documentation
- Document test assumptions and limitations
- Keep test cases updated with requirement changes
- Maintain traceability matrix
- Archive test results for compliance

### 5. Performance Testing Guidelines
```javascript
// Performance benchmarks
const performanceBenchmarks = {
  pageLoad: 2000, // ms
  apiResponse: 500, // ms
  searchResults: 1000, // ms
  reportGeneration: 5000, // ms
};

// Performance test example
test('Policy search performance', async () => {
  const startTime = Date.now();
  await searchPolicies('Toyota');
  const endTime = Date.now();
  const responseTime = endTime - startTime;
  
  expect(responseTime).toBeLessThan(performanceBenchmarks.searchResults);
});
```

### 6. Security Testing Checklist
- [ ] SQL injection prevention
- [ ] XSS attack prevention
- [ ] CSRF token validation
- [ ] Authentication bypass attempts
- [ ] Authorization level checks
- [ ] Session timeout validation
- [ ] Password strength enforcement
- [ ] Sensitive data encryption
- [ ] API rate limiting
- [ ] Input validation

### 7. Accessibility Testing
- [ ] Screen reader compatibility
- [ ] Keyboard navigation
- [ ] Color contrast compliance (WCAG 2.1)
- [ ] Alt text for images
- [ ] ARIA labels
- [ ] Focus indicators
- [ ] Error message clarity

### 8. Localization Testing
- [ ] Thai language display
- [ ] English language display
- [ ] Date format (DD/MM/YYYY for Thai)
- [ ] Currency format (฿ symbol)
- [ระบบ Phone number format (+66)
- [ ] Address format compliance
- [ ] Thai calendar support

### 9. Mobile Testing Considerations
```javascript
// Responsive breakpoints to test
const breakpoints = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
  wide: 1440
};

// Device-specific test
test('Mobile navigation menu', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  await page.click('.mobile-menu-toggle');
  await expect(page.locator('.mobile-menu')).toBeVisible();
});
```

### 10. Test Maintenance
- Review and update test cases quarterly
- Remove obsolete tests
- Refactor duplicate test code
- Update test documentation
- Archive old test results

---

## Appendix

### A. Test Environment URLs
- **Development**: http://localhost:4200
- **Staging**: https://staging.thaiinsurance.com
- **UAT**: https://uat.thaiinsurance.com
- **Production**: https://www.thaiinsurance.com

### B. Test Accounts
```json
{
  "customer": {
    "email": "test.customer@test.com",
    "password": "Test@123"
  },
  "agent": {
    "email": "test.agent@test.com",
    "password": "Test@123"
  },
  "admin": {
    "email": "test.admin@test.com",
    "password": "Test@123"
  }
}
```

### C. Useful Commands
```bash
# Generate test data
npm run generate:test-data

# Reset test database
npm run reset:test-db

# Run specific test suite
npm run test:suite -- --suite=policies

# Generate test report
npm run test:report

# Check test coverage
npm run coverage:check
```

### D. Contact Information
- **QA Lead**: qa.lead@thaiinsurance.com
- **Test Automation**: test.automation@thaiinsurance.com
- **Bug Reports**: bugs@thaiinsurance.com
- **Test Environment Issues**: devops@thaiinsurance.com

---

**Document Version**: 1.0.0  
**Last Updated**: August 2024  
**Author**: QA Team  
**Review**: Test Manager  
**Approval**: Project Manager

---

*This document is maintained by the QA team and should be updated with each release cycle.*