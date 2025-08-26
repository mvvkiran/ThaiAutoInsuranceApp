import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { MediaMatcher } from '@angular/cdk/layout';

import { AuthService } from './core/services/auth.service';
import { LoadingService } from './core/services/loading.service';
import { TranslationService } from './core/services/translation.service';
import { NotificationService } from './core/services/notification.service';
import { User } from './core/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private mobileQuery: MediaQueryList;
  
  title = 'Thai Auto Insurance';
  currentUser: User | null = null;
  isLoading = false;
  isAuthenticated = false;
  isMobile = false;
  sidenavOpened = true;
  currentLanguage: 'th' | 'en' = 'th';
  unreadNotifications = 0;

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    public translationService: TranslationService,
    private notificationService: NotificationService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher
  ) {
    // Setup mobile query listener
    this.mobileQuery = this.media.matchMedia('(max-width: 768px)');
    this.mobileQueryListener = () => {
      this.isMobile = this.mobileQuery.matches;
      this.sidenavOpened = !this.isMobile;
      this.changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addListener(this.mobileQueryListener);
    this.isMobile = this.mobileQuery.matches;
    this.sidenavOpened = !this.isMobile;
  }

  private mobileQueryListener: () => void;

  ngOnInit(): void {
    this.initializeApp();
    this.setupSubscriptions();
    this.setupRouterEvents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  private initializeApp(): void {
    // Initialize translation service
    this.translationService.setLanguage('th').subscribe({
      error: (error) => console.error('Failed to load translations:', error)
    });
  }

  private setupSubscriptions(): void {
    // Subscribe to authentication state
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        this.isAuthenticated = !!user;
        this.changeDetectorRef.detectChanges();
      });

    // Subscribe to loading state
    this.loadingService.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
        this.changeDetectorRef.detectChanges();
      });

    // Subscribe to language changes
    this.translationService.currentLanguage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(language => {
        this.currentLanguage = language;
        this.changeDetectorRef.detectChanges();
      });

    // Subscribe to notification count
    this.notificationService.unreadCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.unreadNotifications = count;
        this.changeDetectorRef.detectChanges();
      });
  }

  private setupRouterEvents(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event) => {
        // Close mobile menu after navigation
        if (this.isMobile) {
          this.sidenavOpened = false;
        }

        // Update page title based on route
        this.updatePageTitle((event as NavigationEnd).url);
      });
  }

  private updatePageTitle(url: string): void {
    let titleKey = 'common.appName';
    
    if (url.includes('/dashboard')) {
      titleKey = 'navigation.dashboard';
    } else if (url.includes('/policies')) {
      titleKey = 'navigation.policies';
    } else if (url.includes('/claims')) {
      titleKey = 'navigation.claims';
    } else if (url.includes('/profile')) {
      titleKey = 'navigation.profile';
    } else if (url.includes('/admin')) {
      titleKey = 'navigation.admin';
    }

    const translatedTitle = this.translationService.instant(titleKey);
    document.title = `${translatedTitle} | Thai Auto Insurance`;
  }

  // Public methods for template
  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  toggleLanguage(): void {
    this.translationService.toggleLanguage().subscribe({
      error: (error) => console.error('Failed to toggle language:', error)
    });
  }

  logout(): void {
    this.authService.logout();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    
    // Close mobile menu
    if (this.isMobile) {
      this.sidenavOpened = false;
    }
  }

  // Navigation menu items
  getNavigationItems(): Array<{ route: string; icon: string; labelKey: string; requiresAuth: boolean }> {
    return [
      { route: '/dashboard', icon: 'dashboard', labelKey: 'navigation.dashboard', requiresAuth: true },
      { route: '/policies', icon: 'description', labelKey: 'navigation.policies', requiresAuth: true },
      { route: '/claims', icon: 'assignment', labelKey: 'navigation.claims', requiresAuth: true },
      { route: '/profile', icon: 'person', labelKey: 'navigation.profile', requiresAuth: true }
      // Admin link is shown separately in the admin section below
    ];
  }

  // Check if user can access admin routes
  canAccessAdmin(): boolean {
    return this.authService.isAdmin;
  }

  // Check if current route is active
  isRouteActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  // Format user display name
  getUserDisplayName(): string {
    if (!this.currentUser) return '';
    
    if (this.currentLanguage === 'th' && this.currentUser.firstNameThai && this.currentUser.lastNameThai) {
      return `${this.currentUser.firstNameThai} ${this.currentUser.lastNameThai}`;
    }
    
    return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
  }

  // Get user role display
  getUserRoleDisplay(): string {
    if (!this.currentUser) return '';
    
    return this.translationService.instant(`user.role.${this.currentUser.role}`);
  }
}