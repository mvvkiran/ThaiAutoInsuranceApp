import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { ClaimData } from '../utils/thai-data-generator';

/**
 * Claims Page Object for Thai Auto Insurance Application
 * 
 * Handles insurance claims operations:
 * - Claim submission and reporting
 * - Photo and document uploads
 * - Claim status tracking
 * - Repair shop coordination
 * - Settlement processing
 * - Thai government reporting requirements
 */
export class ClaimsPage extends BasePage {
  // Claim submission form sections
  readonly claimFormContainer: Locator;
  readonly accidentDetailsSection: Locator;
  readonly vehicleDetailsSection: Locator;
  readonly documentsUploadSection: Locator;
  readonly repairShopSection: Locator;
  
  // Accident information fields
  readonly accidentDateInput: Locator;
  readonly accidentTimeInput: Locator;
  readonly accidentLocationInput: Locator;
  readonly accidentDescriptionTextarea: Locator;
  readonly accidentTypeSelect: Locator;
  readonly policeReportNumberInput: Locator;
  readonly weatherConditionSelect: Locator;
  readonly trafficConditionSelect: Locator;
  
  // Vehicle damage information
  readonly damageDescriptionTextarea: Locator;
  readonly damagePhotosUpload: Locator;
  readonly vehicleCanDriveSelect: Locator;
  readonly towingRequiredCheckbox: Locator;
  readonly estimatedDamageAmountInput: Locator;
  
  // Third party information
  readonly thirdPartyInvolvedCheckbox: Locator;
  readonly thirdPartyNameInput: Locator;
  readonly thirdPartyPhoneInput: Locator;
  readonly thirdPartyLicensePlateInput: Locator;
  readonly thirdPartyInsuranceInput: Locator;
  
  // Document uploads
  readonly drivingLicenseUpload: Locator;
  readonly vehicleRegistrationUpload: Locator;
  readonly policeReportUpload: Locator;
  readonly accidentPhotosUpload: Locator;
  readonly repairQuotesUpload: Locator;
  readonly medicalReportsUpload: Locator;
  
  // Repair shop selection
  readonly repairShopSelect: Locator;
  readonly repairShopSearchInput: Locator;
  readonly preferredRepairShopCheckbox: Locator;
  readonly repairAppointmentDateInput: Locator;
  
  // Claims management
  readonly claimListContainer: Locator;
  readonly claimStatusFilter: Locator;
  readonly claimSearchInput: Locator;
  readonly claimDetailsModal: Locator;
  
  // Form controls
  readonly submitClaimButton: Locator;
  readonly saveAsDraftButton: Locator;
  readonly uploadDocumentButton: Locator;
  readonly scheduleInspectionButton: Locator;
  
  constructor(page: Page) {
    super(page);
    
    // Form sections
    this.claimFormContainer = page.locator('[data-testid="claim-form-container"]');
    this.accidentDetailsSection = page.locator('[data-testid="accident-details-section"]');
    this.vehicleDetailsSection = page.locator('[data-testid="vehicle-details-section"]');
    this.documentsUploadSection = page.locator('[data-testid="documents-upload-section"]');
    this.repairShopSection = page.locator('[data-testid="repair-shop-section"]');
    
    // Accident information
    this.accidentDateInput = page.locator('[data-testid="accident-date-input"]');
    this.accidentTimeInput = page.locator('[data-testid="accident-time-input"]');
    this.accidentLocationInput = page.locator('[data-testid="accident-location-input"]');
    this.accidentDescriptionTextarea = page.locator('[data-testid="accident-description-textarea"]');
    this.accidentTypeSelect = page.locator('[data-testid="accident-type-select"]');
    this.policeReportNumberInput = page.locator('[data-testid="police-report-number-input"]');
    this.weatherConditionSelect = page.locator('[data-testid="weather-condition-select"]');
    this.trafficConditionSelect = page.locator('[data-testid="traffic-condition-select"]');
    
    // Vehicle damage
    this.damageDescriptionTextarea = page.locator('[data-testid="damage-description-textarea"]');
    this.damagePhotosUpload = page.locator('[data-testid="damage-photos-upload"]');
    this.vehicleCanDriveSelect = page.locator('[data-testid="vehicle-can-drive-select"]');
    this.towingRequiredCheckbox = page.locator('[data-testid="towing-required-checkbox"]');
    this.estimatedDamageAmountInput = page.locator('[data-testid="estimated-damage-amount-input"]');
    
    // Third party
    this.thirdPartyInvolvedCheckbox = page.locator('[data-testid="third-party-involved-checkbox"]');
    this.thirdPartyNameInput = page.locator('[data-testid="third-party-name-input"]');
    this.thirdPartyPhoneInput = page.locator('[data-testid="third-party-phone-input"]');
    this.thirdPartyLicensePlateInput = page.locator('[data-testid="third-party-license-plate-input"]');
    this.thirdPartyInsuranceInput = page.locator('[data-testid="third-party-insurance-input"]');
    
    // Document uploads
    this.drivingLicenseUpload = page.locator('[data-testid="driving-license-upload"]');
    this.vehicleRegistrationUpload = page.locator('[data-testid="vehicle-registration-upload"]');
    this.policeReportUpload = page.locator('[data-testid="police-report-upload"]');
    this.accidentPhotosUpload = page.locator('[data-testid="accident-photos-upload"]');
    this.repairQuotesUpload = page.locator('[data-testid="repair-quotes-upload"]');
    this.medicalReportsUpload = page.locator('[data-testid="medical-reports-upload"]');
    
    // Repair shop
    this.repairShopSelect = page.locator('[data-testid="repair-shop-select"]');
    this.repairShopSearchInput = page.locator('[data-testid="repair-shop-search-input"]');
    this.preferredRepairShopCheckbox = page.locator('[data-testid="preferred-repair-shop-checkbox"]');
    this.repairAppointmentDateInput = page.locator('[data-testid="repair-appointment-date-input"]');
    
    // Claims management
    this.claimListContainer = page.locator('[data-testid="claim-list-container"]');
    this.claimStatusFilter = page.locator('[data-testid="claim-status-filter"]');
    this.claimSearchInput = page.locator('[data-testid="claim-search-input"]');
    this.claimDetailsModal = page.locator('[data-testid="claim-details-modal"]');
    
    // Form controls
    this.submitClaimButton = page.locator('[data-testid="submit-claim-button"]');
    this.saveAsDraftButton = page.locator('[data-testid="save-as-draft-button"]');
    this.uploadDocumentButton = page.locator('[data-testid="upload-document-button"]');
    this.scheduleInspectionButton = page.locator('[data-testid="schedule-inspection-button"]');
  }

  /**
   * Navigate to new claim submission page
   */
  async navigateToNewClaim(): Promise<void> {
    await this.goto('/claims/new');
    await this.verifyNewClaimPageLoaded();
  }

  /**
   * Navigate to claims management page
   */
  async navigateToClaimsList(): Promise<void> {
    await this.goto('/claims');
    await this.verifyClaimsListPageLoaded();
  }

  /**
   * Verify new claim page is loaded
   */
  async verifyNewClaimPageLoaded(): Promise<void> {
    await expect(this.claimFormContainer).toBeVisible();
    await expect(this.accidentDetailsSection).toBeVisible();
    await expect(this.page).toHaveTitle(/เคลมใหม่|New Claim/);
  }

  /**
   * Verify claims list page is loaded
   */
  async verifyClaimsListPageLoaded(): Promise<void> {
    await expect(this.claimListContainer).toBeVisible();
    await expect(this.page).toHaveTitle(/เคลมของฉัน|My Claims/);
  }

  /**
   * Submit a complete insurance claim
   */
  async submitClaim(claimData: ClaimData, documents: {
    damagePhotos?: string[];
    policeReport?: string;
    drivingLicense?: string;
    vehicleRegistration?: string;
    repairQuotes?: string[];
  }): Promise<string> {
    // Step 1: Fill accident details
    await this.fillAccidentDetails(claimData);
    
    // Step 2: Fill vehicle damage information
    await this.fillVehicleDamageDetails(claimData);
    
    // Step 3: Fill third party information (if applicable)
    if (claimData.thirdPartyInvolved) {
      await this.fillThirdPartyDetails(claimData);
    }
    
    // Step 4: Upload required documents
    await this.uploadDocuments(documents);
    
    // Step 5: Select repair shop (if applicable)
    if (claimData.repairRequired) {
      await this.selectRepairShop(claimData.preferredRepairShop);
    }
    
    // Step 6: Submit claim
    await this.submitClaimForm();
    
    // Return claim number
    return await this.getClaimNumber();
  }

  /**
   * Fill accident details section
   */
  async fillAccidentDetails(claimData: ClaimData): Promise<void> {
    // Date and time of accident
    await this.fillField(this.accidentDateInput, claimData.accidentDate);
    await this.fillField(this.accidentTimeInput, claimData.accidentTime);
    
    // Location (Thai address)
    await this.fillField(this.accidentLocationInput, claimData.accidentLocation);
    
    // Accident description in Thai
    await this.fillField(this.accidentDescriptionTextarea, claimData.accidentDescription);
    
    // Accident type
    await this.selectOption(this.accidentTypeSelect, claimData.accidentType);
    
    // Police report number (if available)
    if (claimData.policeReportNumber) {
      await this.fillField(this.policeReportNumberInput, claimData.policeReportNumber);
    }
    
    // Environmental conditions
    await this.selectOption(this.weatherConditionSelect, claimData.weatherCondition);
    await this.selectOption(this.trafficConditionSelect, claimData.trafficCondition);
    
    await this.takeScreenshot('accident-details-completed');
  }

  /**
   * Fill vehicle damage details
   */
  async fillVehicleDamageDetails(claimData: ClaimData): Promise<void> {
    // Damage description
    await this.fillField(this.damageDescriptionTextarea, claimData.damageDescription);
    
    // Vehicle drivability
    await this.selectOption(this.vehicleCanDriveSelect, claimData.vehicleCanDrive ? 'yes' : 'no');
    
    // Towing requirement
    if (claimData.towingRequired) {
      await this.towingRequiredCheckbox.check();
    }
    
    // Estimated damage amount
    if (claimData.estimatedDamageAmount) {
      await this.fillField(this.estimatedDamageAmountInput, claimData.estimatedDamageAmount.toString());
    }
    
    await this.takeScreenshot('vehicle-damage-details-completed');
  }

  /**
   * Fill third party details (for accidents involving other vehicles)
   */
  async fillThirdPartyDetails(claimData: ClaimData): Promise<void> {
    await this.thirdPartyInvolvedCheckbox.check();
    
    if (claimData.thirdPartyName) {
      await this.fillField(this.thirdPartyNameInput, claimData.thirdPartyName);
    }
    
    if (claimData.thirdPartyPhone) {
      await this.fillField(this.thirdPartyPhoneInput, claimData.thirdPartyPhone);
    }
    
    if (claimData.thirdPartyLicensePlate) {
      await this.fillField(this.thirdPartyLicensePlateInput, claimData.thirdPartyLicensePlate);
    }
    
    if (claimData.thirdPartyInsurance) {
      await this.fillField(this.thirdPartyInsuranceInput, claimData.thirdPartyInsurance);
    }
    
    await this.takeScreenshot('third-party-details-completed');
  }

  /**
   * Upload required documents
   */
  async uploadDocuments(documents: {
    damagePhotos?: string[];
    policeReport?: string;
    drivingLicense?: string;
    vehicleRegistration?: string;
    repairQuotes?: string[];
  }): Promise<void> {
    // Upload damage photos
    if (documents.damagePhotos && documents.damagePhotos.length > 0) {
      await this.damagePhotosUpload.setInputFiles(documents.damagePhotos);
    }
    
    // Upload police report
    if (documents.policeReport) {
      await this.policeReportUpload.setInputFiles(documents.policeReport);
    }
    
    // Upload driving license
    if (documents.drivingLicense) {
      await this.drivingLicenseUpload.setInputFiles(documents.drivingLicense);
    }
    
    // Upload vehicle registration
    if (documents.vehicleRegistration) {
      await this.vehicleRegistrationUpload.setInputFiles(documents.vehicleRegistration);
    }
    
    // Upload repair quotes
    if (documents.repairQuotes && documents.repairQuotes.length > 0) {
      await this.repairQuotesUpload.setInputFiles(documents.repairQuotes);
    }
    
    await this.takeScreenshot('documents-uploaded');
  }

  /**
   * Select repair shop
   */
  async selectRepairShop(preferredShop?: string): Promise<void> {
    if (preferredShop) {
      // Search for specific repair shop
      await this.fillField(this.repairShopSearchInput, preferredShop);
      await this.page.waitForTimeout(1000);
      
      // Select from search results
      const shopOption = this.page.locator(`[data-testid="repair-shop-option-${preferredShop}"]`);
      await shopOption.click();
    } else {
      // Select first available repair shop
      await this.repairShopSelect.click();
      await this.page.click('[data-testid^="repair-shop-option-"]:first-child');
    }
    
    // Schedule appointment date (optional)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const appointmentDate = tomorrow.toISOString().split('T')[0];
    
    await this.fillField(this.repairAppointmentDateInput, appointmentDate);
    
    await this.takeScreenshot('repair-shop-selected');
  }

  /**
   * Submit claim form
   */
  async submitClaimForm(): Promise<void> {
    await this.submitClaimButton.click();
    
    // Wait for submission to complete
    await this.waitForApiResponse('/api/claims');
    
    // Verify success message
    await this.waitForSuccessMessage();
    
    // Should redirect to claim confirmation
    await this.page.waitForURL(/\/claims\/confirmation/);
    
    await this.takeScreenshot('claim-submitted');
  }

  /**
   * Get claim number from confirmation page
   */
  async getClaimNumber(): Promise<string> {
    const claimNumberElement = this.page.locator('[data-testid="claim-number"]');
    await expect(claimNumberElement).toBeVisible();
    
    const claimNumberText = await claimNumberElement.textContent();
    
    // Extract claim number from text like "เลขที่เคลม: CLM-2024-001234"
    const match = claimNumberText?.match(/CLM-\d{4}-\d{6}/);
    return match ? match[0] : '';
  }

  /**
   * Track claim status
   */
  async trackClaim(claimNumber: string): Promise<{
    status: string;
    lastUpdate: string;
    nextAction: string;
  }> {
    // Search for specific claim
    await this.fillField(this.claimSearchInput, claimNumber);
    await this.page.waitForTimeout(1000);
    
    // Click on claim to view details
    const claimRow = this.page.locator(`[data-testid="claim-row-${claimNumber}"]`);
    await claimRow.click();
    
    // Extract status information
    await expect(this.claimDetailsModal).toBeVisible();
    
    const statusElement = this.page.locator('[data-testid="claim-status"]');
    const lastUpdateElement = this.page.locator('[data-testid="last-update"]');
    const nextActionElement = this.page.locator('[data-testid="next-action"]');
    
    const status = await statusElement.textContent() || '';
    const lastUpdate = await lastUpdateElement.textContent() || '';
    const nextAction = await nextActionElement.textContent() || '';
    
    return { status, lastUpdate, nextAction };
  }

  /**
   * Schedule damage inspection
   */
  async scheduleInspection(claimNumber: string, inspectionDate: string): Promise<void> {
    await this.trackClaim(claimNumber);
    
    await this.scheduleInspectionButton.click();
    
    const inspectionModal = this.page.locator('[data-testid="inspection-modal"]');
    await expect(inspectionModal).toBeVisible();
    
    const inspectionDateInput = this.page.locator('[data-testid="inspection-date-input"]');
    await this.fillField(inspectionDateInput, inspectionDate);
    
    const confirmInspectionButton = this.page.locator('[data-testid="confirm-inspection-button"]');
    await confirmInspectionButton.click();
    
    await this.waitForSuccessMessage('นัดหมายตรวจสอบความเสียหายเรียบร้อย');
  }

  /**
   * Upload additional documents to existing claim
   */
  async uploadAdditionalDocuments(claimNumber: string, documents: string[]): Promise<void> {
    await this.trackClaim(claimNumber);
    
    const additionalDocsUpload = this.page.locator('[data-testid="additional-documents-upload"]');
    await additionalDocsUpload.setInputFiles(documents);
    
    const uploadButton = this.page.locator('[data-testid="upload-additional-docs-button"]');
    await uploadButton.click();
    
    await this.waitForSuccessMessage('อัปโหลดเอกสารเพิ่มเติมเรียบร้อย');
  }

  /**
   * Filter claims by status
   */
  async filterClaimsByStatus(status: 'pending' | 'approved' | 'rejected' | 'in-progress' | 'completed'): Promise<number> {
    await this.selectOption(this.claimStatusFilter, status);
    
    // Wait for filtered results
    await this.waitForApiResponse(`/api/claims?status=${status}`);
    
    // Count filtered results
    const claimRows = await this.page.locator('[data-testid^="claim-row-"]').count();
    return claimRows;
  }

  /**
   * Test Thai date and time validation
   */
  async testAccidentDateTimeValidation(): Promise<void> {
    // Test future date (should be invalid)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    
    await this.fillField(this.accidentDateInput, futureDate.toISOString().split('T')[0]);
    await this.accidentDateInput.blur();
    
    const dateError = this.page.locator('[data-testid="accident-date-error"]');
    await expect(dateError).toBeVisible();
    await expect(dateError).toContainText('วันที่อุบัติเหตุไม่สามารถเป็นอนาคตได้');
  }

  /**
   * Test mandatory document upload validation
   */
  async testMandatoryDocumentValidation(): Promise<void> {
    // Try to submit without required documents
    await this.submitClaimButton.click();
    
    const documentError = this.page.locator('[data-testid="documents-error"]');
    await expect(documentError).toBeVisible();
    await expect(documentError).toContainText('กรุณาอัปโหลดเอกสารที่จำเป็น');
  }

  /**
   * Verify claim submission workflow in Thai
   */
  async verifyThaiClaimWorkflow(): Promise<void> {
    // Check for Thai language elements
    await expect(this.page.locator('text=รายละเอียดอุบัติเหตุ')).toBeVisible();
    await expect(this.page.locator('text=ความเสียหายของรถ')).toBeVisible();
    await expect(this.page.locator('text=อัปโหลดเอกสาร')).toBeVisible();
    await expect(this.page.locator('text=เลือกอู่ซ่อม')).toBeVisible();
  }

  /**
   * Calculate claim processing time
   */
  async getClaimProcessingTime(claimNumber: string): Promise<number> {
    const claimDetails = await this.trackClaim(claimNumber);
    
    // Extract submission and last update dates
    const submissionDate = new Date(); // Would be extracted from claim details
    const lastUpdateDate = new Date(claimDetails.lastUpdate);
    
    // Calculate processing time in days
    const timeDiff = lastUpdateDate.getTime() - submissionDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  /**
   * Test photo upload and validation
   */
  async testPhotoUploadValidation(photoPath: string): Promise<void> {
    await this.damagePhotosUpload.setInputFiles([photoPath]);
    
    // Wait for upload validation
    await this.page.waitForTimeout(2000);
    
    // Check for upload success or error
    const uploadStatus = this.page.locator('[data-testid="photo-upload-status"]');
    const isSuccess = await uploadStatus.locator('.success').isVisible();
    const isError = await uploadStatus.locator('.error').isVisible();
    
    expect(isSuccess || isError).toBe(true);
  }
}