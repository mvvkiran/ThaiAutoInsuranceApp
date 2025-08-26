import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { RoleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { MOCK_USERS } from '../../test-helpers/test-data';
import { User } from '../models';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let currentUserSubject: BehaviorSubject<User | null>;

  beforeEach(() => {
    currentUserSubject = new BehaviorSubject<User | null>(null);
    
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['canAccessRoute'], {
      currentUser$: currentUserSubject.asObservable()
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', 
      ['showError', 'showSuccess', 'showWarning', 'showInfo']
    );

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        RoleGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    });

    guard = TestBed.inject(RoleGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  describe('canActivate', () => {
    let route: ActivatedRouteSnapshot;
    let state: RouterStateSnapshot;

    beforeEach(() => {
      route = new ActivatedRouteSnapshot();
      state = { url: '/admin/users', root: route } as RouterStateSnapshot;
    });

    it('should allow access when user has required role', (done) => {
      route.data = { roles: ['ADMIN'] };
      currentUserSubject.next(MOCK_USERS[1]); // Admin user
      authService.canAccessRoute.and.returnValue(true);

      const result = guard.canActivate(route, state);
      
      if (typeof result === 'object' && result.subscribe) {
        result.subscribe(canActivate => {
          expect(canActivate).toBeTrue();
          expect(authService.canAccessRoute).toHaveBeenCalledWith(['ADMIN']);
          expect(router.navigate).not.toHaveBeenCalled();
          expect(notificationService.showError).not.toHaveBeenCalled();
          done();
        });
      } else {
        expect(result).toBeTrue();
        done();
      }
    });

    it('should deny access when user does not have required role', (done) => {
      route.data = { roles: ['ADMIN'] };
      currentUserSubject.next(MOCK_USERS[0]); // Customer user
      authService.canAccessRoute.and.returnValue(false);

      const result = guard.canActivate(route, state);
      
      if (typeof result === 'object' && result.subscribe) {
        result.subscribe(canActivate => {
          expect(canActivate).toBeFalse();
          expect(authService.canAccessRoute).toHaveBeenCalledWith(['ADMIN']);
          expect(notificationService.showError).toHaveBeenCalledWith(
            'คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้ / You don\'t have permission to access this page'
          );
          expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
          done();
        });
      } else {
        expect(canActivate).toBeFalse();
        done();
      }
    });

    it('should deny access and redirect to login when user is not authenticated', (done) => {
      route.data = { roles: ['ADMIN'] };
      currentUserSubject.next(null);

      const result = guard.canActivate(route, state);
      
      if (typeof result === 'object' && result.subscribe) {
        result.subscribe(canActivate => {
          expect(canActivate).toBeFalse();
          expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
          expect(notificationService.showError).not.toHaveBeenCalled();
          done();
        });
      } else {
        expect(canActivate).toBeFalse();
        done();
      }
    });

    it('should allow access when no roles are specified', (done) => {
      route.data = {}; // No roles specified
      currentUserSubject.next(MOCK_USERS[0]); // Any authenticated user

      const result = guard.canActivate(route, state);
      
      if (typeof result === 'object' && result.subscribe) {
        result.subscribe(canActivate => {
          expect(canActivate).toBeTrue();
          expect(authService.canAccessRoute).not.toHaveBeenCalled();
          expect(router.navigate).not.toHaveBeenCalled();
          expect(notificationService.showError).not.toHaveBeenCalled();
          done();
        });
      } else {
        expect(result).toBeTrue();
        done();
      }
    });

    it('should allow access when roles array is empty', (done) => {
      route.data = { roles: [] };
      currentUserSubject.next(MOCK_USERS[0]); // Any authenticated user

      const result = guard.canActivate(route, state);
      
      if (typeof result === 'object' && result.subscribe) {
        result.subscribe(canActivate => {
          expect(canActivate).toBeTrue();
          expect(authService.canAccessRoute).not.toHaveBeenCalled();
          expect(router.navigate).not.toHaveBeenCalled();
          expect(notificationService.showError).not.toHaveBeenCalled();
          done();
        });
      } else {
        expect(result).toBeTrue();
        done();
      }
    });

    it('should allow access when user has one of multiple required roles', (done) => {
      route.data = { roles: ['ADMIN', 'SUPER_ADMIN'] };
      currentUserSubject.next(MOCK_USERS[1]); // Admin user
      authService.canAccessRoute.and.returnValue(true);

      const result = guard.canActivate(route, state);
      
      if (typeof result === 'object' && result.subscribe) {
        result.subscribe(canActivate => {
          expect(canActivate).toBeTrue();
          expect(authService.canAccessRoute).toHaveBeenCalledWith(['ADMIN', 'SUPER_ADMIN']);
          done();
        });
      } else {
        expect(result).toBeTrue();
        done();
      }
    });

    it('should deny access when user has none of the multiple required roles', (done) => {
      route.data = { roles: ['ADMIN', 'SUPER_ADMIN'] };
      currentUserSubject.next(MOCK_USERS[0]); // Customer user
      authService.canAccessRoute.and.returnValue(false);

      const result = guard.canActivate(route, state);
      
      if (typeof result === 'object' && result.subscribe) {
        result.subscribe(canActivate => {
          expect(canActivate).toBeFalse();
          expect(authService.canAccessRoute).toHaveBeenCalledWith(['ADMIN', 'SUPER_ADMIN']);
          expect(notificationService.showError).toHaveBeenCalled();
          expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
          done();
        });
      } else {
        expect(canActivate).toBeFalse();
        done();
      }
    });
  });

  describe('Role-specific Scenarios', () => {
    let route: ActivatedRouteSnapshot;
    let state: RouterStateSnapshot;

    beforeEach(() => {
      route = new ActivatedRouteSnapshot();
      state = { url: '/admin', root: route } as RouterStateSnapshot;
    });

    it('should allow SUPER_ADMIN access to admin routes', (done) => {
      route.data = { roles: ['ADMIN'] };
      currentUserSubject.next(MOCK_USERS[2]); // Super admin user
      authService.canAccessRoute.and.returnValue(true);

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

    it('should deny CUSTOMER access to admin routes', (done) => {
      route.data = { roles: ['ADMIN'] };
      currentUserSubject.next(MOCK_USERS[0]); // Customer user
      authService.canAccessRoute.and.returnValue(false);

      const result = guard.canActivate(route, state);
      
      if (typeof result === 'object' && result.subscribe) {
        result.subscribe(canActivate => {
          expect(canActivate).toBeFalse();
          expect(notificationService.showError).toHaveBeenCalled();
          done();
        });
      } else {
        expect(canActivate).toBeFalse();
        done();
      }
    });

    it('should handle CUSTOMER role requirement', (done) => {
      route.data = { roles: ['CUSTOMER'] };
      currentUserSubject.next(MOCK_USERS[0]); // Customer user
      authService.canAccessRoute.and.returnValue(true);

      const result = guard.canActivate(route, state);
      
      if (typeof result === 'object' && result.subscribe) {
        result.subscribe(canActivate => {
          expect(canActivate).toBeTrue();
          expect(authService.canAccessRoute).toHaveBeenCalledWith(['CUSTOMER']);
          done();
        });
      } else {
        expect(result).toBeTrue();
        done();
      }
    });
  });

  describe('Edge Cases', () => {
    let route: ActivatedRouteSnapshot;
    let state: RouterStateSnapshot;

    beforeEach(() => {
      route = new ActivatedRouteSnapshot();
      state = { url: '/test', root: route } as RouterStateSnapshot;
    });

    it('should handle route with null data', (done) => {
      route.data = null as any;
      currentUserSubject.next(MOCK_USERS[0]);

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

    it('should handle route with undefined data', (done) => {
      route.data = undefined as any;
      currentUserSubject.next(MOCK_USERS[0]);

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

    it('should handle invalid role type in route data', (done) => {
      route.data = { roles: 'ADMIN' }; // Should be array, not string
      currentUserSubject.next(MOCK_USERS[1]);
      authService.canAccessRoute.and.returnValue(true);

      const result = guard.canActivate(route, state);
      
      if (typeof result === 'object' && result.subscribe) {
        result.subscribe(canActivate => {
          // Should handle gracefully - the canAccessRoute method should be called with the string
          expect(authService.canAccessRoute).toHaveBeenCalledWith('ADMIN');
          done();
        });
      } else {
        done();
      }
    });

    it('should handle case-sensitive role matching', (done) => {
      route.data = { roles: ['admin'] }; // lowercase
      currentUserSubject.next(MOCK_USERS[1]); // Admin user (uppercase role)
      authService.canAccessRoute.and.returnValue(false); // Should not match

      const result = guard.canActivate(route, state);
      
      if (typeof result === 'object' && result.subscribe) {
        result.subscribe(canActivate => {
          expect(canActivate).toBeFalse();
          expect(authService.canAccessRoute).toHaveBeenCalledWith(['admin']);
          done();
        });
      } else {
        expect(canActivate).toBeFalse();
        done();
      }
    });
  });

  describe('Navigation and Notifications', () => {
    let route: ActivatedRouteSnapshot;
    let state: RouterStateSnapshot;

    beforeEach(() => {
      route = new ActivatedRouteSnapshot();
      state = { url: '/admin/settings', root: route } as RouterStateSnapshot;
    });

    it('should show correct error message when access is denied', (done) => {
      route.data = { roles: ['ADMIN'] };
      currentUserSubject.next(MOCK_USERS[0]); // Customer user
      authService.canAccessRoute.and.returnValue(false);

      const result = guard.canActivate(route, state);
      
      if (typeof result === 'object' && result.subscribe) {
        result.subscribe(() => {
          expect(notificationService.showError).toHaveBeenCalledWith(
            'คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้ / You don\'t have permission to access this page'
          );
          done();
        });
      } else {
        done();
      }
    });

    it('should navigate to dashboard when access is denied due to insufficient role', (done) => {
      route.data = { roles: ['ADMIN'] };
      currentUserSubject.next(MOCK_USERS[0]); // Customer user
      authService.canAccessRoute.and.returnValue(false);

      const result = guard.canActivate(route, state);
      
      if (typeof result === 'object' && result.subscribe) {
        result.subscribe(() => {
          expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
          done();
        });
      } else {
        done();
      }
    });

    it('should navigate to login when user is not authenticated', (done) => {
      route.data = { roles: ['ADMIN'] };
      currentUserSubject.next(null);

      const result = guard.canActivate(route, state);
      
      if (typeof result === 'object' && result.subscribe) {
        result.subscribe(() => {
          expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
          done();
        });
      } else {
        done();
      }
    });

    it('should not show error notification when redirecting unauthenticated user', (done) => {
      route.data = { roles: ['ADMIN'] };
      currentUserSubject.next(null);

      const result = guard.canActivate(route, state);
      
      if (typeof result === 'object' && result.subscribe) {
        result.subscribe(() => {
          expect(notificationService.showError).not.toHaveBeenCalled();
          done();
        });
      } else {
        done();
      }
    });
  });

  describe('Multiple Role Combinations', () => {
    let route: ActivatedRouteSnapshot;
    let state: RouterStateSnapshot;

    beforeEach(() => {
      route = new ActivatedRouteSnapshot();
      state = { url: '/test', root: route } as RouterStateSnapshot;
    });

    it('should handle single role requirement', (done) => {
      route.data = { roles: ['CUSTOMER'] };
      currentUserSubject.next(MOCK_USERS[0]); // Customer user
      authService.canAccessRoute.and.returnValue(true);

      const result = guard.canActivate(route, state);
      
      if (typeof result === 'object' && result.subscribe) {
        result.subscribe(canActivate => {
          expect(canActivate).toBeTrue();
          expect(authService.canAccessRoute).toHaveBeenCalledWith(['CUSTOMER']);
          done();
        });
      } else {
        expect(result).toBeTrue();
        done();
      }
    });

    it('should handle multiple role requirements', (done) => {
      route.data = { roles: ['ADMIN', 'SUPER_ADMIN', 'MANAGER'] };
      currentUserSubject.next(MOCK_USERS[2]); // Super admin user
      authService.canAccessRoute.and.returnValue(true);

      const result = guard.canActivate(route, state);
      
      if (typeof result === 'object' && result.subscribe) {
        result.subscribe(canActivate => {
          expect(canActivate).toBeTrue();
          expect(authService.canAccessRoute).toHaveBeenCalledWith(['ADMIN', 'SUPER_ADMIN', 'MANAGER']);
          done();
        });
      } else {
        expect(result).toBeTrue();
        done();
      }
    });
  });

  describe('Observable Behavior', () => {
    let route: ActivatedRouteSnapshot;
    let state: RouterStateSnapshot;

    beforeEach(() => {
      route = new ActivatedRouteSnapshot();
      state = { url: '/test', root: route } as RouterStateSnapshot;
    });

    it('should complete after one emission', (done) => {
      route.data = { roles: ['ADMIN'] };
      currentUserSubject.next(MOCK_USERS[1]);
      authService.canAccessRoute.and.returnValue(true);

      let completedCalled = false;

      const result = guard.canActivate(route, state);
      
      if (typeof result === 'object' && result.subscribe) {
        result.subscribe({
          next: () => {
            // Emit another value to test that guard doesn't react
            currentUserSubject.next(MOCK_USERS[0]);
          },
          complete: () => {
            completedCalled = true;
          }
        });

        setTimeout(() => {
          expect(completedCalled).toBeTrue();
          done();
        }, 10);
      } else {
        done();
      }
    });
  });
});