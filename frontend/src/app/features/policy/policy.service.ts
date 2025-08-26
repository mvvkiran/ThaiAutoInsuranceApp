import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';

export interface Policy {
  id: string;
  policyNumber: string;
  licensePlate: string;
  vehicleMake: string;
  vehicleModel: string;
  year: number;
  coverageType: string;
  coverageAmount: number;
  premium: number;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING' | 'CANCELLED';
  startDate: Date;
  endDate: Date;
  holderName: string;
  createdDate?: Date;
  updatedDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private policiesSubject = new BehaviorSubject<Policy[]>(this.getInitialPolicies());
  public policies$ = this.policiesSubject.asObservable();

  constructor() {}

  getPolicies(): Observable<Policy[]> {
    return this.policies$;
  }

  getCurrentPolicies(): Policy[] {
    return this.policiesSubject.value;
  }

  addPolicy(policyData: any): Policy {
    const currentPolicies = this.getCurrentPolicies();
    
    // Generate policy number
    const policyNumber = this.generatePolicyNumber();
    
    // Create new policy object
    const newPolicy: Policy = {
      id: this.generateId(),
      policyNumber: policyNumber,
      licensePlate: policyData.licensePlate,
      vehicleMake: this.capitalizeFirst(policyData.vehicleMake),
      vehicleModel: policyData.vehicleModel,
      year: parseInt(policyData.year),
      coverageType: this.formatCoverageType(policyData.coverageType),
      coverageAmount: parseInt(policyData.coverageAmount),
      premium: Math.round(policyData.premium),
      status: 'PENDING',
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      holderName: 'ผู้เอาประกันใหม่' // Default holder name in Thai
    };

    // Add to policies list
    const updatedPolicies = [...currentPolicies, newPolicy];
    this.policiesSubject.next(updatedPolicies);
    
    return newPolicy;
  }

  /**
   * Get a policy by ID
   */
  getPolicyById(id: string): Observable<Policy> {
    const policies = this.getCurrentPolicies();
    const policy = policies.find(p => p.id === id);
    
    if (policy) {
      return of(policy);
    } else {
      return throwError(() => new Error(`Policy with ID ${id} not found`));
    }
  }

  /**
   * Update an existing policy
   */
  updatePolicy(updatedPolicy: Policy): Observable<Policy> {
    const currentPolicies = this.getCurrentPolicies();
    const index = currentPolicies.findIndex(p => p.id === updatedPolicy.id);
    
    if (index === -1) {
      return throwError(() => new Error(`Policy with ID ${updatedPolicy.id} not found`));
    }

    // Update the policy
    currentPolicies[index] = {
      ...updatedPolicy,
      updatedDate: new Date()
    };

    // Update the BehaviorSubject
    this.policiesSubject.next([...currentPolicies]);

    return of(currentPolicies[index]);
  }

  /**
   * Delete a policy
   */
  deletePolicy(policyId: string): Observable<boolean> {
    const currentPolicies = this.getCurrentPolicies();
    const index = currentPolicies.findIndex(p => p.id === policyId);
    
    if (index === -1) {
      return throwError(() => new Error(`Policy with ID ${policyId} not found`));
    }

    // Remove the policy
    const updatedPolicies = currentPolicies.filter(p => p.id !== policyId);
    this.policiesSubject.next(updatedPolicies);

    return of(true);
  }

  private generatePolicyNumber(): string {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 900) + 100; // 3 digit random number
    return `POL-${year}-${randomNum.toString().padStart(3, '0')}`;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private formatCoverageType(type: string): string {
    return type === 'third_party' ? 'Third Party' : 'Comprehensive';
  }

  private getInitialPolicies(): Policy[] {
    return [
      {
        id: '1',
        policyNumber: 'POL-2024-001',
        licensePlate: 'กก-1234 กรุงเทพมหานคร',
        vehicleMake: 'Toyota',
        vehicleModel: 'Camry',
        year: 2022,
        coverageType: 'Comprehensive',
        coverageAmount: 3000000,
        premium: 53000,
        status: 'ACTIVE',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2025-01-14'),
        holderName: 'สมชาย ใจดี'
      },
      {
        id: '2',
        policyNumber: 'POL-2024-002',
        licensePlate: 'ขข-5678 กรุงเทพมหานคร',
        vehicleMake: 'Honda',
        vehicleModel: 'Civic',
        year: 2021,
        coverageType: 'Third Party',
        coverageAmount: 1000000,
        premium: 20000,
        status: 'ACTIVE',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2025-02-28'),
        holderName: 'วิไล สวยงาม'
      },
      {
        id: '3',
        policyNumber: 'POL-2024-003',
        licensePlate: 'คค-9999 นนทบุรี',
        vehicleMake: 'Nissan',
        vehicleModel: 'Almera',
        year: 2019,
        coverageType: 'Comprehensive',
        coverageAmount: 2000000,
        premium: 42000,
        status: 'PENDING',
        startDate: new Date('2024-08-15'),
        endDate: new Date('2025-08-14'),
        holderName: 'ประยุทธ มั่นคง'
      }
    ];
  }
}