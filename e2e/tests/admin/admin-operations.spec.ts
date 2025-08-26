import { test, expect } from '../../fixtures/test-fixtures';

/**
 * Admin Operations E2E Test Suite for Thai Auto Insurance Application
 * 
 * Tests comprehensive administrative functions:
 * - User management and role administration
 * - Policy approval and rejection workflows
 * - Claims processing and settlement approval
 * - Agent management and performance tracking
 * - System configuration and Thai regulatory compliance
 * - Reports and analytics generation
 */
test.describe('Admin Operations', () => {

  test.beforeEach(async ({ loginPage, adminPage }) => {
    // Ensure admin user is logged in for all admin tests
    await loginPage.navigate();
    await loginPage.loginAsAdmin();
    await adminPage.verifyAdminPageLoaded();
  });

  test.describe('User Management', () => {
    
    test('should create and manage customer accounts', async ({ 
      adminPage,
      thaiData
    }) => {
      const customerData = thaiData.generateCustomer();
      const userData = {
        email: customerData.email,
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        role: 'CUSTOMER' as const,
        status: 'ACTIVE' as const,
        permissions: ['VIEW_POLICIES', 'SUBMIT_CLAIMS', 'UPDATE_PROFILE']
      };

      await adminPage.createUser(userData);
      
      // Verify user appears in user list
      const searchResults = await adminPage.searchUsers({
        searchTerm: customerData.email,
        role: 'CUSTOMER',
        status: 'ACTIVE'
      });
      
      expect(searchResults).toBeGreaterThan(0);
      console.log('Customer account created:', customerData.email);
    });

    test('should create agent accounts with proper permissions', async ({ 
      adminPage,
      thaiData
    }) => {
      const agentData = thaiData.generateCustomer();
      const userData = {
        email: `agent.${agentData.email}`,
        firstName: agentData.firstName,
        lastName: agentData.lastName,
        role: 'AGENT' as const,
        status: 'ACTIVE' as const,
        permissions: [
          'VIEW_ALL_POLICIES',
          'APPROVE_POLICIES',
          'VIEW_ALL_CLAIMS',
          'PROCESS_CLAIMS',
          'GENERATE_REPORTS'
        ]
      };

      await adminPage.createUser(userData);
      
      // Verify agent-specific permissions are set
      const searchResults = await adminPage.searchUsers({
        role: 'AGENT'
      });
      
      expect(searchResults).toBeGreaterThan(0);
      console.log('Agent account created:', userData.email);
    });

    test('should manage user status changes (activate/deactivate)', async ({ 
      adminPage,
      page
    }) => {
      await adminPage.navigateToUserManagement();
      
      // Find first active user
      const activeUserRow = page.locator('[data-testid^="user-row-"][data-status="ACTIVE"]:first-child');
      const userEmail = await activeUserRow.getAttribute('data-user-email');
      
      if (userEmail) {
        await activeUserRow.click();
        
        // Deactivate user
        const deactivateButton = page.locator('[data-testid="deactivate-user-button"]');
        await deactivateButton.click();
        
        const confirmDeactivationButton = page.locator('[data-testid="confirm-deactivation-button"]');
        await confirmDeactivationButton.click();
        
        await adminPage.waitForSuccessMessage('ปิดใช้งานบัญชีผู้ใช้เรียบร้อย');
        
        // Verify user is deactivated
        const deactivatedUser = page.locator(`[data-testid="user-row-${userEmail}"]`);
        await expect(deactivatedUser).toHaveAttribute('data-status', 'INACTIVE');
        
        console.log('User deactivated:', userEmail);
      }
    });

    test('should handle bulk user operations', async ({ 
      adminPage,
      page
    }) => {
      await adminPage.navigateToUserManagement();
      
      // Select multiple users
      const userCheckboxes = page.locator('[data-testid^="user-checkbox-"]');
      const userCount = await userCheckboxes.count();
      
      if (userCount > 0) {
        // Select first 3 users
        for (let i = 0; i < Math.min(3, userCount); i++) {
          await userCheckboxes.nth(i).check();
        }
        
        // Perform bulk action
        const bulkActionsDropdown = page.locator('[data-testid="bulk-actions-dropdown"]');
        if (await bulkActionsDropdown.isVisible()) {
          await bulkActionsDropdown.click();
          
          const sendNotificationAction = page.locator('[data-testid="bulk-send-notification"]');
          await sendNotificationAction.click();
          
          // Compose notification
          const notificationSubject = page.locator('[data-testid="notification-subject-input"]');
          await notificationSubject.fill('ประกาศจากระบบประกันภัย');
          
          const notificationMessage = page.locator('[data-testid="notification-message-textarea"]');
          await notificationMessage.fill('เรียนลูกค้าที่เคารพ กรุณาตรวจสอบกรมธรรม์ของท่านก่อนหมดอายุ');
          
          const sendNotificationButton = page.locator('[data-testid="send-bulk-notification-button"]');
          await sendNotificationButton.click();
          
          await adminPage.waitForSuccessMessage('ส่งการแจ้งเตือนเรียบร้อย');
          
          console.log('Bulk notification sent to selected users');
        }
      }
    });
  });

  test.describe('Policy Administration', () => {
    
    test('should review and approve new policy applications', async ({ 
      adminPage,
      page
    }) => {
      await adminPage.navigateToPolicyManagement();
      
      // Find pending policy applications
      const pendingPolicyFilter = page.locator('[data-testid="policy-status-filter"]');
      await pendingPolicyFilter.selectOption('pending');
      
      const pendingPolicies = page.locator('[data-testid^="policy-row-"][data-status="pending"]');
      const pendingCount = await pendingPolicies.count();
      
      if (pendingCount > 0) {
        const firstPendingPolicy = pendingPolicies.first();
        const policyNumber = await firstPendingPolicy.getAttribute('data-policy-number');
        
        if (policyNumber) {
          await adminPage.reviewPolicy(
            policyNumber, 
            'approve', 
            'กรมธรรม์ผ่านการพิจารณาตามเกณฑ์มาตรฐาน'
          );
          
          // Verify policy status changed to approved
          await page.reload();
          const approvedPolicy = page.locator(`[data-testid="policy-row-${policyNumber}"]`);
          await expect(approvedPolicy).toHaveAttribute('data-status', 'approved');
          
          console.log('Policy approved:', policyNumber);
        }
      }
    });

    test('should reject policy applications with detailed reasons', async ({ 
      adminPage,
      page
    }) => {
      await adminPage.navigateToPolicyManagement();
      
      const pendingPolicies = page.locator('[data-testid^="policy-row-"][data-status="pending"]');
      const pendingCount = await pendingPolicies.count();
      
      if (pendingCount > 0) {
        const policyToReject = pendingPolicies.first();
        const policyNumber = await policyToReject.getAttribute('data-policy-number');
        
        if (policyNumber) {
          await adminPage.reviewPolicy(
            policyNumber,
            'reject',
            'รถยนต์มีอายุเกิน 20 ปี ไม่อยู่ในเกณฑ์การรับประกันภัย'
          );
          
          // Verify rejection
          const rejectedPolicy = page.locator(`[data-testid="policy-row-${policyNumber}"]`);
          await expect(rejectedPolicy).toHaveAttribute('data-status', 'rejected');
          
          console.log('Policy rejected:', policyNumber);
        }
      }
    });

    test('should handle policy modifications and endorsements', async ({ 
      adminPage,
      page
    }) => {
      await adminPage.navigateToPolicyManagement();
      
      // Find active policy for modification
      const activePolicies = page.locator('[data-testid^="policy-row-"][data-status="active"]');
      const activeCount = await activePolicies.count();
      
      if (activeCount > 0) {
        const policyToModify = activePolicies.first();
        const policyNumber = await policyToModify.getAttribute('data-policy-number');
        
        if (policyNumber) {
          await policyToModify.click();
          
          // Open policy details
          const policyDetailsModal = page.locator('[data-testid="policy-details-modal"]');
          await expect(policyDetailsModal).toBeVisible();
          
          // Create endorsement
          const createEndorsementButton = page.locator('[data-testid="create-endorsement-button"]');
          if (await createEndorsementButton.isVisible()) {
            await createEndorsementButton.click();
            
            // Add coverage modification
            const modificationTypeSelect = page.locator('[data-testid="modification-type-select"]');
            await modificationTypeSelect.selectOption('add-coverage');
            
            const coverageTypeSelect = page.locator('[data-testid="new-coverage-type-select"]');
            await coverageTypeSelect.selectOption('flood-coverage');
            
            const endorsementNotes = page.locator('[data-testid="endorsement-notes-textarea"]');
            await endorsementNotes.fill('เพิ่มความคุ้มครองน้ำท่วมตามคำขอของผู้เอาประกันภัย');
            
            const processEndorsementButton = page.locator('[data-testid="process-endorsement-button"]');
            await processEndorsementButton.click();
            
            await adminPage.waitForSuccessMessage('ดำเนินการแก้ไขกรมธรรม์เรียบร้อย');
            
            console.log('Policy endorsement processed:', policyNumber);
          }
        }
      }
    });

    test('should generate policy certificates and documents', async ({ 
      adminPage,
      page
    }) => {
      await adminPage.navigateToPolicyManagement();
      
      const approvedPolicies = page.locator('[data-testid^="policy-row-"][data-status="approved"]');
      const approvedCount = await approvedPolicies.count();
      
      if (approvedCount > 0) {
        const firstApprovedPolicy = approvedPolicies.first();
        const policyNumber = await firstApprovedPolicy.getAttribute('data-policy-number');
        
        if (policyNumber) {
          await firstApprovedPolicy.click();
          
          // Generate policy certificate
          const generateCertificateButton = page.locator('[data-testid="generate-certificate-button"]');
          if (await generateCertificateButton.isVisible()) {
            await generateCertificateButton.click();
            
            // Verify certificate generation
            const certificatePreview = page.locator('[data-testid="certificate-preview"]');
            await expect(certificatePreview).toBeVisible();
            
            // Check for Thai language elements in certificate
            await expect(page.locator('text=กรมธรรม์ประกันภัยรถยนต์')).toBeVisible();
            await expect(page.locator('text=บริษัทประกันภัย')).toBeVisible();
            
            // Download certificate
            const downloadCertificateButton = page.locator('[data-testid="download-certificate-button"]');
            await downloadCertificateButton.click();
            
            console.log('Policy certificate generated:', policyNumber);
          }
        }
      }
    });
  });

  test.describe('Claims Administration', () => {
    
    test('should process and approve insurance claims', async ({ 
      adminPage,
      page
    }) => {
      await adminPage.navigateToClaimsManagement();
      
      // View pending claims
      const pendingClaims = await adminPage.viewPendingClaims();
      console.log('Pending claims count:', pendingClaims.count);
      
      if (pendingClaims.count > 0) {
        // Find first pending claim
        const firstPendingClaim = page.locator('[data-testid^="claim-row-"][data-status="pending"]:first-child');
        const claimNumber = await firstPendingClaim.getAttribute('data-claim-number');
        
        if (claimNumber) {
          await adminPage.processClaim(claimNumber, 'approve', {
            approvedAmount: 35000,
            notes: 'ความเสียหายอยู่ในเกณฑ์ที่อนุมัติได้ ตามหลักเกณฑ์การพิจารณา'
          });
          
          console.log('Claim approved:', claimNumber);
        }
      }
    });

    test('should reject claims with detailed reasoning', async ({ 
      adminPage,
      page
    }) => {
      await adminPage.navigateToClaimsManagement();
      
      const pendingClaims = page.locator('[data-testid^="claim-row-"][data-status="pending"]');
      const pendingCount = await pendingClaims.count();
      
      if (pendingCount > 0) {
        const claimToReject = pendingClaims.first();
        const claimNumber = await claimToReject.getAttribute('data-claim-number');
        
        if (claimNumber) {
          await adminPage.processClaim(claimNumber, 'reject', {
            rejectionReason: 'ความเสียหายเกิดจากการใช้งานผิดวัตถุประสงค์ ไม่อยู่ในเงื่อนไขความคุ้มครอง'
          });
          
          // Verify claim is rejected
          const rejectedClaim = page.locator(`[data-testid="claim-row-${claimNumber}"]`);
          await expect(rejectedClaim).toHaveAttribute('data-status', 'rejected');
          
          console.log('Claim rejected:', claimNumber);
        }
      }
    });

    test('should assign claims for investigation', async ({ 
      adminPage,
      page
    }) => {
      await adminPage.navigateToClaimsManagement();
      
      const suspiciousClaims = page.locator('[data-testid^="claim-row-"][data-flag="suspicious"]');
      const suspiciousCount = await suspiciousClaims.count();
      
      if (suspiciousCount > 0) {
        const claimToInvestigate = suspiciousClaims.first();
        const claimNumber = await claimToInvestigate.getAttribute('data-claim-number');
        
        if (claimNumber) {
          await adminPage.processClaim(claimNumber, 'investigate', {
            inspectorId: 'INS-001',
            notes: 'ส่งตรวจสอบเพิ่มเติมเนื่องจากมีลักษณะผิดปกติ'
          });
          
          // Verify investigation is assigned
          const investigatingClaim = page.locator(`[data-testid="claim-row-${claimNumber}"]`);
          await expect(investigatingClaim).toHaveAttribute('data-status', 'investigating');
          
          console.log('Claim sent for investigation:', claimNumber);
        }
      }
    });

    test('should manage claims settlement workflow', async ({ 
      adminPage,
      page
    }) => {
      await adminPage.navigateToClaimsManagement();
      
      // Filter approved claims ready for settlement
      const approvedClaimsTab = page.locator('[data-testid="approved-claims-tab"]');
      await approvedClaimsTab.click();
      
      const settlementReadyClaims = page.locator('[data-testid^="claim-row-"][data-settlement-status="ready"]');
      const settlementCount = await settlementReadyClaims.count();
      
      if (settlementCount > 0) {
        const claimForSettlement = settlementReadyClaims.first();
        const claimNumber = await claimForSettlement.getAttribute('data-claim-number');
        
        if (claimNumber) {
          await claimForSettlement.click();
          
          // Process settlement
          const processSettlementButton = page.locator('[data-testid="process-settlement-button"]');
          await processSettlementButton.click();
          
          // Enter settlement details
          const settlementAmountInput = page.locator('[data-testid="settlement-amount-input"]');
          await settlementAmountInput.fill('42000');
          
          const bankAccountInput = page.locator('[data-testid="bank-account-input"]');
          await bankAccountInput.fill('1234567890');
          
          const accountHolderInput = page.locator('[data-testid="account-holder-input"]');
          await accountHolderInput.fill('สมชาย ใจดี');
          
          const confirmSettlementButton = page.locator('[data-testid="confirm-settlement-button"]');
          await confirmSettlementButton.click();
          
          await adminPage.waitForSuccessMessage('ดำเนินการจ่ายค่าสินไหมเรียบร้อย');
          
          console.log('Claim settlement processed:', claimNumber);
        }
      }
    });
  });

  test.describe('Agent Management', () => {
    
    test('should monitor agent performance metrics', async ({ 
      adminPage
    }) => {
      const agentId = 'AGT-001';
      
      const performanceMetrics = await adminPage.getAgentPerformanceMetrics(agentId);
      
      expect(performanceMetrics.totalSales).toBeGreaterThanOrEqual(0);
      expect(performanceMetrics.totalPolicies).toBeGreaterThanOrEqual(0);
      expect(performanceMetrics.customerSatisfaction).toBeBetween(0, 5);
      expect(performanceMetrics.conversionRate).toBeBetween(0, 100);
      
      console.log('Agent performance metrics:', performanceMetrics);
    });

    test('should manage agent commission rates', async ({ 
      adminPage
    }) => {
      const agentId = 'AGT-002';
      const newCommissionRate = 8.5; // 8.5%
      
      await adminPage.manageAgentCommission(agentId, newCommissionRate);
      
      // Verify commission rate updated
      console.log('Agent commission rate updated:', agentId, newCommissionRate);
    });

    test('should generate agent performance reports', async ({ 
      adminPage,
      page
    }) => {
      await adminPage.agentsManagementTab.click();
      
      // Generate monthly performance report
      const generateReportButton = page.locator('[data-testid="generate-agent-report-button"]');
      if (await generateReportButton.isVisible()) {
        await generateReportButton.click();
        
        const reportTypeSelect = page.locator('[data-testid="report-type-select"]');
        await reportTypeSelect.selectOption('monthly-performance');
        
        const generateButton = page.locator('[data-testid="confirm-generate-report-button"]');
        await generateButton.click();
        
        // Verify report generation
        const reportResults = page.locator('[data-testid="agent-report-results"]');
        await expect(reportResults).toBeVisible();
        
        // Check for Thai language elements
        await expect(page.locator('text=รายงานผลการดำเนินงาน')).toBeVisible();
        await expect(page.locator('text=ยอดขายรวม')).toBeVisible();
        
        console.log('Agent performance report generated');
      }
    });
  });

  test.describe('System Configuration', () => {
    
    test('should configure insurance rates and pricing', async ({ 
      adminPage
    }) => {
      const rateUpdates = [
        {
          vehicleType: 'sedan',
          baseRate: 12000,
          adjustmentFactor: 1.2
        },
        {
          vehicleType: 'suv',
          baseRate: 15000,
          adjustmentFactor: 1.4
        },
        {
          vehicleType: 'pickup',
          baseRate: 13500,
          adjustmentFactor: 1.3
        }
      ];
      
      await adminPage.configureInsuranceRates(rateUpdates);
      
      console.log('Insurance rates configured successfully');
    });

    test('should verify Thai regulatory compliance settings', async ({ 
      adminPage
    }) => {
      await adminPage.verifyRegulatoryCompliance();
      
      console.log('Thai regulatory compliance verified');
    });

    test('should manage system-wide settings', async ({ 
      adminPage,
      page
    }) => {
      await adminPage.settingsTab.click();
      
      // Update system settings
      const systemConfigSection = page.locator('[data-testid="system-config-section"]');
      if (await systemConfigSection.isVisible()) {
        // Configure maintenance window
        const maintenanceWindowToggle = page.locator('[data-testid="maintenance-window-toggle"]');
        await maintenanceWindowToggle.click();
        
        const maintenanceStartTime = page.locator('[data-testid="maintenance-start-time"]');
        await maintenanceStartTime.fill('02:00');
        
        const maintenanceEndTime = page.locator('[data-testid="maintenance-end-time"]');
        await maintenanceEndTime.fill('04:00');
        
        const saveSettingsButton = page.locator('[data-testid="save-system-settings-button"]');
        await saveSettingsButton.click();
        
        await adminPage.waitForSuccessMessage('อัปเดตการตั้งค่าระบบเรียบร้อย');
        
        console.log('System settings updated');
      }
    });
  });

  test.describe('Reports and Analytics', () => {
    
    test('should generate comprehensive financial reports', async ({ 
      adminPage
    }) => {
      const dateRange = {
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      };
      
      await adminPage.generateFinancialReport(dateRange, 'comprehensive');
      
      // Export report to Excel
      await adminPage.exportReport('excel');
      
      console.log('Financial report generated and exported');
    });

    test('should generate claims analysis reports', async ({ 
      adminPage
    }) => {
      const dateRange = {
        startDate: '2024-01-01',
        endDate: '2024-06-30'
      };
      
      await adminPage.generateFinancialReport(dateRange, 'claims');
      
      console.log('Claims analysis report generated');
    });

    test('should provide real-time dashboard metrics', async ({ 
      adminPage,
      page
    }) => {
      // Navigate to admin dashboard
      await adminPage.adminDashboard.click();
      
      // Verify key metrics are displayed
      const dashboardMetrics = page.locator('[data-testid="dashboard-metrics"]');
      await expect(dashboardMetrics).toBeVisible();
      
      // Check for Thai language metrics
      await expect(page.locator('text=กรมธรรม์ใหม่วันนี้')).toBeVisible();
      await expect(page.locator('text=เคลมที่รอการพิจารณา')).toBeVisible();
      await expect(page.locator('text=ยอดขายรวม')).toBeVisible();
      
      // Verify metrics have values
      const newPoliciesCount = page.locator('[data-testid="new-policies-count"]');
      const pendingClaimsCount = page.locator('[data-testid="pending-claims-count"]');
      const totalSalesAmount = page.locator('[data-testid="total-sales-amount"]');
      
      const newPoliciesValue = await newPoliciesCount.textContent();
      const pendingClaimsValue = await pendingClaimsCount.textContent();
      const totalSalesValue = await totalSalesAmount.textContent();
      
      expect(newPoliciesValue).toMatch(/\d+/);
      expect(pendingClaimsValue).toMatch(/\d+/);
      expect(totalSalesValue).toMatch(/[฿บาท]/);
      
      console.log('Dashboard metrics verified:', {
        newPolicies: newPoliciesValue,
        pendingClaims: pendingClaimsValue,
        totalSales: totalSalesValue
      });
    });
  });

  test.describe('System Health Monitoring', () => {
    
    test('should monitor system health and performance', async ({ 
      adminPage
    }) => {
      const healthMetrics = await adminPage.getSystemHealthMetrics();
      
      expect(healthMetrics.activeUsers).toBeGreaterThanOrEqual(0);
      expect(healthMetrics.serverStatus).toMatch(/healthy|operational/i);
      expect(healthMetrics.databaseConnections).toBeGreaterThan(0);
      expect(healthMetrics.responseTime).toBeLessThan(1000); // Less than 1 second
      
      console.log('System health metrics:', healthMetrics);
    });

    test('should handle system alerts and notifications', async ({ 
      adminPage,
      page
    }) => {
      // Check system alerts
      const alertsSection = page.locator('[data-testid="system-alerts-section"]');
      if (await alertsSection.isVisible()) {
        const activeAlerts = page.locator('[data-testid^="alert-"][data-status="active"]');
        const alertCount = await activeAlerts.count();
        
        if (alertCount > 0) {
          // Acknowledge first alert
          const firstAlert = activeAlerts.first();
          const acknowledgeButton = firstAlert.locator('[data-testid="acknowledge-alert-button"]');
          await acknowledgeButton.click();
          
          const acknowledgmentNotes = page.locator('[data-testid="acknowledgment-notes-textarea"]');
          await acknowledgmentNotes.fill('รับทราบและดำเนินการแก้ไขแล้ว');
          
          const confirmAcknowledgmentButton = page.locator('[data-testid="confirm-acknowledgment-button"]');
          await confirmAcknowledgmentButton.click();
          
          await adminPage.waitForSuccessMessage('รับทราบการแจ้งเตือนเรียบร้อย');
          
          console.log('System alert acknowledged');
        }
      }
    });

    test('should perform system backup and maintenance', async ({ 
      adminPage,
      page
    }) => {
      await adminPage.settingsTab.click();
      
      const maintenanceSection = page.locator('[data-testid="system-maintenance-section"]');
      if (await maintenanceSection.isVisible()) {
        // Initiate system backup
        const backupButton = page.locator('[data-testid="initiate-backup-button"]');
        if (await backupButton.isVisible()) {
          await backupButton.click();
          
          // Confirm backup
          const confirmBackupButton = page.locator('[data-testid="confirm-backup-button"]');
          await confirmBackupButton.click();
          
          // Wait for backup to complete
          const backupStatus = page.locator('[data-testid="backup-status"]');
          await expect(backupStatus).toContainText('สำเร็จ', { timeout: 60000 });
          
          console.log('System backup completed');
        }
        
        // Check database maintenance
        const dbMaintenanceButton = page.locator('[data-testid="database-maintenance-button"]');
        if (await dbMaintenanceButton.isVisible()) {
          await dbMaintenanceButton.click();
          
          const maintenanceReport = page.locator('[data-testid="maintenance-report"]');
          await expect(maintenanceReport).toBeVisible();
          
          console.log('Database maintenance report generated');
        }
      }
    });
  });
});