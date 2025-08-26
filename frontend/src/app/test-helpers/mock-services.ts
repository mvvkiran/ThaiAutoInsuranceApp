import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { 
  User, 
  Policy, 
  Claim, 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest,
  ApiResponse 
} from '../core/models';
import { 
  MOCK_USERS, 
  MOCK_POLICIES, 
  MOCK_CLAIMS, 
  MOCK_API_RESPONSES,
  MOCK_TRANSLATION_DATA 
} from './test-data';

@Injectable()
export class MockAuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private _isAuthenticated = false;
  private _mockUser: User | null = null;

  get currentUser(): User | null {
    return this._mockUser;
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  get isAdmin(): boolean {
    return this._mockUser?.role === 'ADMIN' || this._mockUser?.role === 'SUPER_ADMIN';
  }

  get userRole(): string | null {
    return this._mockUser?.role || null;
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    if (credentials.email === 'valid@example.com' && credentials.password === 'validPassword') {
      this._isAuthenticated = true;
      this._mockUser = MOCK_USERS[0];
      this.currentUserSubject.next(this._mockUser);
      return of(MOCK_API_RESPONSES.LOGIN_SUCCESS.data).pipe(delay(100));
    } else {
      return throwError(() => new Error('Invalid credentials'));
    }
  }

  register(userData: RegisterRequest): Observable<User> {
    if (userData.email === 'existing@example.com') {
      return throwError(() => new Error('Email already exists'));
    }
    return of(MOCK_USERS[0]).pipe(delay(100));
  }

  logout(): void {
    this._isAuthenticated = false;
    this._mockUser = null;
    this.currentUserSubject.next(null);
  }

  refreshToken(refreshToken: string): Observable<LoginResponse> {
    if (refreshToken === 'valid-refresh-token') {
      return of(MOCK_API_RESPONSES.LOGIN_SUCCESS.data).pipe(delay(100));
    }
    return throwError(() => new Error('Invalid refresh token'));
  }

  forgotPassword(email: string): Observable<void> {
    if (email === 'invalid@example.com') {
      return throwError(() => new Error('Email not found'));
    }
    return of(undefined).pipe(delay(100));
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    if (token === 'invalid-token') {
      return throwError(() => new Error('Invalid token'));
    }
    return of(undefined).pipe(delay(100));
  }

  changePassword(request: any): Observable<void> {
    if (request.currentPassword !== 'currentPassword') {
      return throwError(() => new Error('Current password is incorrect'));
    }
    return of(undefined).pipe(delay(100));
  }

  getToken(): string | null {
    return this._isAuthenticated ? 'mock-token' : null;
  }

  getRefreshToken(): string | null {
    return this._isAuthenticated ? 'mock-refresh-token' : null;
  }

  hasPermission(permission: string): boolean {
    if (!this._mockUser) return false;
    if (this._mockUser.role === 'SUPER_ADMIN') return true;
    
    switch (permission) {
      case 'VIEW_ALL_POLICIES':
      case 'MANAGE_USERS':
        return this._mockUser.role === 'ADMIN';
      default:
        return true;
    }
  }

  canAccessRoute(requiredRoles: string[]): boolean {
    return this._mockUser ? requiredRoles.includes(this._mockUser.role) : false;
  }
}

@Injectable()
export class MockTranslationService {
  private currentLang = 'en';
  private translations = MOCK_TRANSLATION_DATA;

  getCurrentLanguage(): string {
    return this.currentLang;
  }

  setLanguage(lang: string): void {
    this.currentLang = lang;
  }

  translate(key: string): string {
    const keys = key.split('.');
    let value: any = this.translations[this.currentLang];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  }

  instant(key: string, params?: any): string {
    const translation = this.translate(key);
    if (params && typeof translation === 'string') {
      return translation.replace(/{{(\w+)}}/g, (match, param) => {
        return params[param] || match;
      });
    }
    return translation;
  }

  getTranslation(key: string): Observable<string> {
    return of(this.translate(key));
  }
}

@Injectable()
export class MockNotificationService {
  showSuccess = jasmine.createSpy('showSuccess');
  showError = jasmine.createSpy('showError');
  showWarning = jasmine.createSpy('showWarning');
  showInfo = jasmine.createSpy('showInfo');
}

@Injectable()
export class MockLoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  show(): void {
    this.loadingSubject.next(true);
  }

  hide(): void {
    this.loadingSubject.next(false);
  }

  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }
}

@Injectable()
export class MockPolicyService {
  getUserPolicies(userId: string): Observable<Policy[]> {
    return of(MOCK_POLICIES.filter(p => p.customerId === userId)).pipe(delay(100));
  }

  getAllPolicies(): Observable<Policy[]> {
    return of(MOCK_POLICIES).pipe(delay(100));
  }

  getPolicyById(id: string): Observable<Policy> {
    const policy = MOCK_POLICIES.find(p => p.id === id);
    if (policy) {
      return of(policy).pipe(delay(100));
    }
    return throwError(() => new Error('Policy not found'));
  }

  createPolicy(policyData: any): Observable<Policy> {
    const newPolicy: Policy = {
      ...policyData,
      id: 'POL-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return of(newPolicy).pipe(delay(100));
  }

  updatePolicy(id: string, policyData: any): Observable<Policy> {
    const policy = MOCK_POLICIES.find(p => p.id === id);
    if (policy) {
      return of({ ...policy, ...policyData, updatedAt: new Date() }).pipe(delay(100));
    }
    return throwError(() => new Error('Policy not found'));
  }

  deletePolicy(id: string): Observable<void> {
    const policy = MOCK_POLICIES.find(p => p.id === id);
    if (policy) {
      return of(undefined).pipe(delay(100));
    }
    return throwError(() => new Error('Policy not found'));
  }
}

@Injectable()
export class MockClaimService {
  getUserClaims(userId: string): Observable<Claim[]> {
    return of(MOCK_CLAIMS.filter(c => c.customerId === userId)).pipe(delay(100));
  }

  getAllClaims(): Observable<Claim[]> {
    return of(MOCK_CLAIMS).pipe(delay(100));
  }

  getClaimById(id: string): Observable<Claim> {
    const claim = MOCK_CLAIMS.find(c => c.id === id);
    if (claim) {
      return of(claim).pipe(delay(100));
    }
    return throwError(() => new Error('Claim not found'));
  }

  createClaim(claimData: any): Observable<Claim> {
    const newClaim: Claim = {
      ...claimData,
      id: 'CLM-' + Math.random().toString(36).substr(2, 9),
      claimNumber: 'TH-CLM-2024-' + Math.random().toString(36).substr(2, 6),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return of(newClaim).pipe(delay(100));
  }

  updateClaim(id: string, claimData: any): Observable<Claim> {
    const claim = MOCK_CLAIMS.find(c => c.id === id);
    if (claim) {
      return of({ ...claim, ...claimData, updatedAt: new Date() }).pipe(delay(100));
    }
    return throwError(() => new Error('Claim not found'));
  }
}

@Injectable()
export class MockUserService {
  getAllUsers(): Observable<User[]> {
    return of(MOCK_USERS).pipe(delay(100));
  }

  getUserById(id: string): Observable<User> {
    const user = MOCK_USERS.find(u => u.id === id);
    if (user) {
      return of(user).pipe(delay(100));
    }
    return throwError(() => new Error('User not found'));
  }

  updateUser(id: string, userData: any): Observable<User> {
    const user = MOCK_USERS.find(u => u.id === id);
    if (user) {
      return of({ ...user, ...userData, updatedAt: new Date() }).pipe(delay(100));
    }
    return throwError(() => new Error('User not found'));
  }

  deleteUser(id: string): Observable<void> {
    const user = MOCK_USERS.find(u => u.id === id);
    if (user) {
      return of(undefined).pipe(delay(100));
    }
    return throwError(() => new Error('User not found'));
  }
}

// Mock HTTP Client for testing
export class MockHttpClient {
  get = jasmine.createSpy('get').and.returnValue(of({}));
  post = jasmine.createSpy('post').and.returnValue(of({}));
  put = jasmine.createSpy('put').and.returnValue(of({}));
  delete = jasmine.createSpy('delete').and.returnValue(of({}));
  patch = jasmine.createSpy('patch').and.returnValue(of({}));
}

// Mock Router for testing
export class MockRouter {
  navigate = jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true));
  navigateByUrl = jasmine.createSpy('navigateByUrl').and.returnValue(Promise.resolve(true));
  url = '/';
  events = of();
}

// Mock ActivatedRoute for testing
export class MockActivatedRoute {
  params = of({});
  queryParams = of({});
  fragment = of('');
  data = of({});
  url = of([]);
  outlet = 'primary';
  routeConfig = { path: 'test' };
  parent = null;
  firstChild = null;
  children = [];
  pathFromRoot = [];
  paramMap = of(new Map());
  queryParamMap = of(new Map());
  snapshot = {
    params: {},
    queryParams: {},
    fragment: '',
    data: {},
    url: [],
    outlet: 'primary',
    routeConfig: { path: 'test' },
    parent: null,
    firstChild: null,
    children: [],
    pathFromRoot: [],
    paramMap: new Map(),
    queryParamMap: new Map()
  };
}

// Mock Location for testing
export class MockLocation {
  back = jasmine.createSpy('back');
  forward = jasmine.createSpy('forward');
  go = jasmine.createSpy('go');
  replaceState = jasmine.createSpy('replaceState');
  getState = jasmine.createSpy('getState').and.returnValue({});
  path = jasmine.createSpy('path').and.returnValue('');
  isCurrentPathEqualTo = jasmine.createSpy('isCurrentPathEqualTo').and.returnValue(true);
  normalize = jasmine.createSpy('normalize').and.returnValue('');
  subscribe = jasmine.createSpy('subscribe');
}

export const MOCK_PROVIDERS = [
  { provide: 'AuthService', useClass: MockAuthService },
  { provide: 'TranslationService', useClass: MockTranslationService },
  { provide: 'NotificationService', useClass: MockNotificationService },
  { provide: 'LoadingService', useClass: MockLoadingService },
  { provide: 'PolicyService', useClass: MockPolicyService },
  { provide: 'ClaimService', useClass: MockClaimService },
  { provide: 'UserService', useClass: MockUserService }
];