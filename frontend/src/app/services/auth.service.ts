import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
}

export interface LoginResponse {
  token: string;
  user: UserProfile;
}

// Backend API response structure
interface ApiLoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    tokenType: string;
    expiresIn: number;
    username: string;
    email: string;
    role: string;
    loginTime: string;
  };
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api/auth';
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  init(): Promise<boolean> {
    const token = this.getToken();
    if (token) {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<ApiLoginResponse>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        map(apiResponse => {
          // Transform API response to expected LoginResponse format
          const user: UserProfile = {
            id: 0, // Backend doesn't return ID in login response
            username: apiResponse.data.username,
            email: apiResponse.data.email,
            roles: [apiResponse.data.role]
          };

          return {
            token: apiResponse.data.token,
            user: user
          };
        }),
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): Observable<UserProfile | null> {
    return this.currentUser$;
  }

  private loadStoredUser(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Error parsing stored user', e);
      }
    }
  }
}