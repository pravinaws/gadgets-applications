import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_BASE_URL } from '../../common/constants';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;
  showGadgetsMenu = false;

  userProfile = {
    name: '',
    email: '',
    picture: 'https://static.vecteezy.com/system/resources/thumbnails/029/271/062/small_2x/avatar-profile-icon-in-flat-style-male-user-profile-illustration-on-isolated-background-man-profile-sign-business-concept-vector.jpg'
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.getUserDetails();
  }

  getUserDetails() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found! Redirecting to login.');
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<{ name: string; email: string; picture?: string }>(`${API_BASE_URL}/auth/user/3`, { headers })
      .subscribe({
        next: (data) => {
          this.userProfile = {
            name: data.name,
            email: data.email,
            picture: data.picture || this.userProfile.picture
          };
        },
        error: (err) => console.error('Error fetching user details:', err)
      });
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleGadgetsMenu() {
    this.showGadgetsMenu = !this.showGadgetsMenu;
  }

  logout() {
    localStorage.removeItem('token'); // Remove token
    this.router.navigate(['/login']); // Redirect to login
  }
}
