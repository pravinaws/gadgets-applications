import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_BASE_URL } from '../common/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  register(name: string, email: string, password: string) {
    this.http.post(`${API_BASE_URL}/auth/register`, { name, email, password })
      .subscribe({
        next: () => {
          alert('Registration successful! Please log in.');
          this.router.navigate(['/login']);
        },
        error: () => alert('Registration failed. Please try again.')
      });
  }

  login(email: string, password: string) {
    this.http.post<{ token: string }>(`${API_BASE_URL}/auth/login`, { email, password })
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/gadgets/list']);
        },
        error: () => alert('Login failed. Please check your credentials.')
      });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
