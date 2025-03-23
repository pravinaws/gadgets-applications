import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_BASE_URL } from '../../common/constants';

@Component({
  selector: 'app-update-gadget',
  standalone: false,
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  gadget = {
    id: null,
    name: '',
    description: '',
    price: '',
    secretInfo: ''
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id'); // Get gadget ID from URL
    if (id) {
      this.fetchGadgetDetails(id);
    }
  }

  fetchGadgetDetails(id: string) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Unauthorized. Please log in.');
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<{ status: string; data: any }>(`${API_BASE_URL}/gadgets/details/${id}`, { headers })
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.gadget = response.data;
          }
        },
        error: () => alert('Failed to fetch gadget details.')
      });
  }

  onSubmit() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Unauthorized. Please log in.');
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.put(`${API_BASE_URL}/gadgets/update/${this.gadget.id}`, this.gadget, { headers })
      .subscribe({
        next: () => {
          alert('Gadget updated successfully!');
          this.router.navigate(['/gadgets/list']);
        },
        error: () => alert('Failed to update gadget. Please try again.')
      });
  }
}
