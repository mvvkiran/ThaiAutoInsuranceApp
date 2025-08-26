import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { VehicleData, PolicyData } from '../utils/thai-data-generator';

/**
 * Policy Page Object for Thai Auto Insurance Application
 * 
 * Handles policy-related operations:
 * - Policy creation and application
 * - Vehicle information management
 * - Coverage selection
 * - Premium calculation
 * - Policy management and renewal
 * - Thai insurance terms and conditions
 */
export class PolicyPage extends BasePage {
  // Policy creation form sections
  readonly policyFormContainer: Locator;
  readonly vehicleInfoSection: Locator;
  readonly coverageSelectionSection: Locator;
  readonly premiumCalculationSection: Locator;
  readonly personalInfoSection: Locator;
  
  // Vehicle information fields
  readonly vehicleMakeSelect: Locator;
  readonly vehicleModelSelect: Locator;
  readonly vehicleYearSelect: Locator;
  readonly licensePlateInput: Locator;
  readonly chassisNumberInput: Locator;
  readonly engineNumberInput: Locator;
  readonly vehicleColorSelect: Locator;
  readonly vehicleProvinceSelect: Locator;
  
  // Coverage options
  readonly coverageTypeSelect: Locator;
  readonly liabilityAmountSelect: Locator;
  readonly comprehensiveCoverageCheckbox: Locator;
  readonly collisionCoverageCheckbox: Locator;
  readonly theftCoverageCheckbox: Locator;
  readonly floodCoverageCheckbox: Locator;
  readonly personalAccidentCoverageCheckbox: Locator;
  readonly medicalExpenseCoverageCheckbox: Locator;
  
  // Deductible options
  readonly comprehensiveDeductibleSelect: Locator;
  readonly collisionDeductibleSelect: Locator;
  
  // Premium calculation
  readonly basePremiumAmount: Locator;
  readonly discountAmount: Locator;
  readonly taxAmount: Locator;
  readonly totalPremiumAmount: Locator;
  readonly calculatePremiumButton: Locator;
  
  // Policy management
  readonly policyListContainer: Locator;
  readonly activePoliciesTab: Locator;
  readonly expiredPoliciesTab: Locator;
  readonly renewPolicyButton: Locator;
  readonly cancelPolicyButton: Locator;
  readonly downloadPolicyButton: Locator;
  
  // Form controls
  readonly submitApplicationButton: Locator;
  readonly saveAsDraftButton: Locator;
  readonly backButton: Locator;
  readonly nextStepButton: Locator;
  
  constructor(page: Page) {
    super(page);
    
    // Form sections
    this.policyFormContainer = page.locator('[data-testid="policy-form-container"]');
    this.vehicleInfoSection = page.locator('[data-testid="vehicle-info-section"]');
    this.coverageSelectionSection = page.locator('[data-testid="coverage-selection-section"]');
    this.premiumCalculationSection = page.locator('[data-testid="premium-calculation-section"]');
    this.personalInfoSection = page.locator('[data-testid="personal-info-section"]');
    
    // Vehicle fields
    this.vehicleMakeSelect = page.locator('[data-testid="vehicle-make-select"]');
    this.vehicleModelSelect = page.locator('[data-testid="vehicle-model-select"]');
    this.vehicleYearSelect = page.locator('[data-testid="vehicle-year-select"]');
    this.licensePlateInput = page.locator('[data-testid="license-plate-input"]');
    this.chassisNumberInput = page.locator('[data-testid="chassis-number-input"]');
    this.engineNumberInput = page.locator('[data-testid="engine-number-input"]');
    this.vehicleColorSelect = page.locator('[data-testid="vehicle-color-select"]');
    this.vehicleProvinceSelect = page.locator('[data-testid="vehicle-province-select"]');
    
    // Coverage options
    this.coverageTypeSelect = page.locator('[data-testid="coverage-type-select"]');
    this.liabilityAmountSelect = page.locator('[data-testid="liability-amount-select"]');
    this.comprehensiveCoverageCheckbox = page.locator('[data-testid="comprehensive-coverage-checkbox"]');
    this.collisionCoverageCheckbox = page.locator('[data-testid="collision-coverage-checkbox"]');
    this.theftCoverageCheckbox = page.locator('[data-testid="theft-coverage-checkbox"]');
    this.floodCoverageCheckbox = page.locator('[data-testid="flood-coverage-checkbox"]');
    this.personalAccidentCoverageCheckbox = page.locator('[data-testid="personal-accident-coverage-checkbox"]');
    this.medicalExpenseCoverageCheckbox = page.locator('[data-testid="medical-expense-coverage-checkbox"]');
    
    // Deductibles
    this.comprehensiveDeductibleSelect = page.locator('[data-testid="comprehensive-deductible-select"]');
    this.collisionDeductibleSelect = page.locator('[data-testid="collision-deductible-select"]');
    
    // Premium calculation
    this.basePremiumAmount = page.locator('[data-testid="base-premium-amount"]');
    this.discountAmount = page.locator('[data-testid="discount-amount"]');
    this.taxAmount = page.locator('[data-testid="tax-amount"]');
    this.totalPremiumAmount = page.locator('[data-testid="total-premium-amount"]');
    this.calculatePremiumButton = page.locator('[data-testid="calculate-premium-button"]');
    
    // Policy management
    this.policyListContainer = page.locator('[data-testid="policy-list-container"]');
    this.activePoliciesTab = page.locator('[data-testid="active-policies-tab"]');
    this.expiredPoliciesTab = page.locator('[data-testid="expired-policies-tab"]');
    this.renewPolicyButton = page.locator('[data-testid="renew-policy-button"]');
    this.cancelPolicyButton = page.locator('[data-testid="cancel-policy-button"]');
    this.downloadPolicyButton = page.locator('[data-testid="download-policy-button"]');
    
    // Form controls
    this.submitApplicationButton = page.locator('[data-testid="submit-application-button"]');
    this.saveAsDraftButton = page.locator('[data-testid="save-as-draft-button"]');
    this.backButton = page.locator('[data-testid="back-button"]');
    this.nextStepButton = page.locator('[data-testid="next-step-button"]');
  }

  /**
   * Navigate to new policy creation page
   */
  async navigateToNewPolicy(): Promise<void> {
    await this.goto('/policies/new');
    await this.verifyNewPolicyPageLoaded();
  }

  /**
   * Navigate to policy management page
   */
  async navigateToPolicyList(): Promise<void> {
    await this.goto('/policies');
    await this.verifyPolicyListPageLoaded();
  }

  /**
   * Verify new policy page is loaded
   */
  async verifyNewPolicyPageLoaded(): Promise<void> {
    await expect(this.policyFormContainer).toBeVisible();
    await expect(this.vehicleInfoSection).toBeVisible();
    await expect(this.page).toHaveTitle(/กรมธรรม์ใหม่|New Policy/);
  }

  /**
   * Verify policy list page is loaded
   */
  async verifyPolicyListPageLoaded(): Promise<void> {
    await expect(this.policyListContainer).toBeVisible();
    await expect(this.activePoliciesTab).toBeVisible();
    await expect(this.page).toHaveTitle(/กรมธรรม์ของฉัน|My Policies/);
  }

  /**
   * Create a new auto insurance policy with Thai data
   */
  async createNewPolicy(vehicleData: VehicleData, policyData: PolicyData): Promise<string> {
    // Step 1: Fill vehicle information
    await this.fillVehicleInformation(vehicleData);
    
    // Step 2: Select coverage options
    await this.selectCoverageOptions(policyData);
    
    // Step 3: Calculate premium
    await this.calculatePremium();
    
    // Step 4: Submit application
    await this.submitPolicyApplication();
    
    // Return policy number
    return await this.getPolicyNumber();
  }

  /**
   * Fill vehicle information form
   */
  async fillVehicleInformation(vehicleData: VehicleData): Promise<void> {
    // Select vehicle make
    await this.selectOption(this.vehicleMakeSelect, vehicleData.make);
    
    // Wait for models to load
    await this.page.waitForTimeout(1000);
    
    // Select vehicle model
    await this.selectOption(this.vehicleModelSelect, vehicleData.model);
    
    // Select vehicle year
    await this.selectOption(this.vehicleYearSelect, vehicleData.year.toString());
    
    // Fill license plate (Thai format)
    await this.fillField(this.licensePlateInput, vehicleData.licensePlate);
    
    // Fill chassis and engine numbers
    await this.fillField(this.chassisNumberInput, vehicleData.chassisNumber);
    await this.fillField(this.engineNumberInput, vehicleData.engineNumber);
    
    // Select color
    await this.selectOption(this.vehicleColorSelect, vehicleData.color);
    
    // Select province
    await this.selectOption(this.vehicleProvinceSelect, vehicleData.province);
    
    await this.takeScreenshot('vehicle-information-completed');
  }

  /**
   * Select coverage options
   */
  async selectCoverageOptions(policyData: PolicyData): Promise<void> {
    // Select coverage type (Type 1, Type 2+, Type 3+)
    await this.selectOption(this.coverageTypeSelect, policyData.coverageType);
    
    // Select liability amount
    await this.selectOption(this.liabilityAmountSelect, policyData.liabilityAmount.toString());
    
    // Select optional coverages
    if (policyData.comprehensiveCoverage) {
      await this.comprehensiveCoverageCheckbox.check();
      await this.selectOption(this.comprehensiveDeductibleSelect, policyData.comprehensiveDeductible?.toString() || '5000');
    }
    
    if (policyData.collisionCoverage) {
      await this.collisionCoverageCheckbox.check();
      await this.selectOption(this.collisionDeductibleSelect, policyData.collisionDeductible?.toString() || '5000');
    }
    
    if (policyData.theftCoverage) {
      await this.theftCoverageCheckbox.check();
    }
    
    if (policyData.floodCoverage) {
      await this.floodCoverageCheckbox.check();
    }
    
    if (policyData.personalAccidentCoverage) {
      await this.personalAccidentCoverageCheckbox.check();
    }
    
    if (policyData.medicalExpenseCoverage) {
      await this.medicalExpenseCoverageCheckbox.check();
    }
    
    await this.takeScreenshot('coverage-selection-completed');
  }

  /**
   * Calculate premium based on selected options
   */
  async calculatePremium(): Promise<{
    basePremium: number;
    discount: number;
    tax: number;
    totalPremium: number;
  }> {
    await this.calculatePremiumButton.click();
    
    // Wait for calculation to complete
    await this.waitForApiResponse('/api/premium/calculate');
    await this.page.waitForTimeout(2000);
    
    // Extract premium amounts
    const basePremiumText = await this.basePremiumAmount.textContent();
    const discountText = await this.discountAmount.textContent();
    const taxText = await this.taxAmount.textContent();
    const totalPremiumText = await this.totalPremiumAmount.textContent();
    
    const basePremium = this.extractNumberFromThaiCurrency(basePremiumText || '');
    const discount = this.extractNumberFromThaiCurrency(discountText || '');
    const tax = this.extractNumberFromThaiCurrency(taxText || '');
    const totalPremium = this.extractNumberFromThaiCurrency(totalPremiumText || '');
    
    await this.takeScreenshot('premium-calculation-completed');
    
    return { basePremium, discount, tax, totalPremium };
  }

  /**
   * Submit policy application
   */
  async submitPolicyApplication(): Promise<void> {
    await this.submitApplicationButton.click();
    
    // Wait for submission to complete
    await this.waitForApiResponse('/api/policies');
    
    // Verify success message
    await this.waitForSuccessMessage();
    
    // Should redirect to policy confirmation or list
    await this.page.waitForURL(/\/(policies|confirmation)/);
    
    await this.takeScreenshot('policy-application-submitted');
  }

  /**
   * Get policy number from confirmation page
   */
  async getPolicyNumber(): Promise<string> {
    const policyNumberElement = this.page.locator('[data-testid="policy-number"]');
    await expect(policyNumberElement).toBeVisible();
    
    const policyNumberText = await policyNumberElement.textContent();
    
    // Extract policy number from text like "เลขที่กรมธรรม์: POL-2024-001234"
    const match = policyNumberText?.match(/POL-\d{4}-\d{6}/);
    return match ? match[0] : '';
  }

  /**
   * Save policy as draft
   */
  async saveAsDraft(): Promise<void> {
    await this.saveAsDraftButton.click();
    await this.waitForSuccessMessage('บันทึกร่างเรียบร้อย');
  }

  /**
   * View active policies
   */
  async viewActivePolicies(): Promise<void> {
    await this.activePoliciesTab.click();
    await this.waitForApiResponse('/api/policies?status=active');
  }

  /**
   * View expired policies
   */
  async viewExpiredPolicies(): Promise<void> {
    await this.expiredPoliciesTab.click();
    await this.waitForApiResponse('/api/policies?status=expired');
  }

  /**
   * Renew a policy
   */
  async renewPolicy(policyNumber: string): Promise<void> {
    // Find policy in list and click renew button
    const policyRow = this.page.locator(`[data-testid="policy-row-${policyNumber}"]`);
    const renewButton = policyRow.locator('[data-testid="renew-button"]');
    
    await renewButton.click();
    
    // Should navigate to renewal page or open renewal modal
    const renewalForm = this.page.locator('[data-testid="renewal-form"]');
    await expect(renewalForm).toBeVisible();
    
    // Complete renewal process
    const confirmRenewalButton = this.page.locator('[data-testid="confirm-renewal-button"]');
    await confirmRenewalButton.click();
    
    await this.waitForSuccessMessage('ต่ออายุกรมธรรม์เรียบร้อย');
  }

  /**
   * Cancel a policy
   */
  async cancelPolicy(policyNumber: string, reason: string): Promise<void> {
    const policyRow = this.page.locator(`[data-testid="policy-row-${policyNumber}"]`);
    const cancelButton = policyRow.locator('[data-testid="cancel-button"]');
    
    await cancelButton.click();
    
    // Fill cancellation reason
    const cancellationModal = this.page.locator('[data-testid="cancellation-modal"]');
    await expect(cancellationModal).toBeVisible();
    
    const reasonTextarea = this.page.locator('[data-testid="cancellation-reason-textarea"]');
    await this.fillField(reasonTextarea, reason);
    
    const confirmCancelButton = this.page.locator('[data-testid="confirm-cancel-button"]');
    await confirmCancelButton.click();
    
    await this.waitForSuccessMessage('ยกเลิกกรมธรรม์เรียบร้อย');
  }

  /**
   * Download policy document
   */
  async downloadPolicy(policyNumber: string): Promise<void> {
    const policyRow = this.page.locator(`[data-testid="policy-row-${policyNumber}"]`);
    const downloadButton = policyRow.locator('[data-testid="download-button"]');
    
    // Start waiting for download
    const downloadPromise = this.page.waitForEvent('download');
    
    await downloadButton.click();
    
    const download = await downloadPromise;
    
    // Verify download started
    expect(download.suggestedFilename()).toContain(policyNumber);
  }

  /**
   * Search policies by criteria
   */
  async searchPolicies(criteria: {
    policyNumber?: string;
    licensePlate?: string;
    status?: string;
  }): Promise<number> {
    const searchInput = this.page.locator('[data-testid="policy-search-input"]');
    const statusFilter = this.page.locator('[data-testid="status-filter-select"]');
    
    if (criteria.policyNumber) {
      await this.fillField(searchInput, criteria.policyNumber);
    } else if (criteria.licensePlate) {
      await this.fillField(searchInput, criteria.licensePlate);
    }
    
    if (criteria.status) {
      await this.selectOption(statusFilter, criteria.status);
    }
    
    // Wait for search results
    await this.waitForApiResponse('/api/policies/search');
    
    // Count results
    const resultRows = await this.page.locator('[data-testid^="policy-row-"]').count();
    return resultRows;
  }

  /**
   * Verify Thai insurance terms and conditions
   */
  async verifyThaiInsuranceTerms(): Promise<void> {
    const termsSection = this.page.locator('[data-testid="terms-and-conditions"]');
    await this.scrollIntoView(termsSection);
    
    // Check for Thai insurance specific terms
    await expect(this.page.locator('text=ข้อตกลงและเงื่อนไข')).toBeVisible();
    await expect(this.page.locator('text=กรมธรรม์ประกันภัยรถยนต์')).toBeVisible();
    await expect(this.page.locator('text=ความคุ้มครอง')).toBeVisible();
  }

  /**
   * Test Thai license plate format validation
   */
  async testLicensePlateValidation(): Promise<void> {
    const invalidPlates = [
      '123ABC',      // Invalid format
      'กก123456',    // Too many numbers
      'ABC-123',     // Wrong separator
      '1ABC2345'     // Mixed format
    ];
    
    for (const plate of invalidPlates) {
      await this.fillField(this.licensePlateInput, plate);
      await this.licensePlateInput.blur();
      
      const plateError = this.page.locator('[data-testid="license-plate-error"]');
      await expect(plateError).toBeVisible();
      
      // Clear for next test
      await this.licensePlateInput.clear();
    }
  }

  /**
   * Verify premium calculation accuracy
   */
  async verifyPremiumCalculation(expectedTotal: number, tolerance: number = 100): Promise<void> {
    const premiumData = await this.calculatePremium();
    
    // Verify total is within tolerance
    const difference = Math.abs(premiumData.totalPremium - expectedTotal);
    expect(difference).toBeLessThanOrEqual(tolerance);
    
    // Verify calculation components
    expect(premiumData.totalPremium).toBeGreaterThan(0);
    expect(premiumData.basePremium).toBeGreaterThan(0);
    expect(premiumData.tax).toBeGreaterThanOrEqual(0);
  }

  /**
   * Extract number from Thai currency text
   */
  private extractNumberFromThaiCurrency(text: string): number {
    // Remove Thai currency symbols and formatting
    const cleanedText = text.replace(/[฿บาท,\s]/g, '');
    return parseFloat(cleanedText) || 0;
  }
}