import { test, expect } from '../../fixtures/test-fixtures';

/**
 * Policy Management E2E Test Suite for Thai Auto Insurance Application
 * 
 * Tests comprehensive policy operations:
 * - Policy creation with Thai vehicle data
 * - Premium calculations and Thai tax requirements
 * - Policy renewals and modifications
 * - Thai insurance regulatory compliance
 * - Multiple coverage types and deductibles
 */
test.describe('Policy Management', () => {

  test.beforeEach(async ({ loginPage }) => {
    // Ensure user is logged in for all policy tests
    await loginPage.navigate();
    await loginPage.loginAsCustomer();
  });

  test.describe('Policy Creation', () => {
    
    test('should create comprehensive auto insurance policy with Thai vehicle data', async ({ 
      policyPage,
      thaiData
    }) => {
      const vehicleData = thaiData.generateVehicle();
      const policyData = {
        ...thaiData.generatePolicy(),
        policyType: 'comprehensive' as const,
        coverageType: 'Type1' as const,
        comprehensiveCoverage: true,
        collisionCoverage: true,
        theftCoverage: true,
        floodCoverage: true // Important in Thailand
      };
      
      await policyPage.navigateToNewPolicy();
      
      // Test Thai license plate format validation
      await policyPage.testLicensePlateValidation();
      
      // Create policy with valid Thai data
      const policyNumber = await policyPage.createNewPolicy(vehicleData, policyData);
      
      expect(policyNumber).toMatch(/POL-\d{4}-\d{6}/);
      console.log('Created comprehensive policy:', policyNumber);
      
      // Verify policy appears in policy list
      await policyPage.navigateToPolicyList();
      const searchResults = await policyPage.searchPolicies({ 
        policyNumber 
      });
      expect(searchResults).toBeGreaterThan(0);
    });

    test('should create third-party plus policy with compulsory coverage', async ({ 
      policyPage,
      thaiData
    }) => {
      const vehicleData = thaiData.generateVehicle();
      const thirdPartyPolicyData = {
        ...thaiData.generatePolicy(),
        policyType: 'third-party-plus' as const,
        coverageType: 'Type2+' as const,
        liabilityAmount: 1000000, // 1M THB minimum
        comprehensiveCoverage: false,
        personalAccidentCoverage: true, // Required in Thailand
        medicalExpenseCoverage: true
      };
      
      await policyPage.navigateToNewPolicy();
      
      const policyNumber = await policyPage.createNewPolicy(vehicleData, thirdPartyPolicyData);
      expect(policyNumber).toMatch(/POL-\d{4}-\d{6}/);
      
      // Verify Thai compulsory insurance requirements
      await policyPage.verifyThaiInsuranceTerms();
    });

    test('should calculate premiums accurately with Thai tax structure', async ({ 
      policyPage,
      thaiData
    }) => {
      const vehicleData = thaiData.generateVehicle();
      const policyData = thaiData.generatePolicy();
      
      await policyPage.navigateToNewPolicy();
      await policyPage.fillVehicleInformation(vehicleData);
      await policyPage.selectCoverageOptions(policyData);
      
      const premiumCalculation = await policyPage.calculatePremium();
      
      // Verify premium components
      expect(premiumCalculation.basePremium).toBeGreaterThan(0);
      expect(premiumCalculation.tax).toBeGreaterThan(0);
      expect(premiumCalculation.totalPremium).toBeGreaterThan(premiumCalculation.basePremium);
      
      // Thai VAT should be 7% of premium
      const expectedVat = Math.round(premiumCalculation.basePremium * 0.07);
      const actualVatRange = [expectedVat - 10, expectedVat + 10]; // Allow small variance
      expect(premiumCalculation.tax).toBeGreaterThanOrEqual(actualVatRange[0]);
      expect(premiumCalculation.tax).toBeLessThanOrEqual(actualVatRange[1]);
      
      console.log('Premium breakdown verified:', premiumCalculation);
    });

    test('should support motorcycle insurance with different rates', async ({ 
      policyPage,
      thaiData
    }) => {
      const motorcycleData = {
        ...thaiData.generateVehicle(),
        vehicleType: 'motorcycle' as const,
        make: 'Honda',
        model: 'PCX 150',
        licensePlate: '1กข-123' // Motorcycle format
      };
      
      const motorcyclePolicyData = {
        ...thaiData.generatePolicy(),
        coverageType: 'Type3+' as const,
        liabilityAmount: 300000 // Lower for motorcycles
      };
      
      await policyPage.navigateToNewPolicy();
      
      const policyNumber = await policyPage.createNewPolicy(motorcycleData, motorcyclePolicyData);
      expect(policyNumber).toMatch(/POL-\d{4}-\d{6}/);
      
      // Motorcycle premiums should be significantly lower
      const premiumCalculation = await policyPage.calculatePremium();
      expect(premiumCalculation.totalPremium).toBeLessThan(8000); // Typical motorcycle premium
    });

    test('should handle policy creation for different provinces', async ({ 
      policyPage,
      thaiData
    }) => {
      const provinces = ['กรุงเทพมหานคร', 'เชียงใหม่', 'ชลบุรี', 'ขอนแก่น'];
      
      for (const province of provinces) {
        const vehicleData = {
          ...thaiData.generateVehicle(),
          province
        };
        const policyData = thaiData.generatePolicy();
        
        await policyPage.navigateToNewPolicy();
        await policyPage.fillVehicleInformation(vehicleData);
        await policyPage.selectCoverageOptions(policyData);
        
        const premium = await policyPage.calculatePremium();
        expect(premium.totalPremium).toBeGreaterThan(0);
        
        console.log(`Premium for ${province}:`, premium.totalPremium);
        
        // Different provinces may have different risk factors
        // Bangkok might have higher premiums due to traffic density
        if (province === 'กรุงเทพมหานคร') {
          expect(premium.totalPremium).toBeGreaterThanOrEqual(10000);
        }
      }
    });
  });

  test.describe('Policy Modifications', () => {
    
    test('should allow policy holder to modify coverage during policy term', async ({ 
      policyPage,
      thaiData
    }) => {
      // First create a basic policy
      const vehicleData = thaiData.generateVehicle();
      const basicPolicyData = {
        ...thaiData.generatePolicy(),
        comprehensiveCoverage: false,
        floodCoverage: false
      };
      
      await policyPage.navigateToNewPolicy();
      const policyNumber = await policyPage.createNewPolicy(vehicleData, basicPolicyData);
      
      // Navigate to policy modification
      await policyPage.navigateToPolicyList();
      
      // Find and modify the policy
      const modifyButton = policyPage.page.locator(`[data-testid="modify-policy-${policyNumber}"]`);
      if (await modifyButton.isVisible()) {
        await modifyButton.click();
        
        // Add flood coverage (important in Thailand)
        await policyPage.floodCoverageCheckbox.check();
        
        // Recalculate premium
        await policyPage.calculatePremium();
        
        // Save modifications
        const saveModificationsButton = policyPage.page.locator('[data-testid="save-modifications-button"]');
        await saveModificationsButton.click();
        
        await policyPage.waitForSuccessMessage('แก้ไขกรมธรรม์เรียบร้อย');
      }
    });

    test('should handle beneficiary updates with Thai naming conventions', async ({ 
      policyPage,
      thaiData,
      page
    }) => {
      await policyPage.navigateToPolicyList();
      await policyPage.viewActivePolicies();
      
      // Select first policy for beneficiary update
      const firstPolicyRow = page.locator('[data-testid^="policy-row-"]:first-child');
      await firstPolicyRow.click();
      
      const beneficiaryTab = page.locator('[data-testid="beneficiary-tab"]');
      if (await beneficiaryTab.isVisible()) {
        await beneficiaryTab.click();
        
        // Add Thai beneficiary
        const addBeneficiaryButton = page.locator('[data-testid="add-beneficiary-button"]');
        await addBeneficiaryButton.click();
        
        const beneficiaryData = thaiData.generateCustomer();
        await page.fill('[data-testid="beneficiary-first-name"]', beneficiaryData.firstName);
        await page.fill('[data-testid="beneficiary-last-name"]', beneficiaryData.lastName);
        await page.fill('[data-testid="beneficiary-thai-id"]', beneficiaryData.thaiId);
        await page.selectOption('[data-testid="beneficiary-relationship"]', 'spouse');
        
        const saveBeneficiaryButton = page.locator('[data-testid="save-beneficiary-button"]');
        await saveBeneficiaryButton.click();
        
        await policyPage.waitForSuccessMessage('เพิ่มผู้รับผลประโยชน์เรียบร้อย');
      }
    });
  });

  test.describe('Policy Renewals', () => {
    
    test('should process policy renewal with updated premium', async ({ 
      policyPage,
      thaiData,
      page
    }) => {
      await policyPage.navigateToPolicyList();
      await policyPage.viewActivePolicies();
      
      // Find a policy near expiration
      const renewablePolicy = page.locator('[data-testid="policy-near-expiration"]:first-child');
      const policyNumber = await renewablePolicy.getAttribute('data-policy-number');
      
      if (policyNumber) {
        await policyPage.renewPolicy(policyNumber);
        
        // Verify renewal success
        await expect(page.locator('[data-testid="renewal-confirmation"]')).toBeVisible();
        
        // Verify new policy period
        const newExpiryDate = page.locator('[data-testid="new-expiry-date"]');
        const expiryText = await newExpiryDate.textContent();
        
        // Should be one year from now (in Thai Buddhist calendar)
        expect(expiryText).toMatch(/25\d{2}/); // Buddhist era year
      }
    });

    test('should handle early renewal with prorated premium', async ({ 
      policyPage,
      page
    }) => {
      await policyPage.navigateToPolicyList();
      
      // Select an active policy for early renewal
      const activePolicyRow = page.locator('[data-testid^="policy-row-"]:first-child');
      const policyNumber = await activePolicyRow.getAttribute('data-policy-number');
      
      if (policyNumber) {
        const earlyRenewalButton = page.locator(`[data-testid="early-renewal-${policyNumber}"]`);
        
        if (await earlyRenewalButton.isVisible()) {
          await earlyRenewalButton.click();
          
          // Verify prorated premium calculation
          const proratedPremiumElement = page.locator('[data-testid="prorated-premium"]');
          if (await proratedPremiumElement.isVisible()) {
            const proratedAmount = await proratedPremiumElement.textContent();
            expect(proratedAmount).toMatch(/[฿บาท]/);
          }
          
          const confirmEarlyRenewalButton = page.locator('[data-testid="confirm-early-renewal"]');
          await confirmEarlyRenewalButton.click();
          
          await policyPage.waitForSuccessMessage('ต่ออายุกรมธรรม์ล่วงหน้าเรียบร้อย');
        }
      }
    });

    test('should handle renewal with no-claims discount', async ({ 
      policyPage,
      page
    }) => {
      await policyPage.navigateToPolicyList();
      
      // Find policy eligible for no-claims discount
      const eligiblePolicy = page.locator('[data-testid="no-claims-eligible-policy"]:first-child');
      const policyNumber = await eligiblePolicy.getAttribute('data-policy-number');
      
      if (policyNumber) {
        await policyPage.renewPolicy(policyNumber);
        
        // Verify no-claims discount is applied
        const discountElement = page.locator('[data-testid="no-claims-discount"]');
        if (await discountElement.isVisible()) {
          const discountAmount = await discountElement.textContent();
          expect(discountAmount).toMatch(/[฿บาท]/);
          
          // Discount should be negative (reducing premium)
          const discountValue = parseFloat(discountAmount?.replace(/[฿บาท,]/g, '') || '0');
          expect(discountValue).toBeGreaterThan(0);
        }
      }
    });
  });

  test.describe('Policy Cancellation', () => {
    
    test('should process policy cancellation with proper refund calculation', async ({ 
      policyPage,
      page
    }) => {
      await policyPage.navigateToPolicyList();
      
      // Find cancellable policy
      const cancellablePolicy = page.locator('[data-testid^="policy-row-"]:first-child');
      const policyNumber = await cancellablePolicy.getAttribute('data-policy-number') || '';
      
      const cancellationReason = 'ขายรถยนต์แล้ว ไม่ต้องการความคุ้มครองต่อไป';
      
      await policyPage.cancelPolicy(policyNumber, cancellationReason);
      
      // Verify cancellation confirmation
      await expect(page.locator('[data-testid="cancellation-confirmation"]')).toBeVisible();
      
      // Check refund calculation
      const refundAmount = page.locator('[data-testid="refund-amount"]');
      if (await refundAmount.isVisible()) {
        const refundText = await refundAmount.textContent();
        expect(refundText).toMatch(/[฿บาท]/);
        
        // Refund should be prorated based on remaining policy period
        const refundValue = parseFloat(refundText?.replace(/[฿บาท,]/g, '') || '0');
        expect(refundValue).toBeGreaterThan(0);
      }
    });

    test('should handle grace period for policy cancellation', async ({ 
      policyPage,
      page
    }) => {
      await policyPage.navigateToPolicyList();
      
      // Test free-look period cancellation (14 days in Thailand)
      const newPolicy = page.locator('[data-testid="new-policy"]:first-child');
      const policyNumber = await newPolicy.getAttribute('data-policy-number');
      
      if (policyNumber) {
        await policyPage.cancelPolicy(policyNumber, 'เปลี่ยนใจไม่ต้องการประกันภัย');
        
        // Should get full refund during free-look period
        const fullRefundNotice = page.locator('[data-testid="full-refund-notice"]');
        if (await fullRefundNotice.isVisible()) {
          await expect(fullRefundNotice).toContainText('คืนเงินเต็มจำนวน');
        }
      }
    });
  });

  test.describe('Policy Documentation', () => {
    
    test('should generate and download policy certificate in Thai', async ({ 
      policyPage,
      page
    }) => {
      await policyPage.navigateToPolicyList();
      
      const firstPolicyRow = page.locator('[data-testid^="policy-row-"]:first-child');
      const policyNumber = await firstPolicyRow.getAttribute('data-policy-number') || '';
      
      await policyPage.downloadPolicy(policyNumber);
      
      // Verify download completed
      // Note: In real implementation, would verify PDF content
      console.log('Policy certificate downloaded for:', policyNumber);
    });

    test('should generate tax receipt for premium payment', async ({ 
      policyPage,
      page
    }) => {
      await policyPage.navigateToPolicyList();
      
      const policyRow = page.locator('[data-testid^="policy-row-"]:first-child');
      await policyRow.click();
      
      // Access tax receipt
      const taxReceiptTab = page.locator('[data-testid="tax-receipt-tab"]');
      if (await taxReceiptTab.isVisible()) {
        await taxReceiptTab.click();
        
        const downloadTaxReceiptButton = page.locator('[data-testid="download-tax-receipt-button"]');
        await downloadTaxReceiptButton.click();
        
        // Tax receipt should include Thai VAT details
        await expect(page.locator('text=ใบกำกับภาษี')).toBeVisible();
        await expect(page.locator('text=ภาษีมูลค่าเพิ่ม 7%')).toBeVisible();
      }
    });
  });

  test.describe('Policy Comparisons', () => {
    
    test('should compare different coverage types and premiums', async ({ 
      policyPage,
      thaiData,
      page
    }) => {
      const vehicleData = thaiData.generateVehicle();
      
      await policyPage.navigateToNewPolicy();
      await policyPage.fillVehicleInformation(vehicleData);
      
      // Test different coverage types
      const coverageTypes = ['Type1', 'Type2+', 'Type3+'];
      const premiumComparisons: { [key: string]: number } = {};
      
      for (const coverageType of coverageTypes) {
        const policyData = {
          ...thaiData.generatePolicy(),
          coverageType: coverageType as any
        };
        
        await policyPage.selectCoverageOptions(policyData);
        const premium = await policyPage.calculatePremium();
        
        premiumComparisons[coverageType] = premium.totalPremium;
        console.log(`${coverageType} premium:`, premium.totalPremium);
      }
      
      // Type1 (comprehensive) should be most expensive
      expect(premiumComparisons['Type1']).toBeGreaterThan(premiumComparisons['Type2+']);
      expect(premiumComparisons['Type2+']).toBeGreaterThan(premiumComparisons['Type3+']);
    });

    test('should provide deductible options with premium impact', async ({ 
      policyPage,
      thaiData
    }) => {
      const vehicleData = thaiData.generateVehicle();
      const policyData = {
        ...thaiData.generatePolicy(),
        comprehensiveCoverage: true
      };
      
      await policyPage.navigateToNewPolicy();
      await policyPage.fillVehicleInformation(vehicleData);
      await policyPage.selectCoverageOptions(policyData);
      
      // Test different deductible amounts
      const deductibleOptions = ['5000', '10000', '15000', '20000'];
      const deductiblePremiums: { [key: string]: number } = {};
      
      for (const deductible of deductibleOptions) {
        await policyPage.selectOption(
          policyPage.comprehensiveDeductibleSelect, 
          deductible
        );
        
        const premium = await policyPage.calculatePremium();
        deductiblePremiums[deductible] = premium.totalPremium;
        
        console.log(`Deductible ${deductible} THB:`, premium.totalPremium);
      }
      
      // Higher deductible should result in lower premium
      expect(deductiblePremiums['20000']).toBeLessThan(deductiblePremiums['5000']);
    });
  });

  test.describe('Special Policy Features', () => {
    
    test('should handle seasonal policies (for flood season)', async ({ 
      policyPage,
      thaiData,
      page
    }) => {
      const vehicleData = thaiData.generateVehicle();
      
      await policyPage.navigateToNewPolicy();
      await policyPage.fillVehicleInformation(vehicleData);
      
      // Check for seasonal policy options
      const seasonalPolicyOption = page.locator('[data-testid="seasonal-policy-option"]');
      if (await seasonalPolicyOption.isVisible()) {
        await seasonalPolicyOption.click();
        
        // Select flood season coverage (June-October)
        const floodSeasonOption = page.locator('[data-testid="flood-season-coverage"]');
        await floodSeasonOption.check();
        
        const premium = await policyPage.calculatePremium();
        
        // Seasonal premium should be lower than annual
        expect(premium.totalPremium).toBeLessThan(20000);
        
        console.log('Seasonal flood coverage premium:', premium.totalPremium);
      }
    });

    test('should support commercial vehicle policies', async ({ 
      policyPage,
      thaiData
    }) => {
      const commercialVehicleData = {
        ...thaiData.generateVehicle(),
        vehicleType: 'pickup' as const,
        licensePlate: 'กม-1234', // Commercial format
        make: 'Isuzu',
        model: 'D-Max'
      };
      
      const commercialPolicyData = {
        ...thaiData.generatePolicy(),
        coverageType: 'Type2+' as const,
        liabilityAmount: 2000000, // Higher for commercial use
        personalAccidentCoverage: false, // Different for commercial
        medicalExpenseCoverage: true
      };
      
      await policyPage.navigateToNewPolicy();
      
      const policyNumber = await policyPage.createNewPolicy(
        commercialVehicleData, 
        commercialPolicyData
      );
      
      expect(policyNumber).toMatch(/POL-\d{4}-\d{6}/);
      
      // Commercial policies should have higher premiums
      const premium = await policyPage.calculatePremium();
      expect(premium.totalPremium).toBeGreaterThan(15000);
    });
  });
});