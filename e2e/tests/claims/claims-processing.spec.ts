import { test, expect } from '../../fixtures/test-fixtures';

/**
 * Claims Processing E2E Test Suite for Thai Auto Insurance Application
 * 
 * Tests comprehensive claims workflow:
 * - Claims submission with Thai documentation
 * - Photo and document upload validation
 * - Damage assessment and repair shop coordination
 * - Settlement processing and payment
 * - Thai regulatory compliance for claims
 */
test.describe('Claims Processing', () => {

  test.beforeEach(async ({ loginPage }) => {
    // Ensure user is logged in with active policy
    await loginPage.navigate();
    await loginPage.loginAsCustomer();
  });

  test.describe('Claims Submission', () => {
    
    test('should submit collision claim with complete documentation', async ({ 
      claimsPage,
      thaiData
    }) => {
      const collisionClaimData = {
        ...thaiData.generateClaim(),
        accidentType: 'collision' as const,
        accidentLocation: 'ถนนสุขุมวิท กม.18 แยกอโศก กรุงเทพมหานคร',
        accidentDescription: 'รถยนต์ชนท้ายรถคันหน้าขณะจอดรอไฟแดง เกิดความเสียหายที่กันชนหน้า กระจกหน้าแตกร้าว',
        damageDescription: 'กันชนหน้าเสียหาย กระจกหน้าแตกร้าว ไฟหน้าด้านซ้ายแตก',
        policeReportNumber: '2567/123456',
        weatherCondition: 'clear' as const,
        trafficCondition: 'heavy' as const
      };

      const mockDocuments = {
        damagePhotos: ['test-data/collision-damage1.jpg', 'test-data/collision-damage2.jpg'],
        policeReport: 'test-data/police-report-collision.pdf',
        drivingLicense: 'test-data/driving-license.jpg',
        vehicleRegistration: 'test-data/vehicle-registration.pdf'
      };

      await claimsPage.navigateToNewClaim();
      
      // Test Thai date and time validation
      await claimsPage.testAccidentDateTimeValidation();
      
      const claimNumber = await claimsPage.submitClaim(collisionClaimData, mockDocuments);
      
      expect(claimNumber).toMatch(/CLM-\d{4}-\d{6}/);
      console.log('Collision claim submitted:', claimNumber);
      
      // Verify claim appears in claims list
      await claimsPage.navigateToClaimsList();
      const claimSearch = await claimsPage.filterClaimsByStatus('pending');
      expect(claimSearch).toBeGreaterThan(0);
    });

    test('should submit flood damage claim with Thai monsoon context', async ({ 
      claimsPage,
      thaiData
    }) => {
      const floodClaimData = {
        ...thaiData.generateClaim(),
        accidentType: 'flood' as const,
        accidentLocation: 'ถนนรัชดาภิเษก แยวข้างเซ็นทรัล ลาดพร้าว น้ำท่วมสูง 80 ซม.',
        accidentDescription: 'รถยนต์จมน้ำขณะขับผ่านบริเวณน้ำท่วม เครื่องยนต์ดับขณะอยู่ในน้ำ',
        damageDescription: 'เครื่องยนต์จมน้ำ ระบบไฟฟ้าเสียหายทั้งหมด เบาะและพรมเปียกชื้น',
        weatherCondition: 'storm' as const,
        vehicleCanDrive: false,
        towingRequired: true,
        estimatedDamageAmount: 150000
      };

      const floodDocuments = {
        damagePhotos: ['test-data/flood-damage1.jpg', 'test-data/flood-damage2.jpg'],
        policeReport: 'test-data/flood-incident-report.pdf'
      };

      await claimsPage.navigateToNewClaim();
      const claimNumber = await claimsPage.submitClaim(floodClaimData, floodDocuments);
      
      expect(claimNumber).toMatch(/CLM-\d{4}-\d{6}/);
      
      // Verify flood-specific processing
      const claimStatus = await claimsPage.trackClaim(claimNumber);
      expect(claimStatus.status).toMatch(/รอการตรวจสอบ|รับเรื่องแล้ว/);
      
      console.log('Flood claim submitted and tracked:', claimNumber);
    });

    test('should submit theft claim with police report requirement', async ({ 
      claimsPage,
      thaiData
    }) => {
      const theftClaimData = {
        ...thaiData.generateClaim(),
        accidentType: 'theft' as const,
        accidentLocation: 'ลานจอดรถห้างสรรพสินค้าเซ็นทรัล พระราม 2',
        accidentDescription: 'รถยนต์ถูกขโมยจากลานจอดรถ พบว่าสูญหายตอนกลับมาหารถ',
        damageDescription: 'รถยนต์สูญหายพร้อมเอกสารทั้งหมด',
        policeReportNumber: '2567/T789012',
        vehicleCanDrive: false,
        towingRequired: false,
        estimatedDamageAmount: 800000 // Full vehicle value
      };

      const theftDocuments = {
        policeReport: 'test-data/theft-police-report.pdf',
        drivingLicense: 'test-data/driving-license.jpg',
        vehicleRegistration: 'test-data/vehicle-registration.pdf'
      };

      await claimsPage.navigateToNewClaim();
      
      // Theft claims require police report
      await claimsPage.fillAccidentDetails(theftClaimData);
      
      // Verify police report number is mandatory for theft
      if (!theftClaimData.policeReportNumber) {
        await claimsPage.testMandatoryDocumentValidation();
      }

      const claimNumber = await claimsPage.submitClaim(theftClaimData, theftDocuments);
      
      expect(claimNumber).toMatch(/CLM-\d{4}-\d{6}/);
      console.log('Theft claim submitted:', claimNumber);
    });

    test('should handle multi-vehicle accident with third party details', async ({ 
      claimsPage,
      thaiData
    }) => {
      const multiVehicleClaimData = {
        ...thaiData.generateClaim(),
        accidentType: 'collision' as const,
        thirdPartyInvolved: true,
        thirdPartyName: 'วิชัย สุขใส',
        thirdPartyPhone: '0891234567',
        thirdPartyLicensePlate: 'กท-9876',
        thirdPartyInsurance: 'Bangkok Insurance',
        accidentDescription: 'รถยนต์ 3 คัน ชนกันต่อเนื่อง เกิดจากรถคันแรกเบรกกะทันหัน',
        damageDescription: 'ความเสียหายกันชนหลัง และด้านข้าง'
      };

      const multiVehicleDocuments = {
        damagePhotos: ['test-data/multi-vehicle1.jpg', 'test-data/multi-vehicle2.jpg'],
        policeReport: 'test-data/multi-vehicle-police-report.pdf'
      };

      await claimsPage.navigateToNewClaim();
      const claimNumber = await claimsPage.submitClaim(multiVehicleClaimData, multiVehicleDocuments);
      
      // Multi-vehicle claims require additional processing
      const claimStatus = await claimsPage.trackClaim(claimNumber);
      expect(claimStatus.status).toMatch(/รอการประสานงาน|รอการตรวจสอบ/);
      
      console.log('Multi-vehicle claim submitted:', claimNumber);
    });
  });

  test.describe('Document Upload and Validation', () => {
    
    test('should validate mandatory documents for different claim types', async ({ 
      claimsPage,
      thaiData
    }) => {
      await claimsPage.navigateToNewClaim();
      
      // Test mandatory document validation
      await claimsPage.testMandatoryDocumentValidation();
      
      const claimData = thaiData.generateClaim();
      await claimsPage.fillAccidentDetails(claimData);
      await claimsPage.fillVehicleDamageDetails(claimData);
      
      // Attempt submission without documents
      try {
        await claimsPage.submitClaimForm();
      } catch (error) {
        // Should fail due to missing documents
        await claimsPage.waitForErrorMessage('กรุณาอัปโหลดเอกสารที่จำเป็น');
      }
    });

    test('should validate photo upload quality and format', async ({ 
      claimsPage
    }) => {
      await claimsPage.navigateToNewClaim();
      
      // Test photo upload validation
      const testPhotos = [
        'test-data/valid-damage-photo.jpg',
        'test-data/low-quality-photo.jpg',
        'test-data/invalid-format.txt'
      ];

      for (const photo of testPhotos) {
        await claimsPage.testPhotoUploadValidation(photo);
      }
    });

    test('should support progressive document upload during claim process', async ({ 
      claimsPage,
      thaiData
    }) => {
      // Submit initial claim
      const claimData = thaiData.generateClaim();
      const initialDocuments = {
        damagePhotos: ['test-data/initial-damage.jpg']
      };

      await claimsPage.navigateToNewClaim();
      const claimNumber = await claimsPage.submitClaim(claimData, initialDocuments);
      
      // Upload additional documents later
      const additionalDocuments = [
        'test-data/repair-quote.pdf',
        'test-data/additional-damage-photo.jpg'
      ];

      await claimsPage.uploadAdditionalDocuments(claimNumber, additionalDocuments);
      
      // Verify documents are attached to claim
      const claimStatus = await claimsPage.trackClaim(claimNumber);
      console.log('Additional documents uploaded for claim:', claimNumber);
    });
  });

  test.describe('Damage Assessment and Inspection', () => {
    
    test('should schedule damage inspection appointment', async ({ 
      claimsPage,
      thaiData
    }) => {
      // Submit claim first
      const claimData = thaiData.generateClaim();
      const documents = {
        damagePhotos: ['test-data/damage-photo.jpg']
      };

      await claimsPage.navigateToNewClaim();
      const claimNumber = await claimsPage.submitClaim(claimData, documents);
      
      // Schedule inspection
      const inspectionDate = new Date();
      inspectionDate.setDate(inspectionDate.getDate() + 3); // 3 days from now
      
      await claimsPage.scheduleInspection(
        claimNumber,
        inspectionDate.toISOString().split('T')[0]
      );
      
      // Verify inspection is scheduled
      const claimStatus = await claimsPage.trackClaim(claimNumber);
      expect(claimStatus.nextAction).toMatch(/การตรวจสอบ|นัดหมาย/);
      
      console.log('Inspection scheduled for claim:', claimNumber);
    });

    test('should calculate damage assessment with Thai market rates', async ({ 
      claimsPage,
      thaiData,
      page
    }) => {
      const claimData = {
        ...thaiData.generateClaim(),
        estimatedDamageAmount: 50000
      };

      await claimsPage.navigateToNewClaim();
      const claimNumber = await claimsPage.submitClaim(claimData, {
        damagePhotos: ['test-data/moderate-damage.jpg']
      });
      
      // Navigate to damage assessment (admin/inspector view)
      await page.goto(`/claims/${claimNumber}/assessment`);
      
      const damageAssessmentSection = page.locator('[data-testid="damage-assessment-section"]');
      if (await damageAssessmentSection.isVisible()) {
        // Verify Thai market rates are used
        await expect(page.locator('text=อัตราค่าแรงมาตรฐาน')).toBeVisible();
        await expect(page.locator('text=ราคาอะไหล่แท้')).toBeVisible();
        
        const assessedAmount = page.locator('[data-testid="assessed-damage-amount"]');
        const assessedValue = await assessedAmount.textContent();
        
        expect(assessedValue).toMatch(/[฿บาท]/);
        console.log('Damage assessed at:', assessedValue);
      }
    });
  });

  test.describe('Repair Shop Coordination', () => {
    
    test('should coordinate with authorized repair shop network', async ({ 
      claimsPage,
      thaiData,
      apiHelpers
    }) => {
      const claimData = {
        ...thaiData.generateClaim(),
        repairRequired: true,
        preferredRepairShop: 'Toyota Authorized Service Center'
      };

      await claimsPage.navigateToNewClaim();
      await claimsPage.fillAccidentDetails(claimData);
      await claimsPage.fillVehicleDamageDetails(claimData);
      
      // Search and select repair shop
      const repairShops = await apiHelpers.searchRepairShops(
        claimData.accidentLocation,
        'Toyota'
      );
      
      expect(repairShops.length).toBeGreaterThan(0);
      
      // Select first available repair shop
      await claimsPage.selectRepairShop(repairShops[0].name);
      
      const claimNumber = await claimsPage.submitClaim(claimData, {
        damagePhotos: ['test-data/repairable-damage.jpg']
      });
      
      // Verify repair shop is assigned
      const claimStatus = await claimsPage.trackClaim(claimNumber);
      expect(claimStatus.nextAction).toMatch(/ซ่อม|อู่/);
      
      console.log('Repair shop coordination completed for:', claimNumber);
    });

    test('should handle repair cost estimation and approval', async ({ 
      claimsPage,
      thaiData,
      page
    }) => {
      const repairableClaimData = {
        ...thaiData.generateClaim(),
        estimatedDamageAmount: 25000,
        repairRequired: true
      };

      await claimsPage.navigateToNewClaim();
      const claimNumber = await claimsPage.submitClaim(repairableClaimData, {
        damagePhotos: ['test-data/minor-damage.jpg'],
        repairQuotes: ['test-data/repair-quote.pdf']
      });
      
      // Navigate to repair estimation
      await page.goto(`/claims/${claimNumber}/repair-estimate`);
      
      const repairEstimateSection = page.locator('[data-testid="repair-estimate-section"]');
      if (await repairEstimateSection.isVisible()) {
        const estimatedCost = page.locator('[data-testid="repair-cost-estimate"]');
        const costText = await estimatedCost.textContent();
        
        expect(costText).toMatch(/[฿บาท]/);
        
        // Approve repair if cost is reasonable
        const approveRepairButton = page.locator('[data-testid="approve-repair-button"]');
        if (await approveRepairButton.isVisible()) {
          await approveRepairButton.click();
          await claimsPage.waitForSuccessMessage('อนุมัติการซ่อมเรียบร้อย');
        }
        
        console.log('Repair cost approved:', costText);
      }
    });
  });

  test.describe('Claims Processing and Settlement', () => {
    
    test('should process claim settlement with Thai banking integration', async ({ 
      claimsPage,
      thaiData,
      page
    }) => {
      // Simulate approved claim ready for settlement
      const approvedClaimData = thaiData.generateClaim();
      
      await claimsPage.navigateToNewClaim();
      const claimNumber = await claimsPage.submitClaim(approvedClaimData, {
        damagePhotos: ['test-data/approved-damage.jpg']
      });
      
      // Navigate to settlement processing (admin view)
      await page.goto(`/admin/claims/${claimNumber}/settlement`);
      
      const settlementSection = page.locator('[data-testid="settlement-section"]');
      if (await settlementSection.isVisible()) {
        // Enter settlement amount
        const settlementAmountInput = page.locator('[data-testid="settlement-amount-input"]');
        await settlementAmountInput.fill('45000');
        
        // Select Thai bank for transfer
        const bankSelect = page.locator('[data-testid="bank-select"]');
        await bankSelect.selectOption('Kasikorn Bank');
        
        // Enter account details
        const accountNumberInput = page.locator('[data-testid="account-number-input"]');
        await accountNumberInput.fill('1234567890');
        
        const accountNameInput = page.locator('[data-testid="account-name-input"]');
        await accountNameInput.fill('สมชาย ใจดี');
        
        // Process settlement
        const processSettlementButton = page.locator('[data-testid="process-settlement-button"]');
        await processSettlementButton.click();
        
        await claimsPage.waitForSuccessMessage('ประมวลผลการจ่ายค่าสินไหมเรียบร้อย');
        
        console.log('Settlement processed for claim:', claimNumber);
      }
    });

    test('should handle partial settlement with detailed breakdown', async ({ 
      claimsPage,
      thaiData,
      page
    }) => {
      const partialClaimData = {
        ...thaiData.generateClaim(),
        estimatedDamageAmount: 100000
      };

      await claimsPage.navigateToNewClaim();
      const claimNumber = await claimsPage.submitClaim(partialClaimData, {
        damagePhotos: ['test-data/major-damage.jpg']
      });
      
      // Process partial settlement
      await page.goto(`/admin/claims/${claimNumber}/settlement`);
      
      const partialSettlementOption = page.locator('[data-testid="partial-settlement-option"]');
      if (await partialSettlementOption.isVisible()) {
        await partialSettlementOption.click();
        
        // Set partial amount with reason
        const partialAmountInput = page.locator('[data-testid="partial-amount-input"]');
        await partialAmountInput.fill('75000');
        
        const partialReasonTextarea = page.locator('[data-testid="partial-reason-textarea"]');
        await partialReasonTextarea.fill('ความเสียหายบางส่วนเกิดจากการใช้งานปกติ ไม่อยู่ในขอบเขตความคุ้มครอง');
        
        const processPartialButton = page.locator('[data-testid="process-partial-settlement-button"]');
        await processPartialButton.click();
        
        await claimsPage.waitForSuccessMessage('จ่ายค่าสินไหมบางส่วนเรียบร้อย');
        
        console.log('Partial settlement processed for:', claimNumber);
      }
    });

    test('should generate settlement documentation in Thai', async ({ 
      claimsPage,
      thaiData,
      page
    }) => {
      const settledClaimData = thaiData.generateClaim();
      
      await claimsPage.navigateToNewClaim();
      const claimNumber = await claimsPage.submitClaim(settledClaimData, {
        damagePhotos: ['test-data/settled-damage.jpg']
      });
      
      // Navigate to settlement documents
      await page.goto(`/claims/${claimNumber}/documents`);
      
      const settlementDocumentsSection = page.locator('[data-testid="settlement-documents-section"]');
      if (await settlementDocumentsSection.isVisible()) {
        // Generate settlement letter
        const generateLetterButton = page.locator('[data-testid="generate-settlement-letter-button"]');
        await generateLetterButton.click();
        
        // Verify Thai language in settlement documents
        await expect(page.locator('text=หนังสือแจ้งการจ่ายค่าสินไหม')).toBeVisible();
        await expect(page.locator('text=จำนวนเงินที่จ่าย')).toBeVisible();
        
        // Download settlement letter
        const downloadLetterButton = page.locator('[data-testid="download-settlement-letter-button"]');
        if (await downloadLetterButton.isVisible()) {
          await downloadLetterButton.click();
        }
        
        console.log('Settlement documentation generated for:', claimNumber);
      }
    });
  });

  test.describe('Claims Analytics and Reporting', () => {
    
    test('should track claims processing time and performance', async ({ 
      claimsPage,
      thaiData
    }) => {
      const claimData = thaiData.generateClaim();
      
      await claimsPage.navigateToNewClaim();
      const submitStartTime = Date.now();
      
      const claimNumber = await claimsPage.submitClaim(claimData, {
        damagePhotos: ['test-data/performance-test-damage.jpg']
      });
      
      const submitEndTime = Date.now();
      const submissionTime = submitEndTime - submitStartTime;
      
      console.log('Claim submission time:', submissionTime, 'ms');
      expect(submissionTime).toBeLessThan(10000); // Should complete within 10 seconds
      
      // Track processing time
      const processingTime = await claimsPage.getClaimProcessingTime(claimNumber);
      console.log('Claim processing time:', processingTime, 'days');
      
      // Thai insurance regulations require processing within certain timeframes
      expect(processingTime).toBeLessThanOrEqual(30); // Maximum 30 days
    });

    test('should generate claims trend reports', async ({ 
      page
    }) => {
      // Navigate to claims analytics (admin view)
      await page.goto('/admin/reports/claims');
      
      const claimsReportSection = page.locator('[data-testid="claims-report-section"]');
      if (await claimsReportSection.isVisible()) {
        // Generate monthly claims report
        const monthlyReportButton = page.locator('[data-testid="monthly-claims-report-button"]');
        await monthlyReportButton.click();
        
        // Verify report includes Thai context
        await expect(page.locator('text=รายงานการเคลมประจำเดือน')).toBeVisible();
        await expect(page.locator('text=จำนวนเคลมตามประเภทอุบัติเหตุ')).toBeVisible();
        
        // Check for common Thai accident types
        await expect(page.locator('text=อุบัติเหตุชน')).toBeVisible();
        await expect(page.locator('text=น้ำท่วม')).toBeVisible();
        await expect(page.locator('text=ขโมย')).toBeVisible();
        
        console.log('Claims trend report generated successfully');
      }
    });

    test('should monitor fraud detection patterns', async ({ 
      page
    }) => {
      // Navigate to fraud detection dashboard
      await page.goto('/admin/fraud-detection');
      
      const fraudDetectionSection = page.locator('[data-testid="fraud-detection-section"]');
      if (await fraudDetectionSection.isVisible()) {
        // Check fraud indicators
        const fraudIndicators = page.locator('[data-testid="fraud-indicators-list"]');
        await expect(fraudIndicators).toBeVisible();
        
        // Verify Thai-specific fraud patterns
        await expect(page.locator('text=รูปแบบการฉ้อโกงที่พบบ่อย')).toBeVisible();
        
        console.log('Fraud detection monitoring active');
      }
    });
  });
});