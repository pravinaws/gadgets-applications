import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isAuthenticated = !!localStorage.getItem('token'); // Check if token exists

  if (!isAuthenticated) {
    router.navigate(['/login']); // Redirect to login if not authenticated
    return false;
  }
  
  return true; // Allow access if authenticated
};
