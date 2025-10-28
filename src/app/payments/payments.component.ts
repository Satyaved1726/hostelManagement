import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  room: any = { name: 'Deluxe', cost: 8000, sharingOptions: 2 };
  form = { fullName: '', email: '', phone: '', duration: 1 };
  total = 0;
  bookingConfirmed = false;
  bookingId = '';
  // payment UI state
  choosingPayment = false;
  paymentMethod: 'Cash' | 'UPI' | null = null;
  upiQRUrl = '';
  // When UPI flow: show/hide transaction entry after user clicks Done
  awaitingTransaction = false;
  transactionNumber = '';
  // upiQRUrl will point to the static QR image served from assets

  private roomMap: any = {
    SuperDeluxe: { name: 'Super Deluxe', cost: 12000, sharingOptions: 1 },
    SuperDelux: { name: 'Super Deluxe', cost: 12000, sharingOptions: 1 },
    Deluxe: { name: 'Deluxe', cost: 8000, sharingOptions: 2 },
    Delux: { name: 'Deluxe', cost: 8000, sharingOptions: 2 },
    Standard: { name: 'Standard', cost: 5000, sharingOptions: 3 }
  };

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const r = (params['room'] || params['type'] || 'Deluxe').toString();
      const normalized = r.replace(/\s+/g, '').toLowerCase();

      // Try exact key match first
      let matchKey = Object.keys(this.roomMap).find(k => k.toLowerCase() === normalized);
      // Try partial/inclusive match (handle typos like 'Delux' vs 'Deluxe')
      if (!matchKey) {
        matchKey = Object.keys(this.roomMap).find(k => k.toLowerCase().indexOf(normalized) !== -1 || normalized.indexOf(k.toLowerCase()) !== -1);
      }
      if (!matchKey) matchKey = 'Deluxe';
      this.room = this.roomMap[matchKey];
      this.updateTotal();
    });
  }

  updateTotal() {
    this.total = this.room.cost * (Number(this.form.duration) || 1);
  }

  validate(): boolean {
    if (!this.form.fullName || this.form.fullName.trim().length < 3) { alert('Enter a valid name (3+ chars)'); return false; }
    if (!this.form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.form.email)) { alert('Enter a valid email'); return false; }
    if (!this.form.phone || !/^\d{7,15}$/.test(this.form.phone)) { alert('Enter a valid phone number (7-15 digits)'); return false; }
    if (!this.form.duration || Number(this.form.duration) <= 0) { alert('Select duration'); return false; }
    return true;
  }

  proceedToPay() {
    if (!this.validate()) return;
    this.updateTotal();
    // Show payment method choices first
    this.choosingPayment = true;
  }

  startCashPayment() {
    this.paymentMethod = 'Cash';
    this.submitBooking('Cash', 'pending');
  }

  startUpiPayment() {
    // Show the project's QR image by fetching it and embedding as a data URL.
    // If fetching fails, fall back to a generated UPI QR (Google Charts).
    this.paymentMethod = 'UPI';

    const merchantVPA = 'yourmerchant@upi';
    const merchantName = 'Hostel Payment';
    const note = encodeURIComponent(`${this.room.name} booking`);
    const upiUri = `upi://pay?pa=${encodeURIComponent(merchantVPA)}&pn=${encodeURIComponent(merchantName)}&cu=INR&tn=${note}`;
    const chartUrl = `https://chart.googleapis.com/chart?cht=qr&chs=400x400&chl=${encodeURIComponent(upiUri)}`;

    // Use the static asset placed in src/assets/upi-qr.png so it's served at /assets/upi-qr.png.
    // This keeps the component small and avoids reading large blobs at runtime.
    // If that asset isn't present, the <img> tag can fall back to the generated chart URL via onerror in the template.
    // Try the static asset first; if it fails to load, fall back to generated QR
    this.upiQRUrl = 'assets/upi-qr.png';
    try {
      const tester = new Image();
      tester.onload = () => {
        // static asset is fine — keep it
        this.upiQRUrl = 'assets/upi-qr.png';
      };
      tester.onerror = () => {
        // static asset missing or blocked — use generated QR
        this.upiQRUrl = chartUrl;
      };
      tester.src = 'assets/upi-qr.png';
    } catch (e) {
      // If anything goes wrong, use generated QR
      this.upiQRUrl = chartUrl;
    }
    /*
    // Build UPI URI (replace pa with your merchant VPA)
    const merchantVPA = 'yourmerchant@upi';
    const merchantName = 'Hostel Payment';
    const amount = (this.total || (this.room.cost)).toFixed(2);
    const note = encodeURIComponent(`${this.room.name} booking`);
    const upiUri = `upi://pay?pa=${encodeURIComponent(merchantVPA)}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${note}`;
    const chartUrl = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(upiUri)}`;
    this.upiQRUrl = chartUrl;
    */
  }

  confirmUpiPaid() {
    // Show the transaction number input so the user can enter their UPI txn id
    this.awaitingTransaction = true;
  }

  submitTransaction() {
    if (!this.transactionNumber || this.transactionNumber.trim().length < 3) {
      alert('Please enter a valid transaction number/reference (3+ chars).');
      return;
    }
    // Submit booking with transaction reference
    this.submitBooking('UPI', 'paid', this.transactionNumber.trim());
  }

  // Allow user to upload a local QR image file (avoids needing to copy into assets)
  // Removed upload/paste/load helpers per new requirement; the component
  // now directly displays the static image placed at assets/payments-public/image/image.png

  submitBooking(method: 'Cash' | 'UPI', status: 'paid' | 'pending', transactionNumber?: string) {
    const payload = {
      name: this.form.fullName.trim(),
      email: this.form.email.trim(),
      phone: this.form.phone.trim(),
      room: this.room.name,
      duration: Number(this.form.duration),
      total: this.total,
      paymentMethod: method,
      status,
      transactionNumber: transactionNumber || undefined
    };

    this.http.post('/api/bookings', payload).subscribe({
      next: (res: any) => {
        this.bookingConfirmed = true;
        this.bookingId = res && res._id ? res._id : ('BK' + Date.now().toString(36).toUpperCase());
        this.choosingPayment = false;
      },
      error: () => {
        // fallback: simulate stored booking
        this.bookingConfirmed = true;
        this.bookingId = 'BK' + Date.now().toString(36).toUpperCase();
        this.choosingPayment = false;
      }
    });
  }

  backToHome() {
    this.router.navigate(['/dashboard']);
  }

}
