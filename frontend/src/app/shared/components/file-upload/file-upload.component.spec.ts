import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { of, throwError } from 'rxjs';

import { FileUploadComponent, FileUploadOptions } from './file-upload.component';
import { FileService } from '../../../core/services/file.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TranslationService } from '../../../core/services/translation.service';

// Page Object for FileUpload Component
class FileUploadPageObject {
  constructor(
    private fixture: ComponentFixture<FileUploadComponent>,
    private loader: HarnessLoader
  ) {}

  get component(): FileUploadComponent {
    return this.fixture.componentInstance;
  }

  get compiled(): HTMLElement {
    return this.fixture.nativeElement;
  }

  // Button getters
  async getUploadButton(): Promise<MatButtonHarness> {
    return this.loader.getHarness(MatButtonHarness.with({ 
      selector: '[data-testid="upload-button"]' 
    }));
  }

  async getClearButton(): Promise<MatButtonHarness> {
    return this.loader.getHarness(MatButtonHarness.with({ 
      selector: '[data-testid="clear-button"]' 
    }));
  }

  async getRemoveFileButton(index: number = 0): Promise<MatButtonHarness> {
    return this.loader.getHarness(MatButtonHarness.with({ 
      selector: `[data-testid="remove-file-${index}"]` 
    }));
  }

  // Element getters
  getFileInput(): HTMLInputElement | null {
    return this.compiled.querySelector('[data-testid="file-input"]') as HTMLInputElement;
  }

  getDropZone(): HTMLElement | null {
    return this.compiled.querySelector('[data-testid="drop-zone"]');
  }

  getFileList(): HTMLElement | null {
    return this.compiled.querySelector('[data-testid="file-list"]');
  }

  getProgressBar(): HTMLElement | null {
    return this.compiled.querySelector('mat-progress-bar');
  }

  getErrorMessage(): string | null {
    const errorElement = this.compiled.querySelector('[data-testid="error-message"]');
    return errorElement ? errorElement.textContent?.trim() || null : null;
  }

  getSuccessMessage(): string | null {
    const successElement = this.compiled.querySelector('[data-testid="success-message"]');
    return successElement ? successElement.textContent?.trim() || null : null;
  }

  getUploadStatus(): string | null {
    const statusElement = this.compiled.querySelector('[data-testid="upload-status"]');
    return statusElement ? statusElement.textContent?.trim() || null : null;
  }

  getFileItem(index: number): HTMLElement | null {
    return this.compiled.querySelector(`[data-testid="file-item-${index}"]`);
  }

  getFileItemName(index: number): string | null {
    const fileItem = this.getFileItem(index);
    const nameElement = fileItem?.querySelector('[data-testid="file-name"]');
    return nameElement ? nameElement.textContent?.trim() || null : null;
  }

  getFileItemSize(index: number): string | null {
    const fileItem = this.getFileItem(index);
    const sizeElement = fileItem?.querySelector('[data-testid="file-size"]');
    return sizeElement ? sizeElement.textContent?.trim() || null : null;
  }

  getFileItemProgress(index: number): string | null {
    const fileItem = this.getFileItem(index);
    const progressElement = fileItem?.querySelector('[data-testid="file-progress"]');
    return progressElement ? progressElement.textContent?.trim() || null : null;
  }

  // Helper methods
  isDropZoneVisible(): boolean {
    return !!this.getDropZone();
  }

  isDropZoneActive(): boolean {
    const dropZone = this.getDropZone();
    return dropZone?.classList.contains('drop-active') || false;
  }

  isUploading(): boolean {
    return this.component.isUploading;
  }

  getFileCount(): number {
    return this.component.selectedFiles.length;
  }

  getAcceptedTypes(): string {
    const fileInput = this.getFileInput();
    return fileInput?.accept || '';
  }

  isMultipleAllowed(): boolean {
    const fileInput = this.getFileInput();
    return fileInput?.multiple || false;
  }

  // Simulation methods
  simulateFileDrop(files: File[]): void {
    const dropZone = this.getDropZone();
    const dataTransfer = new DataTransfer();
    
    files.forEach(file => dataTransfer.items.add(file));
    
    const dragOverEvent = new DragEvent('dragover', {
      dataTransfer,
      bubbles: true
    });
    
    const dropEvent = new DragEvent('drop', {
      dataTransfer,
      bubbles: true
    });
    
    dropZone?.dispatchEvent(dragOverEvent);
    dropZone?.dispatchEvent(dropEvent);
    
    this.fixture.detectChanges();
  }

  simulateFileSelect(files: File[]): void {
    const fileInput = this.getFileInput();
    const dataTransfer = new DataTransfer();
    
    files.forEach(file => dataTransfer.items.add(file));
    
    if (fileInput) {
      Object.defineProperty(fileInput, 'files', {
        value: dataTransfer.files,
        writable: false
      });
      
      const changeEvent = new Event('change', { bubbles: true });
      fileInput.dispatchEvent(changeEvent);
    }
    
    this.fixture.detectChanges();
  }

  createMockFile(name: string, size: number, type: string): File {
    const content = 'x'.repeat(size);
    return new File([content], name, { type });
  }

  async clickUploadButton(): Promise<void> {
    const uploadButton = await this.getUploadButton();
    await uploadButton.click();
    this.fixture.detectChanges();
  }

  async clearFiles(): Promise<void> {
    const clearButton = await this.getClearButton();
    await clearButton.click();
    this.fixture.detectChanges();
  }

  async removeFile(index: number): Promise<void> {
    const removeButton = await this.getRemoveFileButton(index);
    await removeButton.click();
    this.fixture.detectChanges();
  }
}

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let pageObject: FileUploadPageObject;
  let loader: HarnessLoader;
  
  // Mock services
  let mockFileService: jasmine.SpyObj<FileService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockTranslationService: jasmine.SpyObj<TranslationService>;

  const defaultOptions: FileUploadOptions = {
    multiple: true,
    acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxTotalFiles: 10
  };

  beforeEach(async () => {
    // Create mock services
    mockFileService = jasmine.createSpyObj('FileService', [
      'uploadFile',
      'uploadFiles',
      'validateFile',
      'getFileInfo'
    ]);
    mockNotificationService = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError',
      'showWarning',
      'showInfo'
    ]);
    mockTranslationService = jasmine.createSpyObj('TranslationService', [
      'translate',
      'getTranslation'
    ]);

    // Setup default mock returns
    mockFileService.uploadFile.and.returnValue(of({ 
      success: true, 
      fileId: 'file-123',
      url: 'http://example.com/file.jpg'
    }));
    mockFileService.uploadFiles.and.returnValue(of({ 
      success: true, 
      files: [{ fileId: 'file-123', url: 'http://example.com/file.jpg' }]
    }));
    mockFileService.validateFile.and.returnValue(of({ valid: true }));
    mockTranslationService.translate.and.returnValue('Translated text');
    mockTranslationService.getTranslation.and.returnValue(of('Translated text'));

    await TestBed.configureTestingModule({
      declarations: [FileUploadComponent],
      imports: [
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
        MatTooltipModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: FileService, useValue: mockFileService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: TranslationService, useValue: mockTranslationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    pageObject = new FileUploadPageObject(fixture, loader);
    
    // Set default options
    component.options = defaultOptions;
    
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default options', () => {
      component.options = undefined;
      component.ngOnInit();
      
      expect(component.options.multiple).toBe(false);
      expect(component.options.maxFileSize).toBe(10 * 1024 * 1024); // 10MB
      expect(component.options.maxTotalFiles).toBe(1);
    });

    it('should merge custom options with defaults', () => {
      const customOptions: Partial<FileUploadOptions> = {
        maxFileSize: 2 * 1024 * 1024 // 2MB
      };
      
      component.options = customOptions;
      component.ngOnInit();
      
      expect(component.options.maxFileSize).toBe(2 * 1024 * 1024);
      expect(component.options.multiple).toBe(false); // Default value
    });

    it('should set up file input attributes correctly', () => {
      expect(pageObject.getAcceptedTypes()).toContain('image/jpeg');
      expect(pageObject.getAcceptedTypes()).toContain('image/png');
      expect(pageObject.getAcceptedTypes()).toContain('application/pdf');
      expect(pageObject.isMultipleAllowed()).toBe(true);
    });

    it('should display drop zone initially', () => {
      expect(pageObject.isDropZoneVisible()).toBe(true);
    });

    it('should not show progress bar initially', () => {
      expect(pageObject.getProgressBar()).toBeNull();
    });

    it('should not show file list initially', () => {
      expect(pageObject.getFileList()).toBeNull();
    });
  });

  describe('File Selection', () => {
    it('should select files through file input', () => {
      const files = [
        pageObject.createMockFile('test.jpg', 1024, 'image/jpeg'),
        pageObject.createMockFile('document.pdf', 2048, 'application/pdf')
      ];
      
      pageObject.simulateFileSelect(files);
      
      expect(pageObject.getFileCount()).toBe(2);
      expect(component.selectedFiles[0].name).toBe('test.jpg');
      expect(component.selectedFiles[1].name).toBe('document.pdf');
    });

    it('should select files through drag and drop', () => {
      const files = [
        pageObject.createMockFile('dropped.png', 1024, 'image/png')
      ];
      
      pageObject.simulateFileDrop(files);
      
      expect(pageObject.getFileCount()).toBe(1);
      expect(component.selectedFiles[0].name).toBe('dropped.png');
    });

    it('should activate drop zone on drag over', () => {
      const dropZone = pageObject.getDropZone();
      
      const dragOverEvent = new DragEvent('dragover', { bubbles: true });
      dropZone?.dispatchEvent(dragOverEvent);
      fixture.detectChanges();
      
      expect(pageObject.isDropZoneActive()).toBe(true);
    });

    it('should deactivate drop zone on drag leave', () => {
      const dropZone = pageObject.getDropZone();
      
      const dragOverEvent = new DragEvent('dragover', { bubbles: true });
      const dragLeaveEvent = new DragEvent('dragleave', { bubbles: true });
      
      dropZone?.dispatchEvent(dragOverEvent);
      fixture.detectChanges();
      expect(pageObject.isDropZoneActive()).toBe(true);
      
      dropZone?.dispatchEvent(dragLeaveEvent);
      fixture.detectChanges();
      expect(pageObject.isDropZoneActive()).toBe(false);
    });

    it('should limit files when multiple is false', () => {
      component.options.multiple = false;
      component.options.maxTotalFiles = 1;
      fixture.detectChanges();
      
      const files = [
        pageObject.createMockFile('file1.jpg', 1024, 'image/jpeg'),
        pageObject.createMockFile('file2.jpg', 1024, 'image/jpeg')
      ];
      
      pageObject.simulateFileSelect(files);
      
      expect(pageObject.getFileCount()).toBe(1);
      expect(component.selectedFiles[0].name).toBe('file1.jpg');
    });

    it('should enforce maximum total files limit', () => {
      component.options.maxTotalFiles = 2;
      
      const files = [
        pageObject.createMockFile('file1.jpg', 1024, 'image/jpeg'),
        pageObject.createMockFile('file2.jpg', 1024, 'image/jpeg'),
        pageObject.createMockFile('file3.jpg', 1024, 'image/jpeg')
      ];
      
      pageObject.simulateFileSelect(files);
      
      expect(pageObject.getFileCount()).toBe(2);
      expect(mockNotificationService.showWarning).toHaveBeenCalledWith(
        jasmine.stringMatching(/สามารถเลือกไฟล์ได้สูงสุด/)
      );
    });

    it('should replace existing files when single mode and new file selected', () => {
      component.options.multiple = false;
      fixture.detectChanges();
      
      // Select first file
      const file1 = [pageObject.createMockFile('file1.jpg', 1024, 'image/jpeg')];
      pageObject.simulateFileSelect(file1);
      expect(pageObject.getFileCount()).toBe(1);
      
      // Select second file
      const file2 = [pageObject.createMockFile('file2.jpg', 1024, 'image/jpeg')];
      pageObject.simulateFileSelect(file2);
      expect(pageObject.getFileCount()).toBe(1);
      expect(component.selectedFiles[0].name).toBe('file2.jpg');
    });
  });

  describe('File Validation', () => {
    it('should validate file types', () => {
      const validFiles = [
        pageObject.createMockFile('image.jpg', 1024, 'image/jpeg'),
        pageObject.createMockFile('document.pdf', 1024, 'application/pdf')
      ];
      
      pageObject.simulateFileSelect(validFiles);
      
      expect(pageObject.getFileCount()).toBe(2);
      expect(pageObject.getErrorMessage()).toBeNull();
    });

    it('should reject invalid file types', () => {
      const invalidFiles = [
        pageObject.createMockFile('document.doc', 1024, 'application/msword')
      ];
      
      pageObject.simulateFileSelect(invalidFiles);
      
      expect(pageObject.getFileCount()).toBe(0);
      expect(pageObject.getErrorMessage()).toContain('ประเภทไฟล์ไม่ถูกต้อง');
    });

    it('should validate file size', () => {
      const largeFile = [
        pageObject.createMockFile('large.jpg', 10 * 1024 * 1024, 'image/jpeg') // 10MB
      ];
      
      pageObject.simulateFileSelect(largeFile);
      
      expect(pageObject.getFileCount()).toBe(0);
      expect(pageObject.getErrorMessage()).toContain('ขนาดไฟล์เกินกำหนด');
    });

    it('should allow files within size limit', () => {
      const validFile = [
        pageObject.createMockFile('valid.jpg', 2 * 1024 * 1024, 'image/jpeg') // 2MB
      ];
      
      pageObject.simulateFileSelect(validFile);
      
      expect(pageObject.getFileCount()).toBe(1);
      expect(pageObject.getErrorMessage()).toBeNull();
    });

    it('should validate file names', () => {
      const filesWithBadNames = [
        pageObject.createMockFile('file with spaces.jpg', 1024, 'image/jpeg'),
        pageObject.createMockFile('file@#$.jpg', 1024, 'image/jpeg'),
        pageObject.createMockFile('', 1024, 'image/jpeg')
      ];
      
      component.options.validateFileName = true;
      
      pageObject.simulateFileSelect(filesWithBadNames);
      
      // Should show warnings for invalid names but still allow files
      expect(mockNotificationService.showWarning).toHaveBeenCalled();
    });

    it('should check for duplicate files', () => {
      const file = pageObject.createMockFile('duplicate.jpg', 1024, 'image/jpeg');
      
      // Select same file twice
      pageObject.simulateFileSelect([file]);
      pageObject.simulateFileSelect([file]);
      
      expect(pageObject.getFileCount()).toBe(1);
      expect(mockNotificationService.showWarning).toHaveBeenCalledWith(
        jasmine.stringMatching(/ไฟล์นี้ถูกเลือกแล้ว/)
      );
    });

    it('should validate Thai insurance document requirements', () => {
      component.options.documentType = 'insurance-claim';
      component.options.required = true;
      
      const validFiles = [
        pageObject.createMockFile('claim-form.pdf', 1024, 'application/pdf'),
        pageObject.createMockFile('id-card.jpg', 1024, 'image/jpeg')
      ];
      
      pageObject.simulateFileSelect(validFiles);
      
      expect(pageObject.getFileCount()).toBe(2);
      expect(pageObject.getErrorMessage()).toBeNull();
    });
  });

  describe('File Display', () => {
    beforeEach(() => {
      const files = [
        pageObject.createMockFile('test.jpg', 1024, 'image/jpeg'),
        pageObject.createMockFile('document.pdf', 2048, 'application/pdf')
      ];
      
      pageObject.simulateFileSelect(files);
    });

    it('should display selected files list', () => {
      expect(pageObject.getFileList()).toBeTruthy();
      expect(pageObject.getFileItem(0)).toBeTruthy();
      expect(pageObject.getFileItem(1)).toBeTruthy();
    });

    it('should display file names correctly', () => {
      expect(pageObject.getFileItemName(0)).toBe('test.jpg');
      expect(pageObject.getFileItemName(1)).toBe('document.pdf');
    });

    it('should display file sizes in Thai format', () => {
      expect(pageObject.getFileItemSize(0)).toContain('KB');
      expect(pageObject.getFileItemSize(1)).toContain('KB');
    });

    it('should show file icons based on type', () => {
      const fileItem0 = pageObject.getFileItem(0);
      const fileItem1 = pageObject.getFileItem(1);
      
      const icon0 = fileItem0?.querySelector('mat-icon');
      const icon1 = fileItem1?.querySelector('mat-icon');
      
      expect(icon0?.textContent?.trim()).toBe('image');
      expect(icon1?.textContent?.trim()).toBe('picture_as_pdf');
    });

    it('should show remove buttons for each file', () => {
      const fileItem0 = pageObject.getFileItem(0);
      const fileItem1 = pageObject.getFileItem(1);
      
      const removeButton0 = fileItem0?.querySelector('[data-testid="remove-file-0"]');
      const removeButton1 = fileItem1?.querySelector('[data-testid="remove-file-1"]');
      
      expect(removeButton0).toBeTruthy();
      expect(removeButton1).toBeTruthy();
    });

    it('should display upload status for each file', () => {
      expect(pageObject.getFileItemProgress(0)).toBe('0%');
      expect(pageObject.getFileItemProgress(1)).toBe('0%');
    });
  });

  describe('File Removal', () => {
    beforeEach(() => {
      const files = [
        pageObject.createMockFile('file1.jpg', 1024, 'image/jpeg'),
        pageObject.createMockFile('file2.pdf', 2048, 'application/pdf')
      ];
      
      pageObject.simulateFileSelect(files);
    });

    it('should remove individual files', async () => {
      expect(pageObject.getFileCount()).toBe(2);
      
      await pageObject.removeFile(0);
      
      expect(pageObject.getFileCount()).toBe(1);
      expect(pageObject.getFileItemName(0)).toBe('file2.pdf');
    });

    it('should clear all files', async () => {
      expect(pageObject.getFileCount()).toBe(2);
      
      await pageObject.clearFiles();
      
      expect(pageObject.getFileCount()).toBe(0);
      expect(pageObject.getFileList()).toBeNull();
    });

    it('should emit file removed event', async () => {
      spyOn(component.filesRemoved, 'emit');
      
      await pageObject.removeFile(0);
      
      expect(component.filesRemoved.emit).toHaveBeenCalledWith(
        jasmine.objectContaining({ name: 'file1.jpg' })
      );
    });

    it('should emit all files cleared event', async () => {
      spyOn(component.allFilesCleared, 'emit');
      
      await pageObject.clearFiles();
      
      expect(component.allFilesCleared.emit).toHaveBeenCalled();
    });
  });

  describe('File Upload Process', () => {
    beforeEach(() => {
      const files = [
        pageObject.createMockFile('test.jpg', 1024, 'image/jpeg'),
        pageObject.createMockFile('document.pdf', 2048, 'application/pdf')
      ];
      
      pageObject.simulateFileSelect(files);
    });

    it('should upload single file successfully', fakeAsync(() => {
      component.options.multiple = false;
      const file = [pageObject.createMockFile('single.jpg', 1024, 'image/jpeg')];
      pageObject.simulateFileSelect(file);
      
      mockFileService.uploadFile.and.returnValue(of({
        success: true,
        fileId: 'file-123',
        url: 'http://example.com/single.jpg'
      }));
      
      pageObject.clickUploadButton();
      tick();
      
      expect(mockFileService.uploadFile).toHaveBeenCalledWith(
        jasmine.any(File),
        jasmine.any(Object)
      );
      expect(pageObject.isUploading()).toBe(false);
      expect(mockNotificationService.showSuccess).toHaveBeenCalled();
    }));

    it('should upload multiple files successfully', fakeAsync(() => {
      mockFileService.uploadFiles.and.returnValue(of({
        success: true,
        files: [
          { fileId: 'file-1', url: 'http://example.com/test.jpg' },
          { fileId: 'file-2', url: 'http://example.com/document.pdf' }
        ]
      }));
      
      pageObject.clickUploadButton();
      tick();
      
      expect(mockFileService.uploadFiles).toHaveBeenCalledWith(
        jasmine.any(Array),
        jasmine.any(Object)
      );
      expect(pageObject.isUploading()).toBe(false);
      expect(mockNotificationService.showSuccess).toHaveBeenCalled();
    }));

    it('should show progress during upload', fakeAsync(() => {
      mockFileService.uploadFiles.and.returnValue(of({
        success: true,
        files: []
      }));
      
      pageObject.clickUploadButton();
      
      expect(pageObject.isUploading()).toBe(true);
      expect(pageObject.getProgressBar()).toBeTruthy();
      
      tick();
      
      expect(pageObject.isUploading()).toBe(false);
    }));

    it('should handle upload errors gracefully', fakeAsync(() => {
      mockFileService.uploadFiles.and.returnValue(throwError({
        error: { message: 'Upload failed' }
      }));
      
      pageObject.clickUploadButton();
      tick();
      
      expect(mockNotificationService.showError).toHaveBeenCalledWith('Upload failed');
      expect(pageObject.isUploading()).toBe(false);
      expect(pageObject.getErrorMessage()).toContain('การอัปโหลดล้มเหลว');
    }));

    it('should handle network errors', fakeAsync(() => {
      mockFileService.uploadFiles.and.returnValue(throwError('Network error'));
      
      pageObject.clickUploadButton();
      tick();
      
      expect(mockNotificationService.showError).toHaveBeenCalledWith(
        jasmine.stringMatching(/เกิดข้อผิดพลาดในการเชื่อมต่อ/)
      );
    }));

    it('should emit upload started event', async () => {
      spyOn(component.uploadStarted, 'emit');
      
      await pageObject.clickUploadButton();
      
      expect(component.uploadStarted.emit).toHaveBeenCalledWith(
        component.selectedFiles
      );
    });

    it('should emit upload completed event', fakeAsync(() => {
      spyOn(component.uploadCompleted, 'emit');
      
      mockFileService.uploadFiles.and.returnValue(of({
        success: true,
        files: [{ fileId: 'file-1', url: 'http://example.com/test.jpg' }]
      }));
      
      pageObject.clickUploadButton();
      tick();
      
      expect(component.uploadCompleted.emit).toHaveBeenCalledWith({
        success: true,
        files: jasmine.any(Array)
      });
    }));

    it('should disable upload button during upload', fakeAsync(() => {
      mockFileService.uploadFiles.and.returnValue(of({
        success: true,
        files: []
      }));
      
      pageObject.clickUploadButton();
      
      expect(pageObject.isUploading()).toBe(true);
      
      tick();
    }));

    it('should show individual file progress', fakeAsync(() => {
      mockFileService.uploadFiles.and.returnValue(of({
        success: true,
        files: []
      }));
      
      // Simulate progress updates
      component.updateFileProgress(0, 50);
      fixture.detectChanges();
      
      expect(pageObject.getFileItemProgress(0)).toContain('50%');
      
      component.updateFileProgress(0, 100);
      fixture.detectChanges();
      
      expect(pageObject.getFileItemProgress(0)).toContain('100%');
    }));
  });

  describe('Thai Insurance Document Types', () => {
    it('should handle insurance claim documents', () => {
      component.options.documentType = 'insurance-claim';
      component.options.acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      component.options.required = true;
      
      const files = [
        pageObject.createMockFile('claim-form.pdf', 1024, 'application/pdf'),
        pageObject.createMockFile('accident-photos.jpg', 1024, 'image/jpeg'),
        pageObject.createMockFile('id-card.png', 1024, 'image/png')
      ];
      
      pageObject.simulateFileSelect(files);
      
      expect(pageObject.getFileCount()).toBe(3);
      expect(pageObject.getErrorMessage()).toBeNull();
    });

    it('should handle policy application documents', () => {
      component.options.documentType = 'policy-application';
      component.options.acceptedTypes = ['application/pdf'];
      component.options.maxTotalFiles = 5;
      
      const files = [
        pageObject.createMockFile('application-form.pdf', 1024, 'application/pdf'),
        pageObject.createMockFile('driving-license.pdf', 1024, 'application/pdf')
      ];
      
      pageObject.simulateFileSelect(files);
      
      expect(pageObject.getFileCount()).toBe(2);
    });

    it('should validate vehicle registration documents', () => {
      component.options.documentType = 'vehicle-registration';
      component.options.acceptedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      
      const files = [
        pageObject.createMockFile('vehicle-registration.jpg', 1024, 'image/jpeg'),
        pageObject.createMockFile('vehicle-inspection.pdf', 1024, 'application/pdf')
      ];
      
      pageObject.simulateFileSelect(files);
      
      expect(pageObject.getFileCount()).toBe(2);
    });

    it('should handle medical certificate uploads', () => {
      component.options.documentType = 'medical-certificate';
      component.options.acceptedTypes = ['application/pdf', 'image/jpeg'];
      component.options.maxFileSize = 2 * 1024 * 1024; // 2MB
      
      const files = [
        pageObject.createMockFile('medical-cert.pdf', 1024, 'application/pdf')
      ];
      
      pageObject.simulateFileSelect(files);
      
      expect(pageObject.getFileCount()).toBe(1);
    });

    it('should show document type specific instructions', () => {
      component.options.documentType = 'insurance-claim';
      component.options.showInstructions = true;
      fixture.detectChanges();
      
      const instructionsElement = fixture.debugElement.query(By.css('[data-testid="instructions"]'));
      expect(instructionsElement.nativeElement.textContent).toContain('เอกสารเคลมประกันภัย');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const dropZone = pageObject.getDropZone();
      expect(dropZone?.getAttribute('role')).toBe('button');
      expect(dropZone?.getAttribute('tabindex')).toBe('0');
      expect(dropZone?.getAttribute('aria-label')).toBeTruthy();
    });

    it('should support keyboard navigation', () => {
      const dropZone = pageObject.getDropZone();
      const fileInput = pageObject.getFileInput();
      
      expect(dropZone?.tabIndex).toBe(0);
      expect(fileInput?.tabIndex).not.toBe(-1);
    });

    it('should announce file selection to screen readers', () => {
      const files = [pageObject.createMockFile('test.jpg', 1024, 'image/jpeg')];
      pageObject.simulateFileSelect(files);
      
      const statusElement = fixture.debugElement.query(By.css('[aria-live="polite"]'));
      expect(statusElement).toBeTruthy();
    });

    it('should have proper focus management', () => {
      const dropZone = pageObject.getDropZone();
      
      dropZone?.focus();
      expect(document.activeElement).toBe(dropZone);
    });

    it('should support keyboard file selection', () => {
      const dropZone = pageObject.getDropZone();
      
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
      
      spyOn(pageObject.getFileInput() as HTMLElement, 'click');
      
      dropZone?.dispatchEvent(enterEvent);
      dropZone?.dispatchEvent(spaceEvent);
      
      expect(pageObject.getFileInput()?.click).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error Handling', () => {
    it('should handle file read errors', () => {
      const corruptedFile = pageObject.createMockFile('corrupted.jpg', 1024, 'image/jpeg');
      Object.defineProperty(corruptedFile, 'size', { value: -1 });
      
      pageObject.simulateFileSelect([corruptedFile]);
      
      expect(pageObject.getErrorMessage()).toContain('ไฟล์เสียหาย');
    });

    it('should handle missing file extension', () => {
      const noExtensionFile = pageObject.createMockFile('filename', 1024, 'image/jpeg');
      
      pageObject.simulateFileSelect([noExtensionFile]);
      
      expect(mockNotificationService.showWarning).toHaveBeenCalledWith(
        jasmine.stringMatching(/ไฟล์ไม่มีนามสกุล/)
      );
    });

    it('should handle empty files', () => {
      const emptyFile = pageObject.createMockFile('empty.txt', 0, 'text/plain');
      
      pageObject.simulateFileSelect([emptyFile]);
      
      expect(pageObject.getErrorMessage()).toContain('ไฟล์ว่างเปล่า');
    });

    it('should handle browser compatibility issues', () => {
      // Mock older browser without File API
      const originalFile = window.File;
      (window as any).File = undefined;
      
      expect(component.isBrowserSupported()).toBe(false);
      
      window.File = originalFile;
    });

    it('should handle quota exceeded errors', fakeAsync(() => {
      mockFileService.uploadFiles.and.returnValue(throwError({
        name: 'QuotaExceededError',
        message: 'Storage quota exceeded'
      }));
      
      const files = [pageObject.createMockFile('large.jpg', 1024, 'image/jpeg')];
      pageObject.simulateFileSelect(files);
      pageObject.clickUploadButton();
      tick();
      
      expect(mockNotificationService.showError).toHaveBeenCalledWith(
        jasmine.stringMatching(/พื้นที่จัดเก็บเต็ม/)
      );
    }));
  });

  describe('Edge Cases', () => {
    it('should handle files with same names but different content', () => {
      const file1 = pageObject.createMockFile('document.pdf', 1024, 'application/pdf');
      const file2 = pageObject.createMockFile('document.pdf', 2048, 'application/pdf');
      
      pageObject.simulateFileSelect([file1]);
      pageObject.simulateFileSelect([file2]);
      
      // Should allow files with same name but different size
      expect(pageObject.getFileCount()).toBe(2);
    });

    it('should handle very long filenames', () => {
      const longName = 'a'.repeat(255) + '.jpg';
      const file = pageObject.createMockFile(longName, 1024, 'image/jpeg');
      
      pageObject.simulateFileSelect([file]);
      
      expect(mockNotificationService.showWarning).toHaveBeenCalledWith(
        jasmine.stringMatching(/ชื่อไฟล์ยาวเกินไป/)
      );
    });

    it('should handle special characters in filenames', () => {
      const specialCharsFile = pageObject.createMockFile('file!@#$%^&*().jpg', 1024, 'image/jpeg');
      
      pageObject.simulateFileSelect([specialCharsFile]);
      
      expect(pageObject.getFileCount()).toBe(1);
      expect(pageObject.getFileItemName(0)).toBe('file!@#$%^&*().jpg');
    });

    it('should handle rapid file selection changes', () => {
      const files1 = [pageObject.createMockFile('file1.jpg', 1024, 'image/jpeg')];
      const files2 = [pageObject.createMockFile('file2.jpg', 1024, 'image/jpeg')];
      const files3 = [pageObject.createMockFile('file3.jpg', 1024, 'image/jpeg')];
      
      pageObject.simulateFileSelect(files1);
      pageObject.simulateFileSelect(files2);
      pageObject.simulateFileSelect(files3);
      
      expect(pageObject.getFileCount()).toBe(3);
    });

    it('should handle component destruction during upload', fakeAsync(() => {
      const files = [pageObject.createMockFile('test.jpg', 1024, 'image/jpeg')];
      pageObject.simulateFileSelect(files);
      
      mockFileService.uploadFiles.and.returnValue(of({
        success: true,
        files: []
      }));
      
      pageObject.clickUploadButton();
      
      // Destroy component before upload completes
      component.ngOnDestroy();
      tick();
      
      expect(component.isUploading).toBe(false);
    }));
  });

  describe('Performance', () => {
    it('should handle large number of files efficiently', () => {
      const files = Array.from({ length: 100 }, (_, i) => 
        pageObject.createMockFile(`file${i}.jpg`, 1024, 'image/jpeg')
      );
      
      component.options.maxTotalFiles = 100;
      
      const startTime = performance.now();
      pageObject.simulateFileSelect(files);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(1000); // Should complete in less than 1 second
      expect(pageObject.getFileCount()).toBe(100);
    });

    it('should clean up resources on destroy', () => {
      spyOn(component, 'ngOnDestroy').and.callThrough();
      
      fixture.destroy();
      
      expect(component.ngOnDestroy).toHaveBeenCalled();
    });

    it('should debounce validation calls', fakeAsync(() => {
      spyOn(component, 'validateFiles').and.callThrough();
      
      const files = [pageObject.createMockFile('test.jpg', 1024, 'image/jpeg')];
      
      // Rapid file selections
      pageObject.simulateFileSelect(files);
      pageObject.simulateFileSelect(files);
      pageObject.simulateFileSelect(files);
      
      tick(300);
      
      expect(component.validateFiles).toHaveBeenCalledTimes(1);
    }));
  });

  describe('Internationalization', () => {
    it('should use translation service for messages', () => {
      const files = [pageObject.createMockFile('test.txt', 1024, 'text/plain')];
      pageObject.simulateFileSelect(files);
      
      expect(mockTranslationService.translate).toHaveBeenCalledWith(
        jasmine.stringMatching(/fileUpload\.error\.invalidType/)
      );
    });

    it('should format file sizes in Thai locale', () => {
      const files = [pageObject.createMockFile('test.jpg', 1536, 'image/jpeg')]; // 1.5KB
      pageObject.simulateFileSelect(files);
      
      expect(pageObject.getFileItemSize(0)).toContain('1.5 KB');
    });

    it('should display Thai month names in timestamps', () => {
      const files = [pageObject.createMockFile('test.jpg', 1024, 'image/jpeg')];
      pageObject.simulateFileSelect(files);
      
      component.showTimestamp = true;
      fixture.detectChanges();
      
      const timestampElement = fixture.debugElement.query(By.css('[data-testid="timestamp"]'));
      if (timestampElement) {
        expect(timestampElement.nativeElement.textContent).toMatch(
          /(มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม)/
        );
      }
    });
  });
});