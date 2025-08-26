import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { MOCK_API_RESPONSES } from '../../test-helpers/test-data';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const mockToken = 'mock-access-token';
  const mockRefreshToken = 'mock-refresh-token';
  const apiUrl = 'http://localhost:3000/api';

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getToken', 
      'getRefreshToken', 
      'refreshToken', 
      'logout'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        AuthInterceptor,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        }
      ]
    });

    interceptor = TestBed.inject(AuthInterceptor);
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Token Attachment', () => {
    it('should add Authorization header when token exists', () => {
      authService.getToken.and.returnValue(mockToken);

      httpClient.get(`${apiUrl}/policies`).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/policies`);
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush({});
    });

    it('should not add Authorization header when token does not exist', () => {
      authService.getToken.and.returnValue(null);

      httpClient.get(`${apiUrl}/policies`).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/policies`);
      expect(req.request.headers.get('Authorization')).toBeNull();
      req.flush({});
    });

    it('should not add Authorization header for auth endpoints', () => {
      authService.getToken.and.returnValue(mockToken);

      httpClient.post(`${apiUrl}/auth/login`, {}).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/auth/login`);
      expect(req.request.headers.get('Authorization')).toBeNull();
      req.flush({});
    });
  });

  describe('Auth Endpoints Detection', () => {
    it('should skip token attachment for all auth endpoints', () => {
      const authEndpoints = [
        '/auth/login',
        '/auth/register',
        '/auth/refresh-token',
        '/auth/forgot-password',
        '/auth/reset-password',
        '/auth/verify-email'
      ];

      authService.getToken.and.returnValue(mockToken);

      authEndpoints.forEach(endpoint => {
        httpClient.post(`${apiUrl}${endpoint}`, {}).subscribe();
        const req = httpMock.expectOne(`${apiUrl}${endpoint}`);
        expect(req.request.headers.get('Authorization')).toBeNull();
        req.flush({});
      });
    });

    it('should detect auth endpoints with different base URLs', () => {
      authService.getToken.and.returnValue(mockToken);

      httpClient.post('https://api.example.com/auth/login', {}).subscribe();

      const req = httpMock.expectOne('https://api.example.com/auth/login');
      expect(req.request.headers.get('Authorization')).toBeNull();
      req.flush({});
    });

    it('should detect auth endpoints with query parameters', () => {
      authService.getToken.and.returnValue(mockToken);

      httpClient.post(`${apiUrl}/auth/login?returnUrl=/dashboard`, {}).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/auth/login?returnUrl=/dashboard`);
      expect(req.request.headers.get('Authorization')).toBeNull();
      req.flush({});
    });
  });

  describe('401 Error Handling', () => {
    it('should attempt token refresh on 401 error', () => {
      authService.getToken.and.returnValue(mockToken);
      authService.getRefreshToken.and.returnValue(mockRefreshToken);
      authService.refreshToken.and.returnValue(of(MOCK_API_RESPONSES.LOGIN_SUCCESS.data));

      httpClient.get(`${apiUrl}/policies`).subscribe({
        next: (response) => {
          expect(response).toBeTruthy();
        },
        error: () => fail('Should not error after successful token refresh')
      });

      // First request fails with 401
      const req1 = httpMock.expectOne(`${apiUrl}/policies`);
      expect(req1.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req1.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

      // Should call refresh token
      expect(authService.refreshToken).toHaveBeenCalledWith(mockRefreshToken);

      // Retry request with new token
      const req2 = httpMock.expectOne(`${apiUrl}/policies`);
      expect(req2.request.headers.get('Authorization')).toBe(`Bearer ${MOCK_API_RESPONSES.LOGIN_SUCCESS.data.accessToken}`);
      req2.flush({ policies: [] });
    });

    it('should logout and redirect when refresh token fails', () => {
      authService.getToken.and.returnValue(mockToken);
      authService.getRefreshToken.and.returnValue(mockRefreshToken);
      authService.refreshToken.and.returnValue(throwError(() => new Error('Refresh failed')));

      httpClient.get(`${apiUrl}/policies`).subscribe({
        next: () => fail('Should not succeed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      // First request fails with 401
      const req = httpMock.expectOne(`${apiUrl}/policies`);
      req.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

      expect(authService.refreshToken).toHaveBeenCalledWith(mockRefreshToken);
      expect(authService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    });

    it('should logout and redirect when no refresh token available', () => {
      authService.getToken.and.returnValue(mockToken);
      authService.getRefreshToken.and.returnValue(null);

      httpClient.get(`${apiUrl}/policies`).subscribe({
        next: () => fail('Should not succeed'),
        error: () => {
          // Expected to complete without emitting due to EMPTY
        },
        complete: () => {
          expect(authService.logout).toHaveBeenCalled();
          expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
        }
      });

      // First request fails with 401
      const req = httpMock.expectOne(`${apiUrl}/policies`);
      req.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

      expect(authService.refreshToken).not.toHaveBeenCalled();
    });

    it('should not handle 401 errors for auth endpoints', () => {
      authService.getToken.and.returnValue(mockToken);

      httpClient.post(`${apiUrl}/auth/login`, {}).subscribe({
        next: () => fail('Should not succeed'),
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/login`);
      req.flush({ error: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });

      expect(authService.refreshToken).not.toHaveBeenCalled();
      expect(authService.logout).not.toHaveBeenCalled();
    });

    it('should not handle 401 errors when no token exists', () => {
      authService.getToken.and.returnValue(null);

      httpClient.get(`${apiUrl}/policies`).subscribe({
        next: () => fail('Should not succeed'),
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/policies`);
      req.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

      expect(authService.refreshToken).not.toHaveBeenCalled();
      expect(authService.logout).not.toHaveBeenCalled();
    });
  });

  describe('Concurrent Request Handling', () => {
    it('should handle concurrent requests during token refresh', () => {
      authService.getToken.and.returnValue(mockToken);
      authService.getRefreshToken.and.returnValue(mockRefreshToken);
      authService.refreshToken.and.returnValue(of(MOCK_API_RESPONSES.LOGIN_SUCCESS.data));

      // Make multiple concurrent requests
      httpClient.get(`${apiUrl}/policies`).subscribe();
      httpClient.get(`${apiUrl}/claims`).subscribe();
      httpClient.get(`${apiUrl}/users`).subscribe();

      // All requests fail with 401
      const req1 = httpMock.expectOne(`${apiUrl}/policies`);
      const req2 = httpMock.expectOne(`${apiUrl}/claims`);
      const req3 = httpMock.expectOne(`${apiUrl}/users`);

      req1.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
      req2.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
      req3.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

      // Should only call refresh token once
      expect(authService.refreshToken).toHaveBeenCalledTimes(1);

      // All requests should be retried with new token
      const retryReq1 = httpMock.expectOne(`${apiUrl}/policies`);
      const retryReq2 = httpMock.expectOne(`${apiUrl}/claims`);
      const retryReq3 = httpMock.expectOne(`${apiUrl}/users`);

      expect(retryReq1.request.headers.get('Authorization')).toBe(`Bearer ${MOCK_API_RESPONSES.LOGIN_SUCCESS.data.accessToken}`);
      expect(retryReq2.request.headers.get('Authorization')).toBe(`Bearer ${MOCK_API_RESPONSES.LOGIN_SUCCESS.data.accessToken}`);
      expect(retryReq3.request.headers.get('Authorization')).toBe(`Bearer ${MOCK_API_RESPONSES.LOGIN_SUCCESS.data.accessToken}`);

      retryReq1.flush({ policies: [] });
      retryReq2.flush({ claims: [] });
      retryReq3.flush({ users: [] });
    });

    it('should queue requests while token refresh is in progress', () => {
      authService.getToken.and.returnValue(mockToken);
      authService.getRefreshToken.and.returnValue(mockRefreshToken);
      
      // Create a delayed refresh response
      let refreshResolve: any;
      const refreshPromise = new Promise(resolve => {
        refreshResolve = resolve;
      });
      authService.refreshToken.and.returnValue(refreshPromise as any);

      // Make requests that will trigger 401
      httpClient.get(`${apiUrl}/policies`).subscribe();
      
      // First request fails
      const req1 = httpMock.expectOne(`${apiUrl}/policies`);
      req1.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

      // Make another request while refresh is in progress
      httpClient.get(`${apiUrl}/claims`).subscribe();
      const req2 = httpMock.expectOne(`${apiUrl}/claims`);
      req2.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

      // Should only call refresh once
      expect(authService.refreshToken).toHaveBeenCalledTimes(1);

      // Complete the refresh
      refreshResolve(MOCK_API_RESPONSES.LOGIN_SUCCESS.data);

      // Both requests should be retried
      httpMock.expectOne(`${apiUrl}/policies`).flush({ policies: [] });
      httpMock.expectOne(`${apiUrl}/claims`).flush({ claims: [] });
    });
  });

  describe('Non-401 Error Handling', () => {
    it('should pass through 403 errors without token refresh', () => {
      authService.getToken.and.returnValue(mockToken);

      httpClient.get(`${apiUrl}/policies`).subscribe({
        next: () => fail('Should not succeed'),
        error: (error) => {
          expect(error.status).toBe(403);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/policies`);
      req.flush({ error: 'Forbidden' }, { status: 403, statusText: 'Forbidden' });

      expect(authService.refreshToken).not.toHaveBeenCalled();
    });

    it('should pass through 404 errors without token refresh', () => {
      authService.getToken.and.returnValue(mockToken);

      httpClient.get(`${apiUrl}/policies/nonexistent`).subscribe({
        next: () => fail('Should not succeed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/policies/nonexistent`);
      req.flush({ error: 'Not Found' }, { status: 404, statusText: 'Not Found' });

      expect(authService.refreshToken).not.toHaveBeenCalled();
    });

    it('should pass through 500 errors without token refresh', () => {
      authService.getToken.and.returnValue(mockToken);

      httpClient.get(`${apiUrl}/policies`).subscribe({
        next: () => fail('Should not succeed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/policies`);
      req.flush({ error: 'Internal Server Error' }, { status: 500, statusText: 'Internal Server Error' });

      expect(authService.refreshToken).not.toHaveBeenCalled();
    });
  });

  describe('Request Cloning', () => {
    it('should properly clone request with Authorization header', () => {
      authService.getToken.and.returnValue(mockToken);

      const originalBody = { test: 'data' };
      const originalHeaders = { 'Content-Type': 'application/json' };

      httpClient.post(`${apiUrl}/policies`, originalBody, { headers: originalHeaders }).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/policies`);
      
      // Should have original headers plus Authorization
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      
      // Should have original body
      expect(req.request.body).toEqual(originalBody);
      
      req.flush({});
    });

    it('should not modify original request object', () => {
      authService.getToken.and.returnValue(mockToken);

      httpClient.get(`${apiUrl}/policies`).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/policies`);
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      
      req.flush({});
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty token string', () => {
      authService.getToken.and.returnValue('');

      httpClient.get(`${apiUrl}/policies`).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/policies`);
      expect(req.request.headers.get('Authorization')).toBeNull();
      req.flush({});
    });

    it('should handle whitespace-only token', () => {
      authService.getToken.and.returnValue('   ');

      httpClient.get(`${apiUrl}/policies`).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/policies`);
      expect(req.request.headers.get('Authorization')).toBe('Bearer    ');
      req.flush({});
    });

    it('should reset refresh state after successful refresh', () => {
      authService.getToken.and.returnValue(mockToken);
      authService.getRefreshToken.and.returnValue(mockRefreshToken);
      authService.refreshToken.and.returnValue(of(MOCK_API_RESPONSES.LOGIN_SUCCESS.data));

      // First 401 error
      httpClient.get(`${apiUrl}/policies`).subscribe();
      const req1 = httpMock.expectOne(`${apiUrl}/policies`);
      req1.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

      // Complete the retry
      const retryReq1 = httpMock.expectOne(`${apiUrl}/policies`);
      retryReq1.flush({ policies: [] });

      // Second request should be able to trigger refresh again if needed
      httpClient.get(`${apiUrl}/claims`).subscribe();
      const req2 = httpMock.expectOne(`${apiUrl}/claims`);
      req2.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

      // Should attempt refresh again
      expect(authService.refreshToken).toHaveBeenCalledTimes(2);

      const retryReq2 = httpMock.expectOne(`${apiUrl}/claims`);
      retryReq2.flush({ claims: [] });
    });
  });
});