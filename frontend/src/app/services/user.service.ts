import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserCreate, UserUpdate, Role, RoleCreate, RoleUpdate } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  // Utilisateurs
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  createUser(data: UserCreate): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, data);
  }

  updateUser(id: number, data: UserUpdate): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, data);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  assignRole(userId: number, roleId: number): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/${userId}/role`, { roleId });
  }

  // Rôles
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/roles`);
  }

  createRole(data: RoleCreate): Observable<Role> {
    return this.http.post<Role>(`${this.apiUrl}/roles`, data);
  }

  updateRole(id: number, data: RoleUpdate): Observable<Role> {
    return this.http.put<Role>(`${this.apiUrl}/roles/${id}`, data);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/roles/${id}`);
  }
} 