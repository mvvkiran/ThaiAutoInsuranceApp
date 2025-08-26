import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, timer } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { 
  User, 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  ResetPasswordRequest,
  ChangePasswordRequest,
  RefreshTokenRequest,
  ApiResponse,
  Gender,
  UserRole
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer?: any;

  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Initialize user from localStorage if available
    this.initializeFromStorage();
    
    // Force mock user creation in development if no user exists
    setTimeout(() => {
      if (!this.currentUser && !environment.production) {
        console.log('Creating mock user for development...');
        this.initializeMockUser();
      }
    }, 100);
  }

  // Public getters
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.getToken() && !!this.currentUser;
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN' || this.currentUser?.role === 'SUPER_ADMIN';
  }

  get userRole(): string | null {
    return this.currentUser?.role || null;
  }

  // Authentication methods
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, credentials)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Login failed');
          }
          return response.data;
        }),
        tap(loginResponse => {
          this.setSession(loginResponse);
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  register(userData: RegisterRequest): Observable<User> {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/register`, userData)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Registration failed');
          }
          return response.data;
        }),
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.clearSession();
    this.currentUserSubject.next(null);
    this.clearTokenExpirationTimer();
    this.router.navigate(['/auth/login']);
  }

  refreshToken(refreshToken: string): Observable<LoginResponse> {
    const request: RefreshTokenRequest = { refreshToken };
    
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/refresh-token`, request)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Token refresh failed');
          }
          return response.data;
        }),
        tap(loginResponse => {
          this.setSession(loginResponse);
        }),
        catchError(error => {
          console.error('Token refresh error:', error);
          this.logout();
          return throwError(() => error);
        })
      );
  }

  forgotPassword(email: string): Observable<void> {
    const request: ResetPasswordRequest = { email };
    
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/forgot-password`, request)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message || 'Password reset request failed');
          }
        }),
        catchError(error => {
          console.error('Forgot password error:', error);
          return throwError(() => error);
        })
      );
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/reset-password`, {
      token,
      newPassword
    })
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message || 'Password reset failed');
          }
        }),
        catchError(error => {
          console.error('Reset password error:', error);
          return throwError(() => error);
        })
      );
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/change-password`, request)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message || 'Password change failed');
          }
        }),
        catchError(error => {
          console.error('Change password error:', error);
          return throwError(() => error);
        })
      );
  }

  verifyEmail(token: string): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/verify-email`, { token })
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message || 'Email verification failed');
          }
        }),
        catchError(error => {
          console.error('Email verification error:', error);
          return throwError(() => error);
        })
      );
  }

  resendVerificationEmail(): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/resend-verification`, {})
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message || 'Resend verification failed');
          }
        }),
        catchError(error => {
          console.error('Resend verification error:', error);
          return throwError(() => error);
        })
      );
  }

  // Token management
  getToken(): string | null {
    return localStorage.getItem(environment.storage.tokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(`${environment.storage.tokenKey}_refresh`);
  }

  // Session management
  private setSession(loginResponse: LoginResponse): void {
    const { user, accessToken, refreshToken, expiresIn } = loginResponse;
    
    // Calculate expiration date from duration
    const expiresAt = new Date(Date.now() + expiresIn);
    
    // Store tokens
    localStorage.setItem(environment.storage.tokenKey, accessToken);
    localStorage.setItem(`${environment.storage.tokenKey}_refresh`, refreshToken);
    localStorage.setItem(environment.storage.userKey, JSON.stringify(user));
    localStorage.setItem(`${environment.storage.tokenKey}_expires`, expiresAt.toString());
    
    // Update current user
    this.currentUserSubject.next(user);
    
    // Set token expiration timer
    this.setTokenExpirationTimer(expiresAt);
  }

  private clearSession(): void {
    localStorage.removeItem(environment.storage.tokenKey);
    localStorage.removeItem(`${environment.storage.tokenKey}_refresh`);
    localStorage.removeItem(environment.storage.userKey);
    localStorage.removeItem(`${environment.storage.tokenKey}_expires`);
  }

  private initializeFromStorage(): void {
    try {
      const userJson = localStorage.getItem(environment.storage.userKey);
      const token = this.getToken();
      const expiresAtStr = localStorage.getItem(`${environment.storage.tokenKey}_expires`);

      if (userJson && token && expiresAtStr) {
        const user = JSON.parse(userJson) as User;
        const expiresAt = new Date(expiresAtStr);

        // Check if token is still valid
        if (expiresAt > new Date()) {
          this.currentUserSubject.next(user);
          this.setTokenExpirationTimer(expiresAt);
        } else {
          // Token expired, try to refresh
          const refreshToken = this.getRefreshToken();
          if (refreshToken) {
            this.refreshToken(refreshToken).subscribe({
              error: () => this.clearSession()
            });
          } else {
            this.clearSession();
          }
        }
      } else {
        // Development mode: Create mock user if no authentication exists
        if (!environment.production) {
          this.initializeMockUser();
        }
      }
    } catch (error) {
      console.error('Error initializing auth from storage:', error);
      this.clearSession();
      // Development mode: Create mock user on error
      if (!environment.production) {
        this.initializeMockUser();
      }
    }
  }

  private initializeMockUser(): void {
    const mockUser: User = {
      id: 'mock-user-1',
      email: 'customer@example.com',
      username: 'customer123',
      firstName: 'สมชาย',
      lastName: 'ใจดี',
      firstNameThai: 'สมชาย',
      lastNameThai: 'ใจดี',
      fullName: 'สมชาย ใจดี',
      nationalId: '1234567890123',
      phoneNumber: '0812345678',
      dateOfBirth: new Date('1985-03-15'),
      gender: Gender.MALE,
      role: UserRole.CUSTOMER,
      isActive: true,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date(),
      preferredLanguage: 'th'
    };

    // Set mock session
    const mockToken = 'mock-jwt-token-for-development';
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    localStorage.setItem(environment.storage.tokenKey, mockToken);
    localStorage.setItem(environment.storage.userKey, JSON.stringify(mockUser));
    localStorage.setItem(`${environment.storage.tokenKey}_expires`, expiresAt.toString());
    
    this.currentUserSubject.next(mockUser);
    console.log('Development mode: Mock user initialized');
  }

  private setTokenExpirationTimer(expirationDate: Date): void {
    this.clearTokenExpirationTimer();
    
    const expiresInMs = expirationDate.getTime() - new Date().getTime();
    
    if (expiresInMs > 0) {
      // Set timer to refresh token 5 minutes before expiration
      const refreshTime = Math.max(expiresInMs - (5 * 60 * 1000), 60000); // At least 1 minute
      
      this.tokenExpirationTimer = timer(refreshTime).subscribe(() => {
        const refreshToken = this.getRefreshToken();
        if (refreshToken) {
          this.refreshToken(refreshToken).subscribe({
            error: () => this.logout()
          });
        } else {
          this.logout();
        }
      });
    }
  }

  private clearTokenExpirationTimer(): void {
    if (this.tokenExpirationTimer) {
      this.tokenExpirationTimer.unsubscribe();
      this.tokenExpirationTimer = undefined;
    }
  }

  // Utility methods
  hasPermission(permission: string): boolean {
    if (!this.currentUser) {
      return false;
    }

    // Super admin has all permissions
    if (this.currentUser.role === 'SUPER_ADMIN') {
      return true;
    }

    // Add specific permission logic based on roles
    switch (permission) {
      case 'VIEW_ALL_POLICIES':
      case 'VIEW_ALL_CLAIMS':
      case 'MANAGE_USERS':
        return this.currentUser.role === 'ADMIN';
      
      case 'CREATE_POLICY':
      case 'VIEW_OWN_POLICIES':
      case 'CREATE_CLAIM':
      case 'VIEW_OWN_CLAIMS':
        return true; // All authenticated users
      
      default:
        return false;
    }
  }

  canAccessRoute(requiredRoles: string[]): boolean {
    if (!this.currentUser) {
      return false;
    }

    return requiredRoles.includes(this.currentUser.role);
  }
}