import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-bookings',
  templateUrl: './admin-bookings.component.html',
  styleUrls: ['./admin-bookings.component.css']
})
export class AdminBookingsComponent implements OnInit {
  bookings: any[] = [];
  loading = false;
  error = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.error = '';
    this.http.get<any[]>('/api/bookings').subscribe({
      next: data => { this.bookings = data || []; this.loading = false; },
      error: err => { this.error = err?.message || 'Failed to load bookings'; this.loading = false; }
    });
  }

  fmt(d: string) {
    if (!d) return '';
    try { return new Date(d).toLocaleString(); } catch { return d; }
  }
}
