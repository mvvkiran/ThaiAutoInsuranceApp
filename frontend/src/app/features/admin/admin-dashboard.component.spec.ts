import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { AdminDashboardComponent } from './admin-dashboard.component';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { PolicyService } from '../../core/services/policy.service';
import { ClaimService } from '../../core/services/claim.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { TranslationService } from '../../core/services/translation.service';
import { NotificationService } from '../../core/services/notification.service';
import { LoadingService } from '../../core/services/loading.service';
import { 
  MockAuthService, 
  MockUserService,
  MockPolicyService,
  MockClaimService,
  MockTranslationService, 
  MockNotificationService,
  MockLoadingService,
  MockRouter
} from '../../test-helpers/mock-services';
import { 
  MOCK_USERS, 
  MOCK_POLICIES, 
  MOCK_CLAIMS, 
  MOCK_ANALYTICS_DATA,
  MOCK_ADMIN_REPORTS
} from '../../test-helpers/test-data';
import { TestUtilities, PageObject, ThaiValidationUtils } from '../../test-helpers/test-utilities';

// Mock Analytics Service
class MockAnalyticsService {
  getDashboardMetrics() { 
    return of(MOCK_ANALYTICS_DATA.dashboardMetrics); 
  }
  getRevenueAnalytics() { 
    return of(MOCK_ANALYTICS_DATA.revenueData); 
  }
  getClaimsAnalytics() { 
    return of(MOCK_ANALYTICS_DATA.claimsData); 
  }
  getUserAnalytics() { 
    return of(MOCK_ANALYTICS_DATA.userData); 
  }
  getPolicyAnalytics() { 
    return of(MOCK_ANALYTICS_DATA.policyData); 
  }
  generateReport = jasmine.createSpy('generateReport').and.returnValue(of(MOCK_ADMIN_REPORTS[0]));
}

class AdminDashboardPageObject extends PageObject<AdminDashboardComponent> {
  get metricsCards(): NodeListOf<Element> {
    return this.getElements('[data-testid="metric-card"]');
  }

  get totalUsersCard(): HTMLElement | null {
    return this.getElement('[data-testid="total-users-card"]');
  }

  get totalPoliciesCard(): HTMLElement | null {
    return this.getElement('[data-testid="total-policies-card"]');
  }

  get totalClaimsCard(): HTMLElement | null {
    return this.getElement('[data-testid="total-claims-card"]');
  }

  get revenueCard(): HTMLElement | null {
    return this.getElement('[data-testid="revenue-card"]');
  }

  get revenueChart(): HTMLElement | null {
    return this.getElement('[data-testid="revenue-chart"]');
  }

  get claimsChart(): HTMLElement | null {
    return this.getElement('[data-testid="claims-chart"]');
  }

  get policiesChart(): HTMLElement | null {
    return this.getElement('[data-testid="policies-chart"]');
  }

  get userGrowthChart(): HTMLElement | null {
    return this.getElement('[data-testid="user-growth-chart"]');
  }

  get recentUsersTable(): HTMLElement | null {
    return this.getElement('[data-testid="recent-users-table"]');
  }

  get recentPoliciesTable(): HTMLElement | null {
    return this.getElement('[data-testid="recent-policies-table"]');
  }

  get recentClaimsTable(): HTMLElement | null {
    return this.getElement('[data-testid="recent-claims-table"]');
  }

  get pendingApprovalsList(): HTMLElement | null {
    return this.getElement('[data-testid="pending-approvals-list"]');
  }

  get systemAlertsPanel(): HTMLElement | null {
    return this.getElement('[data-testid="system-alerts-panel"]');
  }

  get dateRangeSelector(): HTMLSelectElement | null {
    return this.getElement<HTMLSelectElement>('[data-testid="date-range-selector"]');
  }

  get refreshButton(): HTMLButtonElement | null {
    return this.getElement<HTMLButtonElement>('[data-testid="refresh-button"]');
  }

  get exportButton(): HTMLButtonElement | null {
    return this.getElement<HTMLButtonElement>('[data-testid="export-button"]');
  }

  get fullScreenButton(): HTMLButtonElement | null {
    return this.getElement<HTMLButtonElement>('[data-testid="fullscreen-button"]');
  }

  get filterPanel(): HTMLElement | null {
    return this.getElement('[data-testid="filter-panel"]');
  }

  get departmentFilter(): HTMLSelectElement | null {
    return this.getElement<HTMLSelectElement>('[data-testid="department-filter"]');
  }

  get regionFilter(): HTMLSelectElement | null {
    return this.getElement<HTMLSelectElement>('[data-testid="region-filter"]');
  }

  get loadingSpinner(): HTMLElement | null {
    return this.getElement('[data-testid="loading-spinner"]');
  }

  get errorMessage(): string {
    return this.getText('[data-testid="error-message"]');
  }

  get quickActionsPanel(): HTMLElement | null {
    return this.getElement('[data-testid="quick-actions-panel"]');
  }

  get manageUsersButton(): HTMLButtonElement | null {
    return this.getElement<HTMLButtonElement>('[data-testid="manage-users-button"]');
  }

  get managePoliciesButton(): HTMLButtonElement | null {
    return this.getElement<HTMLButtonElement>('[data-testid="manage-policies-button"]');
  }

  get manageClaimsButton(): HTMLButtonElement | null {
    return this.getElement<HTMLButtonElement>('[data-testid="manage-claims-button"]');
  }

  get systemSettingsButton(): HTMLButtonElement | null {
    return this.getElement<HTMLButtonElement>('[data-testid="system-settings-button"]');
  }

  get reportsButton(): HTMLButtonElement | null {
    return this.getElement<HTMLButtonElement>('[data-testid="reports-button"]');
  }

  get totalUsersCount(): string {
    return this.getText('[data-testid="total-users-count"]');
  }

  get activePoliciesCount(): string {
    return this.getText('[data-testid="active-policies-count"]');
  }

  get pendingClaimsCount(): string {
    return this.getText('[data-testid="pending-claims-count"]');
  }

  get monthlyRevenueAmount(): string {
    return this.getText('[data-testid="monthly-revenue-amount"]');
  }

  get revenueGrowthPercent(): string {
    return this.getText('[data-testid="revenue-growth-percent"]');
  }

  setDateRange(range: string): void {
    const select = this.dateRangeSelector;
    if (select) {
      select.value = range;
      select.dispatchEvent(new Event('change'));
      this.detectChanges();
    }
  }

  setDepartmentFilter(department: string): void {
    const select = this.departmentFilter;
    if (select) {
      select.value = department;
      select.dispatchEvent(new Event('change'));
      this.detectChanges();
    }
  }

  setRegionFilter(region: string): void {
    const select = this.regionFilter;
    if (select) {
      select.value = region;
      select.dispatchEvent(new Event('change'));
      this.detectChanges();
    }
  }

  clickRefresh(): void {
    this.clickElement('[data-testid="refresh-button"]');
  }

  clickExport(): void {
    this.clickElement('[data-testid="export-button"]');
  }

  clickFullScreen(): void {
    this.clickElement('[data-testid="fullscreen-button"]');
  }

  clickManageUsers(): void {
    this.clickElement('[data-testid="manage-users-button"]');
  }

  clickManagePolicies(): void {
    this.clickElement('[data-testid="manage-policies-button"]');
  }

  clickManageClaims(): void {
    this.clickElement('[data-testid="manage-claims-button"]');
  }

  clickSystemSettings(): void {
    this.clickElement('[data-testid="system-settings-button"]');
  }

  clickReports(): void {
    this.clickElement('[data-testid="reports-button"]');
  }

  approvePendingItem(itemId: string): void {
    this.clickElement(`[data-testid="approve-${itemId}"]`);
  }

  rejectPendingItem(itemId: string): void {
    this.clickElement(`[data-testid="reject-${itemId}"]`);
  }

  dismissAlert(alertId: string): void {
    this.clickElement(`[data-testid="dismiss-alert-${alertId}"]`);
  }

  getMetricValue(metricName: string): string {
    return this.getText(`[data-testid="${metricName}-value"]`);
  }

  getChartData(chartName: string): any {
    const chart = this.getElement(`[data-testid="${chartName}-chart"]`);
    return chart ? JSON.parse(chart.getAttribute('data-chart') || '{}') : null;
  }

  getPendingApprovalItems(): NodeListOf<Element> {
    return this.getElements('[data-testid="pending-approval-item"]');
  }

  getSystemAlerts(): NodeListOf<Element> {
    return this.getElements('[data-testid="system-alert"]');
  }
}

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let pageObject: AdminDashboardPageObject;
  let authService: MockAuthService;
  let userService: MockUserService;
  let policyService: MockPolicyService;
  let claimService: MockClaimService;
  let analyticsService: MockAnalyticsService;
  let router: MockRouter;
  let translationService: MockTranslationService;
  let notificationService: MockNotificationService;
  let loadingService: MockLoadingService;

  beforeEach(async () => {
    const authServiceInstance = new MockAuthService();
    const userServiceInstance = new MockUserService();
    const policyServiceInstance = new MockPolicyService();
    const claimServiceInstance = new MockClaimService();
    const analyticsServiceInstance = new MockAnalyticsService();
    const routerInstance = new MockRouter();
    const translationServiceInstance = new MockTranslationService();
    const notificationServiceInstance = new MockNotificationService();
    const loadingServiceInstance = new MockLoadingService();

    await TestBed.configureTestingModule({
      declarations: [AdminDashboardComponent],
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceInstance },
        { provide: UserService, useValue: userServiceInstance },
        { provide: PolicyService, useValue: policyServiceInstance },
        { provide: ClaimService, useValue: claimServiceInstance },
        { provide: AnalyticsService, useValue: analyticsServiceInstance },
        { provide: Router, useValue: routerInstance },
        { provide: TranslationService, useValue: translationServiceInstance },
        { provide: NotificationService, useValue: notificationServiceInstance },
        { provide: LoadingService, useValue: loadingServiceInstance }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    pageObject = new AdminDashboardPageObject(fixture);

    authService = TestBed.inject(AuthService) as any;
    userService = TestBed.inject(UserService) as any;
    policyService = TestBed.inject(PolicyService) as any;
    claimService = TestBed.inject(ClaimService) as any;
    analyticsService = TestBed.inject(AnalyticsService) as any;
    router = TestBed.inject(Router) as any;
    translationService = TestBed.inject(TranslationService) as any;
    notificationService = TestBed.inject(NotificationService) as any;
    loadingService = TestBed.inject(LoadingService) as any;

    // Set up admin user
    authService._isAuthenticated = true;
    authService._mockUser = { ...MOCK_USERS[0], role: 'ADMIN' };
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct default values', () => {
      fixture.detectChanges();
      
      expect(component.isLoading).toBeFalse();
      expect(component.dashboardMetrics).toBeDefined();
      expect(component.selectedDateRange).toBe('7d');
      expect(component.selectedDepartment).toBe('ALL');
      expect(component.selectedRegion).toBe('ALL');
    });

    it('should redirect non-admin users', () => {
      authService._mockUser = { ...MOCK_USERS[0], role: 'CUSTOMER' };
      
      component.ngOnInit();
      
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should load dashboard data on init', fakeAsync(() => {
      spyOn(analyticsService, 'getDashboardMetrics').and.returnValue(of(MOCK_ANALYTICS_DATA.dashboardMetrics));
      spyOn(userService, 'getAllUsers').and.returnValue(of(MOCK_USERS));
      spyOn(policyService, 'getAllPolicies').and.returnValue(of(MOCK_POLICIES));
      spyOn(claimService, 'getAllClaims').and.returnValue(of(MOCK_CLAIMS));
      
      component.ngOnInit();
      tick(200);
      
      expect(analyticsService.getDashboardMetrics).toHaveBeenCalled();
      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(policyService.getAllPolicies).toHaveBeenCalled();
      expect(claimService.getAllClaims).toHaveBeenCalled();
    }));

    it('should set up real-time updates', fakeAsync(() => {
      spyOn(component, 'setupRealTimeUpdates');
      
      component.ngOnInit();
      
      expect(component.setupRealTimeUpdates).toHaveBeenCalled();
    }));

    it('should handle access denied for non-admin users', () => {
      authService._mockUser = { ...MOCK_USERS[0], role: 'CUSTOMER' };
      authService._isAuthenticated = true;
      
      component.ngOnInit();
      
      expect(notificationService.showError).toHaveBeenCalledWith(jasmine.stringMatching(/access denied/i));
    });
  });

  describe('Dashboard Metrics Display', () => {
    beforeEach(fakeAsync(() => {
      spyOn(analyticsService, 'getDashboardMetrics').and.returnValue(of(MOCK_ANALYTICS_DATA.dashboardMetrics));
      spyOn(userService, 'getAllUsers').and.returnValue(of(MOCK_USERS));
      spyOn(policyService, 'getAllPolicies').and.returnValue(of(MOCK_POLICIES));
      spyOn(claimService, 'getAllClaims').and.returnValue(of(MOCK_CLAIMS));
      fixture.detectChanges();
      tick(200);
    }));

    it('should display key metrics cards', () => {
      const metricsCards = pageObject.metricsCards;
      expect(metricsCards.length).toBeGreaterThan(0);
      
      expect(pageObject.totalUsersCard).toBeTruthy();
      expect(pageObject.totalPoliciesCard).toBeTruthy();
      expect(pageObject.totalClaimsCard).toBeTruthy();
      expect(pageObject.revenueCard).toBeTruthy();
    });

    it('should show correct user count', () => {
      const userCount = pageObject.totalUsersCount;
      expect(userCount).toBe(MOCK_USERS.length.toString());
    });

    it('should show correct active policies count', () => {
      const activePolicies = MOCK_POLICIES.filter(p => p.status === 'ACTIVE');
      const displayedCount = pageObject.activePoliciesCount;
      expect(displayedCount).toBe(activePolicies.length.toString());
    });

    it('should show correct pending claims count', () => {
      const pendingClaims = MOCK_CLAIMS.filter(c => c.status === 'PENDING');
      const displayedCount = pageObject.pendingClaimsCount;
      expect(displayedCount).toBe(pendingClaims.length.toString());
    });

    it('should display revenue in Thai currency format', () => {
      const revenueText = pageObject.monthlyRevenueAmount;
      expect(revenueText).toContain('฿');
      expect(revenueText).toMatch(/[\d,]+/);
    });

    it('should show revenue growth percentage', () => {
      const growthText = pageObject.revenueGrowthPercent;
      expect(growthText).toMatch(/[\d.]+%/);
    });

    it('should display metrics with proper Thai localization', () => {
      translationService.setLanguage('th');
      component.currentLanguage = 'th';
      fixture.detectChanges();
      
      const metrics = component.getLocalizedMetrics();
      expect(metrics).toBeDefined();
    });
  });

  describe('Charts and Analytics', () => {
    beforeEach(fakeAsync(() => {
      spyOn(analyticsService, 'getDashboardMetrics').and.returnValue(of(MOCK_ANALYTICS_DATA.dashboardMetrics));
      spyOn(analyticsService, 'getRevenueAnalytics').and.returnValue(of(MOCK_ANALYTICS_DATA.revenueData));
      spyOn(analyticsService, 'getClaimsAnalytics').and.returnValue(of(MOCK_ANALYTICS_DATA.claimsData));
      spyOn(analyticsService, 'getUserAnalytics').and.returnValue(of(MOCK_ANALYTICS_DATA.userData));
      fixture.detectChanges();
      tick(200);
    }));

    it('should display revenue chart', () => {
      expect(pageObject.revenueChart).toBeTruthy();
    });

    it('should display claims analytics chart', () => {
      expect(pageObject.claimsChart).toBeTruthy();
    });

    it('should display policies chart', () => {
      expect(pageObject.policiesChart).toBeTruthy();
    });

    it('should display user growth chart', () => {
      expect(pageObject.userGrowthChart).toBeTruthy();
    });

    it('should update charts when date range changes', fakeAsync(() => {
      spyOn(component, 'updateCharts');
      
      pageObject.setDateRange('30d');
      tick(100);
      
      expect(component.updateCharts).toHaveBeenCalled();
      expect(component.selectedDateRange).toBe('30d');
    }));

    it('should handle chart data formatting for Thai locale', () => {
      component.currentLanguage = 'th';
      const chartData = component.formatChartDataForLocale(MOCK_ANALYTICS_DATA.revenueData);
      
      expect(chartData).toBeDefined();
      expect(chartData.labels.length).toBeGreaterThan(0);
    });

    it('should show chart loading states', () => {
      component.chartsLoading = true;
      fixture.detectChanges();
      
      expect(pageObject.loadingSpinner).toBeTruthy();
    });
  });

  describe('Recent Activity Tables', () => {
    beforeEach(fakeAsync(() => {
      spyOn(userService, 'getAllUsers').and.returnValue(of(MOCK_USERS));
      spyOn(policyService, 'getAllPolicies').and.returnValue(of(MOCK_POLICIES));
      spyOn(claimService, 'getAllClaims').and.returnValue(of(MOCK_CLAIMS));
      fixture.detectChanges();
      tick(200);
    }));

    it('should display recent users table', () => {
      expect(pageObject.recentUsersTable).toBeTruthy();
    });

    it('should display recent policies table', () => {
      expect(pageObject.recentPoliciesTable).toBeTruthy();
    });

    it('should display recent claims table', () => {
      expect(pageObject.recentClaimsTable).toBeTruthy();
    });

    it('should show only the most recent items', () => {
      const recentUsers = component.getRecentUsers();
      expect(recentUsers.length).toBeLessThanOrEqual(5);
    });

    it('should sort recent items by creation date', () => {
      const recentPolicies = component.getRecentPolicies();
      
      for (let i = 0; i < recentPolicies.length - 1; i++) {
        const current = new Date(recentPolicies[i].createdAt);
        const next = new Date(recentPolicies[i + 1].createdAt);
        expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
      }
    });

    it('should handle empty recent activity gracefully', () => {
      component.recentUsers = [];
      component.recentPolicies = [];
      component.recentClaims = [];
      fixture.detectChanges();
      
      expect(component.hasRecentActivity()).toBeFalse();
    });
  });

  describe('Pending Approvals', () => {
    beforeEach(fakeAsync(() => {
      spyOn(policyService, 'getAllPolicies').and.returnValue(of(MOCK_POLICIES));
      spyOn(claimService, 'getAllClaims').and.returnValue(of(MOCK_CLAIMS));
      fixture.detectChanges();
      tick(200);
    }));

    it('should display pending approvals list', () => {
      expect(pageObject.pendingApprovalsList).toBeTruthy();
    });

    it('should show pending approval items', () => {
      const pendingItems = pageObject.getPendingApprovalItems();
      expect(pendingItems.length).toBeGreaterThanOrEqual(0);
    });

    it('should approve pending policy', fakeAsync(() => {
      const policyId = 'POL-123';
      spyOn(policyService, 'updatePolicy').and.returnValue(of({ ...MOCK_POLICIES[0], status: 'ACTIVE' }));
      
      component.approvePendingPolicy(policyId);
      tick(100);
      
      expect(policyService.updatePolicy).toHaveBeenCalledWith(policyId, jasmine.objectContaining({
        status: 'ACTIVE'
      }));
      expect(notificationService.showSuccess).toHaveBeenCalled();
    }));

    it('should approve pending claim', fakeAsync(() => {
      const claimId = 'CLM-123';
      spyOn(claimService, 'updateClaim').and.returnValue(of({ ...MOCK_CLAIMS[0], status: 'APPROVED' }));
      
      component.approvePendingClaim(claimId);
      tick(100);
      
      expect(claimService.updateClaim).toHaveBeenCalledWith(claimId, jasmine.objectContaining({
        status: 'APPROVED'
      }));
      expect(notificationService.showSuccess).toHaveBeenCalled();
    }));

    it('should reject pending item with reason', fakeAsync(() => {
      const itemId = 'CLM-123';
      const reason = 'Insufficient documentation';
      spyOn(claimService, 'updateClaim').and.returnValue(of({ ...MOCK_CLAIMS[0], status: 'REJECTED' }));
      spyOn(window, 'prompt').and.returnValue(reason);
      
      pageObject.rejectPendingItem(itemId);
      tick(100);
      
      expect(window.prompt).toHaveBeenCalled();
      expect(claimService.updateClaim).toHaveBeenCalledWith(itemId, jasmine.objectContaining({
        status: 'REJECTED',
        rejectionReason: reason
      }));
    }));

    it('should handle bulk approval', fakeAsync(() => {
      const itemIds = ['POL-123', 'POL-456'];
      spyOn(component, 'bulkApproveItems');
      
      component.selectItemsForBulkAction(itemIds);
      component.bulkApprove();
      tick(100);
      
      expect(component.bulkApproveItems).toHaveBeenCalledWith(itemIds);
    }));

    it('should prioritize high-value items', () => {
      const prioritizedItems = component.getPrioritizedPendingItems();
      
      for (let i = 0; i < prioritizedItems.length - 1; i++) {
        const current = component.getItemPriority(prioritizedItems[i]);
        const next = component.getItemPriority(prioritizedItems[i + 1]);
        expect(current).toBeGreaterThanOrEqual(next);
      }
    });
  });

  describe('System Alerts', () => {
    beforeEach(fakeAsync(() => {
      spyOn(component, 'loadSystemAlerts');
      fixture.detectChanges();
      tick(100);
    }));

    it('should display system alerts panel', () => {
      expect(pageObject.systemAlertsPanel).toBeTruthy();
    });

    it('should show system alerts', () => {
      component.systemAlerts = [
        { id: '1', type: 'warning', message: 'High claim volume', timestamp: new Date() },
        { id: '2', type: 'info', message: 'System update scheduled', timestamp: new Date() }
      ];
      fixture.detectChanges();
      
      const alerts = pageObject.getSystemAlerts();
      expect(alerts.length).toBe(2);
    });

    it('should dismiss alerts', fakeAsync(() => {
      const alertId = 'alert-1';
      spyOn(component, 'dismissAlert');
      
      pageObject.dismissAlert(alertId);
      
      expect(component.dismissAlert).toHaveBeenCalledWith(alertId);
    }));

    it('should categorize alerts by severity', () => {
      component.systemAlerts = [
        { id: '1', type: 'critical', message: 'System down', timestamp: new Date() },
        { id: '2', type: 'warning', message: 'High load', timestamp: new Date() },
        { id: '3', type: 'info', message: 'Maintenance notice', timestamp: new Date() }
      ];
      
      const categorized = component.categorizeAlertsBySeverity();
      
      expect(categorized.critical.length).toBe(1);
      expect(categorized.warning.length).toBe(1);
      expect(categorized.info.length).toBe(1);
    });

    it('should auto-refresh alerts', fakeAsync(() => {
      spyOn(component, 'refreshSystemAlerts');
      
      component.startAlertAutoRefresh();
      tick(30000); // 30 seconds
      
      expect(component.refreshSystemAlerts).toHaveBeenCalled();
    }));

    it('should handle alert acknowledgment', fakeAsync(() => {
      const alertId = 'alert-1';
      spyOn(component, 'acknowledgeAlert');
      
      component.acknowledgeAlert(alertId);
      tick(100);
      
      expect(component.acknowledgeAlert).toHaveBeenCalledWith(alertId);
    }));
  });

  describe('Quick Actions', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should display quick actions panel', () => {
      expect(pageObject.quickActionsPanel).toBeTruthy();
    });

    it('should navigate to manage users', () => {
      pageObject.clickManageUsers();
      
      expect(router.navigate).toHaveBeenCalledWith(['/admin/users']);
    });

    it('should navigate to manage policies', () => {
      pageObject.clickManagePolicies();
      
      expect(router.navigate).toHaveBeenCalledWith(['/admin/policies']);
    });

    it('should navigate to manage claims', () => {
      pageObject.clickManageClaims();
      
      expect(router.navigate).toHaveBeenCalledWith(['/admin/claims']);
    });

    it('should navigate to system settings', () => {
      pageObject.clickSystemSettings();
      
      expect(router.navigate).toHaveBeenCalledWith(['/admin/settings']);
    });

    it('should navigate to reports', () => {
      pageObject.clickReports();
      
      expect(router.navigate).toHaveBeenCalledWith(['/admin/reports']);
    });

    it('should check permissions before navigation', () => {
      authService._mockUser = { ...MOCK_USERS[0], role: 'MANAGER' };
      
      pageObject.clickSystemSettings();
      
      expect(notificationService.showError).toHaveBeenCalledWith(jasmine.stringMatching(/permission/i));
    });
  });

  describe('Filtering and Date Range', () => {
    beforeEach(fakeAsync(() => {
      spyOn(analyticsService, 'getDashboardMetrics').and.returnValue(of(MOCK_ANALYTICS_DATA.dashboardMetrics));
      fixture.detectChanges();
      tick(100);
    }));

    it('should update metrics when date range changes', fakeAsync(() => {
      spyOn(component, 'loadDashboardData');
      
      pageObject.setDateRange('30d');
      tick(500); // Debounce delay
      
      expect(component.loadDashboardData).toHaveBeenCalled();
      expect(component.selectedDateRange).toBe('30d');
    }));

    it('should filter by department', fakeAsync(() => {
      spyOn(component, 'applyFilters');
      
      pageObject.setDepartmentFilter('CLAIMS');
      tick(100);
      
      expect(component.applyFilters).toHaveBeenCalled();
      expect(component.selectedDepartment).toBe('CLAIMS');
    }));

    it('should filter by region', fakeAsync(() => {
      spyOn(component, 'applyFilters');
      
      pageObject.setRegionFilter('BANGKOK');
      tick(100);
      
      expect(component.applyFilters).toHaveBeenCalled();
      expect(component.selectedRegion).toBe('BANGKOK');
    }));

    it('should combine multiple filters', fakeAsync(() => {
      pageObject.setDateRange('7d');
      pageObject.setDepartmentFilter('POLICIES');
      pageObject.setRegionFilter('CHIANG_MAI');
      tick(500);
      
      expect(component.selectedDateRange).toBe('7d');
      expect(component.selectedDepartment).toBe('POLICIES');
      expect(component.selectedRegion).toBe('CHIANG_MAI');
    }));

    it('should provide Thai region options', () => {
      const regions = component.getAvailableRegions();
      
      expect(regions).toContain({ value: 'BANGKOK', label: 'กรุงเทพมหานคร' });
      expect(regions).toContain({ value: 'CHIANG_MAI', label: 'เชียงใหม่' });
      expect(regions).toContain({ value: 'PHUKET', label: 'ภูเก็ต' });
    });
  });

  describe('Export and Reporting', () => {
    beforeEach(fakeAsync(() => {
      spyOn(analyticsService, 'getDashboardMetrics').and.returnValue(of(MOCK_ANALYTICS_DATA.dashboardMetrics));
      fixture.detectChanges();
      tick(100);
    }));

    it('should export dashboard data', () => {
      spyOn(component, 'generateDashboardReport').and.callThrough();
      spyOn(component, 'downloadFile');
      
      pageObject.clickExport();
      
      expect(component.generateDashboardReport).toHaveBeenCalled();
      expect(component.downloadFile).toHaveBeenCalled();
    });

    it('should generate PDF report', fakeAsync(() => {
      spyOn(analyticsService, 'generateReport').and.returnValue(of(MOCK_ADMIN_REPORTS[0]));
      
      component.generatePDFReport();
      tick(100);
      
      expect(analyticsService.generateReport).toHaveBeenCalledWith('dashboard', jasmine.any(Object));
    }));

    it('should generate Excel export', () => {
      const excelData = component.generateExcelData();
      
      expect(excelData).toBeDefined();
      expect(excelData.sheets).toBeDefined();
      expect(excelData.sheets.length).toBeGreaterThan(0);
    });

    it('should include Thai formatting in exports', () => {
      const exportData = component.prepareExportData();
      
      expect(exportData.currency).toBe('THB');
      expect(exportData.locale).toBe('th-TH');
    });

    it('should schedule automated reports', fakeAsync(() => {
      spyOn(component, 'scheduleReport');
      
      const schedule = {
        frequency: 'weekly',
        recipients: ['admin@example.com'],
        format: 'pdf'
      };
      
      component.scheduleAutomatedReport(schedule);
      tick(100);
      
      expect(component.scheduleReport).toHaveBeenCalledWith(schedule);
    }));
  });

  describe('Real-time Updates', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should setup real-time updates', () => {
      spyOn(component, 'subscribeToRealTimeUpdates');
      
      component.setupRealTimeUpdates();
      
      expect(component.subscribeToRealTimeUpdates).toHaveBeenCalled();
    });

    it('should refresh data periodically', fakeAsync(() => {
      spyOn(component, 'refreshDashboardData');
      
      component.startAutoRefresh();
      tick(60000); // 1 minute
      
      expect(component.refreshDashboardData).toHaveBeenCalled();
    }));

    it('should handle real-time notifications', () => {
      const mockNotification = {
        type: 'new_claim',
        data: { claimId: 'CLM-123', amount: 50000 }
      };
      
      component.handleRealTimeNotification(mockNotification);
      
      expect(component.pendingNotifications.length).toBe(1);
    });

    it('should update metrics in real-time', fakeAsync(() => {
      spyOn(component, 'updateMetricsFromRealTime');
      
      const update = { totalClaims: 150, pendingClaims: 25 };
      component.processRealTimeUpdate(update);
      
      expect(component.updateMetricsFromRealTime).toHaveBeenCalledWith(update);
    }));
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle dashboard data loading error', fakeAsync(() => {
      const error = new Error('Failed to load dashboard data');
      spyOn(analyticsService, 'getDashboardMetrics').and.returnValue(throwError(() => error));
      
      component.loadDashboardData();
      tick(100);
      
      expect(notificationService.showError).toHaveBeenCalled();
      expect(component.error).toBeTruthy();
      expect(component.isLoading).toBeFalse();
    }));

    it('should handle chart loading errors', fakeAsync(() => {
      const error = new Error('Chart data error');
      spyOn(analyticsService, 'getRevenueAnalytics').and.returnValue(throwError(() => error));
      
      component.loadChartData();
      tick(100);
      
      expect(component.chartErrors.revenue).toBeTruthy();
    }));

    it('should handle approval action errors', fakeAsync(() => {
      const error = new Error('Approval failed');
      spyOn(policyService, 'updatePolicy').and.returnValue(throwError(() => error));
      
      component.approvePendingPolicy('POL-123');
      tick(100);
      
      expect(notificationService.showError).toHaveBeenCalled();
    }));

    it('should display error message in UI', () => {
      component.error = 'Test error message';
      fixture.detectChanges();
      
      expect(pageObject.errorMessage).toBe('Test error message');
    });

    it('should handle network connectivity issues', fakeAsync(() => {
      spyOn(analyticsService, 'getDashboardMetrics').and.returnValue(throwError(() => ({ status: 0 })));
      spyOn(translationService, 'instant').and.returnValue('Network connection error');
      
      component.loadDashboardData();
      tick(100);
      
      expect(notificationService.showError).toHaveBeenCalledWith('Network connection error');
    }));

    it('should provide error recovery options', () => {
      component.error = 'Data loading failed';
      fixture.detectChanges();
      
      const retryButton = fixture.nativeElement.querySelector('[data-testid="retry-button"]');
      expect(retryButton).toBeTruthy();
    });
  });

  describe('Thai Insurance Business Logic', () => {
    beforeEach(fakeAsync(() => {
      spyOn(analyticsService, 'getDashboardMetrics').and.returnValue(of(MOCK_ANALYTICS_DATA.dashboardMetrics));
      fixture.detectChanges();
      tick(100);
    }));

    it('should calculate compulsory vs voluntary insurance metrics', () => {
      const metrics = component.getInsuranceTypeMetrics();
      
      expect(metrics.compulsory).toBeDefined();
      expect(metrics.voluntary).toBeDefined();
      expect(metrics.compulsory.count + metrics.voluntary.count).toBeGreaterThan(0);
    });

    it('should track regulatory compliance metrics', () => {
      const compliance = component.getRegulatoryComplianceMetrics();
      
      expect(compliance.oicCompliance).toBeDefined();
      expect(compliance.reserveRequirements).toBeDefined();
      expect(compliance.reportingCompliance).toBeDefined();
    });

    it('should monitor claim settlement ratios', () => {
      const ratios = component.getClaimSettlementRatios();
      
      expect(ratios.overallRatio).toBeGreaterThan(0);
      expect(ratios.overallRatio).toBeLessThanOrEqual(1);
    });

    it('should calculate province-wise statistics', () => {
      const provinceStats = component.getProvinceWiseStatistics();
      
      expect(provinceStats.bangkok).toBeDefined();
      expect(provinceStats.chiangmai).toBeDefined();
      expect(provinceStats.phuket).toBeDefined();
    });

    it('should track seasonal trends', () => {
      const seasonalData = component.getSeasonalTrends();
      
      expect(seasonalData.rainySeason).toBeDefined();
      expect(seasonalData.drySeason).toBeDefined();
      expect(seasonalData.holidayPeaks).toBeDefined();
    });

    it('should monitor fraud detection metrics', () => {
      const fraudMetrics = component.getFraudDetectionMetrics();
      
      expect(fraudMetrics.suspiciousClaims).toBeGreaterThanOrEqual(0);
      expect(fraudMetrics.confirmedFraud).toBeGreaterThanOrEqual(0);
      expect(fraudMetrics.falseFlagRate).toBeLessThan(0.1); // Less than 10%
    });
  });

  describe('Performance Optimization', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should implement lazy loading for charts', () => {
      spyOn(component, 'loadChartsLazily');
      
      component.initializeDashboard();
      
      expect(component.loadChartsLazily).toHaveBeenCalled();
    });

    it('should cache dashboard data', () => {
      const cacheKey = 'dashboard-metrics-7d';
      spyOn(component, 'getCachedData').and.returnValue(MOCK_ANALYTICS_DATA.dashboardMetrics);
      
      const data = component.getDashboardMetrics();
      
      expect(component.getCachedData).toHaveBeenCalledWith(cacheKey);
    });

    it('should debounce filter changes', fakeAsync(() => {
      spyOn(component, 'applyFilters');
      
      // Rapid filter changes
      pageObject.setDateRange('7d');
      pageObject.setDateRange('30d');
      pageObject.setDateRange('90d');
      
      tick(500);
      
      // Should only apply filters once after debounce
      expect(component.applyFilters).toHaveBeenCalledTimes(1);
    }));

    it('should implement virtual scrolling for large datasets', () => {
      const largeDataset = Array(1000).fill(null).map((_, i) => ({
        id: `item-${i}`,
        name: `Item ${i}`
      }));
      
      component.recentUsers = largeDataset as any;
      component.enableVirtualScrolling();
      
      expect(component.virtualScrollEnabled).toBeTrue();
    });

    it('should optimize chart rendering', () => {
      spyOn(component, 'optimizeChartRendering');
      
      component.renderCharts();
      
      expect(component.optimizeChartRendering).toHaveBeenCalled();
    });
  });

  describe('Accessibility Features', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have proper ARIA labels on dashboard cards', () => {
      const metricsCards = pageObject.metricsCards;
      metricsCards.forEach(card => {
        expect(card.getAttribute('aria-label')).toBeTruthy();
      });
    });

    it('should support keyboard navigation', () => {
      const quickActionButtons = fixture.nativeElement.querySelectorAll('[data-testid*="button"]');
      quickActionButtons.forEach((button: HTMLElement) => {
        expect(button.tabIndex).not.toBe(-1);
      });
    });

    it('should provide screen reader announcements', () => {
      spyOn(component, 'announceDataUpdate');
      
      component.refreshDashboardData();
      
      expect(component.announceDataUpdate).toHaveBeenCalled();
    });

    it('should have proper heading hierarchy', () => {
      const headings = fixture.nativeElement.querySelectorAll('h1, h2, h3, h4');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('should support high contrast mode', () => {
      component.enableHighContrastMode();
      fixture.detectChanges();
      
      expect(component.highContrastMode).toBeTrue();
    });
  });

  describe('Component Lifecycle', () => {
    it('should unsubscribe on destroy', () => {
      const subscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
      component['subscriptions'] = [subscription];
      
      component.ngOnDestroy();
      
      expect(subscription.unsubscribe).toHaveBeenCalled();
    });

    it('should stop auto-refresh on destroy', () => {
      spyOn(component, 'stopAutoRefresh');
      
      component.ngOnDestroy();
      
      expect(component.stopAutoRefresh).toHaveBeenCalled();
    });

    it('should cleanup real-time connections', () => {
      spyOn(component, 'disconnectRealTime');
      
      component.ngOnDestroy();
      
      expect(component.disconnectRealTime).toHaveBeenCalled();
    });

    it('should save dashboard state', () => {
      spyOn(component, 'saveDashboardState');
      
      component.ngOnDestroy();
      
      expect(component.saveDashboardState).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle empty analytics data', fakeAsync(() => {
      spyOn(analyticsService, 'getDashboardMetrics').and.returnValue(of({}));
      
      component.loadDashboardData();
      tick(100);
      
      expect(component.dashboardMetrics).toEqual({});
      expect(() => component.calculateMetrics()).not.toThrow();
    }));

    it('should handle malformed chart data', () => {
      const malformedData = { labels: null, datasets: undefined };
      
      expect(() => component.renderChart('revenue', malformedData)).not.toThrow();
    });

    it('should handle rapid refresh requests', fakeAsync(() => {
      spyOn(analyticsService, 'getDashboardMetrics').and.returnValue(of(MOCK_ANALYTICS_DATA.dashboardMetrics));
      
      // Rapid refresh clicks
      pageObject.clickRefresh();
      pageObject.clickRefresh();
      pageObject.clickRefresh();
      
      tick(500);
      
      // Should only make one request due to debouncing
      expect(analyticsService.getDashboardMetrics).toHaveBeenCalledTimes(1);
    }));

    it('should handle browser tab visibility changes', () => {
      spyOn(component, 'pauseRealTimeUpdates');
      spyOn(component, 'resumeRealTimeUpdates');
      
      // Simulate tab becoming hidden
      Object.defineProperty(document, 'hidden', { value: true, configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));
      
      expect(component.pauseRealTimeUpdates).toHaveBeenCalled();
      
      // Simulate tab becoming visible
      Object.defineProperty(document, 'hidden', { value: false, configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));
      
      expect(component.resumeRealTimeUpdates).toHaveBeenCalled();
    });

    it('should handle localStorage quota exceeded', () => {
      spyOn(localStorage, 'setItem').and.throwError('QuotaExceededError');
      
      expect(() => component.saveDashboardState()).not.toThrow();
    });

    it('should handle timezone changes', () => {
      const originalTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Simulate timezone change
      component.handleTimezoneChange('Asia/Bangkok');
      
      expect(component.currentTimezone).toBe('Asia/Bangkok');
    });
  });
});