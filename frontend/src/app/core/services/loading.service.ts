import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<{[key: string]: boolean}>({});
  
  /**
   * Observable that emits the current loading state
   */
  public loading$ = this.loadingSubject.asObservable();

  /**
   * Observable that emits true if any loading operation is active
   */
  public isLoading$ = this.loading$.pipe(
    map(loadingStates => Object.values(loadingStates).some(isLoading => isLoading))
  );

  /**
   * Set loading state for a specific key
   * @param key - Unique identifier for the loading operation
   * @param isLoading - Loading state
   */
  setLoading(key: string, isLoading: boolean): void {
    const currentState = this.loadingSubject.value;
    
    if (isLoading) {
      this.loadingSubject.next({
        ...currentState,
        [key]: true
      });
    } else {
      const { [key]: removed, ...newState } = currentState;
      this.loadingSubject.next(newState);
    }
  }

  /**
   * Get loading state for a specific key
   * @param key - Unique identifier for the loading operation
   */
  isLoading(key: string): Observable<boolean> {
    return this.loading$.pipe(
      map(loadingStates => !!loadingStates[key])
    );
  }

  /**
   * Get current loading state for a specific key (synchronous)
   * @param key - Unique identifier for the loading operation
   */
  isLoadingSync(key: string): boolean {
    const currentState = this.loadingSubject.value;
    return !!currentState[key];
  }

  /**
   * Clear all loading states
   */
  clearAll(): void {
    this.loadingSubject.next({});
  }

  /**
   * Get all currently active loading keys
   */
  getActiveLoadingKeys(): string[] {
    const currentState = this.loadingSubject.value;
    return Object.keys(currentState).filter(key => currentState[key]);
  }

  /**
   * Show loading for a specific operation with automatic cleanup
   * @param key - Unique identifier for the loading operation
   * @param operation - Promise or Observable to track
   */
  async trackOperation<T>(key: string, operation: Promise<T> | Observable<T>): Promise<T> {
    this.setLoading(key, true);
    
    try {
      if (operation instanceof Promise) {
        const result = await operation;
        return result;
      } else {
        // Handle Observable
        return new Promise((resolve, reject) => {
          operation.subscribe({
            next: (value) => resolve(value),
            error: (error) => reject(error),
            complete: () => {} // Value should be emitted in next
          });
        });
      }
    } finally {
      this.setLoading(key, false);
    }
  }

  /**
   * Show loading with a minimum display time to prevent flickering
   * @param key - Unique identifier for the loading operation
   * @param operation - Promise or Observable to track
   * @param minDuration - Minimum time to show loading (in milliseconds)
   */
  async trackOperationWithMinDuration<T>(
    key: string, 
    operation: Promise<T> | Observable<T>, 
    minDuration: number = 500
  ): Promise<T> {
    this.setLoading(key, true);
    
    const startTime = Date.now();
    
    try {
      let result: T;
      
      if (operation instanceof Promise) {
        result = await operation;
      } else {
        // Handle Observable
        result = await new Promise((resolve, reject) => {
          operation.subscribe({
            next: (value) => resolve(value),
            error: (error) => reject(error)
          });
        });
      }
      
      // Ensure minimum duration
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < minDuration) {
        await new Promise(resolve => setTimeout(resolve, minDuration - elapsedTime));
      }
      
      return result;
    } finally {
      this.setLoading(key, false);
    }
  }

  /**
   * Show global loading overlay
   */
  showGlobalLoading(): void {
    this.setLoading('GLOBAL', true);
  }

  /**
   * Hide global loading overlay
   */
  hideGlobalLoading(): void {
    this.setLoading('GLOBAL', false);
  }

  /**
   * Check if global loading is active
   */
  isGlobalLoading(): Observable<boolean> {
    return this.isLoading('GLOBAL');
  }

  /**
   * Show page loading
   */
  showPageLoading(page: string): void {
    this.setLoading(`PAGE_${page}`, true);
  }

  /**
   * Hide page loading
   */
  hidePageLoading(page: string): void {
    this.setLoading(`PAGE_${page}`, false);
  }

  /**
   * Check if specific page is loading
   */
  isPageLoading(page: string): Observable<boolean> {
    return this.isLoading(`PAGE_${page}`);
  }
}