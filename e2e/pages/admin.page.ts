import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Admin Page Object for Thai Auto Insurance Application
 * 
 * Handles administrative operations:
 * - User management and roles
 * - Policy administration
 * - Claims processing and approval
 * - Reports and analytics
 * - System configuration
 * - Agent management
 * - Regulatory compliance (Thai insurance requirements)
 */
export class AdminPage extends BasePage {
  // Main navigation
  readonly adminDashboard: Locator;
  readonly usersManagementTab: Locator;
  readonly policiesManagementTab: Locator;
  readonly claimsManagementTab: Locator;
  readonly agentsManagementTab: Locator;
  readonly reportsTab: Locator;
  readonly settingsTab: Locator;
  
  // User Management
  readonly userListContainer: Locator;
  readonly createUserButton: Locator;
  readonly userSearchInput: Locator;
  readonly userRoleFilter: Locator;
  readonly userStatusFilter: Locator;
  
  // User Creation/Edit Form
  readonly userFormModal: Locator;
  readonly userEmailInput: Locator;
  readonly userFirstNameInput: Locator;
  readonly userLastNameInput: Locator;
  readonly userRoleSelect: Locator;
  readonly userStatusSelect: Locator;
  readonly userPermissionsCheckboxes: Locator;
  readonly saveUserButton: Locator;
  
  // Policy Management
  readonly policyListContainer: Locator;
  readonly policySearchInput: Locator;
  readonly policyStatusFilter: Locator;
  readonly approvePolicyButton: Locator;
  readonly rejectPolicyButton: Locator;
  readonly policyDetailsModal: Locator;
  
  // Claims Management
  readonly claimListContainer: Locator;
  readonly pendingClaimsTab: Locator;
  readonly approvedClaimsTab: Locator;
  readonly rejectedClaimsTab: Locator;
  readonly claimSearchInput: Locator;
  readonly approveClaimButton: Locator;
  readonly rejectClaimButton: Locator;
  readonly claimDetailsModal: Locator;
  readonly assignInspectorButton: Locator;
  
  // Agent Management
  readonly agentListContainer: Locator;
  readonly createAgentButton: Locator;
  readonly agentSearchInput: Locator;
  readonly agentPerformanceMetrics: Locator;
  readonly agentCommissionSettings: Locator;
  
  // Reports and Analytics
  readonly reportsContainer: Locator;
  readonly salesReportButton: Locator;
  readonly claimsReportButton: Locator;
  readonly financialReportButton: Locator;
  readonly reportDateRangeInput: Locator;
  readonly generateReportButton: Locator;
  readonly exportReportButton: Locator;
  
  // System Settings
  readonly systemSettingsContainer: Locator;
  readonly insuranceRatesSettings: Locator;
  readonly coverageTypesSettings: Locator;
  readonly repairShopsSettings: Locator;
  readonly regulatorySettings: Locator;
  
  constructor(page: Page) {
    super(page);
    
    // Main navigation
    this.adminDashboard = page.locator('[data-testid="admin-dashboard"]');
    this.usersManagementTab = page.locator('[data-testid="users-management-tab"]');
    this.policiesManagementTab = page.locator('[data-testid="policies-management-tab"]');
    this.claimsManagementTab = page.locator('[data-testid="claims-management-tab"]');
    this.agentsManagementTab = page.locator('[data-testid="agents-management-tab"]');
    this.reportsTab = page.locator('[data-testid="reports-tab"]');
    this.settingsTab = page.locator('[data-testid="settings-tab"]');
    
    // User Management
    this.userListContainer = page.locator('[data-testid="user-list-container"]');
    this.createUserButton = page.locator('[data-testid="create-user-button"]');
    this.userSearchInput = page.locator('[data-testid="user-search-input"]');
    this.userRoleFilter = page.locator('[data-testid="user-role-filter"]');
    this.userStatusFilter = page.locator('[data-testid="user-status-filter"]');
    
    // User Form
    this.userFormModal = page.locator('[data-testid="user-form-modal"]');
    this.userEmailInput = page.locator('[data-testid="user-email-input"]');
    this.userFirstNameInput = page.locator('[data-testid="user-first-name-input"]');
    this.userLastNameInput = page.locator('[data-testid="user-last-name-input"]');
    this.userRoleSelect = page.locator('[data-testid="user-role-select"]');
    this.userStatusSelect = page.locator('[data-testid="user-status-select"]');
    this.userPermissionsCheckboxes = page.locator('[data-testid^="permission-checkbox-"]');
    this.saveUserButton = page.locator('[data-testid="save-user-button"]');
    
    // Policy Management
    this.policyListContainer = page.locator('[data-testid="policy-list-container"]');
    this.policySearchInput = page.locator('[data-testid="policy-search-input"]');
    this.policyStatusFilter = page.locator('[data-testid="policy-status-filter"]');
    this.approvePolicyButton = page.locator('[data-testid="approve-policy-button"]');
    this.rejectPolicyButton = page.locator('[data-testid="reject-policy-button"]');
    this.policyDetailsModal = page.locator('[data-testid="policy-details-modal"]');
    
    // Claims Management
    this.claimListContainer = page.locator('[data-testid="claim-list-container"]');
    this.pendingClaimsTab = page.locator('[data-testid="pending-claims-tab"]');
    this.approvedClaimsTab = page.locator('[data-testid="approved-claims-tab"]');
    this.rejectedClaimsTab = page.locator('[data-testid="rejected-claims-tab"]');
    this.claimSearchInput = page.locator('[data-testid="claim-search-input"]');
    this.approveClaimButton = page.locator('[data-testid="approve-claim-button"]');
    this.rejectClaimButton = page.locator('[data-testid="reject-claim-button"]');
    this.claimDetailsModal = page.locator('[data-testid="claim-details-modal"]');
    this.assignInspectorButton = page.locator('[data-testid="assign-inspector-button"]');
    
    // Agent Management
    this.agentListContainer = page.locator('[data-testid="agent-list-container"]');
    this.createAgentButton = page.locator('[data-testid="create-agent-button"]');
    this.agentSearchInput = page.locator('[data-testid="agent-search-input"]');
    this.agentPerformanceMetrics = page.locator('[data-testid="agent-performance-metrics"]');
    this.agentCommissionSettings = page.locator('[data-testid="agent-commission-settings"]');
    
    // Reports
    this.reportsContainer = page.locator('[data-testid="reports-container"]');
    this.salesReportButton = page.locator('[data-testid="sales-report-button"]');
    this.claimsReportButton = page.locator('[data-testid="claims-report-button"]');
    this.financialReportButton = page.locator('[data-testid="financial-report-button"]');
    this.reportDateRangeInput = page.locator('[data-testid="report-date-range-input"]');
    this.generateReportButton = page.locator('[data-testid="generate-report-button"]');
    this.exportReportButton = page.locator('[data-testid="export-report-button"]');
    
    // Settings
    this.systemSettingsContainer = page.locator('[data-testid="system-settings-container"]');
    this.insuranceRatesSettings = page.locator('[data-testid="insurance-rates-settings"]');
    this.coverageTypesSettings = page.locator('[data-testid="coverage-types-settings"]');
    this.repairShopsSettings = page.locator('[data-testid="repair-shops-settings"]');
    this.regulatorySettings = page.locator('[data-testid="regulatory-settings"]');
  }

  /**
   * Navigate to admin dashboard
   */
  async navigate(): Promise<void> {
    await this.goto('/admin');
    await this.verifyAdminPageLoaded();
  }

  /**
   * Verify admin page is loaded and accessible
   */
  async verifyAdminPageLoaded(): Promise<void> {
    await expect(this.adminDashboard).toBeVisible();
    await expect(this.page).toHaveTitle(/ผู้ดูแลระบบ|Admin/);
    
    // Verify admin navigation is present
    await expect(this.usersManagementTab).toBeVisible();
    await expect(this.policiesManagementTab).toBeVisible();
    await expect(this.claimsManagementTab).toBeVisible();
  }

  /**
   * Navigate to user management section
   */
  async navigateToUserManagement(): Promise<void> {
    await this.usersManagementTab.click();
    await expect(this.userListContainer).toBeVisible();
    await this.waitForApiResponse('/api/admin/users');
  }

  /**
   * Create new user account
   */
  async createUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    role: 'ADMIN' | 'AGENT' | 'CUSTOMER';
    status: 'ACTIVE' | 'INACTIVE';
    permissions?: string[];
  }): Promise<void> {
    await this.navigateToUserManagement();
    
    await this.createUserButton.click();
    await expect(this.userFormModal).toBeVisible();
    
    // Fill user details
    await this.fillField(this.userEmailInput, userData.email);
    await this.fillField(this.userFirstNameInput, userData.firstName);
    await this.fillField(this.userLastNameInput, userData.lastName);
    
    // Select role and status
    await this.selectOption(this.userRoleSelect, userData.role);
    await this.selectOption(this.userStatusSelect, userData.status);
    
    // Set permissions if provided
    if (userData.permissions) {
      for (const permission of userData.permissions) {
        const permissionCheckbox = this.page.locator(`[data-testid="permission-checkbox-${permission}"]`);
        await permissionCheckbox.check();
      }
    }
    
    // Save user
    await this.saveUserButton.click();
    await this.waitForSuccessMessage('สร้างผู้ใช้เรียบร้อย');
    
    await this.takeScreenshot(`user-created-${userData.email}`);
  }

  /**
   * Search and filter users
   */
  async searchUsers(criteria: {
    searchTerm?: string;
    role?: string;
    status?: string;
  }): Promise<number> {
    await this.navigateToUserManagement();
    
    if (criteria.searchTerm) {
      await this.fillField(this.userSearchInput, criteria.searchTerm);
    }
    
    if (criteria.role) {
      await this.selectOption(this.userRoleFilter, criteria.role);
    }
    
    if (criteria.status) {
      await this.selectOption(this.userStatusFilter, criteria.status);
    }
    
    // Wait for search results
    await this.waitForApiResponse('/api/admin/users/search');
    
    // Count results
    return await this.page.locator('[data-testid^="user-row-"]').count();
  }

  /**
   * Navigate to policy management section
   */
  async navigateToPolicyManagement(): Promise<void> {
    await this.policiesManagementTab.click();
    await expect(this.policyListContainer).toBeVisible();
    await this.waitForApiResponse('/api/admin/policies');
  }

  /**
   * Review and approve/reject policy application
   */
  async reviewPolicy(policyNumber: string, action: 'approve' | 'reject', notes?: string): Promise<void> {
    await this.navigateToPolicyManagement();
    
    // Find policy in list
    const policyRow = this.page.locator(`[data-testid="policy-row-${policyNumber}"]`);
    await policyRow.click();
    
    // Open policy details
    await expect(this.policyDetailsModal).toBeVisible();
    
    if (action === 'approve') {
      await this.approvePolicyButton.click();
      
      if (notes) {
        const approvalNotesTextarea = this.page.locator('[data-testid="approval-notes-textarea"]');
        await this.fillField(approvalNotesTextarea, notes);
      }
      
      const confirmApprovalButton = this.page.locator('[data-testid="confirm-approval-button"]');
      await confirmApprovalButton.click();
      
      await this.waitForSuccessMessage('อนุมัติกรมธรรม์เรียบร้อย');
    } else {
      await this.rejectPolicyButton.click();
      
      const rejectionReasonTextarea = this.page.locator('[data-testid="rejection-reason-textarea"]');
      await this.fillField(rejectionReasonTextarea, notes || 'ไม่ผ่านเกณฑ์การพิจารณา');
      
      const confirmRejectionButton = this.page.locator('[data-testid="confirm-rejection-button"]');
      await confirmRejectionButton.click();
      
      await this.waitForSuccessMessage('ปฏิเสธกรมธรรม์เรียบร้อย');
    }
    
    await this.takeScreenshot(`policy-${action}-${policyNumber}`);
  }

  /**
   * Navigate to claims management section
   */
  async navigateToClaimsManagement(): Promise<void> {
    await this.claimsManagementTab.click();
    await expect(this.claimListContainer).toBeVisible();
    await this.waitForApiResponse('/api/admin/claims');
  }

  /**
   * Review and process insurance claim
   */
  async processClaim(claimNumber: string, action: 'approve' | 'reject' | 'investigate', details?: {
    approvedAmount?: number;
    rejectionReason?: string;
    inspectorId?: string;
    notes?: string;
  }): Promise<void> {
    await this.navigateToClaimsManagement();
    
    // Find claim in list
    const claimRow = this.page.locator(`[data-testid="claim-row-${claimNumber}"]`);
    await claimRow.click();
    
    // Open claim details
    await expect(this.claimDetailsModal).toBeVisible();
    
    switch (action) {
      case 'approve':
        await this.approveClaimButton.click();
        
        if (details?.approvedAmount) {
          const approvedAmountInput = this.page.locator('[data-testid="approved-amount-input"]');
          await this.fillField(approvedAmountInput, details.approvedAmount.toString());
        }
        
        if (details?.notes) {
          const approvalNotesTextarea = this.page.locator('[data-testid="approval-notes-textarea"]');
          await this.fillField(approvalNotesTextarea, details.notes);
        }
        
        const confirmApprovalButton = this.page.locator('[data-testid="confirm-claim-approval-button"]');
        await confirmApprovalButton.click();
        
        await this.waitForSuccessMessage('อนุมัติเคลมเรียบร้อย');
        break;
        
      case 'reject':
        await this.rejectClaimButton.click();
        
        const rejectionReasonTextarea = this.page.locator('[data-testid="rejection-reason-textarea"]');
        await this.fillField(rejectionReasonTextarea, details?.rejectionReason || 'ไม่อยู่ในเงื่อนไขความคุ้มครอง');
        
        const confirmRejectionButton = this.page.locator('[data-testid="confirm-claim-rejection-button"]');
        await confirmRejectionButton.click();
        
        await this.waitForSuccessMessage('ปฏิเสธเคลมเรียบร้อย');
        break;
        
      case 'investigate':
        await this.assignInspectorButton.click();
        
        if (details?.inspectorId) {
          const inspectorSelect = this.page.locator('[data-testid="inspector-select"]');
          await this.selectOption(inspectorSelect, details.inspectorId);
        }
        
        if (details?.notes) {
          const investigationNotesTextarea = this.page.locator('[data-testid="investigation-notes-textarea"]');
          await this.fillField(investigationNotesTextarea, details.notes);
        }
        
        const assignInspectorButton = this.page.locator('[data-testid="confirm-assign-inspector-button"]');
        await assignInspectorButton.click();
        
        await this.waitForSuccessMessage('มอบหมายผู้ตรวจสอบเรียบร้อย');
        break;
    }
    
    await this.takeScreenshot(`claim-${action}-${claimNumber}`);
  }

  /**
   * View pending claims requiring attention
   */
  async viewPendingClaims(): Promise<{
    count: number;
    averageProcessingTime: number;
  }> {
    await this.navigateToClaimsManagement();
    await this.pendingClaimsTab.click();
    
    // Wait for pending claims data
    await this.waitForApiResponse('/api/admin/claims?status=pending');
    
    const pendingCount = await this.page.locator('[data-testid^="claim-row-"]').count();
    
    // Get average processing time from dashboard metrics
    const avgProcessingTimeElement = this.page.locator('[data-testid="avg-processing-time"]');
    const avgProcessingTimeText = await avgProcessingTimeElement.textContent();
    const averageProcessingTime = parseInt(avgProcessingTimeText?.match(/\d+/)?.[0] || '0');
    
    return {
      count: pendingCount,
      averageProcessingTime
    };
  }

  /**
   * Generate financial report
   */
  async generateFinancialReport(dateRange: {
    startDate: string;
    endDate: string;
  }, reportType: 'sales' | 'claims' | 'comprehensive'): Promise<void> {
    await this.reportsTab.click();
    await expect(this.reportsContainer).toBeVisible();
    
    // Set date range
    await this.fillField(this.reportDateRangeInput, `${dateRange.startDate} - ${dateRange.endDate}`);
    
    // Select report type
    switch (reportType) {
      case 'sales':
        await this.salesReportButton.click();
        break;
      case 'claims':
        await this.claimsReportButton.click();
        break;
      case 'comprehensive':
        await this.financialReportButton.click();
        break;
    }
    
    // Generate report
    await this.generateReportButton.click();
    await this.waitForApiResponse('/api/admin/reports/generate');
    
    // Wait for report to be ready
    await this.page.waitForSelector('[data-testid="report-ready"]', { timeout: 30000 });
    
    await this.takeScreenshot(`${reportType}-report-generated`);
  }

  /**
   * Export report to PDF/Excel
   */
  async exportReport(format: 'pdf' | 'excel'): Promise<void> {
    // Start waiting for download
    const downloadPromise = this.page.waitForEvent('download');
    
    await this.exportReportButton.click();
    
    // Select format
    const formatOption = this.page.locator(`[data-testid="export-format-${format}"]`);
    await formatOption.click();
    
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(new RegExp(`\\.${format === 'excel' ? 'xlsx' : 'pdf'}$`));
  }

  /**
   * Manage agent performance and commissions
   */
  async manageAgentCommission(agentId: string, commissionRate: number): Promise<void> {
    await this.agentsManagementTab.click();
    await expect(this.agentListContainer).toBeVisible();
    
    // Find agent
    const agentRow = this.page.locator(`[data-testid="agent-row-${agentId}"]`);
    await agentRow.click();
    
    // Open commission settings
    await this.agentCommissionSettings.click();
    
    const commissionRateInput = this.page.locator('[data-testid="commission-rate-input"]');
    await this.fillField(commissionRateInput, commissionRate.toString());
    
    const saveCommissionButton = this.page.locator('[data-testid="save-commission-button"]');
    await saveCommissionButton.click();
    
    await this.waitForSuccessMessage('อัปเดตอัตราค่าคอมมิชชันเรียบร้อย');
  }

  /**
   * View agent performance metrics
   */
  async getAgentPerformanceMetrics(agentId: string): Promise<{
    totalSales: number;
    totalPolicies: number;
    customerSatisfaction: number;
    conversionRate: number;
  }> {
    await this.agentsManagementTab.click();
    
    const agentRow = this.page.locator(`[data-testid="agent-row-${agentId}"]`);
    await agentRow.click();
    
    await expect(this.agentPerformanceMetrics).toBeVisible();
    
    const totalSalesElement = this.page.locator('[data-testid="agent-total-sales"]');
    const totalPoliciesElement = this.page.locator('[data-testid="agent-total-policies"]');
    const satisfactionElement = this.page.locator('[data-testid="agent-satisfaction"]');
    const conversionElement = this.page.locator('[data-testid="agent-conversion-rate"]');
    
    const totalSales = parseFloat(await totalSalesElement.textContent() || '0');
    const totalPolicies = parseInt(await totalPoliciesElement.textContent() || '0');
    const customerSatisfaction = parseFloat(await satisfactionElement.textContent() || '0');
    const conversionRate = parseFloat(await conversionElement.textContent() || '0');
    
    return {
      totalSales,
      totalPolicies,
      customerSatisfaction,
      conversionRate
    };
  }

  /**
   * Configure system settings (insurance rates, coverage types, etc.)
   */
  async configureInsuranceRates(rateUpdates: {
    vehicleType: string;
    baseRate: number;
    adjustmentFactor: number;
  }[]): Promise<void> {
    await this.settingsTab.click();
    await expect(this.systemSettingsContainer).toBeVisible();
    
    await this.insuranceRatesSettings.click();
    
    for (const update of rateUpdates) {
      const vehicleTypeRow = this.page.locator(`[data-testid="rate-row-${update.vehicleType}"]`);
      
      const baseRateInput = vehicleTypeRow.locator('[data-testid="base-rate-input"]');
      await this.fillField(baseRateInput, update.baseRate.toString());
      
      const adjustmentFactorInput = vehicleTypeRow.locator('[data-testid="adjustment-factor-input"]');
      await this.fillField(adjustmentFactorInput, update.adjustmentFactor.toString());
    }
    
    const saveRatesButton = this.page.locator('[data-testid="save-rates-button"]');
    await saveRatesButton.click();
    
    await this.waitForSuccessMessage('อัปเดตอัตราประกันภัยเรียบร้อย');
  }

  /**
   * Monitor system health and performance
   */
  async getSystemHealthMetrics(): Promise<{
    activeUsers: number;
    serverStatus: string;
    databaseConnections: number;
    responseTime: number;
  }> {
    // Navigate to system health dashboard
    const systemHealthTab = this.page.locator('[data-testid="system-health-tab"]');
    await systemHealthTab.click();
    
    const activeUsersElement = this.page.locator('[data-testid="active-users-count"]');
    const serverStatusElement = this.page.locator('[data-testid="server-status"]');
    const dbConnectionsElement = this.page.locator('[data-testid="db-connections-count"]');
    const responseTimeElement = this.page.locator('[data-testid="avg-response-time"]');
    
    const activeUsers = parseInt(await activeUsersElement.textContent() || '0');
    const serverStatus = await serverStatusElement.textContent() || '';
    const databaseConnections = parseInt(await dbConnectionsElement.textContent() || '0');
    const responseTime = parseFloat(await responseTimeElement.textContent() || '0');
    
    return {
      activeUsers,
      serverStatus,
      databaseConnections,
      responseTime
    };
  }

  /**
   * Verify Thai regulatory compliance settings
   */
  async verifyRegulatoryCompliance(): Promise<void> {
    await this.settingsTab.click();
    await this.regulatorySettings.click();
    
    // Check for Thai insurance regulatory requirements
    await expect(this.page.locator('text=การประกันภัยแบบบังคับ')).toBeVisible();
    await expect(this.page.locator('text=พรบ. คุ้มครองผู้ประสบภัย')).toBeVisible();
    await expect(this.page.locator('text=กรมการประกันภัย')).toBeVisible();
  }
}