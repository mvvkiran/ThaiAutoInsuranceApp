import { Page, APIResponse } from '@playwright/test';
import { CustomerData, VehicleData, PolicyData, ClaimData } from './thai-data-generator';

/**
 * API Helper Utilities for Thai Auto Insurance E2E Tests
 * 
 * Provides methods for:
 * - Direct API testing alongside UI tests
 * - Test data setup and cleanup
 * - API response validation
 * - Performance monitoring
 * - Thai locale-specific API operations
 */
export class ApiHelpers {
  private page: Page;
  private baseApiUrl: string;
  private authToken?: string;

  constructor(page: Page, baseApiUrl: string = 'http://localhost:8080/api') {
    this.page = page;
    this.baseApiUrl = baseApiUrl;
  }

  /**
   * Set authentication token for API requests
   */
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Get default headers for API requests
   */
  private getDefaultHeaders(): { [key: string]: string } {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Accept-Language': 'th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7'
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  /**
   * Create user via API
   */
  async createUser(userData: CustomerData, password: string): Promise<{
    userId: string;
    email: string;
    authToken: string;
  }> {
    const response = await this.page.request.post(`${this.baseApiUrl}/auth/register`, {
      headers: this.getDefaultHeaders(),
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: password,
        thaiId: userData.thaiId,
        phone: userData.phone,
        birthDate: userData.birthDate,
        gender: userData.gender,
        address: userData.address
      }
    });

    const responseData = await response.json();
    
    if (response.status() === 201) {
      return {
        userId: responseData.userId,
        email: responseData.email,
        authToken: responseData.token
      };
    } else {
      throw new Error(`Failed to create user: ${responseData.message || 'Unknown error'}`);
    }
  }

  /**
   * Authenticate user and get token
   */
  async authenticateUser(email: string, password: string): Promise<{
    userId: string;
    token: string;
    role: string;
  }> {
    const response = await this.page.request.post(`${this.baseApiUrl}/auth/login`, {
      headers: this.getDefaultHeaders(),
      data: {
        email,
        password
      }
    });

    const responseData = await response.json();

    if (response.status() === 200) {
      this.setAuthToken(responseData.token);
      return {
        userId: responseData.userId,
        token: responseData.token,
        role: responseData.role
      };
    } else {
      throw new Error(`Authentication failed: ${responseData.message || 'Invalid credentials'}`);
    }
  }

  /**
   * Create vehicle via API
   */
  async createVehicle(vehicleData: VehicleData, customerId?: string): Promise<{
    vehicleId: string;
    licensePlate: string;
  }> {
    const response = await this.page.request.post(`${this.baseApiUrl}/vehicles`, {
      headers: this.getDefaultHeaders(),
      data: {
        ...vehicleData,
        customerId
      }
    });

    const responseData = await response.json();

    if (response.status() === 201) {
      return {
        vehicleId: responseData.vehicleId,
        licensePlate: responseData.licensePlate
      };
    } else {
      throw new Error(`Failed to create vehicle: ${responseData.message || 'Unknown error'}`);
    }
  }

  /**
   * Create policy via API
   */
  async createPolicy(policyData: PolicyData, customerId?: string, vehicleId?: string): Promise<{
    policyId: string;
    policyNumber: string;
    premium: number;
  }> {
    const response = await this.page.request.post(`${this.baseApiUrl}/policies`, {
      headers: this.getDefaultHeaders(),
      data: {
        ...policyData,
        customerId,
        vehicleId
      }
    });

    const responseData = await response.json();

    if (response.status() === 201) {
      return {
        policyId: responseData.policyId,
        policyNumber: responseData.policyNumber,
        premium: responseData.premiumAmount
      };
    } else {
      throw new Error(`Failed to create policy: ${responseData.message || 'Unknown error'}`);
    }
  }

  /**
   * Submit claim via API
   */
  async submitClaim(claimData: ClaimData, policyId: string, documents?: {
    damagePhotos?: string[];
    policeReport?: string;
  }): Promise<{
    claimId: string;
    claimNumber: string;
    status: string;
  }> {
    const response = await this.page.request.post(`${this.baseApiUrl}/claims`, {
      headers: this.getDefaultHeaders(),
      data: {
        ...claimData,
        policyId,
        documents
      }
    });

    const responseData = await response.json();

    if (response.status() === 201) {
      return {
        claimId: responseData.claimId,
        claimNumber: responseData.claimNumber,
        status: responseData.status
      };
    } else {
      throw new Error(`Failed to submit claim: ${responseData.message || 'Unknown error'}`);
    }
  }

  /**
   * Get user profile via API
   */
  async getUserProfile(userId: string): Promise<CustomerData & {
    id: string;
    createdAt: string;
    status: string;
  }> {
    const response = await this.page.request.get(`${this.baseApiUrl}/users/${userId}`, {
      headers: this.getDefaultHeaders()
    });

    const responseData = await response.json();

    if (response.status() === 200) {
      return responseData;
    } else {
      throw new Error(`Failed to get user profile: ${responseData.message || 'Not found'}`);
    }
  }

  /**
   * Get user policies via API
   */
  async getUserPolicies(userId: string, status?: 'active' | 'expired' | 'cancelled'): Promise<Array<{
    policyId: string;
    policyNumber: string;
    status: string;
    premiumAmount: number;
    coverageType: string;
    startDate: string;
    endDate: string;
  }>> {
    let url = `${this.baseApiUrl}/users/${userId}/policies`;
    if (status) {
      url += `?status=${status}`;
    }

    const response = await this.page.request.get(url, {
      headers: this.getDefaultHeaders()
    });

    const responseData = await response.json();

    if (response.status() === 200) {
      return responseData.policies || [];
    } else {
      throw new Error(`Failed to get user policies: ${responseData.message || 'Unknown error'}`);
    }
  }

  /**
   * Get user claims via API
   */
  async getUserClaims(userId: string, status?: string): Promise<Array<{
    claimId: string;
    claimNumber: string;
    status: string;
    accidentDate: string;
    damageAmount: number;
    approvedAmount?: number;
  }>> {
    let url = `${this.baseApiUrl}/users/${userId}/claims`;
    if (status) {
      url += `?status=${status}`;
    }

    const response = await this.page.request.get(url, {
      headers: this.getDefaultHeaders()
    });

    const responseData = await response.json();

    if (response.status() === 200) {
      return responseData.claims || [];
    } else {
      throw new Error(`Failed to get user claims: ${responseData.message || 'Unknown error'}`);
    }
  }

  /**
   * Calculate premium via API
   */
  async calculatePremium(vehicleData: Partial<VehicleData>, coverageData: Partial<PolicyData>): Promise<{
    basePremium: number;
    totalPremium: number;
    tax: number;
    discount: number;
    breakdown: Array<{
      type: string;
      amount: number;
    }>;
  }> {
    const response = await this.page.request.post(`${this.baseApiUrl}/premium/calculate`, {
      headers: this.getDefaultHeaders(),
      data: {
        vehicle: vehicleData,
        coverage: coverageData
      }
    });

    const responseData = await response.json();

    if (response.status() === 200) {
      return responseData;
    } else {
      throw new Error(`Failed to calculate premium: ${responseData.message || 'Unknown error'}`);
    }
  }

  /**
   * Get claim status and updates via API
   */
  async getClaimStatus(claimId: string): Promise<{
    status: string;
    lastUpdate: string;
    timeline: Array<{
      date: string;
      status: string;
      description: string;
      updatedBy: string;
    }>;
    documents: Array<{
      id: string;
      type: string;
      filename: string;
      uploadDate: string;
    }>;
  }> {
    const response = await this.page.request.get(`${this.baseApiUrl}/claims/${claimId}/status`, {
      headers: this.getDefaultHeaders()
    });

    const responseData = await response.json();

    if (response.status() === 200) {
      return responseData;
    } else {
      throw new Error(`Failed to get claim status: ${responseData.message || 'Not found'}`);
    }
  }

  /**
   * Upload document via API
   */
  async uploadDocument(filePath: string, documentType: string, relatedId: string, relatedType: 'policy' | 'claim'): Promise<{
    documentId: string;
    filename: string;
    url: string;
  }> {
    const response = await this.page.request.post(`${this.baseApiUrl}/documents/upload`, {
      headers: {
        ...this.getDefaultHeaders(),
        'Content-Type': 'multipart/form-data'
      },
      multipart: {
        file: filePath,
        documentType,
        relatedId,
        relatedType
      }
    });

    const responseData = await response.json();

    if (response.status() === 201) {
      return responseData;
    } else {
      throw new Error(`Failed to upload document: ${responseData.message || 'Unknown error'}`);
    }
  }

  /**
   * Search repair shops via API
   */
  async searchRepairShops(location: string, vehicleMake?: string): Promise<Array<{
    id: string;
    name: string;
    address: string;
    phone: string;
    rating: number;
    specializes: string[];
    distance: number;
  }>> {
    let url = `${this.baseApiUrl}/repair-shops/search?location=${encodeURIComponent(location)}`;
    if (vehicleMake) {
      url += `&make=${encodeURIComponent(vehicleMake)}`;
    }

    const response = await this.page.request.get(url, {
      headers: this.getDefaultHeaders()
    });

    const responseData = await response.json();

    if (response.status() === 200) {
      return responseData.repairShops || [];
    } else {
      throw new Error(`Failed to search repair shops: ${responseData.message || 'Unknown error'}`);
    }
  }

  /**
   * Validate Thai ID number via API
   */
  async validateThaiId(thaiId: string): Promise<{
    valid: boolean;
    message?: string;
  }> {
    const response = await this.page.request.post(`${this.baseApiUrl}/validation/thai-id`, {
      headers: this.getDefaultHeaders(),
      data: { thaiId }
    });

    const responseData = await response.json();

    if (response.status() === 200) {
      return responseData;
    } else {
      throw new Error(`Failed to validate Thai ID: ${responseData.message || 'Unknown error'}`);
    }
  }

  /**
   * Validate Thai license plate via API
   */
  async validateLicensePlate(licensePlate: string, province: string): Promise<{
    valid: boolean;
    format: string;
    message?: string;
  }> {
    const response = await this.page.request.post(`${this.baseApiUrl}/validation/license-plate`, {
      headers: this.getDefaultHeaders(),
      data: { licensePlate, province }
    });

    const responseData = await response.json();

    if (response.status() === 200) {
      return responseData;
    } else {
      throw new Error(`Failed to validate license plate: ${responseData.message || 'Unknown error'}`);
    }
  }

  /**
   * Get system health status
   */
  async getHealthStatus(): Promise<{
    status: 'healthy' | 'unhealthy';
    database: 'connected' | 'disconnected';
    services: Array<{
      name: string;
      status: 'up' | 'down';
      responseTime?: number;
    }>;
    timestamp: string;
  }> {
    const response = await this.page.request.get(`${this.baseApiUrl}/health`, {
      headers: this.getDefaultHeaders()
    });

    const responseData = await response.json();

    if (response.status() === 200) {
      return responseData;
    } else {
      throw new Error(`Failed to get health status: ${responseData.message || 'Unknown error'}`);
    }
  }

  /**
   * Clean up test data via API
   */
  async cleanupTestData(testRunId?: string): Promise<{
    usersDeleted: number;
    policiesDeleted: number;
    claimsDeleted: number;
    vehiclesDeleted: number;
  }> {
    const response = await this.page.request.delete(`${this.baseApiUrl}/test/cleanup`, {
      headers: this.getDefaultHeaders(),
      data: { testRunId }
    });

    const responseData = await response.json();

    if (response.status() === 200) {
      return responseData;
    } else {
      throw new Error(`Failed to cleanup test data: ${responseData.message || 'Unknown error'}`);
    }
  }

  /**
   * Wait for API response with timeout
   */
  async waitForApiResponse(
    urlPattern: string | RegExp, 
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      timeout?: number;
      status?: number;
    } = {}
  ): Promise<APIResponse> {
    const { method = 'GET', timeout = 10000, status = 200 } = options;

    const response = await this.page.waitForResponse(
      (response) => {
        const url = response.url();
        const matchesUrl = typeof urlPattern === 'string' 
          ? url.includes(urlPattern)
          : urlPattern.test(url);
        
        return matchesUrl && 
               response.request().method() === method &&
               response.status() === status;
      },
      { timeout }
    );

    return response;
  }

  /**
   * Measure API response time
   */
  async measureApiResponseTime(url: string, method: 'GET' | 'POST' = 'GET', data?: any): Promise<{
    responseTime: number;
    status: number;
    success: boolean;
  }> {
    const startTime = Date.now();

    try {
      const response = method === 'GET' 
        ? await this.page.request.get(url, { headers: this.getDefaultHeaders() })
        : await this.page.request.post(url, { 
            headers: this.getDefaultHeaders(),
            data 
          });

      const responseTime = Date.now() - startTime;

      return {
        responseTime,
        status: response.status(),
        success: response.ok()
      };
    } catch (error) {
      return {
        responseTime: Date.now() - startTime,
        status: 0,
        success: false
      };
    }
  }

  /**
   * Verify API response structure
   */
  async verifyApiResponse(
    response: APIResponse,
    expectedStructure: { [key: string]: string | number | boolean | object }
  ): Promise<boolean> {
    try {
      const data = await response.json();
      
      for (const [key, expectedType] of Object.entries(expectedStructure)) {
        if (!(key in data)) {
          console.error(`Missing key: ${key}`);
          return false;
        }
        
        if (typeof data[key] !== typeof expectedType) {
          console.error(`Type mismatch for ${key}: expected ${typeof expectedType}, got ${typeof data[key]}`);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Failed to verify API response:', error);
      return false;
    }
  }
}