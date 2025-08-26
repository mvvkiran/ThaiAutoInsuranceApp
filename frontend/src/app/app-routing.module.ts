import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  // Default route - redirect to dashboard if authenticated, login if not
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  
  // Authentication routes (lazy loaded)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  
  // Dashboard route (protected)
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  
  // Customer routes (protected)
  {
    path: 'customer',
    loadChildren: () => import('./features/customer/customer.module').then(m => m.CustomerModule),
    canActivate: [AuthGuard]
  },
  
  // Policy routes (protected)
  {
    path: 'policies',
    loadChildren: () => import('./features/policy/policy.module').then(m => m.PolicyModule),
    canActivate: [AuthGuard]
  },
  
  // Claims routes (protected)
  {
    path: 'claims',
    loadChildren: () => import('./features/claims/claims.module').then(m => m.ClaimsModule),
    canActivate: [AuthGuard]
  },
  
  // Admin routes (protected with role check)
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      roles: ['ADMIN', 'SUPER_ADMIN'] 
    }
  },
  
  // Profile and settings routes (protected)
  {
    path: 'profile',
    loadChildren: () => import('./features/customer/customer.module').then(m => m.CustomerModule),
    canActivate: [AuthGuard]
  },
  
  // Catch all route - redirect to dashboard
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // Enable router tracing for debugging (only in development)
    enableTracing: false, // Set to true for debugging
    // Preload all lazy loaded modules for better performance
    preloadingStrategy: undefined, // Can use PreloadAllModules if needed
    // Scroll to top on route change
    scrollPositionRestoration: 'top',
    // Hash location strategy for deployment compatibility
    useHash: false
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }