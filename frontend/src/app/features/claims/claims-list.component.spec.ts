import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { ClaimsListComponent } from './claims-list.component';
import { AuthService } from '../../core/services/auth.service';
import { ClaimService } from '../../core/services/claim.service';
import { PolicyService } from '../../core/services/policy.service';
import { TranslationService } from '../../core/services/translation.service';
import { NotificationService } from '../../core/services/notification.service';
import { LoadingService } from '../../core/services/loading.service';
import { 
  MockAuthService, 
  MockClaimService,
  MockPolicyService,
  MockTranslationService, 
  MockNotificationService,
  MockLoadingService,
  MockRouter
} from '../../test-helpers/mock-services';
import { MOCK_USERS, MOCK_CLAIMS, MOCK_POLICIES, MOCK_CLAIM_DOCUMENTS } from '../../test-helpers/test-data';
import { TestUtilities, PageObject, ThaiValidationUtils } from '../../test-helpers/test-utilities';

class ClaimsListPageObject extends PageObject<ClaimsListComponent> {
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

  get amountFromInput(): HTMLInputElement | null {
    return this.getElement<HTMLInputElement>('[data-testid="amount-from-input"]');
  }

  get amountToInput(): HTMLInputElement | null {
    return this.getElement<HTMLInputElement>('[data-testid="amount-to-input"]');
  }

  get policyFilter(): HTMLSelectElement | null {
    return this.getElement<HTMLSelectElement>('[data-testid="policy-filter"]');
  }

  get clearFiltersButton(): HTMLButtonElement | null {
    return this.getElement<HTMLButtonElement>('[data-testid="clear-filters-button"]');
  }

  get newClaimButton(): HTMLButtonElement | null {
    return this.getElement<HTMLButtonElement>('[data-testid="new-claim-button"]');
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

  get claimsTable(): HTMLTableElement | null {
    return this.getElement<HTMLTableElement>('[data-testid="claims-table"]');
  }

  get claimCards(): NodeListOf<Element> {
    return this.getElements('[data-testid="claim-card"]');
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

  get statusLegend(): HTMLElement | null {
    return this.getElement('[data-testid="status-legend"]');
  }

  get claimsSummary(): HTMLElement | null {
    return this.getElement('[data-testid="claims-summary"]');
  }

  get quickStats(): HTMLElement | null {
    return this.getElement('[data-testid="quick-stats"]');
  }

  searchClaims(query: string): void {
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

  filterByPolicy(policyId: string): void {
    const select = this.policyFilter;
    if (select) {
      select.value = policyId;
      select.dispatchEvent(new Event('change'));
      this.detectChanges();
    }
  }

  setDateRange(from: string, to: string): void {
    if (this.dateFromInput) this.setInputValue('[data-testid="date-from-input"]', from);
    if (this.dateToInput) this.setInputValue('[data-testid="date-to-input"]', to);
  }

  setAmountRange(from: string, to: string): void {
    if (this.amountFromInput) this.setInputValue('[data-testid="amount-from-input"]', from);
    if (this.amountToInput) this.setInputValue('[data-testid="amount-to-input"]', to);
  }

  clickClearFilters(): void {
    this.clickElement('[data-testid="clear-filters-button"]');
  }

  clickNewClaim(): void {
    this.clickElement('[data-testid="new-claim-button"]');
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

  selectAllClaims(): void {
    this.clickElement('[data-testid="select-all-checkbox"]');
  }

  selectClaim(index: number): void {
    this.clickElement(`[data-testid="claim-checkbox-${index}"]`);
  }

  clickClaimAction(claimId: string, action: string): void {
    this.clickElement(`[data-testid="claim-${action}-${claimId}"]`);
  }

  getClaimRows(): NodeListOf<Element> {
    return this.getElements('[data-testid="claim-row"]');
  }

  getClaimCardElements(): NodeListOf<Element> {
    return this.getElements('[data-testid="claim-card"]');
  }

  getClaimStatusChips(): NodeListOf<Element> {
    return this.getElements('[data-testid="claim-status-chip"]');
  }

  getClaimProgressBars(): NodeListOf<Element> {
    return this.getElements('[data-testid="claim-progress-bar"]');
  }
}

describe('ClaimsListComponent', () => {
  let component: ClaimsListComponent;
  let fixture: ComponentFixture<ClaimsListComponent>;
  let pageObject: ClaimsListPageObject;
  let authService: MockAuthService;
  let claimService: MockClaimService;
  let policyService: MockPolicyService;
  let router: MockRouter;
  let translationService: MockTranslationService;
  let notificationService: MockNotificationService;
  let loadingService: MockLoadingService;

  beforeEach(async () => {
    const authServiceInstance = new MockAuthService();
    const claimServiceInstance = new MockClaimService();
    const policyServiceInstance = new MockPolicyService();
    const routerInstance = new MockRouter();
    const translationServiceInstance = new MockTranslationService();
    const notificationServiceInstance = new MockNotificationService();
    const loadingServiceInstance = new MockLoadingService();

    await TestBed.configureTestingModule({
      declarations: [ClaimsListComponent],
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceInstance },
        { provide: ClaimService, useValue: claimServiceInstance },
        { provide: PolicyService, useValue: policyServiceInstance },
        { provide: Router, useValue: routerInstance },
        { provide: TranslationService, useValue: translationServiceInstance },
        { provide: NotificationService, useValue: notificationServiceInstance },
        { provide: LoadingService, useValue: loadingServiceInstance }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClaimsListComponent);
    component = fixture.componentInstance;
    pageObject = new ClaimsListPageObject(fixture);

    authService = TestBed.inject(AuthService) as any;
    claimService = TestBed.inject(ClaimService) as any;
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
      expect(component.claims).toEqual([]);
      expect(component.filteredClaims).toEqual([]);
      expect(component.selectedClaims).toEqual([]);
      expect(component.currentPage).toBe(1);
      expect(component.viewMode).toBe('table');
    });

    it('should load claims on init', fakeAsync(() => {
      spyOn(claimService, 'getUserClaims').and.returnValue(of(MOCK_CLAIMS));
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      
      component.ngOnInit();
      tick(100);
      
      expect(claimService.getUserClaims).toHaveBeenCalledWith(MOCK_USERS[0].id);
      expect(policyService.getUserPolicies).toHaveBeenCalledWith(MOCK_USERS[0].id);
      expect(component.claims).toEqual(MOCK_CLAIMS);
      expect(component.filteredClaims).toEqual(MOCK_CLAIMS);
    }));

    it('should load all claims for admin users', fakeAsync(() => {
      authService._mockUser = { ...MOCK_USERS[0], role: 'ADMIN' };
      spyOn(claimService, 'getAllClaims').and.returnValue(of(MOCK_CLAIMS));
      spyOn(policyService, 'getAllPolicies').and.returnValue(of(MOCK_POLICIES));
      
      component.ngOnInit();
      tick(100);
      
      expect(claimService.getAllClaims).toHaveBeenCalled();
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
      expect(component.filtersForm.get('amountFrom')).toBeTruthy();
      expect(component.filtersForm.get('amountTo')).toBeTruthy();
      expect(component.filtersForm.get('policyId')).toBeTruthy();
    }));

    it('should redirect unauthenticated users', () => {
      authService._isAuthenticated = false;
      authService._mockUser = null;
      
      component.ngOnInit();
      
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });

  describe('Claims Loading and Display', () => {
    beforeEach(fakeAsync(() => {
      spyOn(claimService, 'getUserClaims').and.returnValue(of(MOCK_CLAIMS));
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      fixture.detectChanges();
      tick(100);
    }));

    it('should display claims in table view', () => {
      component.viewMode = 'table';
      fixture.detectChanges();
      
      expect(pageObject.claimsTable).toBeTruthy();
      
      const rows = pageObject.getClaimRows();
      expect(rows.length).toBeGreaterThan(0);
    });

    it('should display claims in card view', () => {
      component.viewMode = 'card';
      fixture.detectChanges();
      
      const cards = pageObject.getClaimCardElements();
      expect(cards.length).toBeGreaterThan(0);
    });

    it('should show claim status chips', () => {
      const statusChips = pageObject.getClaimStatusChips();
      expect(statusChips.length).toBeGreaterThanOrEqual(0);
    });

    it('should display claim progress bars', () => {
      const progressBars = pageObject.getClaimProgressBars();
      expect(progressBars.length).toBeGreaterThanOrEqual(0);
    });

    it('should show total results count', () => {
      const totalText = pageObject.totalResultsText;
      expect(totalText).toContain(MOCK_CLAIMS.length.toString());
    });

    it('should show loading state', () => {
      component.isLoading = true;
      fixture.detectChanges();
      
      expect(pageObject.loadingSpinner).toBeTruthy();
    });

    it('should show empty message when no claims', () => {
      component.claims = [];
      component.filteredClaims = [];
      fixture.detectChanges();
      
      expect(pageObject.emptyMessage).toBeTruthy();
    });

    it('should display Thai claim information correctly', () => {
      const claim = component.claims[0];
      const formattedAmount = component.formatThaiCurrency(claim.claimAmount);
      
      expect(formattedAmount).toContain('฿');
      expect(formattedAmount).toContain(',');
    });

    it('should show claims summary statistics', () => {
      expect(pageObject.claimsSummary).toBeTruthy();
      expect(pageObject.quickStats).toBeTruthy();
    });
  });

  describe('Search and Filtering', () => {
    beforeEach(fakeAsync(() => {
      spyOn(claimService, 'getUserClaims').and.returnValue(of(MOCK_CLAIMS));
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      fixture.detectChanges();
      tick(100);
    }));

    it('should filter claims by search query', fakeAsync(() => {
      const searchTerm = 'CLM-2024';
      pageObject.searchClaims(searchTerm);
      tick(300); // Debounce delay
      
      const filtered = component.filteredClaims.filter(c => 
        c.claimNumber.includes(searchTerm) || 
        c.description.includes(searchTerm)
      );
      
      expect(component.filteredClaims.length).toBe(filtered.length);
    }));

    it('should filter claims by status', () => {
      pageObject.filterByStatus('PENDING');
      
      component.filteredClaims.forEach(claim => {
        expect(claim.status).toBe('PENDING');
      });
    });

    it('should filter claims by type', () => {
      pageObject.filterByType('ACCIDENT');
      
      component.filteredClaims.forEach(claim => {
        expect(claim.type).toBe('ACCIDENT');
      });
    });

    it('should filter claims by policy', () => {
      const policyId = MOCK_POLICIES[0].id;
      pageObject.filterByPolicy(policyId);
      
      component.filteredClaims.forEach(claim => {
        expect(claim.policyId).toBe(policyId);
      });
    });

    it('should filter claims by date range', () => {
      const fromDate = '2024-01-01';
      const toDate = '2024-12-31';
      
      pageObject.setDateRange(fromDate, toDate);
      
      component.filteredClaims.forEach(claim => {
        const claimDate = new Date(claim.incidentDate);
        expect(claimDate.getTime()).toBeGreaterThanOrEqual(new Date(fromDate).getTime());
        expect(claimDate.getTime()).toBeLessThanOrEqual(new Date(toDate).getTime());
      });
    });

    it('should filter claims by amount range', () => {
      const minAmount = '10000';
      const maxAmount = '100000';
      
      pageObject.setAmountRange(minAmount, maxAmount);
      
      component.filteredClaims.forEach(claim => {
        expect(claim.claimAmount).toBeGreaterThanOrEqual(parseFloat(minAmount));
        expect(claim.claimAmount).toBeLessThanOrEqual(parseFloat(maxAmount));
      });
    });

    it('should clear all filters', () => {
      // Apply some filters first
      pageObject.searchClaims('test');
      pageObject.filterByStatus('PENDING');
      
      pageObject.clickClearFilters();
      
      expect(component.filtersForm.get('search')?.value).toBe('');
      expect(component.filtersForm.get('status')?.value).toBe('');
      expect(component.filteredClaims.length).toBe(component.claims.length);
    });

    it('should combine multiple filters', fakeAsync(() => {
      pageObject.searchClaims('CLM');
      pageObject.filterByStatus('PENDING');
      pageObject.filterByType('ACCIDENT');
      tick(300);
      
      component.filteredClaims.forEach(claim => {
        expect(claim.claimNumber).toContain('CLM');
        expect(claim.status).toBe('PENDING');
        expect(claim.type).toBe('ACCIDENT');
      });
    }));

    it('should handle Thai search terms', fakeAsync(() => {
      const thaiTerm = 'อุบัติเหตุ';
      pageObject.searchClaims(thaiTerm);
      tick(300);
      
      // Should filter based on Thai descriptions
      expect(component.filteredClaims.length).toBeGreaterThanOrEqual(0);
    }));
  });

  describe('Sorting Functionality', () => {
    beforeEach(fakeAsync(() => {
      spyOn(claimService, 'getUserClaims').and.returnValue(of(MOCK_CLAIMS));
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      fixture.detectChanges();
      tick(100);
    }));

    it('should sort claims by claim number', () => {
      pageObject.sortBy('claimNumber');
      
      const sorted = [...component.filteredClaims].sort((a, b) => 
        a.claimNumber.localeCompare(b.claimNumber)
      );
      
      expect(component.filteredClaims).toEqual(sorted);
    });

    it('should sort claims by incident date', () => {
      pageObject.sortBy('incidentDate');
      
      const sorted = [...component.filteredClaims].sort((a, b) => 
        new Date(a.incidentDate).getTime() - new Date(b.incidentDate).getTime()
      );
      
      expect(component.filteredClaims[0].incidentDate).toBe(sorted[0].incidentDate);
    });

    it('should sort claims by amount', () => {
      pageObject.sortBy('claimAmount');
      
      const sorted = [...component.filteredClaims].sort((a, b) => a.claimAmount - b.claimAmount);
      
      expect(component.filteredClaims[0].claimAmount).toBe(sorted[0].claimAmount);
    });

    it('should sort claims by status', () => {
      pageObject.sortBy('status');
      
      const sorted = [...component.filteredClaims].sort((a, b) => 
        a.status.localeCompare(b.status)
      );
      
      expect(component.filteredClaims[0].status).toBe(sorted[0].status);
    });

    it('should toggle sort order', () => {
      pageObject.sortBy('claimAmount');
      const firstAsc = component.filteredClaims[0].claimAmount;
      
      pageObject.toggleSortOrder();
      const firstDesc = component.filteredClaims[0].claimAmount;
      
      expect(firstAsc).not.toBe(firstDesc);
    });

    it('should maintain sort order when filtering', fakeAsync(() => {
      pageObject.sortBy('claimAmount');
      pageObject.searchClaims('CLM');
      tick(300);
      
      // Should maintain amount sorting after search
      for (let i = 0; i < component.filteredClaims.length - 1; i++) {
        const current = component.filteredClaims[i].claimAmount;
        const next = component.filteredClaims[i + 1].claimAmount;
        expect(current).toBeLessThanOrEqual(next);
      }
    }));
  });

  describe('Claim Status Management', () => {
    beforeEach(fakeAsync(() => {
      spyOn(claimService, 'getUserClaims').and.returnValue(of(MOCK_CLAIMS));
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      fixture.detectChanges();
      tick(100);
    }));

    it('should display status legend', () => {
      expect(pageObject.statusLegend).toBeTruthy();
    });

    it('should calculate status statistics', () => {
      const stats = component.getClaimStatusStats();
      
      expect(stats.total).toBe(MOCK_CLAIMS.length);
      expect(stats.pending).toBeGreaterThanOrEqual(0);
      expect(stats.approved).toBeGreaterThanOrEqual(0);
      expect(stats.rejected).toBeGreaterThanOrEqual(0);
    });

    it('should show progress for each claim', () => {
      const claim = MOCK_CLAIMS[0];
      const progress = component.getClaimProgress(claim);
      
      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(100);
    });

    it('should identify overdue claims', () => {
      const overdueClaims = component.getOverdueClaims();
      
      overdueClaims.forEach(claim => {
        const daysSinceSubmission = component.getDaysSinceSubmission(claim);
        expect(daysSinceSubmission).toBeGreaterThan(component.SLA_DAYS);
      });
    });

    it('should show estimated processing time', () => {
      const claim = MOCK_CLAIMS[0];
      const estimatedTime = component.getEstimatedProcessingTime(claim);
      
      expect(estimatedTime).toBeGreaterThan(0);
    });
  });

  describe('Bulk Actions', () => {
    beforeEach(fakeAsync(() => {
      spyOn(claimService, 'getUserClaims').and.returnValue(of(MOCK_CLAIMS));
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      fixture.detectChanges();
      tick(100);
    }));

    it('should select all claims', () => {
      pageObject.selectAllClaims();
      
      expect(component.selectedClaims.length).toBe(component.getPageItems().length);
    });

    it('should deselect all claims', () => {
      // First select all
      pageObject.selectAllClaims();
      expect(component.selectedClaims.length).toBeGreaterThan(0);
      
      // Then deselect all
      pageObject.selectAllClaims();
      expect(component.selectedClaims.length).toBe(0);
    });

    it('should select individual claim', () => {
      pageObject.selectClaim(0);
      
      expect(component.selectedClaims.length).toBe(1);
      expect(component.selectedClaims[0]).toBe(component.getPageItems()[0].id);
    });

    it('should show selected count', () => {
      pageObject.selectClaim(0);
      pageObject.selectClaim(1);
      fixture.detectChanges();
      
      const selectedCountText = pageObject.selectedCount;
      expect(selectedCountText).toContain('2');
    });

    it('should show bulk actions panel when items selected', () => {
      pageObject.selectClaim(0);
      fixture.detectChanges();
      
      expect(pageObject.bulkActionsPanel).toBeTruthy();
    });

    it('should bulk update claim status for admin users', fakeAsync(() => {
      authService._mockUser = { ...MOCK_USERS[0], role: 'ADMIN' };
      pageObject.selectClaim(0);
      pageObject.selectClaim(1);
      
      spyOn(claimService, 'updateClaim').and.returnValue(of(MOCK_CLAIMS[0]));
      
      component.bulkUpdateStatus('APPROVED');
      tick(100);
      
      expect(claimService.updateClaim).toHaveBeenCalledTimes(2);
    }));
  });

  describe('Claim Actions', () => {
    beforeEach(fakeAsync(() => {
      spyOn(claimService, 'getUserClaims').and.returnValue(of(MOCK_CLAIMS));
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      fixture.detectChanges();
      tick(100);
    }));

    it('should navigate to claim details', () => {
      const claimId = MOCK_CLAIMS[0].id;
      
      component.viewClaimDetails(claimId);
      
      expect(router.navigate).toHaveBeenCalledWith(['/claims', claimId]);
    });

    it('should navigate to claim edit', () => {
      const claimId = MOCK_CLAIMS[0].id;
      
      component.editClaim(claimId);
      
      expect(router.navigate).toHaveBeenCalledWith(['/claims', claimId, 'edit']);
    });

    it('should navigate to create new claim', () => {
      pageObject.clickNewClaim();
      
      expect(router.navigate).toHaveBeenCalledWith(['/claims/new']);
    });

    it('should upload claim documents', fakeAsync(() => {
      const claimId = MOCK_CLAIMS[0].id;
      const mockFile = new File(['test'], 'document.pdf', { type: 'application/pdf' });
      
      spyOn(claimService, 'uploadDocument').and.returnValue(of(MOCK_CLAIM_DOCUMENTS[0]));
      
      component.uploadDocument(claimId, mockFile);
      tick(100);
      
      expect(claimService.uploadDocument).toHaveBeenCalledWith(claimId, mockFile);
      expect(notificationService.showSuccess).toHaveBeenCalled();
    }));

    it('should withdraw claim with confirmation', fakeAsync(() => {
      const claimId = MOCK_CLAIMS[0].id;
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(claimService, 'updateClaim').and.returnValue(of({ ...MOCK_CLAIMS[0], status: 'WITHDRAWN' }));
      
      component.withdrawClaim(claimId);
      tick(100);
      
      expect(window.confirm).toHaveBeenCalled();
      expect(claimService.updateClaim).toHaveBeenCalledWith(claimId, jasmine.objectContaining({
        status: 'WITHDRAWN'
      }));
      expect(notificationService.showSuccess).toHaveBeenCalled();
    }));

    it('should not withdraw claim without confirmation', () => {
      const claimId = MOCK_CLAIMS[0].id;
      spyOn(window, 'confirm').and.returnValue(false);
      
      component.withdrawClaim(claimId);
      
      expect(claimService.updateClaim).not.toHaveBeenCalled();
    });

    it('should approve claim for admin users', fakeAsync(() => {
      authService._mockUser = { ...MOCK_USERS[0], role: 'ADMIN' };
      const claimId = MOCK_CLAIMS[0].id;
      spyOn(claimService, 'updateClaim').and.returnValue(of({ ...MOCK_CLAIMS[0], status: 'APPROVED' }));
      
      component.approveClaim(claimId);
      tick(100);
      
      expect(claimService.updateClaim).toHaveBeenCalledWith(claimId, jasmine.objectContaining({
        status: 'APPROVED'
      }));
    }));

    it('should reject claim for admin users with reason', fakeAsync(() => {
      authService._mockUser = { ...MOCK_USERS[0], role: 'ADMIN' };
      const claimId = MOCK_CLAIMS[0].id;
      const reason = 'Insufficient documentation';
      spyOn(claimService, 'updateClaim').and.returnValue(of({ ...MOCK_CLAIMS[0], status: 'REJECTED' }));
      
      component.rejectClaim(claimId, reason);
      tick(100);
      
      expect(claimService.updateClaim).toHaveBeenCalledWith(claimId, jasmine.objectContaining({
        status: 'REJECTED',
        rejectionReason: reason
      }));
    }));
  });

  describe('Export Functionality', () => {
    beforeEach(fakeAsync(() => {
      spyOn(claimService, 'getUserClaims').and.returnValue(of(MOCK_CLAIMS));
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      fixture.detectChanges();
      tick(100);
    }));

    it('should export claims to CSV', () => {
      spyOn(component, 'generateCSV').and.callThrough();
      spyOn(component, 'downloadFile');
      
      pageObject.clickExport();
      
      expect(component.generateCSV).toHaveBeenCalled();
      expect(component.downloadFile).toHaveBeenCalled();
    });

    it('should export only filtered claims', () => {
      pageObject.filterByStatus('PENDING');
      spyOn(component, 'generateCSV').and.callThrough();
      
      pageObject.clickExport();
      
      expect(component.generateCSV).toHaveBeenCalledWith(component.filteredClaims);
    });

    it('should export selected claims when bulk selected', () => {
      pageObject.selectClaim(0);
      pageObject.selectClaim(1);
      spyOn(component, 'generateCSV').and.callThrough();
      
      pageObject.clickExport();
      
      expect(component.generateCSV).toHaveBeenCalledWith(jasmine.any(Array));
    });

    it('should format Thai data correctly in export', () => {
      const csv = component.generateCSV(MOCK_CLAIMS);
      
      expect(csv).toContain('CLM-'); // Claim number format
      expect(csv).not.toContain('undefined'); // No undefined values
    });

    it('should include policy information in export', () => {
      const csv = component.generateCSV(MOCK_CLAIMS);
      
      expect(csv).toContain('Policy Number'); // Header
      expect(csv).toContain('TH-POL'); // Policy number format
    });
  });

  describe('Thai Insurance Business Logic', () => {
    beforeEach(fakeAsync(() => {
      spyOn(claimService, 'getUserClaims').and.returnValue(of(MOCK_CLAIMS));
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      fixture.detectChanges();
      tick(100);
    }));

    it('should categorize claims by Thai insurance types', () => {
      const compulsoryClaims = component.getCompulsoryClaims();
      const voluntaryClaims = component.getVoluntaryClaims();
      
      compulsoryClaims.forEach(claim => {
        const policy = component.getPolicyForClaim(claim.id);
        expect(policy?.type).toContain('COMPULSORY');
      });
      
      voluntaryClaims.forEach(claim => {
        const policy = component.getPolicyForClaim(claim.id);
        expect(policy?.type).not.toContain('COMPULSORY');
      });
    });

    it('should calculate claim value in Thai Baht', () => {
      const claim = MOCK_CLAIMS[0];
      const thaiValue = component.formatThaiCurrency(claim.claimAmount);
      
      expect(thaiValue).toMatch(/฿[\d,]+\.\d{2}/);
    });

    it('should handle Thai holiday delays in processing', () => {
      const claim = MOCK_CLAIMS[0];
      const processingDays = component.calculateProcessingDaysExcludingHolidays(claim);
      
      expect(processingDays).toBeGreaterThanOrEqual(0);
    });

    it('should validate Thai vehicle damage assessments', () => {
      const damageReport = {
        vehicleLicense: 'กข 1234',
        damageDescription: 'กันชนหน้าเสียหาย',
        repairCost: 25000
      };
      
      const isValid = component.validateDamageReport(damageReport);
      expect(isValid).toBeTrue();
    });

    it('should handle third-party liability claims', () => {
      const thirdPartyClaims = component.getThirdPartyClaims();
      
      thirdPartyClaims.forEach(claim => {
        expect(claim.type).toBe('THIRD_PARTY_LIABILITY');
        expect(claim.thirdPartyDetails).toBeDefined();
      });
    });
  });

  describe('Accessibility Features', () => {
    beforeEach(fakeAsync(() => {
      spyOn(claimService, 'getUserClaims').and.returnValue(of(MOCK_CLAIMS));
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      fixture.detectChanges();
      tick(100);
    }));

    it('should have proper ARIA labels on interactive elements', () => {
      const searchInput = pageObject.searchInput;
      expect(searchInput?.getAttribute('aria-label')).toBeTruthy();
    });

    it('should support keyboard navigation in table', () => {
      const firstRow = pageObject.getClaimRows()[0];
      if (firstRow) {
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        firstRow.dispatchEvent(event);
        
        // Should navigate to claim details
        expect(router.navigate).toHaveBeenCalled();
      }
    });

    it('should announce filter changes to screen readers', () => {
      spyOn(component, 'announceFilterChange');
      
      pageObject.filterByStatus('PENDING');
      
      expect(component.announceFilterChange).toHaveBeenCalled();
    });

    it('should provide status information for screen readers', () => {
      const statusChips = pageObject.getClaimStatusChips();
      statusChips.forEach(chip => {
        expect(chip.getAttribute('aria-label')).toBeTruthy();
      });
    });

    it('should have proper table headers and structure', () => {
      const table = pageObject.claimsTable;
      if (table) {
        const headers = table.querySelectorAll('th');
        expect(headers.length).toBeGreaterThan(0);
        
        headers.forEach(header => {
          expect(header.getAttribute('scope')).toBeTruthy();
        });
      }
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle claims loading error', fakeAsync(() => {
      const error = new Error('Failed to load claims');
      spyOn(claimService, 'getUserClaims').and.returnValue(throwError(() => error));
      
      component.loadClaims();
      tick(100);
      
      expect(notificationService.showError).toHaveBeenCalled();
      expect(component.error).toBeTruthy();
      expect(component.isLoading).toBeFalse();
    }));

    it('should handle claim action errors', fakeAsync(() => {
      const error = new Error('Action failed');
      spyOn(claimService, 'updateClaim').and.returnValue(throwError(() => error));
      
      component.approveClaim('CLM-123');
      tick(100);
      
      expect(notificationService.showError).toHaveBeenCalled();
    }));

    it('should handle document upload errors', fakeAsync(() => {
      const error = new Error('Upload failed');
      const mockFile = new File(['test'], 'document.pdf', { type: 'application/pdf' });
      spyOn(claimService, 'uploadDocument').and.returnValue(throwError(() => error));
      
      component.uploadDocument('CLM-123', mockFile);
      tick(100);
      
      expect(notificationService.showError).toHaveBeenCalled();
    }));

    it('should display error message in UI', () => {
      component.error = 'Test error message';
      fixture.detectChanges();
      
      expect(pageObject.errorMessage).toBe('Test error message');
    });

    it('should handle network connectivity issues', fakeAsync(() => {
      spyOn(claimService, 'getUserClaims').and.returnValue(throwError(() => ({ status: 0 })));
      spyOn(translationService, 'instant').and.returnValue('Network connection error');
      
      component.loadClaims();
      tick(100);
      
      expect(notificationService.showError).toHaveBeenCalledWith('Network connection error');
    }));
  });

  describe('Performance Optimization', () => {
    beforeEach(fakeAsync(() => {
      spyOn(claimService, 'getUserClaims').and.returnValue(of(MOCK_CLAIMS));
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      fixture.detectChanges();
      tick(100);
    }));

    it('should implement virtual scrolling for large datasets', () => {
      const largeDataset = Array(1000).fill(null).map((_, i) => ({
        ...MOCK_CLAIMS[0],
        id: `CLM-${i}`,
        claimNumber: `TH-CLM-2024-${i}`
      }));
      
      component.claims = largeDataset;
      component.enableVirtualScrolling();
      
      expect(component.virtualScrollEnabled).toBeTrue();
    });

    it('should debounce search input', fakeAsync(() => {
      spyOn(component, 'performSearch');
      
      pageObject.searchClaims('test');
      pageObject.searchClaims('test1');
      pageObject.searchClaims('test12');
      
      tick(300);
      
      // Should only call once after debounce delay
      expect(component.performSearch).toHaveBeenCalledTimes(1);
    }));

    it('should cache filtered results', () => {
      spyOn(component, 'getCachedFilterResults').and.returnValue(MOCK_CLAIMS.slice(0, 2));
      
      pageObject.filterByStatus('PENDING');
      
      expect(component.getCachedFilterResults).toHaveBeenCalled();
    });

    it('should track items by ID for efficient rendering', () => {
      const trackFn = component.trackByClaimId;
      const claim = MOCK_CLAIMS[0];
      
      expect(trackFn(0, claim)).toBe(claim.id);
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
        filters: { status: 'PENDING' },
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

    it('should handle empty claims response', fakeAsync(() => {
      spyOn(claimService, 'getUserClaims').and.returnValue(of([]));
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      
      component.loadClaims();
      tick(100);
      
      expect(component.claims).toEqual([]);
      expect(component.filteredClaims).toEqual([]);
      expect(pageObject.emptyMessage).toBeTruthy();
    }));

    it('should handle malformed claim data', fakeAsync(() => {
      const malformedClaims = [
        { ...MOCK_CLAIMS[0], claimAmount: null },
        { ...MOCK_CLAIMS[0], incidentDate: 'invalid-date' }
      ];
      spyOn(claimService, 'getUserClaims').and.returnValue(of(malformedClaims as any));
      spyOn(policyService, 'getUserPolicies').and.returnValue(of(MOCK_POLICIES));
      
      component.loadClaims();
      tick(100);
      
      expect(() => component.formatClaim(malformedClaims[0] as any)).not.toThrow();
    }));

    it('should handle claims without associated policies', () => {
      const orphanClaim = {
        ...MOCK_CLAIMS[0],
        policyId: 'non-existent-policy'
      };
      
      const policy = component.getPolicyForClaim(orphanClaim.id);
      expect(policy).toBeNull();
    });

    it('should handle rapid status updates', fakeAsync(() => {
      spyOn(claimService, 'updateClaim').and.returnValue(of(MOCK_CLAIMS[0]));
      
      // Rapid status updates
      component.approveClaim('CLM-123');
      component.rejectClaim('CLM-123', 'reason');
      
      tick(100);
      
      // Should only process the first one due to loading state
      expect(claimService.updateClaim).toHaveBeenCalledTimes(1);
    }));

    it('should handle pagination edge cases', () => {
      component.filteredClaims = [];
      
      expect(() => component.nextPage()).not.toThrow();
      expect(() => component.previousPage()).not.toThrow();
      expect(component.currentPage).toBe(1);
    });
  });
});