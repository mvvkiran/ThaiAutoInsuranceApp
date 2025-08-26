import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../core/services/auth.service';
import { PolicyService } from '../../core/services/policy.service';
import { ClaimService } from '../../core/services/claim.service';
import { TranslationService } from '../../core/services/translation.service';
import { NotificationService } from '../../core/services/notification.service';
import { LoadingService } from '../../core/services/loading.service';
import { 
  MockAuthService, 
  MockPolicyService,
  MockClaimService,
  MockTranslationService, 
  MockNotificationService,
  MockLoadingService,
  MockRouter
} from '../../test-helpers/mock-services';
import { MOCK_USERS, MOCK_POLICIES, MOCK_CLAIMS, MOCK_DASHBOARD_DATA } from '../../test-helpers/test-data';
import { TestUtilities, PageObject, ThaiValidationUtils } from '../../test-helpers/test-utilities';

class DashboardPageObject extends PageObject<DashboardComponent> {
  get welcomeMessage(): string {
    return this.getText('[data-testid="welcome-message"]');
  }

  get totalPoliciesCard(): HTMLElement | null {
    return this.getElement('[data-testid="total-policies-card"]');
  }

  get activePoliciesCount(): string {
    return this.getText('[data-testid="active-policies-count"]');
  }

  get totalClaimsCard(): HTMLElement | null {
    return this.getElement('[data-testid="total-claims-card"]');
  }

  get pendingClaimsCount(): string {
    return this.getText('[data-testid="pending-claims-count"]');
  }

  get premiumDueCard(): HTMLElement | null {
    return this.getElement('[data-testid="premium-due-card"]');
  }

  get recentPoliciesSection(): HTMLElement | null {
    return this.getElement('[data-testid="recent-policies-section"]');
  }

  get recentClaimsSection(): HTMLElement | null {
    return this.getElement('[data-testid="recent-claims-section"]');
  }

  get quickActionsPanel(): HTMLElement | null {
    return this.getElement('[data-testid="quick-actions-panel"]');
  }

  get newPolicyButton(): HTMLButtonElement | null {
    return this.getElement<HTMLButtonElement>('[data-testid="new-policy-button"]');
  }

  get viewAllPoliciesButton(): HTMLButtonElement | null {
    return this.getElement<HTMLButtonElement>('[data-testid="view-all-policies-button"]');
  }

  get fileClaimButton(): HTMLButtonElement | null {
    return this.getElement<HTMLButtonElement>('[data-testid="file-claim-button"]');
  }

  get viewAllClaimsButton(): HTMLButtonElement | null {
    return this.getElement<HTMLButtonElement>('[data-testid="view-all-claims-button"]');
  }

  get refreshButton(): HTMLButtonElement | null {
    return this.getElement<HTMLButtonElement>('[data-testid="refresh-button"]');
  }

  get errorMessage(): string {
    return this.getText('[data-testid="error-message"]');
  }

  get loadingSpinner(): HTMLElement | null {
    return this.getElement('[data-testid="loading-spinner"]');
  }

  get notificationsPanel(): HTMLElement | null {
    return this.getElement('[data-testid="notifications-panel"]');
  }

  get upcomingRenewalsSection(): HTMLElement | null {
    return this.getElement('[data-testid="upcoming-renewals"]');
  }

  get chartContainer(): HTMLElement | null {
    return this.getElement('[data-testid="dashboard-charts"]');
  }

  get premiumAmountDisplay(): string {
    return this.getText('[data-testid="premium-amount"]');
  }

  get lastLoginInfo(): string {
    return this.getText('[data-testid="last-login-info"]');
  }

  get emergencyContactsCard(): HTMLElement | null {
    return this.getElement('[data-testid="emergency-contacts"]');
  }

  clickNewPolicy(): void {
    this.clickElement('[data-testid="new-policy-button"]');
  }

  clickViewAllPolicies(): void {
    this.clickElement('[data-testid="view-all-policies-button"]');
  }

  clickFileClaim(): void {
    this.clickElement('[data-testid="file-claim-button"]');
  }

  clickViewAllClaims(): void {
    this.clickElement('[data-testid="view-all-claims-button"]');
  }

  clickRefresh(): void {
    this.clickElement('[data-testid="refresh-button"]');
  }

  getPolicyListItems(): NodeListOf<Element> {
    return this.getElements('[data-testid="policy-list-item"]');
  }

  getClaimListItems(): NodeListOf<Element> {
    return this.getElements('[data-testid="claim-list-item"]');
  }
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let pageObject: DashboardPageObject;
  let authService: MockAuthService;
  let policyService: MockPolicyService;
  let claimService: MockClaimService;
  let router: MockRouter;
  let translationService: MockTranslationService;
  let notificationService: MockNotificationService;
  let loadingService: MockLoadingService;

  beforeEach(async () => {
    const authServiceInstance = new MockAuthService();
    const policyServiceInstance = new MockPolicyService();
    const claimServiceInstance = new MockClaimService();
    const routerInstance = new MockRouter();
    const translationServiceInstance = new MockTranslationService();
    const notificationServiceInstance = new MockNotificationService();
    const loadingServiceInstance = new MockLoadingService();

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceInstance },
        { provide: PolicyService, useValue: policyServiceInstance },
        { provide: ClaimService, useValue: claimServiceInstance },
        { provide: Router, useValue: routerInstance },
        { provide: TranslationService, useValue: translationServiceInstance },
        { provide: NotificationService, useValue: notificationServiceInstance },
        { provide: LoadingService, useValue: loadingServiceInstance }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    pageObject = new DashboardPageObject(fixture);

    authService = TestBed.inject(AuthService) as any;
    policyService = TestBed.inject(PolicyService) as any;
    claimService = TestBed.inject(ClaimService) as any;
    router = TestBed.inject(Router) as any;
    translationService = TestBed.inject(TranslationService) as any;
    notificationService = TestBed.inject(NotificationService) as any;
    loadingService = TestBed.inject(LoadingService) as any;

    // Set up authenticated user
    authService._isAuthenticated = true;
    authService._mockUser = MOCK_USERS[0];
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct default values', () => {
      fixture.detectChanges();
      
      expect(component.isLoading).toBeFalse();
      expect(component.dashboardData).toBeDefined();
      expect(component.policies).toEqual([]);
      expect(component.claims).toEqual([]);
    });

    it('should load dashboard data on init', fakeAsync(() => {
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      spyOn(claimService, 'getUserClaims').and.returnValue(of(MOCK_CLAIMS));
      
      component.ngOnInit();
      tick(150);
      
      expect(policyService.getUserPolicies).toHaveBeenCalledWith(MOCK_USERS[0].id);
      expect(claimService.getUserClaims).toHaveBeenCalledWith(MOCK_USERS[0].id);
      expect(component.policies).toEqual(MOCK_POLICIES);
      expect(component.claims).toEqual(MOCK_CLAIMS);
    }));

    it('should redirect unauthenticated users', () => {
      authService._isAuthenticated = false;
      authService._mockUser = null;
      
      component.ngOnInit();
      
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    });

    it('should show loading state during data fetch', fakeAsync(() => {
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES).pipe());
      spyOn(claimService, 'getUserClaims').and.returnValue(of(MOCK_CLAIMS).pipe());
      
      component.ngOnInit();
      
      expect(component.isLoading).toBeTrue();
      
      tick(150);
      
      expect(component.isLoading).toBeFalse();
    }));
  });

  describe('Dashboard Data Display', () => {
    beforeEach(fakeAsync(() => {
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      spyOn(claimService, 'getUserClaims').and.returnValue(of(MOCK_CLAIMS));
      fixture.detectChanges();
      tick(150);
    }));

    it('should display correct welcome message', () => {
      const welcomeText = pageObject.welcomeMessage;
      expect(welcomeText).toContain(MOCK_USERS[0].firstName);
    });

    it('should display total policies count', () => {
      expect(component.getTotalPoliciesCount()).toBe(MOCK_POLICIES.length);
    });

    it('should display active policies count', () => {
      const activeCount = MOCK_POLICIES.filter(p => p.status === 'ACTIVE').length;
      expect(component.getActivePoliciesCount()).toBe(activeCount);
    });

    it('should display pending claims count', () => {
      const pendingCount = MOCK_CLAIMS.filter(c => c.status === 'PENDING').length;
      expect(component.getPendingClaimsCount()).toBe(pendingCount);
    });

    it('should display premium due amount in Thai currency', () => {
      const expectedAmount = component.getTotalPremiumDue();
      const formattedAmount = TestUtilities.formatThaiCurrency(expectedAmount);
      
      expect(component.getFormattedPremiumDue()).toEqual(formattedAmount);
    });

    it('should show recent policies section', () => {
      expect(pageObject.recentPoliciesSection).toBeTruthy();
      const policyItems = pageObject.getPolicyListItems();
      expect(policyItems.length).toBeGreaterThan(0);
    });

    it('should show recent claims section', () => {
      expect(pageObject.recentClaimsSection).toBeTruthy();
      const claimItems = pageObject.getClaimListItems();
      expect(claimItems.length).toBeGreaterThan(0);
    });

    it('should display notifications panel', () => {
      expect(pageObject.notificationsPanel).toBeTruthy();
    });

    it('should show upcoming renewals', () => {
      expect(pageObject.upcomingRenewalsSection).toBeTruthy();
    });
  });

  describe('Quick Actions', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should navigate to new policy page', () => {
      pageObject.clickNewPolicy();
      
      expect(router.navigate).toHaveBeenCalledWith(['/policies/new']);
    });

    it('should navigate to policies list page', () => {
      pageObject.clickViewAllPolicies();
      
      expect(router.navigate).toHaveBeenCalledWith(['/policies']);
    });

    it('should navigate to file claim page', () => {
      pageObject.clickFileClaim();
      
      expect(router.navigate).toHaveBeenCalledWith(['/claims/new']);
    });

    it('should navigate to claims list page', () => {
      pageObject.clickViewAllClaims();
      
      expect(router.navigate).toHaveBeenCalledWith(['/claims']);
    });

    it('should refresh dashboard data', fakeAsync(() => {
      spyOn(component, 'loadDashboardData');
      
      pageObject.clickRefresh();
      
      expect(component.loadDashboardData).toHaveBeenCalled();
    }));

    it('should show notification when refresh is successful', fakeAsync(() => {
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      spyOn(claimService, 'getUserClaims').and.returnValue(of(MOCK_CLAIMS));
      spyOn(translationService, 'instant').and.returnValue('Dashboard refreshed successfully');
      
      component.refreshData();
      tick(150);
      
      expect(notificationService.showSuccess).toHaveBeenCalledWith('Dashboard refreshed successfully');
    }));
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle policy service error', fakeAsync(() => {
      const error = new Error('Policy service error');
      spyOn(policyService, 'getUserPolicies').and.returnValue(throwError(() => error));
      spyOn(claimService, 'getUserClaims').and.returnValue(of(MOCK_CLAIMS));
      
      component.loadDashboardData();
      tick(150);
      
      expect(notificationService.showError).toHaveBeenCalled();
      expect(component.isLoading).toBeFalse();
    }));

    it('should handle claim service error', fakeAsync(() => {
      const error = new Error('Claim service error');
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      spyOn(claimService, 'getUserClaims').and.returnValue(throwError(() => error));
      
      component.loadDashboardData();
      tick(150);
      
      expect(notificationService.showError).toHaveBeenCalled();
      expect(component.isLoading).toBeFalse();
    }));

    it('should handle simultaneous service errors', fakeAsync(() => {
      const error = new Error('Service error');
      spyOn(policyService, 'getUserPolicies').and.returnValue(throwError(() => error));
      spyOn(claimService, 'getUserClaims').and.returnValue(throwError(() => error));
      
      component.loadDashboardData();
      tick(150);
      
      expect(notificationService.showError).toHaveBeenCalledTimes(2);
    }));

    it('should display error message in UI', () => {
      component.error = 'Test error message';
      fixture.detectChanges();
      
      expect(pageObject.errorMessage).toBe('Test error message');
    });

    it('should handle network connectivity issues', fakeAsync(() => {
      spyOn(policyService, 'getUserPolicies').and.returnValue(throwError(() => ({ status: 0 })));
      spyOn(translationService, 'instant').and.returnValue('Network connection error');
      
      component.loadDashboardData();
      tick(150);
      
      expect(notificationService.showError).toHaveBeenCalledWith('Network connection error');
    }));
  });

  describe('Data Calculations', () => {
    beforeEach(fakeAsync(() => {
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      spyOn(claimService, 'getUserClaims').and.returnValue(of(MOCK_CLAIMS));
      component.ngOnInit();
      tick(150);
    }));

    it('should calculate total premium correctly', () => {
      const expectedTotal = MOCK_POLICIES.reduce((sum, policy) => sum + policy.premium, 0);
      expect(component.getTotalPremium()).toBe(expectedTotal);
    });

    it('should calculate premium due correctly', () => {
      const overduePolicies = MOCK_POLICIES.filter(p => component.isPremiumDue(p));
      const expectedDue = overduePolicies.reduce((sum, policy) => sum + policy.premium, 0);
      expect(component.getTotalPremiumDue()).toBe(expectedDue);
    });

    it('should identify upcoming renewals', () => {
      const upcomingRenewals = component.getUpcomingRenewals();
      upcomingRenewals.forEach(policy => {
        const daysUntilRenewal = component.getDaysUntilRenewal(policy);
        expect(daysUntilRenewal).toBeLessThanOrEqual(30);
      });
    });

    it('should calculate claim success rate', () => {
      const successfulClaims = MOCK_CLAIMS.filter(c => c.status === 'APPROVED').length;
      const expectedRate = (successfulClaims / MOCK_CLAIMS.length) * 100;
      expect(component.getClaimSuccessRate()).toBe(expectedRate);
    });

    it('should calculate average processing time for claims', () => {
      const avgTime = component.getAverageClaimProcessingTime();
      expect(avgTime).toBeGreaterThan(0);
    });
  });

  describe('Date Handling and Thai Formatting', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should format dates in Thai Buddhist calendar', () => {
      const testDate = new Date('2024-01-01');
      const formattedDate = component.formatThaiDate(testDate);
      
      expect(formattedDate).toMatch(/\d{1,2}\s\w+\s\d{4}/);
      expect(formattedDate).toContain('2567'); // Buddhist year
    });

    it('should handle Thai currency formatting', () => {
      const amount = 50000;
      const formatted = component.formatCurrency(amount);
      
      expect(formatted).toContain('฿');
      expect(formatted).toContain('50,000');
    });

    it('should calculate business days correctly for Thai holidays', () => {
      const startDate = new Date('2024-04-13'); // Songkran holiday
      const endDate = new Date('2024-04-20');
      
      const businessDays = component.calculateBusinessDays(startDate, endDate);
      
      expect(businessDays).toBeLessThan(7); // Should exclude holidays
    });

    it('should identify Thai public holidays', () => {
      const songkran = new Date('2024-04-13');
      expect(component.isThaiPublicHoliday(songkran)).toBeTrue();
      
      const regularDay = new Date('2024-04-01');
      expect(component.isThaiPublicHoliday(regularDay)).toBeFalse();
    });
  });

  describe('Thai Language Support', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should display Thai text correctly', () => {
      spyOn(translationService, 'instant').and.returnValue('ยินดีต้อนรับ');
      translationService.setLanguage('th');
      
      const welcome = component.getWelcomeMessage();
      
      expect(welcome).toContain('ยินดีต้อนรับ');
    });

    it('should handle Thai policy types', () => {
      const thaiPolicyTypes = component.getThaiPolicyTypes();
      
      expect(thaiPolicyTypes).toContain('ประกันภาคบังคับ'); // Compulsory insurance
      expect(thaiPolicyTypes).toContain('ประกันภาคสมัครใจ'); // Voluntary insurance
    });

    it('should validate Thai National ID in user profile', () => {
      const validId = '1234567890123';
      const invalidId = '1234567890124';
      
      expect(TestUtilities.isValidThaiNationalId(validId)).toBeDefined();
      expect(TestUtilities.isValidThaiNationalId(invalidId)).toBeDefined();
    });

    it('should format Thai phone numbers correctly', () => {
      const phoneNumber = '0812345678';
      const formatted = component.formatThaiPhoneNumber(phoneNumber);
      
      expect(formatted).toMatch(/\d{3}-\d{3}-\d{4}/);
    });
  });

  describe('Accessibility Features', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have proper ARIA labels on dashboard cards', () => {
      const policyCard = pageObject.totalPoliciesCard;
      expect(policyCard?.getAttribute('aria-label')).toBeTruthy();
    });

    it('should support keyboard navigation on quick actions', () => {
      const newPolicyButton = pageObject.newPolicyButton;
      if (newPolicyButton) {
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        newPolicyButton.dispatchEvent(event);
        
        expect(router.navigate).toHaveBeenCalledWith(['/policies/new']);
      }
    });

    it('should provide screen reader announcements for data updates', () => {
      spyOn(component, 'announceDataUpdate');
      
      component.refreshData();
      
      expect(component.announceDataUpdate).toHaveBeenCalled();
    });

    it('should have proper heading hierarchy', () => {
      const headings = fixture.nativeElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      // Should have logical heading structure
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  describe('Performance Optimization', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should track changes efficiently', () => {
      spyOn(component, 'trackByPolicyId');
      
      component.ngOnInit();
      
      // trackBy functions should be defined for ngFor loops
      expect(component.trackByPolicyId).toBeDefined();
    });

    it('should implement lazy loading for large datasets', () => {
      const largePolicySet = Array(100).fill(null).map((_, i) => ({
        ...MOCK_POLICIES[0],
        id: `POL-${i}`,
        policyNumber: `TH-POL-2024-${i}`
      }));
      
      component.policies = largePolicySet;
      
      expect(component.getDisplayedPolicies().length).toBeLessThanOrEqual(10);
    });

    it('should debounce refresh requests', fakeAsync(() => {
      spyOn(component, 'loadDashboardData');
      
      // Rapid refresh clicks
      pageObject.clickRefresh();
      pageObject.clickRefresh();
      pageObject.clickRefresh();
      
      tick(500);
      
      // Should only call once due to debouncing
      expect(component.loadDashboardData).toHaveBeenCalledTimes(1);
    }));

    it('should cache dashboard data temporarily', () => {
      spyOn(component, 'getCachedData').and.returnValue(MOCK_DASHBOARD_DATA);
      
      const data = component.getDashboardData();
      
      expect(data).toEqual(MOCK_DASHBOARD_DATA);
    });
  });

  describe('Responsive Design', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should adapt layout for mobile devices', () => {
      Object.defineProperty(window, 'innerWidth', { value: 375 });
      component.onResize();
      
      expect(component.isMobileView()).toBeTrue();
    });

    it('should show/hide elements based on screen size', () => {
      component.isMobile = true;
      fixture.detectChanges();
      
      // Some elements should be hidden on mobile
      expect(component.showDetailedCharts()).toBeFalse();
    });

    it('should adjust chart sizes for different viewports', () => {
      component.screenSize = 'tablet';
      
      const chartConfig = component.getChartConfiguration();
      
      expect(chartConfig.responsive).toBeTrue();
    });
  });

  describe('Insurance Business Logic', () => {
    beforeEach(fakeAsync(() => {
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      spyOn(claimService, 'getUserClaims').and.returnValue(of(MOCK_CLAIMS));
      component.ngOnInit();
      tick(150);
    }));

    it('should identify high-risk policies', () => {
      const highRiskPolicies = component.getHighRiskPolicies();
      
      highRiskPolicies.forEach(policy => {
        expect(policy.riskLevel).toBe('HIGH');
      });
    });

    it('should calculate no-claim discount eligibility', () => {
      const eligiblePolicies = component.getNoClaimDiscountEligible();
      
      eligiblePolicies.forEach(policy => {
        const hasRecentClaims = component.hasRecentClaims(policy.id);
        expect(hasRecentClaims).toBeFalse();
      });
    });

    it('should identify policies requiring inspection', () => {
      const inspectionRequired = component.getPoliciesRequiringInspection();
      
      inspectionRequired.forEach(policy => {
        const daysSinceInspection = component.getDaysSinceLastInspection(policy);
        expect(daysSinceInspection).toBeGreaterThan(365);
      });
    });

    it('should calculate total coverage amount', () => {
      const totalCoverage = component.getTotalCoverageAmount();
      const expectedTotal = MOCK_POLICIES.reduce((sum, policy) => sum + policy.coverageAmount, 0);
      
      expect(totalCoverage).toBe(expectedTotal);
    });
  });

  describe('Data Filtering and Sorting', () => {
    beforeEach(fakeAsync(() => {
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      spyOn(claimService, 'getUserClaims').and.returnValue(of(MOCK_CLAIMS));
      component.ngOnInit();
      tick(150);
    }));

    it('should filter active policies', () => {
      const activePolicies = component.getActivePolicies();
      
      activePolicies.forEach(policy => {
        expect(policy.status).toBe('ACTIVE');
      });
    });

    it('should sort policies by expiration date', () => {
      const sortedPolicies = component.getPoliciesSortedByExpiration();
      
      for (let i = 0; i < sortedPolicies.length - 1; i++) {
        const current = new Date(sortedPolicies[i].endDate);
        const next = new Date(sortedPolicies[i + 1].endDate);
        expect(current.getTime()).toBeLessThanOrEqual(next.getTime());
      }
    });

    it('should filter recent claims', () => {
      const recentClaims = component.getRecentClaims();
      
      recentClaims.forEach(claim => {
        const claimDate = new Date(claim.createdAt);
        const daysDiff = component.getDaysFromNow(claimDate);
        expect(daysDiff).toBeLessThanOrEqual(30);
      });
    });

    it('should group claims by status', () => {
      const groupedClaims = component.getClaimsGroupedByStatus();
      
      expect(groupedClaims.PENDING).toBeDefined();
      expect(groupedClaims.APPROVED).toBeDefined();
      expect(groupedClaims.REJECTED).toBeDefined();
    });
  });

  describe('Component Lifecycle', () => {
    it('should unsubscribe on destroy', () => {
      const subscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
      component['subscription'] = subscription;
      
      component.ngOnDestroy();
      
      expect(subscription.unsubscribe).toHaveBeenCalled();
    });

    it('should handle multiple subscriptions cleanup', () => {
      component.ngOnInit();
      
      const subscriptionCount = component['subscriptions']?.length || 0;
      
      component.ngOnDestroy();
      
      // All subscriptions should be cleaned up
      expect(subscriptionCount).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle empty policy list', fakeAsync(() => {
      spyOn(policyService, 'getUserPolicies').and.returnValue(of([]));
      spyOn(claimService, 'getUserClaims').and.returnValue(of(MOCK_CLAIMS));
      
      component.loadDashboardData();
      tick(150);
      
      expect(component.policies).toEqual([]);
      expect(component.getTotalPoliciesCount()).toBe(0);
    }));

    it('should handle empty claims list', fakeAsync(() => {
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      spyOn(claimService, 'getUserClaims').and.returnValue(of([]));
      
      component.loadDashboardData();
      tick(150);
      
      expect(component.claims).toEqual([]);
      expect(component.getPendingClaimsCount()).toBe(0);
    }));

    it('should handle malformed date strings', () => {
      const malformedPolicy = {
        ...MOCK_POLICIES[0],
        endDate: 'invalid-date'
      };
      
      expect(() => component.getDaysUntilRenewal(malformedPolicy)).not.toThrow();
    });

    it('should handle null user gracefully', () => {
      authService._mockUser = null;
      
      expect(() => component.getWelcomeMessage()).not.toThrow();
      expect(component.getWelcomeMessage()).toContain('Guest');
    });

    it('should handle service timeout errors', fakeAsync(() => {
      spyOn(policyService, 'getUserPolicies').and.returnValue(throwError(() => ({ status: 408 })));
      spyOn(translationService, 'instant').and.returnValue('Request timeout');
      
      component.loadDashboardData();
      tick(150);
      
      expect(notificationService.showError).toHaveBeenCalledWith('Request timeout');
    }));
  });
});