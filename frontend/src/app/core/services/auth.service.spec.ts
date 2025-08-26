import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { 
  MOCK_USERS, 
  MOCK_API_RESPONSES, 
  MOCK_LOGIN_REQUESTS, 
  MOCK_REGISTER_REQUESTS 
} from '../../test-helpers/test-data';
import { User, LoginRequest, RegisterRequest } from '../models';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  const apiUrl = `${environment.apiUrl}/auth`;

  beforeEach(() => {
    const localStorageSpyObj = jasmine.createSpyObj('localStorage', ['getItem', 'setItem', 'removeItem', 'clear']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    
    localStorageSpy = localStorageSpyObj;
    Object.defineProperty(window, 'localStorage', { value: localStorageSpy });

    spyOn(router, 'navigate');
  });

  afterEach(() => {
    httpMock.verify();
    localStorageSpy.clear.calls.reset();
    localStorageSpy.getItem.calls.reset();
    localStorageSpy.setItem.calls.reset();
    localStorageSpy.removeItem.calls.reset();
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize currentUser$ observable', () => {
      expect(service.currentUser$).toBeDefined();
      service.currentUser$.subscribe(user => {
        expect(user).toBeNull();
      });
    });

    it('should initialize from localStorage on service creation', () => {
      localStorageSpy.getItem.and.returnValue(JSON.stringify(MOCK_USERS[0]));
      
      // Create a new service instance to test initialization
      const newService = new (AuthService as any)(
        TestBed.inject(HttpTestingController as any),
        router
      );

      expect(localStorageSpy.getItem).toHaveBeenCalledWith(environment.storage.userKey);
    });
  });

  describe('Authentication State', () => {
    it('should return null for currentUser when not authenticated', () => {
      expect(service.currentUser).toBeNull();
    });

    it('should return false for isAuthenticated when not authenticated', () => {
      expect(service.isAuthenticated).toBeFalse();
    });

    it('should return false for isAdmin when not authenticated', () => {
      expect(service.isAdmin).toBeFalse();
    });

    it('should return null for userRole when not authenticated', () => {
      expect(service.userRole).toBeNull();
    });

    it('should return true for isAdmin when user role is ADMIN', () => {
      (service as any).currentUserSubject.next(MOCK_USERS[1]); // Admin user
      expect(service.isAdmin).toBeTrue();
    });

    it('should return true for isAdmin when user role is SUPER_ADMIN', () => {
      (service as any).currentUserSubject.next(MOCK_USERS[2]); // Super admin user
      expect(service.isAdmin).toBeTrue();
    });
  });

  describe('Login', () => {
    it('should login successfully with valid credentials', () => {
      const credentials: LoginRequest = MOCK_LOGIN_REQUESTS[0];
      const expectedResponse = MOCK_API_RESPONSES.LOGIN_SUCCESS;

      service.login(credentials).subscribe(response => {
        expect(response).toEqual(expectedResponse.data);
        expect(service.currentUser).toEqual(expectedResponse.data.user);
        expect(service.isAuthenticated).toBeTrue();
      });

      const req = httpMock.expectOne(`${apiUrl}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(expectedResponse);
    });

    it('should handle login failure', () => {
      const credentials: LoginRequest = MOCK_LOGIN_REQUESTS[0];
      const errorResponse = MOCK_API_RESPONSES.LOGIN_FAILURE;

      service.login(credentials).subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error.message).toBe(errorResponse.message);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/login`);
      req.flush(errorResponse);
    });

    it('should handle HTTP error during login', () => {
      const credentials: LoginRequest = MOCK_LOGIN_REQUESTS[0];

      service.login(credentials).subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error).toBeDefined();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/login`);
      req.error(new ErrorEvent('Network error'));
    });

    it('should set session data on successful login', () => {
      const credentials: LoginRequest = MOCK_LOGIN_REQUESTS[0];
      const expectedResponse = MOCK_API_RESPONSES.LOGIN_SUCCESS;

      service.login(credentials).subscribe(() => {
        expect(localStorageSpy.setItem).toHaveBeenCalledWith(
          environment.storage.tokenKey,
          expectedResponse.data.accessToken
        );
        expect(localStorageSpy.setItem).toHaveBeenCalledWith(
          `${environment.storage.tokenKey}_refresh`,
          expectedResponse.data.refreshToken
        );
        expect(localStorageSpy.setItem).toHaveBeenCalledWith(
          environment.storage.userKey,
          JSON.stringify(expectedResponse.data.user)
        );
      });

      const req = httpMock.expectOne(`${apiUrl}/login`);
      req.flush(expectedResponse);
    });
  });

  describe('Register', () => {
    it('should register successfully with valid data', () => {
      const userData: RegisterRequest = MOCK_REGISTER_REQUESTS[0];
      const expectedResponse = MOCK_API_RESPONSES.REGISTER_SUCCESS;

      service.register(userData).subscribe(user => {
        expect(user).toEqual(expectedResponse.data);
      });

      const req = httpMock.expectOne(`${apiUrl}/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(userData);
      req.flush(expectedResponse);
    });

    it('should handle registration failure', () => {
      const userData: RegisterRequest = MOCK_REGISTER_REQUESTS[0];
      const errorResponse = {
        success: false,
        message: 'Email already exists',
        data: null
      };

      service.register(userData).subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error.message).toBe(errorResponse.message);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/register`);
      req.flush(errorResponse);
    });
  });

  describe('Logout', () => {
    beforeEach(() => {
      // Set up authenticated state
      (service as any).currentUserSubject.next(MOCK_USERS[0]);
      localStorageSpy.getItem.and.returnValue('mock-token');
    });

    it('should clear session and navigate to login', () => {
      service.logout();

      expect(localStorageSpy.removeItem).toHaveBeenCalledWith(environment.storage.tokenKey);
      expect(localStorageSpy.removeItem).toHaveBeenCalledWith(`${environment.storage.tokenKey}_refresh`);
      expect(localStorageSpy.removeItem).toHaveBeenCalledWith(environment.storage.userKey);
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
      expect(service.currentUser).toBeNull();
    });

    it('should clear token expiration timer on logout', () => {
      spyOn(service as any, 'clearTokenExpirationTimer');
      
      service.logout();
      
      expect((service as any).clearTokenExpirationTimer).toHaveBeenCalled();
    });
  });

  describe('Token Refresh', () => {
    it('should refresh token successfully', () => {
      const refreshToken = 'valid-refresh-token';
      const expectedResponse = MOCK_API_RESPONSES.LOGIN_SUCCESS;

      service.refreshToken(refreshToken).subscribe(response => {
        expect(response).toEqual(expectedResponse.data);
      });

      const req = httpMock.expectOne(`${apiUrl}/refresh-token`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ refreshToken });
      req.flush(expectedResponse);
    });

    it('should logout on refresh token failure', () => {
      const refreshToken = 'invalid-refresh-token';
      spyOn(service, 'logout');

      service.refreshToken(refreshToken).subscribe({
        next: () => fail('Expected error'),
        error: () => {
          expect(service.logout).toHaveBeenCalled();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/refresh-token`);
      req.error(new ErrorEvent('Unauthorized'));
    });
  });

  describe('Password Management', () => {
    it('should send forgot password request successfully', () => {
      const email = 'test@example.com';
      const expectedResponse = { success: true, message: 'Reset email sent', data: null };

      service.forgotPassword(email).subscribe(() => {
        expect(true).toBeTrue(); // Request completed successfully
      });

      const req = httpMock.expectOne(`${apiUrl}/forgot-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email });
      req.flush(expectedResponse);
    });

    it('should handle forgot password failure', () => {
      const email = 'invalid@example.com';
      const errorResponse = { success: false, message: 'Email not found', data: null };

      service.forgotPassword(email).subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error.message).toBe(errorResponse.message);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/forgot-password`);
      req.flush(errorResponse);
    });

    it('should reset password successfully', () => {
      const token = 'valid-reset-token';
      const newPassword = 'newPassword123!';
      const expectedResponse = { success: true, message: 'Password reset successful', data: null };

      service.resetPassword(token, newPassword).subscribe(() => {
        expect(true).toBeTrue(); // Request completed successfully
      });

      const req = httpMock.expectOne(`${apiUrl}/reset-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ token, newPassword });
      req.flush(expectedResponse);
    });

    it('should change password successfully', () => {
      const changeRequest = {
        currentPassword: 'oldPassword',
        newPassword: 'newPassword123!',
        confirmPassword: 'newPassword123!'
      };
      const expectedResponse = { success: true, message: 'Password changed', data: null };

      service.changePassword(changeRequest).subscribe(() => {
        expect(true).toBeTrue(); // Request completed successfully
      });

      const req = httpMock.expectOne(`${apiUrl}/change-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(changeRequest);
      req.flush(expectedResponse);
    });
  });

  describe('Email Verification', () => {
    it('should verify email successfully', () => {
      const token = 'verification-token';
      const expectedResponse = { success: true, message: 'Email verified', data: null };

      service.verifyEmail(token).subscribe(() => {
        expect(true).toBeTrue(); // Request completed successfully
      });

      const req = httpMock.expectOne(`${apiUrl}/verify-email`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ token });
      req.flush(expectedResponse);
    });

    it('should resend verification email successfully', () => {
      const expectedResponse = { success: true, message: 'Verification email sent', data: null };

      service.resendVerificationEmail().subscribe(() => {
        expect(true).toBeTrue(); // Request completed successfully
      });

      const req = httpMock.expectOne(`${apiUrl}/resend-verification`);
      expect(req.request.method).toBe('POST');
      req.flush(expectedResponse);
    });
  });

  describe('Token Management', () => {
    it('should get token from localStorage', () => {
      const mockToken = 'mock-jwt-token';
      localStorageSpy.getItem.and.returnValue(mockToken);

      const token = service.getToken();

      expect(token).toBe(mockToken);
      expect(localStorageSpy.getItem).toHaveBeenCalledWith(environment.storage.tokenKey);
    });

    it('should get refresh token from localStorage', () => {
      const mockRefreshToken = 'mock-refresh-token';
      localStorageSpy.getItem.and.returnValue(mockRefreshToken);

      const token = service.getRefreshToken();

      expect(token).toBe(mockRefreshToken);
      expect(localStorageSpy.getItem).toHaveBeenCalledWith(`${environment.storage.tokenKey}_refresh`);
    });

    it('should return null when no token exists', () => {
      localStorageSpy.getItem.and.returnValue(null);

      const token = service.getToken();

      expect(token).toBeNull();
    });
  });

  describe('Permissions', () => {
    beforeEach(() => {
      (service as any).currentUserSubject.next(MOCK_USERS[0]); // Customer user
    });

    it('should return false for permissions when not authenticated', () => {
      (service as any).currentUserSubject.next(null);
      
      expect(service.hasPermission('VIEW_ALL_POLICIES')).toBeFalse();
      expect(service.hasPermission('CREATE_POLICY')).toBeFalse();
    });

    it('should return true for all permissions when SUPER_ADMIN', () => {
      (service as any).currentUserSubject.next(MOCK_USERS[2]); // Super admin

      expect(service.hasPermission('VIEW_ALL_POLICIES')).toBeTrue();
      expect(service.hasPermission('MANAGE_USERS')).toBeTrue();
      expect(service.hasPermission('ANY_PERMISSION')).toBeTrue();
    });

    it('should return correct permissions for ADMIN role', () => {
      (service as any).currentUserSubject.next(MOCK_USERS[1]); // Admin

      expect(service.hasPermission('VIEW_ALL_POLICIES')).toBeTrue();
      expect(service.hasPermission('MANAGE_USERS')).toBeTrue();
      expect(service.hasPermission('CREATE_POLICY')).toBeTrue();
    });

    it('should return correct permissions for CUSTOMER role', () => {
      expect(service.hasPermission('VIEW_ALL_POLICIES')).toBeFalse();
      expect(service.hasPermission('MANAGE_USERS')).toBeFalse();
      expect(service.hasPermission('CREATE_POLICY')).toBeTrue();
      expect(service.hasPermission('VIEW_OWN_POLICIES')).toBeTrue();
    });

    it('should return false for unknown permissions', () => {
      expect(service.hasPermission('UNKNOWN_PERMISSION')).toBeFalse();
    });
  });

  describe('Route Access', () => {
    it('should return false when not authenticated', () => {
      expect(service.canAccessRoute(['ADMIN'])).toBeFalse();
    });

    it('should return true when user role matches required roles', () => {
      (service as any).currentUserSubject.next(MOCK_USERS[1]); // Admin user

      expect(service.canAccessRoute(['ADMIN', 'SUPER_ADMIN'])).toBeTrue();
      expect(service.canAccessRoute(['ADMIN'])).toBeTrue();
    });

    it('should return false when user role does not match required roles', () => {
      (service as any).currentUserSubject.next(MOCK_USERS[0]); // Customer user

      expect(service.canAccessRoute(['ADMIN'])).toBeFalse();
      expect(service.canAccessRoute(['SUPER_ADMIN'])).toBeFalse();
    });
  });

  describe('Session Management', () => {
    it('should initialize from valid localStorage data', () => {
      const mockUser = MOCK_USERS[0];
      const mockToken = 'valid-token';
      const futureDate = new Date(Date.now() + 3600000).toISOString();

      localStorageSpy.getItem.and.callFake((key: string) => {
        switch (key) {
          case environment.storage.userKey:
            return JSON.stringify(mockUser);
          case environment.storage.tokenKey:
            return mockToken;
          case `${environment.storage.tokenKey}_expires`:
            return futureDate;
          default:
            return null;
        }
      });

      // Create new service to test initialization
      const newService = TestBed.inject(AuthService);
      
      expect(newService.currentUser).toBeTruthy();
    });

    it('should clear expired session data', () => {
      const mockUser = MOCK_USERS[0];
      const mockToken = 'expired-token';
      const pastDate = new Date(Date.now() - 3600000).toISOString();

      localStorageSpy.getItem.and.callFake((key: string) => {
        switch (key) {
          case environment.storage.userKey:
            return JSON.stringify(mockUser);
          case environment.storage.tokenKey:
            return mockToken;
          case `${environment.storage.tokenKey}_expires`:
            return pastDate;
          case `${environment.storage.tokenKey}_refresh`:
            return 'refresh-token';
          default:
            return null;
        }
      });

      // This should trigger token refresh or clearSession
      TestBed.inject(AuthService);
      
      // Should attempt to refresh token
      httpMock.expectOne(`${apiUrl}/refresh-token`);
    });

    it('should handle corrupted localStorage data', () => {
      localStorageSpy.getItem.and.callFake((key: string) => {
        if (key === environment.storage.userKey) {
          return 'invalid-json';
        }
        return null;
      });

      spyOn(console, 'error');
      
      // Should not throw error and should clear session
      expect(() => TestBed.inject(AuthService)).not.toThrow();
      expect(localStorageSpy.removeItem).toHaveBeenCalled();
    });
  });
});