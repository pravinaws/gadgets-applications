import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_BASE_URL } from '../../common/constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

interface Gadget {
  id: number;
  name: string;
  description: string;
  price: number;
  secretInfo: string;
  selected?: boolean; // Added for checkbox selection
}

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  gadgets: Gadget[] = [];
  selectedGadget: any;
  currentPage: number = 1;

  constructor(private http: HttpClient, private router: Router, private modalService: NgbModal) { }

  ngOnInit() {
    this.fetchGadgets();
  }

  fetchGadgets() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found! Redirecting to login.');
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<{ gadgets: Gadget[] }>(`${API_BASE_URL}/gadgets/all`, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('API Response:', response);
          this.gadgets = response.data || [];
          this.gadgets.forEach(g => g.selected = false); // Initialize selection
        },
        error: (err) => console.error('Error fetching gadgets:', err)
      });
  }

  deleteGadget(id: number) {
    if (!confirm('Are you sure you want to delete this gadget?')) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.delete(`${API_BASE_URL}/gadgets/delete/${id}`, { headers })
      .subscribe({
        next: () => {
          alert('Gadget deleted successfully!');
          this.fetchGadgets();
        },
        error: (err) => console.error('Error deleting gadget:', err)
      });
  }

  deleteSelectedGadgets() {
    const selectedIds = this.gadgets.filter(g => g.selected).map(g => g.id);
    if (selectedIds.length === 0) {
      alert('No gadgets selected!');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedIds.length} gadgets?`)) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    selectedIds.forEach(id => {
      this.http.delete(`${API_BASE_URL}/gadgets/delete/${id}`, { headers })
        .subscribe({
          next: () => {
            this.gadgets = this.gadgets.filter(g => !selectedIds.includes(g.id)); // Remove deleted gadgets
          },
          error: (err) => console.error('Error deleting gadgets:', err)
        });
    });

    alert('Selected gadgets deleted successfully!');
  }

  toggleSelectAll(event: any) {
    const isChecked = event.target.checked;
    this.gadgets.forEach(g => g.selected = isChecked);
  }

  viewGadget(id: number, content: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<Gadget>(`${API_BASE_URL}/gadgets/details/${id}`, { headers })
      .subscribe({
        next: (gadget: any) => {
          this.selectedGadget = gadget.data;
          this.modalService.open(content, { centered: true });
        },
        error: (err) => console.error('Error fetching gadget details:', err)
      });
  }

  updateGadget(id: number) {
    this.router.navigate([`/gadgets/update/${id}`]);
  }

  addGadget() {
    this.router.navigate([`/gadgets/add`]);
  }
}
