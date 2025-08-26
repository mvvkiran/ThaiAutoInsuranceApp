import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { MOCK_USERS } from '../../test-helpers/test-data';
import { User } from '../models';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let currentUserSubject: BehaviorSubject<User | null>;

  beforeEach(() => {
    currentUserSubject = new BehaviorSubject<User | null>(null);
    
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['hasPermission'], {
      currentUser$: currentUserSubject.asObservable()
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  describe('canActivate', () => {
    let route: ActivatedRouteSnapshot;
    let state: RouterStateSnapshot;

    beforeEach(() => {
      route = new ActivatedRouteSnapshot();
      state = { url: '/dashboard', root: route } as RouterStateSnapshot;
    });

    it('should allow access when user is authenticated', (done) => {
      currentUserSubject.next(MOCK_USERS[0]);

      const result = guard.canActivate(route, state);
      
      if (result instanceof Promise) {
        result.then(canActivate => {
          expect(canActivate).toBeTrue();
          expect(router.navigate).not.toHaveBeenCalled();
          done();
        });
      } else if (typeof result === 'object' && result.subscribe) {
        result.subscribe(canActivate => {
          expect(canActivate).toBeTrue();
          expect(router.navigate).not.toHaveBeenCalled();
          done();
        });
      } else {
        expect(result).toBeTrue();
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      }
    });

    it('should deny access and redirect to login when user is not authenticated', (done) => {
      currentUserSubject.next(null);

      const result = guard.canActivate(route, state);
      
      if (result instanceof Promise) {
        result.then(canActivate => {
          expect(canActivate).toBeFalse();
          expect(router.navigate).toHaveBeenCalledWith(['/auth/login'], {
            queryParams: { returnUrl: '/dashboard' }
          });
          done();
        });
      } else if (typeof result === 'object' && result.subscribe) {
        result.subscribe(canActivate => {
          expect(canActivate).toBeFalse();
          expect(router.navigate).toHaveBeenCalledWith(['/auth/login'], {
            queryParams: { returnUrl: '/dashboard' }
          });
          done();
        });
      } else {
        expect(canActivate).toBeFalse();
        expect(router.navigate).toHaveBeenCalledWith(['/auth/login'], {
          queryParams: { returnUrl: '/dashboard' }
        });
        done();
      }
    });

    it('should handle different URLs correctly', (done) => {
      const customState = { url: '/admin/users', root: route } as RouterStateSnapshot;
      currentUserSubject.next(null);

      const result = guard.canActivate(route, customState);
      
      if (result instanceof Promise) {
        result.then(() => {
          expect(router.navigate).toHaveBeenCalledWith(['/auth/login'], {
            queryParams: { returnUrl: '/admin/users' }
          });
          done();
        });
      } else if (typeof result === 'object' && result.subscribe) {
        result.subscribe(() => {
          expect(router.navigate).toHaveBeenCalledWith(['/auth/login'], {
            queryParams: { returnUrl: '/admin/users' }
          });
          done();
        });
      } else {
        expect(router.navigate).toHaveBeenCalledWith(['/auth/login'], {
          queryParams: { returnUrl: '/admin/users' }
        });
        done();
      }
    });

    it('should take only one emission from currentUser$', (done) => {
      let emissionCount = 0;
      
      // Override the currentUser$ observable to count emissions
      const testSubject = new BehaviorSubject<User | null>(MOCK_USERS[0]);
      Object.defineProperty(authService, 'currentUser$', {
        get: () => testSubject.asObservable().pipe(
          // Count emissions
          (source: any) => source.subscribe({
            next: (value: any) => {
              emissionCount++;
              return value;
            }
          })
        )
      });

      const result = guard.canActivate(route, state);
      
      if (typeof result === 'object' && result.subscribe) {
        result.subscribe(() => {
          // Emit another value to test that guard doesn't react to it
          testSubject.next(MOCK_USERS[1]);
          
          setTimeout(() => {
            expect(emissionCount).toBeLessThanOrEqual(1);
            done();
          }, 10);
        });
      } else {
        done();
      }
    });
  });

  describe('canActivateChild', () => {
    let childRoute: ActivatedRouteSnapshot;
    let state: RouterStateSnapshot;

    beforeEach(() => {
      childRoute = new ActivatedRouteSnapshot();
      state = { url: '/dashboard/profile', root: childRoute } as RouterStateSnapshot;
    });

    it('should allow child route access when user is authenticated', (done) => {
      currentUserSubject.next(MOCK_USERS[0]);

      const result = guard.canActivateChild(childRoute, state);
      
      if (result instanceof Promise) {
        result.then(canActivate => {
          expect(canActivate).toBeTrue();
          expect(router.navigate).not.toHaveBeenCalled();
          done();
        });
      } else if (typeof result === 'object' && result.subscribe) {
        result.subscribe(canActivate => {
          expect(canActivate).toBeTrue();
          expect(router.navigate).not.toHaveBeenCalled();
          done();
        });
      } else {
        expect(result).toBeTrue();
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      }
    });

    it('should deny child route access and redirect when user is not authenticated', (done) => {
      currentUserSubject.next(null);

      const result = guard.canActivateChild(childRoute, state);
      
      if (result instanceof Promise) {
        result.then(canActivate => {
          expect(canActivate).toBeFalse();
          expect(router.navigate).toHaveBeenCalledWith(['/auth/login'], {
            queryParams: { returnUrl: '/dashboard/profile' }
          });
          done();
        });
      } else if (typeof result === 'object' && result.subscribe) {
        result.subscribe(canActivate => {
          expect(canActivate).toBeFalse();
          expect(router.navigate).toHaveBeenCalledWith(['/auth/login'], {
            queryParams: { returnUrl: '/dashboard/profile' }
          });
          done();
        });
      } else {
        expect(canActivate).toBeFalse();
        expect(router.navigate).toHaveBeenCalledWith(['/auth/login'], {
          queryParams: { returnUrl: '/dashboard/profile' }
        });
        done();
      }
    });
  });

  describe('Authentication State Changes', () => {
    let route: ActivatedRouteSnapshot;
    let state: RouterStateSnapshot;

    beforeEach(() => {
      route = new ActivatedRouteSnapshot();
      state = { url: '/dashboard', root: route } as RouterStateSnapshot;
    });

    it('should handle authentication state changing from null to user', (done) => {
      // Start with unauthenticated state
      currentUserSubject.next(null);

      const result = guard.canActivate(route, state);
      
      if (typeof result === 'object' && result.subscribe) {
        result.subscribe(canActivate => {
          expect(canActivate).toBeFalse();
          expect(router.navigate).toHaveBeenCalledWith(['/auth/login'], {
            queryParams: { returnUrl: '/dashboard' }
          });
          done();
        });
      } else {
        expect(result).toBeFalse();
        done();
      }

      // Change to authenticated state (should not affect the current check due to take(1))
      currentUserSubject.next(MOCK_USERS[0]);
    });

    it('should handle authentication state changing from user to null', (done) => {
      // Start with authenticated state
      currentUserSubject.next(MOCK_USERS[0]);

      const result = guard.canActivate(route, state);
      
      if (typeof result === 'object' && result.subscribe) {
        result.subscribe(canActivate => {
          expect(canActivate).toBeTrue();
          expect(router.navigate).not.toHaveBeenCalled();
          done();
        });
      } else {
        expect(result).toBeTrue();
        done();
      }

      // Change to unauthenticated state (should not affect the current check due to take(1))
      currentUserSubject.next(null);
    });
  });

  describe('Edge Cases', () => {
    let route: ActivatedRouteSnapshot;
    let state: RouterStateSnapshot;

    beforeEach(() => {
      route = new ActivatedRouteSnapshot();
      state = { url: '', root: route } as RouterStateSnapshot;
    });

    it('should handle empty URL', (done) => {
      currentUserSubject.next(null);

      const result = guard.canActivate(route, state);
      
      if (typeof result === 'object' && result.subscribe) {
        result.subscribe(() => {
          expect(router.navigate).toHaveBeenCalledWith(['/auth/login'], {
            queryParams: { returnUrl: '' }
          });
          done();
        });
      } else {
        done();
      }
    });

    it('should handle root URL', (done) => {
      const rootState = { url: '/', root: route } as RouterStateSnapshot;
      currentUserSubject.next(null);

      const result = guard.canActivate(route, rootState);
      
      if (typeof result === 'object' && result.subscribe) {
        result.subscribe(() => {
          expect(router.navigate).toHaveBeenCalledWith(['/auth/login'], {
            queryParams: { returnUrl: '/' }
          });
          done();
        });
      } else {
        done();
      }
    });

    it('should handle URLs with query parameters', (done) => {
      const queryState = { url: '/dashboard?tab=policies', root: route } as RouterStateSnapshot;
      currentUserSubject.next(null);

      const result = guard.canActivate(route, queryState);
      
      if (typeof result === 'object' && result.subscribe) {
        result.subscribe(() => {
          expect(router.navigate).toHaveBeenCalledWith(['/auth/login'], {
            queryParams: { returnUrl: '/dashboard?tab=policies' }
          });
          done();
        });
      } else {
        done();
      }
    });

    it('should handle URLs with fragments', (done) => {
      const fragmentState = { url: '/dashboard#section1', root: route } as RouterStateSnapshot;
      currentUserSubject.next(null);

      const result = guard.canActivate(route, fragmentState);
      
      if (typeof result === 'object' && result.subscribe) {
        result.subscribe(() => {
          expect(router.navigate).toHaveBeenCalledWith(['/auth/login'], {
            queryParams: { returnUrl: '/dashboard#section1' }
          });
          done();
        });
      } else {
        done();
      }
    });
  });

  describe('Different User Types', () => {
    let route: ActivatedRouteSnapshot;
    let state: RouterStateSnapshot;

    beforeEach(() => {
      route = new ActivatedRouteSnapshot();
      state = { url: '/dashboard', root: route } as RouterStateSnapshot;
    });

    it('should allow access for customer user', (done) => {
      currentUserSubject.next(MOCK_USERS[0]); // Customer user

      const result = guard.canActivate(route, state);
      
      if (typeof result === 'object' && result.subscribe) {
        result.subscribe(canActivate => {
          expect(canActivate).toBeTrue();
          done();
        });
      } else {
        expect(result).toBeTrue();
        done();
      }
    });

    it('should allow access for admin user', (done) => {
      currentUserSubject.next(MOCK_USERS[1]); // Admin user

      const result = guard.canActivate(route, state);
      
      if (typeof result === 'object' && result.subscribe) {
        result.subscribe(canActivate => {
          expect(canActivate).toBeTrue();
          done();
        });
      } else {
        expect(result).toBeTrue();
        done();
      }
    });

    it('should allow access for super admin user', (done) => {
      currentUserSubject.next(MOCK_USERS[2]); // Super admin user

      const result = guard.canActivate(route, state);
      
      if (typeof result === 'object' && result.subscribe) {
        result.subscribe(canActivate => {
          expect(canActivate).toBeTrue();
          done();
        });
      } else {
        expect(result).toBeTrue();
        done();
      }
    });
  });
});