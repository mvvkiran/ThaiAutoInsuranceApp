import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Notification, ApiResponse, PaginatedResponse, SearchRequest } from '../models/common.model';

export interface NotificationOptions extends MatSnackBarConfig {
  type?: 'success' | 'error' | 'warning' | 'info';
  action?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly apiUrl = `${environment.apiUrl}/notifications`;
  private unreadCountSubject = new BehaviorSubject<number>(0);
  
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    // Don't load unread count during initialization to avoid circular dependency
    // It will be loaded when needed
  }

  // Toast notifications
  showSuccess(message: string, options?: NotificationOptions): MatSnackBarRef<SimpleSnackBar> {
    return this.showNotification(message, 'success', options);
  }

  showError(message: string, options?: NotificationOptions): MatSnackBarRef<SimpleSnackBar> {
    return this.showNotification(message, 'error', options);
  }

  showWarning(message: string, options?: NotificationOptions): MatSnackBarRef<SimpleSnackBar> {
    return this.showNotification(message, 'warning', options);
  }

  showInfo(message: string, options?: NotificationOptions): MatSnackBarRef<SimpleSnackBar> {
    return this.showNotification(message, 'info', options);
  }

  private showNotification(
    message: string, 
    type: 'success' | 'error' | 'warning' | 'info', 
    options?: NotificationOptions
  ): MatSnackBarRef<SimpleSnackBar> {
    const config: MatSnackBarConfig = {
      duration: this.getDefaultDuration(type),
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`, 'custom-snackbar'],
      ...options
    };

    return this.snackBar.open(message, options?.action || 'ปิด', config);
  }

  private getDefaultDuration(type: string): number {
    switch (type) {
      case 'success': return 3000;
      case 'error': return 5000;
      case 'warning': return 4000;
      case 'info': return 3000;
      default: return 3000;
    }
  }

  // Server-side notifications
  getNotifications(searchRequest: SearchRequest): Observable<PaginatedResponse<Notification>> {
    return this.http.post<ApiResponse<PaginatedResponse<Notification>>>(
      `${this.apiUrl}/search`, 
      searchRequest
    ).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to load notifications');
        }
        return response.data;
      })
    );
  }

  getUnreadNotifications(): Observable<Notification[]> {
    return this.http.get<ApiResponse<Notification[]>>(`${this.apiUrl}/unread`).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to load unread notifications');
        }
        return response.data;
      })
    );
  }

  markAsRead(notificationId: string): Observable<void> {
    return this.http.patch<ApiResponse<void>>(`${this.apiUrl}/${notificationId}/read`, {}).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to mark notification as read');
        }
      }),
      tap(() => {
        // Update unread count
        this.updateUnreadCount(-1);
      })
    );
  }

  markAllAsRead(): Observable<void> {
    return this.http.patch<ApiResponse<void>>(`${this.apiUrl}/mark-all-read`, {}).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to mark all notifications as read');
        }
      }),
      tap(() => {
        // Reset unread count
        this.unreadCountSubject.next(0);
      })
    );
  }

  deleteNotification(notificationId: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${notificationId}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to delete notification');
        }
      })
    );
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<ApiResponse<{ count: number }>>(`${this.apiUrl}/unread-count`).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to load unread count');
        }
        return response.data.count;
      }),
      tap(count => {
        this.unreadCountSubject.next(count);
      })
    );
  }

  private loadUnreadCount(): void {
    this.getUnreadCount().subscribe({
      error: (error) => {
        console.error('Failed to load unread notification count:', error);
      }
    });
  }

  private updateUnreadCount(delta: number): void {
    const currentCount = this.unreadCountSubject.value;
    const newCount = Math.max(0, currentCount + delta);
    this.unreadCountSubject.next(newCount);
  }

  // Utility methods for common notification scenarios
  showSaveSuccess(): MatSnackBarRef<SimpleSnackBar> {
    return this.showSuccess('บันทึกข้อมูลเรียบร้อยแล้ว / Data saved successfully');
  }

  showDeleteSuccess(): MatSnackBarRef<SimpleSnackBar> {
    return this.showSuccess('ลบข้อมูลเรียบร้อยแล้ว / Data deleted successfully');
  }

  showUpdateSuccess(): MatSnackBarRef<SimpleSnackBar> {
    return this.showSuccess('อัปเดตข้อมูลเรียบร้อยแล้ว / Data updated successfully');
  }

  showValidationError(message?: string): MatSnackBarRef<SimpleSnackBar> {
    return this.showError(message || 'กรุณาตรวจสอบข้อมูลที่กรอก / Please check the entered data');
  }

  showNetworkError(): MatSnackBarRef<SimpleSnackBar> {
    return this.showError('เกิดข้อผิดพลาดในการเชื่อมต่อ / Network connection error', {
      action: 'ลองใหม่ / Retry',
      duration: 0 // Don't auto-dismiss
    });
  }

  showUnauthorizedError(): MatSnackBarRef<SimpleSnackBar> {
    return this.showError('กรุณาเข้าสู่ระบบใหม่ / Please login again', {
      action: 'เข้าสู่ระบบ / Login'
    });
  }

  showMaintenanceNotice(): MatSnackBarRef<SimpleSnackBar> {
    return this.showInfo('ระบบอยู่ในช่วงการบำรุงรักษา / System under maintenance', {
      duration: 0,
      action: 'ตกลง / OK'
    });
  }

  // Policy-specific notifications
  showPolicyCreated(): MatSnackBarRef<SimpleSnackBar> {
    return this.showSuccess('สร้างกรมธรรม์เรียบร้อยแล้ว / Policy created successfully');
  }

  showPolicyUpdated(): MatSnackBarRef<SimpleSnackBar> {
    return this.showSuccess('อัปเดตกรมธรรม์เรียบร้อยแล้ว / Policy updated successfully');
  }

  showClaimSubmitted(): MatSnackBarRef<SimpleSnackBar> {
    return this.showSuccess('ยื่นเรื่องเคลมเรียบร้อยแล้ว / Claim submitted successfully');
  }

  showDocumentUploaded(): MatSnackBarRef<SimpleSnackBar> {
    return this.showSuccess('อัปโหลดเอกสารเรียบร้อยแล้ว / Document uploaded successfully');
  }

  showPaymentProcessed(): MatSnackBarRef<SimpleSnackBar> {
    return this.showSuccess('ดำเนินการชำระเงินเรียบร้อยแล้ว / Payment processed successfully');
  }
}