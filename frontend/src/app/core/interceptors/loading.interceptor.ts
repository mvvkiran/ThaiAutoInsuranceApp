import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip loading indicator for certain requests
    if (this.shouldSkipLoading(req)) {
      return next.handle(req);
    }

    // Generate unique loading key based on request
    const loadingKey = this.generateLoadingKey(req);
    
    // Start loading
    this.loadingService.setLoading(loadingKey, true);

    return next.handle(req).pipe(
      finalize(() => {
        // Stop loading when request completes (success or error)
        this.loadingService.setLoading(loadingKey, false);
      })
    );
  }

  private shouldSkipLoading(req: HttpRequest<any>): boolean {
    // Skip loading for certain requests to avoid UI flickering
    const skipLoadingEndpoints = [
      '/auth/refresh-token',
      '/notifications/count',
      '/heartbeat',
      '/health'
    ];

    // Skip if request has custom header to disable loading
    if (req.headers.has('X-Skip-Loading')) {
      return true;
    }

    // Skip for specific endpoints
    return skipLoadingEndpoints.some(endpoint => req.url.includes(endpoint));
  }

  private generateLoadingKey(req: HttpRequest<any>): string {
    // Create a unique key for the request
    // This allows tracking multiple concurrent requests independently
    const method = req.method;
    const url = req.url.replace(/\/\d+/g, '/:id'); // Replace IDs with placeholder
    
    return `${method}:${url}`;
  }
}