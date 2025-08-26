import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { ClaimsListComponent } from './claims-list.component';
import { ClaimsNewComponent } from './claims-new.component';

const routes: Routes = [
  { path: '', component: ClaimsListComponent },
  { path: 'new', component: ClaimsNewComponent }
];

@NgModule({
  declarations: [
    ClaimsListComponent,
    ClaimsNewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ClaimsModule { }