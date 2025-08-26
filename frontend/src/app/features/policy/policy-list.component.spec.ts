import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { PolicyListComponent } from './policy-list.component';
import { AuthService } from '../../core/services/auth.service';
import { PolicyService } from '../../core/services/policy.service';
import { TranslationService } from '../../core/services/translation.service';
import { NotificationService } from '../../core/services/notification.service';
import { LoadingService } from '../../core/services/loading.service';
import { 
  MockAuthService, 
  MockPolicyService,
  MockTranslationService, 
  MockNotificationService,
  MockLoadingService,
  MockRouter
} from '../../test-helpers/mock-services';
import { MOCK_USERS, MOCK_POLICIES, MOCK_POLICY_FILTERS } from '../../test-helpers/test-data';
import { TestUtilities, PageObject, ThaiValidationUtils } from '../../test-helpers/test-utilities';

class PolicyListPageObject extends PageObject<PolicyListComponent> {
  get searchInput(): HTMLInputElement | null {
    return this.getElement<HTMLInputElement>('[data-testid="search-input"]');
  }

  get statusFilter(): HTMLSelectElement | null {
    return this.getElement<HTMLSelectElement>('[data-testid="status-filter"]');
  }

  get typeFilter(): HTMLSelectElement | null {
    return this.getElement<HTMLSelectElement>('[data-testid="type-filter"]');
  }

  get dateFromInput(): HTMLInputElement | null {
    return this.getElement<HTMLInputElement>('[data-testid="date-from-input"]');
  }

  get dateToInput(): HTMLInputElement | null {
    return this.getElement<HTMLInputElement>('[data-testid="date-to-input"]');
  }

  get clearFiltersButton(): HTMLButtonElement | null {
    return this.getElement<HTMLButtonElement>('[data-testid="clear-filters-button"]');
  }

  get newPolicyButton(): HTMLButtonElement | null {
    return this.getElement<HTMLButtonElement>('[data-testid="new-policy-button"]');
  }

  get exportButton(): HTMLButtonElement | null {
    return this.getElement<HTMLButtonElement>('[data-testid="export-button"]');
  }

  get refreshButton(): HTMLButtonElement | null {
    return this.getElement<HTMLButtonElement>('[data-testid="refresh-button"]');
  }

  get sortBySelect(): HTMLSelectElement | null {
    return this.getElement<HTMLSelectElement>('[data-testid="sort-by-select"]');
  }

  get sortOrderButton(): HTMLButtonElement | null {
    return this.getElement<HTMLButtonElement>('[data-testid="sort-order-button"]');
  }

  get policyTable(): HTMLTableElement | null {
    return this.getElement<HTMLTableElement>('[data-testid="policy-table"]');
  }

  get policyCards(): NodeListOf<Element> {
    return this.getElements('[data-testid="policy-card"]');
  }

  get loadingSpinner(): HTMLElement | null {
    return this.getElement('[data-testid="loading-spinner"]');
  }

  get errorMessage(): string {
    return this.getText('[data-testid="error-message"]');
  }

  get emptyMessage(): HTMLElement | null {
    return this.getElement('[data-testid="empty-message"]');
  }

  get paginationContainer(): HTMLElement | null {
    return this.getElement('[data-testid="pagination-container"]');
  }

  get totalResultsText(): string {
    return this.getText('[data-testid="total-results"]');
  }

  get viewModeToggle(): HTMLButtonElement | null {
    return this.getElement<HTMLButtonElement>('[data-testid="view-mode-toggle"]');
  }

  get bulkActionsPanel(): HTMLElement | null {
    return this.getElement('[data-testid="bulk-actions-panel"]');
  }

  get selectAllCheckbox(): HTMLInputElement | null {
    return this.getElement<HTMLInputElement>('[data-testid="select-all-checkbox"]');
  }

  get selectedCount(): string {
    return this.getText('[data-testid="selected-count"]');
  }

  searchPolicies(query: string): void {
    this.setInputValue('[data-testid="search-input"]', query);
  }

  filterByStatus(status: string): void {
    const select = this.statusFilter;
    if (select) {
      select.value = status;
      select.dispatchEvent(new Event('change'));
      this.detectChanges();
    }
  }

  filterByType(type: string): void {
    const select = this.typeFilter;
    if (select) {
      select.value = type;
      select.dispatchEvent(new Event('change'));
      this.detectChanges();
    }
  }

  setDateRange(from: string, to: string): void {
    if (this.dateFromInput) this.setInputValue('[data-testid="date-from-input"]', from);
    if (this.dateToInput) this.setInputValue('[data-testid="date-to-input"]', to);
  }

  clickClearFilters(): void {
    this.clickElement('[data-testid="clear-filters-button"]');
  }

  clickNewPolicy(): void {
    this.clickElement('[data-testid="new-policy-button"]');
  }

  clickExport(): void {
    this.clickElement('[data-testid="export-button"]');
  }

  clickRefresh(): void {
    this.clickElement('[data-testid="refresh-button"]');
  }

  toggleViewMode(): void {
    this.clickElement('[data-testid="view-mode-toggle"]');
  }

  sortBy(field: string): void {
    const select = this.sortBySelect;
    if (select) {
      select.value = field;
      select.dispatchEvent(new Event('change'));
      this.detectChanges();
    }
  }

  toggleSortOrder(): void {
    this.clickElement('[data-testid="sort-order-button"]');
  }

  selectAllPolicies(): void {
    this.clickElement('[data-testid="select-all-checkbox"]');
  }

  selectPolicy(index: number): void {
    this.clickElement(`[data-testid="policy-checkbox-${index}"]`);
  }

  clickPolicyAction(policyId: string, action: string): void {
    this.clickElement(`[data-testid="policy-${action}-${policyId}"]`);
  }

  getPolicyRows(): NodeListOf<Element> {
    return this.getElements('[data-testid="policy-row"]');
  }

  getPolicyCardElements(): NodeListOf<Element> {
    return this.getElements('[data-testid="policy-card"]');
  }
}

describe('PolicyListComponent', () => {
  let component: PolicyListComponent;
  let fixture: ComponentFixture<PolicyListComponent>;
  let pageObject: PolicyListPageObject;
  let authService: MockAuthService;
  let policyService: MockPolicyService;
  let router: MockRouter;
  let translationService: MockTranslationService;
  let notificationService: MockNotificationService;
  let loadingService: MockLoadingService;

  beforeEach(async () => {
    const authServiceInstance = new MockAuthService();
    const policyServiceInstance = new MockPolicyService();
    const routerInstance = new MockRouter();
    const translationServiceInstance = new MockTranslationService();
    const notificationServiceInstance = new MockNotificationService();
    const loadingServiceInstance = new MockLoadingService();

    await TestBed.configureTestingModule({
      declarations: [PolicyListComponent],
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceInstance },
        { provide: PolicyService, useValue: policyServiceInstance },
        { provide: Router, useValue: routerInstance },
        { provide: TranslationService, useValue: translationServiceInstance },
        { provide: NotificationService, useValue: notificationServiceInstance },
        { provide: LoadingService, useValue: loadingServiceInstance }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PolicyListComponent);
    component = fixture.componentInstance;
    pageObject = new PolicyListPageObject(fixture);

    authService = TestBed.inject(AuthService) as any;
    policyService = TestBed.inject(PolicyService) as any;
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
      expect(component.policies).toEqual([]);
      expect(component.filteredPolicies).toEqual([]);
      expect(component.selectedPolicies).toEqual([]);
      expect(component.currentPage).toBe(1);
      expect(component.viewMode).toBe('table');
    });

    it('should load policies on init', fakeAsync(() => {
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      
      component.ngOnInit();
      tick(100);
      
      expect(policyService.getUserPolicies).toHaveBeenCalledWith(MOCK_USERS[0].id);
      expect(component.policies).toEqual(MOCK_POLICIES);
      expect(component.filteredPolicies).toEqual(MOCK_POLICIES);
    }));

    it('should load all policies for admin users', fakeAsync(() => {
      authService._mockUser = { ...MOCK_USERS[0], role: 'ADMIN' };
      spyOn(policyService, 'getAllPolicies').and.returnValue(of(MOCK_POLICIES));
      
      component.ngOnInit();
      tick(100);
      
      expect(policyService.getAllPolicies).toHaveBeenCalled();
    }));

    it('should initialize filters form', () => {
      fixture.detectChanges();
      
      expect(component.filtersForm).toBeDefined();
      expect(component.filtersForm.get('search')).toBeTruthy();
      expect(component.filtersForm.get('status')).toBeTruthy();
      expect(component.filtersForm.get('type')).toBeTruthy();
      expect(component.filtersForm.get('dateFrom')).toBeTruthy();
      expect(component.filtersForm.get('dateTo')).toBeTruthy();
    });

    it('should redirect unauthenticated users', () => {
      authService._isAuthenticated = false;
      authService._mockUser = null;
      
      component.ngOnInit();
      
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });

  describe('Policy Loading and Display', () => {
    beforeEach(fakeAsync(() => {
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      fixture.detectChanges();
      tick(100);
    }));

    it('should display policies in table view', () => {
      component.viewMode = 'table';
      fixture.detectChanges();
      
      expect(pageObject.policyTable).toBeTruthy();
      
      const rows = pageObject.getPolicyRows();
      expect(rows.length).toBeGreaterThan(0);
    });

    it('should display policies in card view', () => {
      component.viewMode = 'card';
      fixture.detectChanges();
      
      const cards = pageObject.getPolicyCardElements();
      expect(cards.length).toBeGreaterThan(0);
    });

    it('should show total results count', () => {
      const totalText = pageObject.totalResultsText;
      expect(totalText).toContain(MOCK_POLICIES.length.toString());
    });

    it('should show loading state', () => {
      component.isLoading = true;
      fixture.detectChanges();
      
      expect(pageObject.loadingSpinner).toBeTruthy();
    });

    it('should show empty message when no policies', () => {
      component.policies = [];
      component.filteredPolicies = [];
      fixture.detectChanges();
      
      expect(pageObject.emptyMessage).toBeTruthy();
    });

    it('should display Thai policy information correctly', () => {
      const policy = component.policies[0];
      const formattedPremium = component.formatThaiCurrency(policy.premium);
      
      expect(formattedPremium).toContain('฿');
      expect(formattedPremium).toContain(',');
    });
  });

  describe('Search and Filtering', () => {
    beforeEach(fakeAsync(() => {
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      fixture.detectChanges();
      tick(100);
    }));

    it('should filter policies by search query', fakeAsync(() => {
      const searchTerm = 'TH-POL';
      pageObject.searchPolicies(searchTerm);
      tick(300); // Debounce delay
      
      const filtered = component.filteredPolicies.filter(p => 
        p.policyNumber.includes(searchTerm) || 
        p.customerName.includes(searchTerm)
      );
      
      expect(component.filteredPolicies.length).toBe(filtered.length);
    }));

    it('should filter policies by status', () => {
      pageObject.filterByStatus('ACTIVE');
      
      component.filteredPolicies.forEach(policy => {
        expect(policy.status).toBe('ACTIVE');
      });
    });

    it('should filter policies by type', () => {
      pageObject.filterByType('COMPREHENSIVE');
      
      component.filteredPolicies.forEach(policy => {
        expect(policy.type).toBe('COMPREHENSIVE');
      });
    });

    it('should filter policies by date range', () => {
      const fromDate = '2024-01-01';
      const toDate = '2024-12-31';
      
      pageObject.setDateRange(fromDate, toDate);
      
      component.filteredPolicies.forEach(policy => {
        const startDate = new Date(policy.startDate);
        expect(startDate.getTime()).toBeGreaterThanOrEqual(new Date(fromDate).getTime());
        expect(startDate.getTime()).toBeLessThanOrEqual(new Date(toDate).getTime());
      });
    });

    it('should clear all filters', () => {
      // Apply some filters first
      pageObject.searchPolicies('test');
      pageObject.filterByStatus('ACTIVE');
      
      pageObject.clickClearFilters();
      
      expect(component.filtersForm.get('search')?.value).toBe('');
      expect(component.filtersForm.get('status')?.value).toBe('');
      expect(component.filteredPolicies.length).toBe(component.policies.length);
    });

    it('should combine multiple filters', fakeAsync(() => {
      pageObject.searchPolicies('TH');
      pageObject.filterByStatus('ACTIVE');
      pageObject.filterByType('COMPREHENSIVE');
      tick(300);
      
      component.filteredPolicies.forEach(policy => {
        expect(policy.policyNumber).toContain('TH');
        expect(policy.status).toBe('ACTIVE');
        expect(policy.type).toBe('COMPREHENSIVE');
      });
    }));

    it('should handle Thai search terms', fakeAsync(() => {
      const thaiName = 'สมชาย';
      pageObject.searchPolicies(thaiName);
      tick(300);
      
      // Should filter based on Thai customer names
      expect(component.filteredPolicies.length).toBeGreaterThanOrEqual(0);
    }));
  });

  describe('Sorting Functionality', () => {
    beforeEach(fakeAsync(() => {
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      fixture.detectChanges();
      tick(100);
    }));

    it('should sort policies by policy number', () => {
      pageObject.sortBy('policyNumber');
      
      const sorted = [...component.filteredPolicies].sort((a, b) => 
        a.policyNumber.localeCompare(b.policyNumber)
      );
      
      expect(component.filteredPolicies).toEqual(sorted);
    });

    it('should sort policies by start date', () => {
      pageObject.sortBy('startDate');
      
      const sorted = [...component.filteredPolicies].sort((a, b) => 
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
      
      expect(component.filteredPolicies[0].startDate).toBe(sorted[0].startDate);
    });

    it('should sort policies by premium amount', () => {
      pageObject.sortBy('premium');
      
      const sorted = [...component.filteredPolicies].sort((a, b) => a.premium - b.premium);
      
      expect(component.filteredPolicies[0].premium).toBe(sorted[0].premium);
    });

    it('should toggle sort order', () => {
      pageObject.sortBy('premium');
      const firstAsc = component.filteredPolicies[0].premium;
      
      pageObject.toggleSortOrder();
      const firstDesc = component.filteredPolicies[0].premium;
      
      expect(firstAsc).not.toBe(firstDesc);
    });

    it('should maintain sort order when filtering', fakeAsync(() => {
      pageObject.sortBy('premium');
      pageObject.searchPolicies('TH');
      tick(300);
      
      // Should maintain premium sorting after search
      for (let i = 0; i < component.filteredPolicies.length - 1; i++) {
        const current = component.filteredPolicies[i].premium;
        const next = component.filteredPolicies[i + 1].premium;
        expect(current).toBeLessThanOrEqual(next);
      }
    }));
  });

  describe('Pagination', () => {
    beforeEach(fakeAsync(() => {
      // Create a larger dataset for pagination testing
      const largePolicySet = Array(50).fill(null).map((_, i) => ({
        ...MOCK_POLICIES[0],
        id: `POL-${i}`,
        policyNumber: `TH-POL-2024-${String(i).padStart(4, '0')}`
      }));
      
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(largePolicySet));
      fixture.detectChanges();
      tick(100);
    }));

    it('should display pagination controls', () => {
      expect(pageObject.paginationContainer).toBeTruthy();
    });

    it('should navigate to next page', () => {
      const initialPage = component.currentPage;
      
      component.nextPage();
      
      expect(component.currentPage).toBe(initialPage + 1);
    });

    it('should navigate to previous page', () => {
      component.currentPage = 2;
      
      component.previousPage();
      
      expect(component.currentPage).toBe(1);
    });

    it('should jump to specific page', () => {
      component.goToPage(3);
      
      expect(component.currentPage).toBe(3);
    });

    it('should calculate total pages correctly', () => {
      const totalPages = Math.ceil(component.filteredPolicies.length / component.pageSize);
      
      expect(component.totalPages).toBe(totalPages);
    });

    it('should display correct page items', () => {
      component.currentPage = 1;
      const pageItems = component.getPageItems();
      
      expect(pageItems.length).toBe(component.pageSize);
    });
  });

  describe('Bulk Actions', () => {
    beforeEach(fakeAsync(() => {
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      fixture.detectChanges();
      tick(100);
    }));

    it('should select all policies', () => {
      pageObject.selectAllPolicies();
      
      expect(component.selectedPolicies.length).toBe(component.getPageItems().length);
    });

    it('should deselect all policies', () => {
      // First select all
      pageObject.selectAllPolicies();
      expect(component.selectedPolicies.length).toBeGreaterThan(0);
      
      // Then deselect all
      pageObject.selectAllPolicies();
      expect(component.selectedPolicies.length).toBe(0);
    });

    it('should select individual policy', () => {
      pageObject.selectPolicy(0);
      
      expect(component.selectedPolicies.length).toBe(1);
      expect(component.selectedPolicies[0]).toBe(component.getPageItems()[0].id);
    });

    it('should show selected count', () => {
      pageObject.selectPolicy(0);
      pageObject.selectPolicy(1);
      fixture.detectChanges();
      
      const selectedCountText = pageObject.selectedCount;
      expect(selectedCountText).toContain('2');
    });

    it('should show bulk actions panel when items selected', () => {
      pageObject.selectPolicy(0);
      fixture.detectChanges();
      
      expect(pageObject.bulkActionsPanel).toBeTruthy();
    });

    it('should hide bulk actions panel when no items selected', () => {
      // Initially select items
      pageObject.selectPolicy(0);
      fixture.detectChanges();
      expect(pageObject.bulkActionsPanel).toBeTruthy();
      
      // Then deselect
      pageObject.selectPolicy(0); // Click again to deselect
      fixture.detectChanges();
      
      expect(pageObject.bulkActionsPanel).toBeFalsy();
    });
  });

  describe('Policy Actions', () => {
    beforeEach(fakeAsync(() => {
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      fixture.detectChanges();
      tick(100);
    }));

    it('should navigate to policy details', () => {
      const policyId = MOCK_POLICIES[0].id;
      
      component.viewPolicyDetails(policyId);
      
      expect(router.navigate).toHaveBeenCalledWith(['/policies', policyId]);
    });

    it('should navigate to policy edit', () => {
      const policyId = MOCK_POLICIES[0].id;
      
      component.editPolicy(policyId);
      
      expect(router.navigate).toHaveBeenCalledWith(['/policies', policyId, 'edit']);
    });

    it('should navigate to create new policy', () => {
      pageObject.clickNewPolicy();
      
      expect(router.navigate).toHaveBeenCalledWith(['/policies/new']);
    });

    it('should renew policy', fakeAsync(() => {
      const policyId = MOCK_POLICIES[0].id;
      const renewedPolicy = { ...MOCK_POLICIES[0], status: 'ACTIVE' };
      spyOn(policyService, 'updatePolicy').and.returnValue(of(renewedPolicy));
      
      component.renewPolicy(policyId);
      tick(100);
      
      expect(policyService.updatePolicy).toHaveBeenCalledWith(policyId, jasmine.any(Object));
      expect(notificationService.showSuccess).toHaveBeenCalled();
    }));

    it('should cancel policy with confirmation', fakeAsync(() => {
      const policyId = MOCK_POLICIES[0].id;
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(policyService, 'deletePolicy').and.returnValue(of(undefined));
      
      component.cancelPolicy(policyId);
      tick(100);
      
      expect(window.confirm).toHaveBeenCalled();
      expect(policyService.deletePolicy).toHaveBeenCalledWith(policyId);
      expect(notificationService.showSuccess).toHaveBeenCalled();
    }));

    it('should not cancel policy without confirmation', () => {
      const policyId = MOCK_POLICIES[0].id;
      spyOn(window, 'confirm').and.returnValue(false);
      
      component.cancelPolicy(policyId);
      
      expect(policyService.deletePolicy).not.toHaveBeenCalled();
    });
  });

  describe('Export Functionality', () => {
    beforeEach(fakeAsync(() => {
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      fixture.detectChanges();
      tick(100);
    }));

    it('should export policies to CSV', () => {
      spyOn(component, 'generateCSV').and.callThrough();
      spyOn(component, 'downloadFile');
      
      pageObject.clickExport();
      
      expect(component.generateCSV).toHaveBeenCalled();
      expect(component.downloadFile).toHaveBeenCalled();
    });

    it('should export only filtered policies', () => {
      pageObject.filterByStatus('ACTIVE');
      spyOn(component, 'generateCSV').and.callThrough();
      
      pageObject.clickExport();
      
      expect(component.generateCSV).toHaveBeenCalledWith(component.filteredPolicies);
    });

    it('should export selected policies when bulk selected', () => {
      pageObject.selectPolicy(0);
      pageObject.selectPolicy(1);
      spyOn(component, 'generateCSV').and.callThrough();
      
      pageObject.clickExport();
      
      expect(component.generateCSV).toHaveBeenCalledWith(jasmine.any(Array));
    });

    it('should format Thai data correctly in export', () => {
      const csv = component.generateCSV(MOCK_POLICIES);
      
      expect(csv).toContain('TH-POL'); // Policy number format
      expect(csv).not.toContain('undefined'); // No undefined values
    });
  });

  describe('View Mode Toggle', () => {
    beforeEach(fakeAsync(() => {
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      fixture.detectChanges();
      tick(100);
    }));

    it('should toggle between table and card view', () => {
      expect(component.viewMode).toBe('table');
      
      pageObject.toggleViewMode();
      expect(component.viewMode).toBe('card');
      
      pageObject.toggleViewMode();
      expect(component.viewMode).toBe('table');
    });

    it('should maintain selection when changing view mode', () => {
      pageObject.selectPolicy(0);
      const selectedCount = component.selectedPolicies.length;
      
      pageObject.toggleViewMode();
      
      expect(component.selectedPolicies.length).toBe(selectedCount);
    });

    it('should save view preference to localStorage', () => {
      spyOn(localStorage, 'setItem');
      
      pageObject.toggleViewMode();
      
      expect(localStorage.setItem).toHaveBeenCalledWith('policyListViewMode', 'card');
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle policy loading error', fakeAsync(() => {
      const error = new Error('Failed to load policies');
      spyOn(policyService, 'getUserPolicies').and.returnValue(throwError(() => error));
      
      component.loadPolicies();
      tick(100);
      
      expect(notificationService.showError).toHaveBeenCalled();
      expect(component.error).toBeTruthy();
      expect(component.isLoading).toBeFalse();
    }));

    it('should handle policy action errors', fakeAsync(() => {
      const error = new Error('Action failed');
      spyOn(policyService, 'updatePolicy').and.returnValue(throwError(() => error));
      
      component.renewPolicy('POL-123');
      tick(100);
      
      expect(notificationService.showError).toHaveBeenCalled();
    }));

    it('should display error message in UI', () => {
      component.error = 'Test error message';
      fixture.detectChanges();
      
      expect(pageObject.errorMessage).toBe('Test error message');
    });

    it('should handle network connectivity issues', fakeAsync(() => {
      spyOn(policyService, 'getUserPolicies').and.returnValue(throwError(() => ({ status: 0 })));
      spyOn(translationService, 'instant').and.returnValue('Network connection error');
      
      component.loadPolicies();
      tick(100);
      
      expect(notificationService.showError).toHaveBeenCalledWith('Network connection error');
    }));
  });

  describe('Thai Insurance Business Logic', () => {
    beforeEach(fakeAsync(() => {
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      fixture.detectChanges();
      tick(100);
    }));

    it('should identify policies requiring renewal', () => {
      const renewalRequired = component.getPoliciesRequiringRenewal();
      
      renewalRequired.forEach(policy => {
        const daysUntilExpiry = component.getDaysUntilExpiry(policy);
        expect(daysUntilExpiry).toBeLessThanOrEqual(30);
      });
    });

    it('should calculate policy value in Thai Baht', () => {
      const policy = MOCK_POLICIES[0];
      const thaiValue = component.formatThaiCurrency(policy.premium);
      
      expect(thaiValue).toMatch(/฿[\d,]+\.\d{2}/);
    });

    it('should identify compulsory vs voluntary insurance', () => {
      const compulsoryPolicies = component.getCompulsoryPolicies();
      const voluntaryPolicies = component.getVoluntaryPolicies();
      
      compulsoryPolicies.forEach(policy => {
        expect(policy.type).toContain('COMPULSORY');
      });
      
      voluntaryPolicies.forEach(policy => {
        expect(policy.type).not.toContain('COMPULSORY');
      });
    });

    it('should validate Thai vehicle registration numbers', () => {
      const validPlate = 'กข 1234';
      const invalidPlate = 'INVALID';
      
      expect(ThaiValidationUtils.validateVehicleLicensePlate(validPlate)).toBeTrue();
      expect(ThaiValidationUtils.validateVehicleLicensePlate(invalidPlate)).toBeFalse();
    });

    it('should handle Thai holiday calculations for policy dates', () => {
      const songkranDate = new Date('2024-04-13'); // Songkran holiday
      
      expect(component.isThaiPublicHoliday(songkranDate)).toBeTrue();
    });
  });

  describe('Accessibility Features', () => {
    beforeEach(fakeAsync(() => {
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      fixture.detectChanges();
      tick(100);
    }));

    it('should have proper ARIA labels on interactive elements', () => {
      const searchInput = pageObject.searchInput;
      expect(searchInput?.getAttribute('aria-label')).toBeTruthy();
    });

    it('should support keyboard navigation in table', () => {
      const firstRow = pageObject.getPolicyRows()[0];
      if (firstRow) {
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        firstRow.dispatchEvent(event);
        
        // Should navigate to policy details
        expect(router.navigate).toHaveBeenCalled();
      }
    });

    it('should announce filter changes to screen readers', () => {
      spyOn(component, 'announceFilterChange');
      
      pageObject.filterByStatus('ACTIVE');
      
      expect(component.announceFilterChange).toHaveBeenCalled();
    });

    it('should provide skip links for keyboard users', () => {
      const skipLinks = fixture.nativeElement.querySelectorAll('[href^="#"]');
      expect(skipLinks.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    beforeEach(fakeAsync(() => {
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      fixture.detectChanges();
      tick(100);
    }));

    it('should adapt to mobile viewport', () => {
      Object.defineProperty(window, 'innerWidth', { value: 375 });
      component.onResize();
      
      expect(component.isMobileView).toBeTrue();
    });

    it('should switch to card view on mobile automatically', () => {
      component.isMobileView = true;
      component.adaptViewForMobile();
      
      expect(component.viewMode).toBe('card');
    });

    it('should show/hide columns based on screen size', () => {
      component.isMobileView = true;
      
      const visibleColumns = component.getVisibleColumns();
      
      expect(visibleColumns.length).toBeLessThan(component.allColumns.length);
    });

    it('should handle touch gestures for mobile navigation', () => {
      const touchEvent = new TouchEvent('touchstart');
      
      expect(() => component.handleTouchEvent(touchEvent)).not.toThrow();
    });
  });

  describe('Performance Optimization', () => {
    beforeEach(fakeAsync(() => {
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      fixture.detectChanges();
      tick(100);
    }));

    it('should implement virtual scrolling for large datasets', () => {
      const largeDataset = Array(1000).fill(null).map((_, i) => ({
        ...MOCK_POLICIES[0],
        id: `POL-${i}`,
        policyNumber: `TH-POL-2024-${i}`
      }));
      
      component.policies = largeDataset;
      component.enableVirtualScrolling();
      
      expect(component.virtualScrollEnabled).toBeTrue();
    });

    it('should debounce search input', fakeAsync(() => {
      spyOn(component, 'performSearch');
      
      pageObject.searchPolicies('test');
      pageObject.searchPolicies('test1');
      pageObject.searchPolicies('test12');
      
      tick(300);
      
      // Should only call once after debounce delay
      expect(component.performSearch).toHaveBeenCalledTimes(1);
    }));

    it('should cache filtered results', () => {
      spyOn(component, 'getCachedFilterResults').and.returnValue(MOCK_POLICIES.slice(0, 2));
      
      pageObject.filterByStatus('ACTIVE');
      
      expect(component.getCachedFilterResults).toHaveBeenCalled();
    });

    it('should track items by ID for efficient rendering', () => {
      const trackFn = component.trackByPolicyId;
      const policy = MOCK_POLICIES[0];
      
      expect(trackFn(0, policy)).toBe(policy.id);
    });
  });

  describe('Component Lifecycle', () => {
    it('should unsubscribe on destroy', () => {
      const subscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
      component['subscriptions'] = [subscription];
      
      component.ngOnDestroy();
      
      expect(subscription.unsubscribe).toHaveBeenCalled();
    });

    it('should save state before navigation', () => {
      spyOn(component, 'saveListState');
      
      // Simulate navigation away
      component.ngOnDestroy();
      
      expect(component.saveListState).toHaveBeenCalled();
    });

    it('should restore state on return', () => {
      const savedState = {
        currentPage: 2,
        filters: { status: 'ACTIVE' },
        viewMode: 'card'
      };
      spyOn(component, 'loadSavedState').and.returnValue(savedState);
      
      component.ngOnInit();
      
      expect(component.currentPage).toBe(2);
      expect(component.viewMode).toBe('card');
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle empty policy response', fakeAsync(() => {
      spyOn(policyService, 'getUserPolicies').and.returnValue(of([]));
      
      component.loadPolicies();
      tick(100);
      
      expect(component.policies).toEqual([]);
      expect(component.filteredPolicies).toEqual([]);
      expect(pageObject.emptyMessage).toBeTruthy();
    }));

    it('should handle malformed policy data', fakeAsync(() => {
      const malformedPolicies = [
        { ...MOCK_POLICIES[0], premium: null },
        { ...MOCK_POLICIES[0], startDate: 'invalid-date' }
      ];
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(malformedPolicies as any));
      
      component.loadPolicies();
      tick(100);
      
      expect(() => component.formatPolicy(malformedPolicies[0] as any)).not.toThrow();
    }));

    it('should handle rapid filter changes', fakeAsync(() => {
      spyOn(component, 'applyFilters');
      
      // Rapid filter changes
      pageObject.filterByStatus('ACTIVE');
      pageObject.filterByStatus('EXPIRED');
      pageObject.filterByStatus('CANCELLED');
      
      tick(300);
      
      // Should debounce and only apply final filter
      expect(component.applyFilters).toHaveBeenCalledWith(jasmine.objectContaining({
        status: 'CANCELLED'
      }));
    }));

    it('should handle pagination edge cases', () => {
      component.filteredPolicies = [];
      
      expect(() => component.nextPage()).not.toThrow();
      expect(() => component.previousPage()).not.toThrow();
      expect(component.currentPage).toBe(1);
    });
  });
});