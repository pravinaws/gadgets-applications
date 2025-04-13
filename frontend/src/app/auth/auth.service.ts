import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_BASE_URL } from '../common/constants';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  getCountryCode(): any {
    return this.http.get<any>('https://ipapi.co/json/').pipe(
      map(res => res.country_calling_code || '+91'),
      catchError((err) => {
        console.error('Error fetching country code:', err);
        return of('+91'); // fallback
      })
    );
  }
  

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
    this.http.post<any>(`${API_BASE_URL}/auth/login`, { email, password })
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

  sendOtp(phone: string,channel : string) {
    return this.http.post<any>(`${API_BASE_URL}/auth/send-otp`, {phone, channel});
  }

  verifyOtp(phone: string, code: number, name:string) {
    return this.http.post<any>(`${API_BASE_URL}/auth/verify-otp`, { phone, code, name });
  }
  
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
