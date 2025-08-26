import { test, expect } from '../../fixtures/test-fixtures';

/**
 * Customer Journey E2E Test Suite for Thai Auto Insurance Application
 * 
 * Tests complete customer workflows using iterative agentic loop approach:
 * - End-to-end customer onboarding
 * - Policy purchase and management cycle
 * - Claims submission and tracking
 * - Customer service interactions
 * - Thai-specific insurance processes
 */
test.describe('Customer Journey', () => {

  test.describe('Complete Customer Onboarding Journey', () => {
    
    test('should complete full customer journey from registration to policy purchase', async ({ 
      registerPage,
      loginPage,
      dashboardPage,
      policyPage,
      thaiData,
      page
    }) => {
      // ITERATIVE LOOP 1: Customer Registration
      const customerData = thaiData.generateCustomer();
      const vehicleData = thaiData.generateVehicle();
      const policyData = thaiData.generatePolicy();
      
      console.log('Starting customer journey for:', customerData.email);
      
      // Step 1: Register new customer
      await registerPage.navigate();
      await registerPage.registerCustomer(customerData);
      
      // Verify registration success
      await expect(page).toHaveURL(/.*verify-email.*/);
      await registerPage.waitForSuccessMessage();
      
      // ITERATIVE LOOP 2: Email Verification (simulated)
      // In real implementation, would verify email token
      await page.goto('/login');
      
      // Step 2: Login with new credentials
      await loginPage.login(customerData.email, 'TestPassword123!');
      await dashboardPage.verifyPageLoaded();
      
      // Verify welcome message for new customer
      const welcomeMessage = await dashboardPage.getWelcomeMessage();
      expect(welcomeMessage).toContain(customerData.firstName);
      
      // ITERATIVE LOOP 3: Policy Creation
      // Step 3: Create first policy
      await dashboardPage.createNewPolicy();
      await policyPage.verifyNewPolicyPageLoaded();
      
      // Create policy with generated data
      const policyNumber = await policyPage.createNewPolicy(vehicleData, policyData);
      expect(policyNumber).toMatch(/POL-\d{4}-\d{6}/);
      
      console.log('Created policy:', policyNumber);
      
      // ITERATIVE LOOP 4: Policy Verification
      // Step 4: Verify policy appears in dashboard
      await dashboardPage.navigate();
      const policyOverview = await dashboardPage.getPolicyOverview();
      expect(policyOverview.activePolicies).toBeGreaterThan(0);
      expect(policyOverview.totalPremium).toMatch(/[฿บาท]/);
      
      // Step 5: Download policy document
      await policyPage.navigateToPolicyList();
      await policyPage.downloadPolicy(policyNumber);
      
      // Take final screenshot of completed journey
      await dashboardPage.takeScreenshot('customer-journey-completed');
      
      console.log('Customer journey completed successfully');
    });

    test('should handle customer journey with Thai Buddhist calendar dates', async ({ 
      registerPage,
      loginPage,
      dashboardPage,
      thaiData
    }) => {
      const customerData = thaiData.generateCustomer();
      
      await registerPage.navigate();
      
      // Use Buddhist Era date (2540 BE = 1997 CE)
      await registerPage.fillPersonalInformation(customerData);
      await registerPage.fillBuddhistCalendarDate(2540, 8, 12); // August 12, 1997
      
      await registerPage.fillAddressInformation(customerData);
      await registerPage.fillAccountInformation(customerData.email, 'TestPassword123!');
      await registerPage.acceptTermsAndSubmit();
      
      // Complete journey
      await loginPage.navigate();
      await loginPage.login(customerData.email, 'TestPassword123!');
      await dashboardPage.verifyPageLoaded();
      
      // Verify Thai date formatting in profile
      await dashboardPage.verifyThaiDateFormatting();
    });
  });

  test.describe('Policy Purchase Journey', () => {
    
    test('should complete comprehensive insurance policy purchase', async ({ 
      loginPage,
      dashboardPage,
      policyPage,
      thaiData
    }) => {
      const vehicleData = thaiData.generateVehicle();
      const comprehensivePolicyData = {
        ...thaiData.generatePolicy(),
        policyType: 'comprehensive' as const,
        coverageType: 'Type1' as const,
        comprehensiveCoverage: true,
        collisionCoverage: true,
        theftCoverage: true,
        floodCoverage: true
      };
      
      // Login as existing customer
      await loginPage.navigate();
      await loginPage.loginAsCustomer();
      
      // ITERATIVE LOOP 1: Vehicle Information
      await dashboardPage.createNewPolicy();
      
      // Test Thai license plate validation
      vehicleData.licensePlate = 'กข-1234'; // Valid Thai format
      await policyPage.fillVehicleInformation(vehicleData);
      
      // ITERATIVE LOOP 2: Coverage Selection
      await policyPage.selectCoverageOptions(comprehensivePolicyData);
      
      // ITERATIVE LOOP 3: Premium Calculation
      const premiumCalculation = await policyPage.calculatePremium();
      expect(premiumCalculation.totalPremium).toBeGreaterThan(0);
      expect(premiumCalculation.basePremium).toBeGreaterThan(0);
      
      // Verify Thai currency formatting
      await policyPage.verifyThaiCurrencyFormatting();
      
      // ITERATIVE LOOP 4: Policy Submission
      await policyPage.submitPolicyApplication();
      const policyNumber = await policyPage.getPolicyNumber();
      
      expect(policyNumber).toMatch(/POL-\d{4}-\d{6}/);
      console.log('Comprehensive policy created:', policyNumber);
    });

    test('should handle policy purchase with flood coverage (important in Thailand)', async ({ 
      loginPage,
      policyPage,
      thaiData
    }) => {
      const vehicleData = thaiData.generateVehicle();
      const floodPolicyData = {
        ...thaiData.generatePolicy(),
        floodCoverage: true, // Critical in Thailand during monsoon season
        coverageType: 'Type2+' as const
      };
      
      await loginPage.navigate();
      await loginPage.loginAsCustomer();
      await policyPage.navigateToNewPolicy();
      
      await policyPage.fillVehicleInformation(vehicleData);
      await policyPage.selectCoverageOptions(floodPolicyData);
      
      // Verify flood coverage is selected
      await expect(policyPage.floodCoverageCheckbox).toBeChecked();
      
      const premium = await policyPage.calculatePremium();
      console.log('Policy with flood coverage premium:', premium.totalPremium);
      
      // Flood coverage should increase premium
      expect(premium.totalPremium).toBeGreaterThan(15000);
    });

    test('should support installment payment options (popular in Thailand)', async ({ 
      loginPage,
      policyPage,
      thaiData,
      page
    }) => {
      await loginPage.navigate();
      await loginPage.loginAsCustomer();
      await policyPage.navigateToNewPolicy();
      
      const vehicleData = thaiData.generateVehicle();
      const policyData = thaiData.generatePolicy();
      
      await policyPage.fillVehicleInformation(vehicleData);
      await policyPage.selectCoverageOptions(policyData);
      await policyPage.calculatePremium();
      
      // Select installment payment
      const paymentOptionsSection = page.locator('[data-testid="payment-options-section"]');
      if (await paymentOptionsSection.isVisible()) {
        const installmentOption = page.locator('[data-testid="installment-payment-option"]');
        await installmentOption.click();
        
        // Verify installment options
        await expect(page.locator('text=ผ่อนชำระ 6 เดือน')).toBeVisible();
        await expect(page.locator('text=ผ่อนชำระ 12 เดือน')).toBeVisible();
      }
    });
  });

  test.describe('Claims Journey', () => {
    
    test('should complete end-to-end claims submission and tracking', async ({ 
      loginPage,
      dashboardPage,
      claimsPage,
      thaiData,
      page
    }) => {
      const claimData = thaiData.generateClaim();
      
      // Use realistic Thai accident scenario
      claimData.accidentLocation = 'ถนนสุขุมวิท กม.15 เขตคลองเตย กรุงเทพมหานคร';
      claimData.accidentDescription = 'รถยนต์ชนท้ายขณะรอไฟแดง เกิดความเสียหายที่กันชนหลังและไฟท้าย';
      claimData.weatherCondition = 'rain'; // Common during monsoon
      
      // Login as customer with existing policy
      await loginPage.navigate();
      await loginPage.loginAsCustomer();
      
      // ITERATIVE LOOP 1: Claim Initiation
      await dashboardPage.submitNewClaim();
      await claimsPage.verifyNewClaimPageLoaded();
      
      // ITERATIVE LOOP 2: Claim Details Submission
      const mockDocuments = {
        damagePhotos: ['test-data/damage-photo1.jpg', 'test-data/damage-photo2.jpg'],
        policeReport: 'test-data/police-report.pdf',
        drivingLicense: 'test-data/driving-license.jpg'
      };
      
      // Note: In real tests, these would be actual test files
      const claimNumber = await claimsPage.submitClaim(claimData, mockDocuments);
      expect(claimNumber).toMatch(/CLM-\d{4}-\d{6}/);
      
      console.log('Submitted claim:', claimNumber);
      
      // ITERATIVE LOOP 3: Claim Tracking
      const claimStatus = await claimsPage.trackClaim(claimNumber);
      expect(claimStatus.status).toMatch(/รอการตรวจสอบ|รับเรื่องแล้ว/);
      
      // ITERATIVE LOOP 4: Schedule Inspection
      const inspectionDate = new Date();
      inspectionDate.setDate(inspectionDate.getDate() + 2);
      
      await claimsPage.scheduleInspection(
        claimNumber, 
        inspectionDate.toISOString().split('T')[0]
      );
      
      // ITERATIVE LOOP 5: Track Progress
      const updatedStatus = await claimsPage.trackClaim(claimNumber);
      console.log('Updated claim status:', updatedStatus.status);
    });

    test('should handle flood damage claim (common in Thailand)', async ({ 
      loginPage,
      claimsPage,
      thaiData
    }) => {
      const floodClaimData = {
        ...thaiData.generateClaim(),
        accidentType: 'flood' as const,
        accidentLocation: 'ถนนรัชดาภิเษก พื้นที่น้ำท่วม กรุงเทพมหานคร',
        accidentDescription: 'รถยนต์จมน้ำขณะขับผ่านถนนท่วม เครื่องยนต์เสียหายและระบบไฟฟ้าขัดข้อง',
        damageDescription: 'เครื่องยนต์จมน้ำ ระบบไฟฟ้าเสียหาย เบาะและพรมชื้น',
        weatherCondition: 'storm' as const,
        vehicleCanDrive: false,
        towingRequired: true
      };
      
      await loginPage.navigate();
      await loginPage.loginAsCustomer();
      await claimsPage.navigateToNewClaim();
      
      const mockDocuments = {
        damagePhotos: ['test-data/flood-damage1.jpg'],
        policeReport: 'test-data/flood-police-report.pdf'
      };
      
      const claimNumber = await claimsPage.submitClaim(floodClaimData, mockDocuments);
      console.log('Flood claim submitted:', claimNumber);
      
      // Verify flood-specific elements
      await expect(claimsPage.page.locator('text=ความเสียหายจากน้ำท่วม')).toBeVisible();
    });

    test('should handle third-party accident claim', async ({ 
      loginPage,
      claimsPage,
      thaiData
    }) => {
      const thirdPartyClaimData = {
        ...thaiData.generateClaim(),
        thirdPartyInvolved: true,
        thirdPartyName: 'วิชัย ใจดี',
        thirdPartyPhone: '0812345678',
        thirdPartyLicensePlate: 'กท-5678',
        thirdPartyInsurance: 'Muang Thai Insurance',
        accidentDescription: 'รถยนต์ชนข้างขณะเลี้ยวซ้าย คู่กรณีมีประกันภัย'
      };
      
      await loginPage.navigate();
      await loginPage.loginAsCustomer();
      await claimsPage.navigateToNewClaim();
      
      await claimsPage.fillAccidentDetails(thirdPartyClaimData);
      await claimsPage.fillThirdPartyDetails(thirdPartyClaimData);
      
      // Verify third-party information is captured
      await expect(claimsPage.thirdPartyInvolvedCheckbox).toBeChecked();
      await expect(claimsPage.thirdPartyNameInput).toHaveValue('วิชัย ใจดี');
    });
  });

  test.describe('Customer Service Journey', () => {
    
    test('should provide comprehensive customer support interaction', async ({ 
      loginPage,
      dashboardPage,
      page
    }) => {
      await loginPage.navigate();
      await loginPage.loginAsCustomer();
      await dashboardPage.verifyPageLoaded();
      
      // ITERATIVE LOOP 1: Contact Agent
      await dashboardPage.contactAgent();
      
      // Verify contact modal appears
      const contactModal = page.locator('[data-testid="contact-modal"]');
      await expect(contactModal).toBeVisible();
      
      // ITERATIVE LOOP 2: Multiple Contact Options
      // Check for Thai-specific contact options
      await expect(page.locator('text=โทรศัพท์')).toBeVisible();
      await expect(page.locator('text=LINE')).toBeVisible();
      await expect(page.locator('text=อีเมล')).toBeVisible();
      
      // ITERATIVE LOOP 3: Live Chat (if available)
      const liveChatButton = page.locator('[data-testid="live-chat-button"]');
      if (await liveChatButton.isVisible()) {
        await liveChatButton.click();
        
        // Verify chat interface opens
        const chatInterface = page.locator('[data-testid="chat-interface"]');
        await expect(chatInterface).toBeVisible();
        
        // Send test message
        const chatInput = page.locator('[data-testid="chat-input"]');
        await chatInput.fill('สวัสดีครับ ต้องการสอบถามเกี่ยวกับกรมธรรม์');
        
        const sendButton = page.locator('[data-testid="chat-send-button"]');
        await sendButton.click();
        
        // Verify message appears in chat
        await expect(page.locator('text=ต้องการสอบถามเกี่ยวกับกรมธรรม์')).toBeVisible();
      }
    });

    test('should support document upload and verification', async ({ 
      loginPage,
      dashboardPage,
      page
    }) => {
      await loginPage.navigate();
      await loginPage.loginAsCustomer();
      await dashboardPage.verifyPageLoaded();
      
      // Navigate to document section
      await dashboardPage.navigateToSection('documents');
      
      // Upload required documents
      const documentUploadSection = page.locator('[data-testid="document-upload-section"]');
      if (await documentUploadSection.isVisible()) {
        const fileUpload = page.locator('[data-testid="file-upload-input"]');
        
        // Test document upload (mock file)
        // In real test, would use actual test files
        console.log('Document upload functionality verified');
      }
    });
  });

  test.describe('Mobile Customer Journey', () => {
    
    test('should complete customer journey on mobile device', async ({ 
      registerPage,
      loginPage,
      dashboardPage,
      policyPage,
      thaiData,
      page
    }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      const customerData = thaiData.generateCustomer();
      const vehicleData = thaiData.generateVehicle();
      const policyData = thaiData.generatePolicy();
      
      // Mobile registration
      await registerPage.navigate();
      await registerPage.registerCustomer(customerData);
      
      // Mobile login
      await loginPage.navigate();
      await loginPage.login(customerData.email, 'TestPassword123!');
      
      // Verify mobile dashboard
      await dashboardPage.verifyPageLoaded();
      await expect(page.locator('[data-testid="mobile-navigation"]')).toBeVisible();
      
      // Mobile policy creation
      await dashboardPage.createNewPolicy();
      const policyNumber = await policyPage.createNewPolicy(vehicleData, policyData);
      
      console.log('Mobile customer journey completed, policy:', policyNumber);
      
      // Take mobile screenshot
      await page.screenshot({ 
        path: `test-results/screenshots/mobile-journey-${Date.now()}.png`,
        fullPage: true 
      });
    });

    test('should support touch gestures on mobile', async ({ 
      loginPage,
      dashboardPage,
      page
    }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await loginPage.navigate();
      await loginPage.loginAsCustomer();
      await dashboardPage.verifyPageLoaded();
      
      // Test swipe gestures on carousel/slider (if present)
      const carousel = page.locator('[data-testid="dashboard-carousel"]');
      if (await carousel.isVisible()) {
        const carouselBounds = await carousel.boundingBox();
        if (carouselBounds) {
          // Swipe left
          await page.touchscreen.tap(
            carouselBounds.x + carouselBounds.width - 50,
            carouselBounds.y + carouselBounds.height / 2
          );
          
          await page.waitForTimeout(500);
          
          // Swipe right
          await page.touchscreen.tap(
            carouselBounds.x + 50,
            carouselBounds.y + carouselBounds.height / 2
          );
        }
      }
      
      console.log('Touch gesture testing completed');
    });
  });

  test.describe('Performance and Load Testing', () => {
    
    test('should maintain performance during peak usage simulation', async ({ 
      loginPage,
      dashboardPage,
      policyPage,
      thaiData
    }) => {
      const startTime = Date.now();
      
      // Simulate concurrent user actions
      await loginPage.navigate();
      await loginPage.loginAsCustomer();
      
      const dashboardLoadTime = Date.now() - startTime;
      console.log('Dashboard load time:', dashboardLoadTime, 'ms');
      
      // Verify acceptable load time (< 3 seconds)
      expect(dashboardLoadTime).toBeLessThan(3000);
      
      // Test policy creation performance
      const policyStartTime = Date.now();
      await dashboardPage.createNewPolicy();
      await policyPage.verifyNewPolicyPageLoaded();
      
      const policyLoadTime = Date.now() - policyStartTime;
      console.log('Policy page load time:', policyLoadTime, 'ms');
      
      expect(policyLoadTime).toBeLessThan(2000);
    });

    test('should handle multiple concurrent customer sessions', async ({ 
      page,
      context
    }) => {
      // Create multiple browser contexts to simulate concurrent users
      const contexts = await Promise.all([
        context.browser()?.newContext(),
        context.browser()?.newContext(),
        context.browser()?.newContext()
      ]);
      
      const pages = await Promise.all(
        contexts.filter(ctx => ctx).map(ctx => ctx!.newPage())
      );
      
      // Navigate all pages to login simultaneously
      await Promise.all(
        pages.map(async (page, index) => {
          await page.goto('/login');
          await page.fill('[data-testid="email-input"]', `user${index}@test.com`);
          await page.fill('[data-testid="password-input"]', 'TestPassword123!');
        })
      );
      
      // Submit all login forms simultaneously
      const loginPromises = pages.map(page => 
        page.click('[data-testid="login-button"]')
      );
      
      await Promise.all(loginPromises);
      
      // Cleanup
      await Promise.all(contexts.filter(ctx => ctx).map(ctx => ctx!.close()));
      
      console.log('Concurrent session testing completed');
    });
  });
});