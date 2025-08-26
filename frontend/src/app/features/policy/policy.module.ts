import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { PolicyListComponent } from './policy-list.component';
import { PolicyNewComponent } from './policy-new.component';
import { PolicyDetailComponent } from './policy-detail.component';
import { PolicyEditComponent } from './policy-edit.component';

const routes: Routes = [
  { path: '', component: PolicyListComponent },
  { path: 'new', component: PolicyNewComponent },
  { path: 'edit/:id', component: PolicyEditComponent },
  { path: ':id', component: PolicyDetailComponent }
];

@NgModule({
  declarations: [
    PolicyListComponent,
    PolicyNewComponent,
    PolicyDetailComponent,
    PolicyEditComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class PolicyModule { }