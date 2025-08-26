import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';

import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminUsersComponent } from './admin-users.component';
import { AdminCustomersComponent } from './admin-customers.component';
import { AdminPoliciesComponent } from './admin-policies.component';

const routes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'users', component: AdminUsersComponent },
  { path: 'customers', component: AdminCustomersComponent },
  { path: 'policies', component: AdminPoliciesComponent }
];

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminUsersComponent,
    AdminCustomersComponent,
    AdminPoliciesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule { }