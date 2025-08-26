import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, User } from '../models';

export interface AdminDashboardStats {
  totalUsers: number;
  totalCustomers: number;
  totalPolicies: number;
  totalRevenue: number;
}

export interface PagedResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<AdminDashboardStats> {
    return this.http.get<ApiResponse<AdminDashboardStats>>(`${this.apiUrl}/dashboard`)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Failed to load dashboard statistics');
          }
          return response.data;
        })
      );
  }

  getAllUsers(page: number = 0, size: number = 10, sortBy: string = 'createdAt', sortDir: string = 'desc'): Observable<PagedResult<User>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<ApiResponse<PagedResult<User>>>(`${this.apiUrl}/users`, { params })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Failed to load users');
          }
          return response.data;
        })
      );
  }

  getAllCustomers(page: number = 0, size: number = 10, sortBy: string = 'createdAt', sortDir: string = 'desc'): Observable<PagedResult<any>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<ApiResponse<PagedResult<any>>>(`${this.apiUrl}/customers`, { params })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Failed to load customers');
          }
          return response.data;
        })
      );
  }

  getAllPolicies(page: number = 0, size: number = 10, sortBy: string = 'createdAt', sortDir: string = 'desc'): Observable<PagedResult<any>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<ApiResponse<PagedResult<any>>>(`${this.apiUrl}/policies`, { params })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Failed to load policies');
          }
          return response.data;
        })
      );
  }

  searchUsers(query: string, page: number = 0, size: number = 10): Observable<PagedResult<User>> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<PagedResult<User>>>(`${this.apiUrl}/users/search`, { params })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Failed to search users');
          }
          return response.data;
        })
      );
  }

  searchCustomers(query: string, page: number = 0, size: number = 10): Observable<PagedResult<any>> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<PagedResult<any>>>(`${this.apiUrl}/customers/search`, { params })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Failed to search customers');
          }
          return response.data;
        })
      );
  }

  // User CRUD operations
  createUser(user: User): Observable<User> {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/users`, user)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Failed to create user');
          }
          return response.data;
        })
      );
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/users/${id}`)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Failed to get user');
          }
          return response.data;
        })
      );
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/users/${id}`, user)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Failed to update user');
          }
          return response.data;
        })
      );
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/users/${id}`)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message || 'Failed to delete user');
          }
          return;
        })
      );
  }

  toggleUserStatus(id: string): Observable<User> {
    return this.http.patch<ApiResponse<User>>(`${this.apiUrl}/users/${id}/status`, {})
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Failed to toggle user status');
          }
          return response.data;
        })
      );
  }
}