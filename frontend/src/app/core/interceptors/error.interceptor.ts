import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';
import { TranslationService } from '../services/translation.service';
import { environment } from '../../../environments/environment';
import { AppError, ErrorCode } from '../models/common.model';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  
  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      // Retry failed requests (except for certain error types)
      retry({
        count: this.shouldRetry(req) ? environment.api.retryAttempts : 0,
        delay: (error: HttpErrorResponse, retryCount: number) => {
          // Exponential backoff
          return new Promise(resolve => {
            setTimeout(resolve, environment.api.retryDelay * Math.pow(2, retryCount - 1));
          });
        }
      }),
      catchError((error: HttpErrorResponse) => {
        const appError = this.createAppError(error, req);
        
        // Log error in development
        if (!environment.production) {
          console.error('HTTP Error:', appError);
        }

        // Show user-friendly error message
        this.handleUserNotification(appError);

        return throwError(() => appError);
      })
    );
  }

  private shouldRetry(req: HttpRequest<any>): boolean {
    // Don't retry for certain methods and endpoints
    const nonRetryableMethods = ['POST', 'PUT', 'DELETE'];
    const nonRetryableEndpoints = ['/auth/login', '/auth/register'];

    return !nonRetryableMethods.includes(req.method.toUpperCase()) &&
           !nonRetryableEndpoints.some(endpoint => req.url.includes(endpoint));
  }

  private createAppError(error: HttpErrorResponse, req: HttpRequest<any>): AppError {
    let appError: AppError = {
      code: ErrorCode.SERVER_ERROR,
      message: 'An unexpected error occurred',
      messageThai: 'เกิดข้อผิดพลาดที่ไม่คาดคิด',
      timestamp: new Date(),
      path: req.url,
      method: req.method,
      statusCode: error.status
    };

    if (error.error && typeof error.error === 'object') {
      // Server returned structured error response
      appError = {
        ...appError,
        code: error.error.code || this.getErrorCodeFromStatus(error.status),
        message: error.error.message || appError.message,
        messageThai: error.error.messageThai || appError.messageThai,
        details: error.error.errors || error.error.details
      };
    } else {
      // Handle different error types
      switch (error.status) {
        case 0:
          appError.code = ErrorCode.NETWORK_ERROR;
          appError.message = 'Network connection error';
          appError.messageThai = 'เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย';
          break;
        case 400:
          appError.code = ErrorCode.VALIDATION_ERROR;
          appError.message = 'Invalid request data';
          appError.messageThai = 'ข้อมูลที่ส่งมาไม่ถูกต้อง';
          break;
        case 401:
          appError.code = ErrorCode.UNAUTHORIZED;
          appError.message = 'Authentication required';
          appError.messageThai = 'จำเป็นต้องเข้าสู่ระบบ';
          break;
        case 403:
          appError.code = ErrorCode.FORBIDDEN;
          appError.message = 'Access denied';
          appError.messageThai = 'ไม่มีสิทธิ์ในการเข้าถึง';
          break;
        case 404:
          appError.code = ErrorCode.NOT_FOUND;
          appError.message = 'Resource not found';
          appError.messageThai = 'ไม่พบข้อมูลที่ต้องการ';
          break;
        case 409:
          appError.code = ErrorCode.CONFLICT;
          appError.message = 'Resource conflict';
          appError.messageThai = 'ข้อมูลขัดแย้ง';
          break;
        case 422:
          appError.code = ErrorCode.BUSINESS_RULE_VIOLATION;
          appError.message = 'Business rule violation';
          appError.messageThai = 'ข้อมูลไม่เป็นไปตามกฎเกณฑ์ทางธุรกิจ';
          break;
        case 408:
        case 504:
          appError.code = ErrorCode.TIMEOUT_ERROR;
          appError.message = 'Request timeout';
          appError.messageThai = 'การร้องขอหมดเวลา';
          break;
        default:
          if (error.status >= 500) {
            appError.code = ErrorCode.SERVER_ERROR;
            appError.message = 'Server error';
            appError.messageThai = 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์';
          }
      }
    }

    return appError;
  }

  private getErrorCodeFromStatus(status: number): ErrorCode {
    switch (status) {
      case 400: return ErrorCode.VALIDATION_ERROR;
      case 401: return ErrorCode.UNAUTHORIZED;
      case 403: return ErrorCode.FORBIDDEN;
      case 404: return ErrorCode.NOT_FOUND;
      case 409: return ErrorCode.CONFLICT;
      case 422: return ErrorCode.BUSINESS_RULE_VIOLATION;
      case 408:
      case 504: return ErrorCode.TIMEOUT_ERROR;
      default: 
        return status >= 500 ? ErrorCode.SERVER_ERROR : ErrorCode.VALIDATION_ERROR;
    }
  }

  private handleUserNotification(error: AppError): void {
    // Don't show notifications for certain error types
    const silentErrors = [ErrorCode.UNAUTHORIZED];
    
    if (silentErrors.includes(error.code as ErrorCode)) {
      return;
    }

    try {
      // Get services lazily to avoid circular dependency
      const notificationService = this.injector.get(NotificationService);
      const translationService = this.injector.get(TranslationService);

      // Show different notification types based on error severity
      const isCurrentLanguageThai = translationService.currentLanguage === 'th';
      const message = isCurrentLanguageThai && error.messageThai ? error.messageThai : error.message;

      switch (error.code) {
        case ErrorCode.NETWORK_ERROR:
        case ErrorCode.TIMEOUT_ERROR:
          notificationService.showError(message, {
            duration: 5000,
            action: 'Retry'
          });
          break;
        case ErrorCode.VALIDATION_ERROR:
          notificationService.showWarning(message, {
            duration: 4000
          });
          break;
        case ErrorCode.FORBIDDEN:
        case ErrorCode.NOT_FOUND:
          notificationService.showInfo(message, {
            duration: 3000
          });
          break;
        default:
          notificationService.showError(message, {
            duration: 4000
          });
      }
    } catch (injectionError) {
      // Fallback if services are not available
      console.error('Error notification failed:', error.message, injectionError);
    }
  }
}