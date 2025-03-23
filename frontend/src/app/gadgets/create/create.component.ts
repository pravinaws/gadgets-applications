import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_BASE_URL } from '../../common/constants';

@Component({
  selector: 'app-create-gadget',
  standalone: false,
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  gadget = {
    name: '',
    description: '',
    price: '',
    secretInfo: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    if (!token) {
      alert('Unauthorized. Please log in.');
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post(`${API_BASE_URL}/gadgets/create`, this.gadget, { headers })
      .subscribe({
        next: () => {
          alert('Gadget added successfully!');
          this.router.navigate(['/gadgets/list']);
        },
        error: () => {
          alert('Failed to add gadget. Please try again.');
        }
      });
  }
}
