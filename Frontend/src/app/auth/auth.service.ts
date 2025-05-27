import {Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoginRequest, RegisterRequest, RegisterResponse, Role, User} from './models/authModels';
import {map, Observable} from 'rxjs';

// other imports...

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  currentUser = signal<User | null>(null);
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserRole: Role | null = null;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user: User = JSON.parse(storedUser);
      this.currentUser.set(user);
      this.currentUserRole = user.role === "ADMIN" ? Role.ADMIN : Role.USER;
    }
  }

  login(credentials: LoginRequest): Observable<string> {
    return this.http.post<{ token: string; role: string }>(`${this.apiUrl}/login`, credentials).pipe(
      map(response => {
        const { token, role } = response;

        localStorage.setItem('token', token);

        const user: User = {
          email: credentials.email,
          role: role
        };

        this.currentUserRole = user.role === "ADMIN" ? Role.ADMIN : Role.USER;
        console.log(this.currentUserRole)

        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser.set(user);

        return token;
      })
    );
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, data);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setRole(role: Role) {
    this.currentUserRole = role;
  }

  getRole(): string | null {
    return this.currentUserRole ?? null;
  }

  isAdmin(): boolean {
    return this.currentUserRole === Role.ADMIN;
  }

  isUser(): boolean {
    return this.currentUserRole === Role.USER;
  }
}
