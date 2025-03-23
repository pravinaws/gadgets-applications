import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('token'); // Remove token
    this.router.navigate(['/login']); // Redirect to login
  }
}
