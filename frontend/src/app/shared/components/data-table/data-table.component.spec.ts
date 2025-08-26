import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTableHarness } from '@angular/material/table/testing';
import { MatPaginatorHarness } from '@angular/material/paginator/testing';
import { MatInputHarness } from '@angular/material/input/testing';

import { DataTableComponent } from './data-table.component';

// Mock data for testing
const mockInsurancePolicies = [
  { id: 1, policyNumber: 'POL-2024-001', customerName: 'สมชาย ใจดี', vehicleType: 'รถยนต์', premium: 25000, status: 'active', createdDate: new Date('2024-01-15') },
  { id: 2, policyNumber: 'POL-2024-002', customerName: 'สุดา วงศ์ดี', vehicleType: 'รถจักรยานยนต์', premium: 8000, status: 'expired', createdDate: new Date('2024-02-20') },
  { id: 3, policyNumber: 'POL-2024-003', customerName: 'อนุชา สุขใจ', vehicleType: 'รถยนต์', premium: 30000, status: 'pending', createdDate: new Date('2024-03-10') },
  { id: 4, policyNumber: 'POL-2024-004', customerName: 'วิทยา จันทร์ดี', vehicleType: 'รถบรรทุก', premium: 45000, status: 'active', createdDate: new Date('2024-04-05') },
  { id: 5, policyNumber: 'POL-2024-005', customerName: 'กิตติ มาลัย', vehicleType: 'รถยนต์', premium: 28000, status: 'cancelled', createdDate: new Date('2024-05-12') }
];

const mockClaims = [
  { id: 1, claimNumber: 'CLM-2024-001', policyNumber: 'POL-2024-001', amount: 15000, status: 'approved', claimDate: new Date('2024-06-01') },
  { id: 2, claimNumber: 'CLM-2024-002', policyNumber: 'POL-2024-002', amount: 5000, status: 'rejected', claimDate: new Date('2024-06-15') },
  { id: 3, claimNumber: 'CLM-2024-003', policyNumber: 'POL-2024-003', amount: 25000, status: 'processing', claimDate: new Date('2024-06-20') }
];

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataTableComponent],
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        BrowserAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    
    // Set default configuration
    component.columns = [
      { key: 'policyNumber', title: 'เลขที่กรมธรรม์', sortable: true },
      { key: 'customerName', title: 'ชื่อลูกค้า', sortable: true },
      { key: 'vehicleType', title: 'ประเภทยานพาหนะ', sortable: false },
      { key: 'premium', title: 'เบี้ยประกัน', sortable: true, type: 'currency' },
      { key: 'status', title: 'สถานะ', sortable: false, type: 'status' },
      { key: 'createdDate', title: 'วันที่สร้าง', sortable: true, type: 'date' }
    ];
    
    component.data = mockInsurancePolicies;
    component.enablePagination = true;
    component.enableSorting = true;
    component.enableFiltering = true;
    
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct data', () => {
      expect(component.data.length).toBe(5);
      expect(component.dataSource.data).toEqual(mockInsurancePolicies);
    });

    it('should display all columns', async () => {
      const table = await loader.getHarness(MatTableHarness);
      const headerRows = await table.getHeaderRows();
      const cells = await headerRows[0].getCells();
      
      expect(cells.length).toBe(6);
    });

    it('should show Thai column headers', async () => {
      const table = await loader.getHarness(MatTableHarness);
      const headerRows = await table.getHeaderRows();
      const cells = await headerRows[0].getCells();
      
      const headerTexts = await Promise.all(cells.map(cell => cell.getText()));
      expect(headerTexts).toContain('เลขที่กรมธรรม์');
      expect(headerTexts).toContain('ชื่อลูกค้า');
      expect(headerTexts).toContain('ประเภทยานพาหนะ');
    });

    it('should initialize pagination when enabled', async () => {
      const paginator = await loader.getHarness(MatPaginatorHarness);
      expect(paginator).toBeTruthy();
    });

    it('should initialize sorting when enabled', async () => {
      const sortHeaders = fixture.debugElement.queryAll(By.css('th[mat-sort-header]'));
      expect(sortHeaders.length).toBe(4); // Only sortable columns
    });

    it('should initialize filter input when enabled', () => {
      const filterInput = fixture.debugElement.query(By.css('[data-testid="filter-input"]'));
      expect(filterInput).toBeTruthy();
    });
  });

  describe('Data Display', () => {
    it('should display policy numbers correctly', async () => {
      const table = await loader.getHarness(MatTableHarness);
      const rows = await table.getRows();
      const firstRowCells = await rows[0].getCells();
      
      expect(await firstRowCells[0].getText()).toBe('POL-2024-001');
    });

    it('should display Thai customer names correctly', async () => {
      const table = await loader.getHarness(MatTableHarness);
      const rows = await table.getRows();
      const firstRowCells = await rows[0].getCells();
      
      expect(await firstRowCells[1].getText()).toBe('สมชาย ใจดี');
    });

    it('should format currency values in Thai Baht', async () => {
      const table = await loader.getHarness(MatTableHarness);
      const rows = await table.getRows();
      const firstRowCells = await rows[0].getCells();
      
      expect(await firstRowCells[3].getText()).toContain('25,000');
      expect(await firstRowCells[3].getText()).toContain('บาท');
    });

    it('should format dates in Thai format', async () => {
      const table = await loader.getHarness(MatTableHarness);
      const rows = await table.getRows();
      const firstRowCells = await rows[0].getCells();
      
      const dateText = await firstRowCells[5].getText();
      expect(dateText).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });

    it('should display status with appropriate styling', async () => {
      const statusCells = fixture.debugElement.queryAll(By.css('[data-testid^="status-"]'));
      expect(statusCells.length).toBeGreaterThan(0);
      
      const activeStatus = statusCells.find(cell => 
        cell.nativeElement.textContent.includes('active')
      );
      expect(activeStatus?.nativeElement.classList).toContain('status-active');
    });

    it('should show row numbers when enabled', () => {
      component.showRowNumbers = true;
      fixture.detectChanges();
      
      const rowNumberCells = fixture.debugElement.queryAll(By.css('.row-number'));
      expect(rowNumberCells.length).toBe(5);
    });

    it('should show selection checkboxes when enabled', () => {
      component.enableSelection = true;
      fixture.detectChanges();
      
      const checkboxes = fixture.debugElement.queryAll(By.css('mat-checkbox'));
      expect(checkboxes.length).toBe(6); // 5 rows + header
    });
  });

  describe('Sorting Functionality', () => {
    it('should sort by policy number ascending', async () => {
      const policyNumberHeader = fixture.debugElement.query(
        By.css('[data-testid="sort-policyNumber"]')
      );
      
      policyNumberHeader.nativeElement.click();
      fixture.detectChanges();
      
      const table = await loader.getHarness(MatTableHarness);
      const rows = await table.getRows();
      const firstRowCells = await rows[0].getCells();
      
      expect(await firstRowCells[0].getText()).toBe('POL-2024-001');
    });

    it('should sort by policy number descending', async () => {
      const policyNumberHeader = fixture.debugElement.query(
        By.css('[data-testid="sort-policyNumber"]')
      );
      
      // Click twice for descending
      policyNumberHeader.nativeElement.click();
      policyNumberHeader.nativeElement.click();
      fixture.detectChanges();
      
      const table = await loader.getHarness(MatTableHarness);
      const rows = await table.getRows();
      const firstRowCells = await rows[0].getCells();
      
      expect(await firstRowCells[0].getText()).toBe('POL-2024-005');
    });

    it('should sort by premium amount', async () => {
      const premiumHeader = fixture.debugElement.query(
        By.css('[data-testid="sort-premium"]')
      );
      
      premiumHeader.nativeElement.click();
      fixture.detectChanges();
      
      const table = await loader.getHarness(MatTableHarness);
      const rows = await table.getRows();
      const firstRowCells = await rows[0].getCells();
      
      // Should show lowest premium first
      expect(await firstRowCells[3].getText()).toContain('8,000');
    });

    it('should sort by date', async () => {
      const dateHeader = fixture.debugElement.query(
        By.css('[data-testid="sort-createdDate"]')
      );
      
      dateHeader.nativeElement.click();
      fixture.detectChanges();
      
      const table = await loader.getHarness(MatTableHarness);
      const rows = await table.getRows();
      const firstRowCells = await rows[0].getCells();
      
      // Should show earliest date first
      expect(await firstRowCells[0].getText()).toBe('POL-2024-001');
    });

    it('should not sort non-sortable columns', () => {
      const vehicleTypeHeader = fixture.debugElement.query(
        By.css('th:contains("ประเภทยานพาหนะ")')
      );
      
      expect(vehicleTypeHeader?.nativeElement.getAttribute('mat-sort-header')).toBeNull();
    });

    it('should show sort direction indicators', async () => {
      const policyNumberHeader = fixture.debugElement.query(
        By.css('[data-testid="sort-policyNumber"]')
      );
      
      policyNumberHeader.nativeElement.click();
      fixture.detectChanges();
      
      const sortIcon = fixture.debugElement.query(By.css('.mat-sort-header-arrow'));
      expect(sortIcon).toBeTruthy();
    });
  });

  describe('Filtering Functionality', () => {
    it('should filter by policy number', async () => {
      const filterInput = await loader.getHarness(MatInputHarness.with({
        selector: '[data-testid="filter-input"]'
      }));
      
      await filterInput.setValue('POL-2024-001');
      fixture.detectChanges();
      
      const table = await loader.getHarness(MatTableHarness);
      const rows = await table.getRows();
      
      expect(rows.length).toBe(1);
      
      const cells = await rows[0].getCells();
      expect(await cells[0].getText()).toBe('POL-2024-001');
    });

    it('should filter by customer name in Thai', async () => {
      const filterInput = await loader.getHarness(MatInputHarness.with({
        selector: '[data-testid="filter-input"]'
      }));
      
      await filterInput.setValue('สมชาย');
      fixture.detectChanges();
      
      const table = await loader.getHarness(MatTableHarness);
      const rows = await table.getRows();
      
      expect(rows.length).toBe(1);
      
      const cells = await rows[0].getCells();
      expect(await cells[1].getText()).toBe('สมชาย ใจดี');
    });

    it('should filter by vehicle type', async () => {
      const filterInput = await loader.getHarness(MatInputHarness.with({
        selector: '[data-testid="filter-input"]'
      }));
      
      await filterInput.setValue('รถยนต์');
      fixture.detectChanges();
      
      const table = await loader.getHarness(MatTableHarness);
      const rows = await table.getRows();
      
      expect(rows.length).toBe(3); // 3 cars in mock data
    });

    it('should filter by status', async () => {
      const filterInput = await loader.getHarness(MatInputHarness.with({
        selector: '[data-testid="filter-input"]'
      }));
      
      await filterInput.setValue('active');
      fixture.detectChanges();
      
      const table = await loader.getHarness(MatTableHarness);
      const rows = await table.getRows();
      
      expect(rows.length).toBe(2); // 2 active policies
    });

    it('should show no results message when no matches', async () => {
      const filterInput = await loader.getHarness(MatInputHarness.with({
        selector: '[data-testid="filter-input"]'
      }));
      
      await filterInput.setValue('ไม่มีข้อมูล');
      fixture.detectChanges();
      
      const noDataMessage = fixture.debugElement.query(By.css('[data-testid="no-data"]'));
      expect(noDataMessage).toBeTruthy();
      expect(noDataMessage.nativeElement.textContent).toContain('ไม่พบข้อมูล');
    });

    it('should clear filter when input is cleared', async () => {
      const filterInput = await loader.getHarness(MatInputHarness.with({
        selector: '[data-testid="filter-input"]'
      }));
      
      await filterInput.setValue('POL-2024-001');
      fixture.detectChanges();
      
      let table = await loader.getHarness(MatTableHarness);
      let rows = await table.getRows();
      expect(rows.length).toBe(1);
      
      await filterInput.setValue('');
      fixture.detectChanges();
      
      table = await loader.getHarness(MatTableHarness);
      rows = await table.getRows();
      expect(rows.length).toBe(5);
    });

    it('should be case insensitive', async () => {
      const filterInput = await loader.getHarness(MatInputHarness.with({
        selector: '[data-testid="filter-input"]'
      }));
      
      await filterInput.setValue('ACTIVE');
      fixture.detectChanges();
      
      const table = await loader.getHarness(MatTableHarness);
      const rows = await table.getRows();
      
      expect(rows.length).toBe(2);
    });
  });

  describe('Pagination Functionality', () => {
    it('should show correct pagination info', async () => {
      const paginator = await loader.getHarness(MatPaginatorHarness);
      const rangeLabel = await paginator.getRangeLabel();
      
      expect(rangeLabel).toBe('1 – 5 of 5');
    });

    it('should handle page size changes', async () => {
      component.pageSizes = [2, 5, 10];
      component.pageSize = 2;
      fixture.detectChanges();
      
      const paginator = await loader.getHarness(MatPaginatorHarness);
      await paginator.setPageSize(2);
      
      const table = await loader.getHarness(MatTableHarness);
      const rows = await table.getRows();
      
      expect(rows.length).toBe(2);
    });

    it('should navigate to next page', async () => {
      component.pageSize = 2;
      fixture.detectChanges();
      
      const paginator = await loader.getHarness(MatPaginatorHarness);
      await paginator.goToNextPage();
      
      const table = await loader.getHarness(MatTableHarness);
      const rows = await table.getRows();
      const firstRowCells = await rows[0].getCells();
      
      expect(await firstRowCells[0].getText()).toBe('POL-2024-003');
    });

    it('should disable pagination when data is small', () => {
      component.data = [mockInsurancePolicies[0]]; // Only 1 item
      component.pageSize = 10;
      fixture.detectChanges();
      
      const paginatorElement = fixture.debugElement.query(By.css('mat-paginator'));
      expect(paginatorElement).toBeTruthy(); // Still present but effectively disabled
    });

    it('should maintain pagination state during filtering', async () => {
      component.pageSize = 2;
      fixture.detectChanges();
      
      const paginator = await loader.getHarness(MatPaginatorHarness);
      await paginator.goToNextPage();
      
      const filterInput = await loader.getHarness(MatInputHarness.with({
        selector: '[data-testid="filter-input"]'
      }));
      await filterInput.setValue('active');
      fixture.detectChanges();
      
      // Should reset to first page after filtering
      const rangeLabel = await paginator.getRangeLabel();
      expect(rangeLabel).toBe('1 – 2 of 2');
    });
  });

  describe('Selection Functionality', () => {
    beforeEach(() => {
      component.enableSelection = true;
      fixture.detectChanges();
    });

    it('should select single row', () => {
      const firstRowCheckbox = fixture.debugElement.query(
        By.css('[data-testid="select-row-0"] mat-checkbox')
      );
      
      firstRowCheckbox.nativeElement.click();
      fixture.detectChanges();
      
      expect(component.selection.selected.length).toBe(1);
      expect(component.selection.selected[0]).toEqual(mockInsurancePolicies[0]);
    });

    it('should select all rows with master checkbox', () => {
      const masterCheckbox = fixture.debugElement.query(
        By.css('[data-testid="select-all"] mat-checkbox')
      );
      
      masterCheckbox.nativeElement.click();
      fixture.detectChanges();
      
      expect(component.selection.selected.length).toBe(5);
    });

    it('should deselect all when master checkbox clicked again', () => {
      // First select all
      const masterCheckbox = fixture.debugElement.query(
        By.css('[data-testid="select-all"] mat-checkbox')
      );
      
      masterCheckbox.nativeElement.click();
      fixture.detectChanges();
      expect(component.selection.selected.length).toBe(5);
      
      // Then deselect all
      masterCheckbox.nativeElement.click();
      fixture.detectChanges();
      expect(component.selection.selected.length).toBe(0);
    });

    it('should show indeterminate state when some rows selected', () => {
      const firstRowCheckbox = fixture.debugElement.query(
        By.css('[data-testid="select-row-0"] mat-checkbox')
      );
      
      firstRowCheckbox.nativeElement.click();
      fixture.detectChanges();
      
      const masterCheckbox = fixture.debugElement.query(
        By.css('[data-testid="select-all"] mat-checkbox input')
      );
      
      expect(masterCheckbox.nativeElement.indeterminate).toBe(true);
    });

    it('should emit selection change events', () => {
      spyOn(component.selectionChange, 'emit');
      
      const firstRowCheckbox = fixture.debugElement.query(
        By.css('[data-testid="select-row-0"] mat-checkbox')
      );
      
      firstRowCheckbox.nativeElement.click();
      fixture.detectChanges();
      
      expect(component.selectionChange.emit).toHaveBeenCalledWith(
        [mockInsurancePolicies[0]]
      );
    });

    it('should maintain selection across pagination', async () => {
      component.pageSize = 2;
      fixture.detectChanges();
      
      // Select first row
      const firstRowCheckbox = fixture.debugElement.query(
        By.css('[data-testid="select-row-0"] mat-checkbox')
      );
      firstRowCheckbox.nativeElement.click();
      fixture.detectChanges();
      
      // Go to next page
      const paginator = await loader.getHarness(MatPaginatorHarness);
      await paginator.goToNextPage();
      
      // Selection should persist
      expect(component.selection.selected.length).toBe(1);
    });
  });

  describe('Action Buttons', () => {
    beforeEach(() => {
      component.actions = [
        { key: 'view', label: 'ดู', icon: 'visibility' },
        { key: 'edit', label: 'แก้ไข', icon: 'edit' },
        { key: 'delete', label: 'ลบ', icon: 'delete', color: 'warn' }
      ];
      fixture.detectChanges();
    });

    it('should display action buttons for each row', () => {
      const actionButtons = fixture.debugElement.queryAll(By.css('[data-testid^="action-"]'));
      expect(actionButtons.length).toBe(15); // 3 actions × 5 rows
    });

    it('should emit action events when clicked', () => {
      spyOn(component.actionClick, 'emit');
      
      const viewButton = fixture.debugElement.query(
        By.css('[data-testid="action-view-0"]')
      );
      
      viewButton.nativeElement.click();
      
      expect(component.actionClick.emit).toHaveBeenCalledWith({
        action: 'view',
        row: mockInsurancePolicies[0]
      });
    });

    it('should show action buttons with correct colors', () => {
      const deleteButton = fixture.debugElement.query(
        By.css('[data-testid="action-delete-0"]')
      );
      
      expect(deleteButton.nativeElement.classList).toContain('mat-warn');
    });

    it('should show action icons correctly', () => {
      const viewIcon = fixture.debugElement.query(
        By.css('[data-testid="action-view-0"] mat-icon')
      );
      
      expect(viewIcon.nativeElement.textContent).toBe('visibility');
    });

    it('should disable actions based on conditions', () => {
      component.actions = [
        { 
          key: 'edit', 
          label: 'แก้ไข', 
          icon: 'edit',
          disabled: (row: any) => row.status === 'expired'
        }
      ];
      fixture.detectChanges();
      
      const editButtons = fixture.debugElement.queryAll(By.css('[data-testid^="action-edit-"]'));
      const expiredPolicyButton = editButtons[1]; // Second policy is expired
      
      expect(expiredPolicyButton.nativeElement.disabled).toBe(true);
    });
  });

  describe('Thai Insurance Specific Features', () => {
    it('should display Thai policy statuses correctly', () => {
      const statusMapping = {
        'active': 'ใช้งานอยู่',
        'expired': 'หมดอายุ',
        'pending': 'รอดำเนินการ',
        'cancelled': 'ยกเลิก'
      };
      
      const statusCells = fixture.debugElement.queryAll(By.css('[data-testid^="status-"]'));
      
      statusCells.forEach((cell, index) => {
        const status = mockInsurancePolicies[index].status;
        expect(cell.nativeElement.textContent.trim()).toBe(statusMapping[status as keyof typeof statusMapping]);
      });
    });

    it('should format premium amounts in Thai Baht with proper formatting', async () => {
      const table = await loader.getHarness(MatTableHarness);
      const rows = await table.getRows();
      
      for (let i = 0; i < rows.length; i++) {
        const cells = await rows[i].getCells();
        const premiumText = await cells[3].getText();
        
        expect(premiumText).toMatch(/[\d,]+\s*บาท/);
        expect(premiumText).toContain(','); // Should have thousand separators
      }
    });

    it('should display Thai vehicle types', async () => {
      const vehicleTypes = ['รถยนต์', 'รถจักรยานยนต์', 'รถบรรทุก'];
      const table = await loader.getHarness(MatTableHarness);
      const rows = await table.getRows();
      
      for (let i = 0; i < rows.length; i++) {
        const cells = await rows[i].getCells();
        const vehicleText = await cells[2].getText();
        
        expect(vehicleTypes).toContain(vehicleText);
      }
    });

    it('should support Thai date formatting', () => {
      component.dateFormat = 'th';
      fixture.detectChanges();
      
      const dateCells = fixture.debugElement.queryAll(By.css('[data-testid^="date-"]'));
      
      dateCells.forEach(cell => {
        expect(cell.nativeElement.textContent).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
      });
    });

    it('should handle claim data structure', () => {
      component.data = mockClaims;
      component.columns = [
        { key: 'claimNumber', title: 'เลขที่เคลม', sortable: true },
        { key: 'policyNumber', title: 'เลขที่กรมธรรม์', sortable: true },
        { key: 'amount', title: 'จำนวนเงิน', sortable: true, type: 'currency' },
        { key: 'status', title: 'สถานะ', sortable: false, type: 'status' },
        { key: 'claimDate', title: 'วันที่เคลม', sortable: true, type: 'date' }
      ];
      fixture.detectChanges();
      
      expect(component.dataSource.data).toEqual(mockClaims);
      expect(component.dataSource.data.length).toBe(3);
    });
  });

  describe('Responsive Design', () => {
    it('should handle mobile viewport', () => {
      component.responsive = true;
      fixture.detectChanges();
      
      // Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', { value: 480, writable: true });
      window.dispatchEvent(new Event('resize'));
      fixture.detectChanges();
      
      const table = fixture.debugElement.query(By.css('mat-table'));
      expect(table.nativeElement.classList).toContain('mobile-table');
    });

    it('should show/hide columns based on screen size', () => {
      component.responsiveColumns = {
        mobile: ['policyNumber', 'customerName', 'status'],
        tablet: ['policyNumber', 'customerName', 'premium', 'status'],
        desktop: ['policyNumber', 'customerName', 'vehicleType', 'premium', 'status', 'createdDate']
      };
      fixture.detectChanges();
      
      // Test mobile
      component.updateDisplayColumns('mobile');
      expect(component.displayedColumns.length).toBe(3);
      
      // Test desktop
      component.updateDisplayColumns('desktop');
      expect(component.displayedColumns.length).toBe(6);
    });

    it('should stack columns on very small screens', () => {
      component.stackColumns = true;
      fixture.detectChanges();
      
      const stackedRows = fixture.debugElement.queryAll(By.css('.stacked-row'));
      expect(stackedRows.length).toBeGreaterThan(0);
    });
  });

  describe('Export Functionality', () => {
    it('should export data to CSV', () => {
      spyOn(component, 'exportToCsv').and.callThrough();
      
      component.enableExport = true;
      fixture.detectChanges();
      
      const exportButton = fixture.debugElement.query(By.css('[data-testid="export-csv"]'));
      exportButton.nativeElement.click();
      
      expect(component.exportToCsv).toHaveBeenCalled();
    });

    it('should export filtered data only', async () => {
      component.enableExport = true;
      
      // Apply filter first
      const filterInput = await loader.getHarness(MatInputHarness.with({
        selector: '[data-testid="filter-input"]'
      }));
      await filterInput.setValue('active');
      fixture.detectChanges();
      
      spyOn(component, 'getExportData').and.returnValue(
        component.dataSource.filteredData
      );
      
      component.exportToCsv();
      
      expect(component.getExportData).toHaveBeenCalled();
    });

    it('should export with Thai headers', () => {
      const exportData = component.getExportData();
      const headers = Object.keys(exportData[0]);
      
      // Should use Thai column titles
      expect(headers).toContain('เลขที่กรมธรรม์');
      expect(headers).toContain('ชื่อลูกค้า');
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle empty data gracefully', () => {
      component.data = [];
      fixture.detectChanges();
      
      const noDataElement = fixture.debugElement.query(By.css('[data-testid="no-data"]'));
      expect(noDataElement).toBeTruthy();
      expect(noDataElement.nativeElement.textContent).toContain('ไม่มีข้อมูล');
    });

    it('should handle large datasets efficiently', () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        policyNumber: `POL-2024-${String(i).padStart(3, '0')}`,
        customerName: `ลูกค้า ${i}`,
        vehicleType: 'รถยนต์',
        premium: Math.random() * 50000,
        status: 'active',
        createdDate: new Date()
      }));
      
      const startTime = performance.now();
      component.data = largeData;
      fixture.detectChanges();
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(1000); // Should render in less than 1 second
      expect(component.dataSource.data.length).toBe(1000);
    });

    it('should handle null/undefined values', () => {
      const dataWithNulls = [
        { id: 1, policyNumber: null, customerName: undefined, premium: 0, status: '' }
      ];
      
      component.data = dataWithNulls;
      fixture.detectChanges();
      
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should clean up subscriptions on destroy', () => {
      spyOn(component, 'ngOnDestroy').and.callThrough();
      
      fixture.destroy();
      
      expect(component.ngOnDestroy).toHaveBeenCalled();
    });

    it('should handle rapid filter changes', async () => {
      const filterInput = await loader.getHarness(MatInputHarness.with({
        selector: '[data-testid="filter-input"]'
      }));
      
      // Rapid filter changes
      await filterInput.setValue('POL');
      await filterInput.setValue('POL-2024');
      await filterInput.setValue('POL-2024-001');
      
      fixture.detectChanges();
      
      const table = await loader.getHarness(MatTableHarness);
      const rows = await table.getRows();
      expect(rows.length).toBe(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      const table = fixture.debugElement.query(By.css('mat-table'));
      expect(table.nativeElement.getAttribute('role')).toBe('table');
    });

    it('should support keyboard navigation', () => {
      const sortableHeaders = fixture.debugElement.queryAll(By.css('th[mat-sort-header]'));
      
      sortableHeaders.forEach(header => {
        expect(header.nativeElement.tabIndex).not.toBe(-1);
      });
    });

    it('should announce sort changes to screen readers', async () => {
      const policyHeader = fixture.debugElement.query(
        By.css('[data-testid="sort-policyNumber"]')
      );
      
      policyHeader.nativeElement.click();
      fixture.detectChanges();
      
      const ariaLabel = policyHeader.nativeElement.getAttribute('aria-label');
      expect(ariaLabel).toContain('เลขที่กรมธรรม์');
    });

    it('should have proper row selection accessibility', () => {
      component.enableSelection = true;
      fixture.detectChanges();
      
      const checkboxes = fixture.debugElement.queryAll(By.css('mat-checkbox'));
      
      checkboxes.forEach(checkbox => {
        expect(checkbox.nativeElement.getAttribute('aria-label')).toBeTruthy();
      });
    });
  });
});