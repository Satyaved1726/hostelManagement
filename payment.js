// payment.js
// Reads ?room= from URL, displays info, validates form, simulates payment

(function () {
  const roomMap = {
    SuperDeluxe: { name: 'Super Deluxe', cost: 12000, sharingOptions: 1 },
    Deluxe: { name: 'Deluxe', cost: 8000, sharingOptions: 2 },
    Standard: { name: 'Standard', cost: 5000, sharingOptions: 3 }
  };

  function q(sel) { return document.querySelector(sel); }

  function parseRoom() {
    const params = new URLSearchParams(window.location.search);
    const r = params.get('room') || params.get('type') || 'Deluxe';
    // Normalize keys (remove spaces, case-insensitive)
    const key = Object.keys(roomMap).find(k => k.toLowerCase() === r.replace(/\s+/g, '').toLowerCase()) || 'Deluxe';
    return roomMap[key];
  }

  function formatCurrency(n) { return '₹' + n.toLocaleString(); }

  function updateSummary(room) {
    q('#room-name').textContent = room.name;
    q('#room-cost').textContent = formatCurrency(room.cost);
    q('#room-sharing').textContent = room.sharingOptions + ' option(s)';

    q('#sum-room').textContent = room.name;
    q('#sum-monthly').textContent = formatCurrency(room.cost);
    const months = Number(q('#duration').value || 1);
    q('#sum-duration').textContent = months + ' month(s)';
    q('#sum-total').textContent = formatCurrency(room.cost * months);
  }

  function validateForm() {
    const name = q('#fullName').value.trim();
    const email = q('#email').value.trim();
    const phone = q('#phone').value.trim();
    const duration = q('#duration').value;

    if (name.length < 3) { alert('Please enter a valid full name (3+ characters).'); return false; }
    const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRe.test(email)) { alert('Please enter a valid email address.'); return false; }
    const phoneRe = /^\d{7,15}$/; // allow 7-15 digits
    if (!phoneRe.test(phone)) { alert('Please enter a valid phone number (digits only).'); return false; }
    if (!duration || Number(duration) <= 0) { alert('Please select a duration.'); return false; }
    return true;
  }

  function showConfirmation(details) {
    q('.container').classList.add('has-confirmation');
    q('#confirmation').classList.remove('hidden');
    q('#confirm-msg').textContent = `Hi ${details.name}, your ${details.room} booking for ${details.duration} month(s) is confirmed.`;
    q('#confirm-id').textContent = details.bookingId;
    // Hide form and summary
    q('#booking-form').classList.add('hidden');
    q('.summary').classList.add('hidden');
    q('.room-summary').classList.add('hidden');
  }

  document.addEventListener('DOMContentLoaded', function () {
    const room = parseRoom();

    // Populate static fields
    q('#room-name').textContent = room.name;
    q('#room-cost').textContent = formatCurrency(room.cost);
    q('#room-sharing').textContent = room.sharingOptions + ' option(s)';

    // Update dynamic summary when duration changes
    q('#duration').addEventListener('change', function () { updateSummary(room); });
    updateSummary(room);

    // When room param is missing or invalid, allow user to see current default

    q('#booking-form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!validateForm()) return;

      // Calculate total
      const months = Number(q('#duration').value);
      const total = room.cost * months;

      // Simulate payment flow
      const proceed = confirm(`Proceed to pay ${formatCurrency(total)} for ${room.name} (for ${months} month(s))?`);
      if (!proceed) return;

      // Simulate small delay as "processing"
      q('#pay-btn').textContent = 'Processing...';
      q('#pay-btn').disabled = true;

      setTimeout(function () {
        // Payment successful simulation
        const bookingId = 'BK' + Date.now().toString(36).toUpperCase();
        const details = {
          bookingId,
          name: q('#fullName').value.trim(),
          email: q('#email').value.trim(),
          phone: q('#phone').value.trim(),
          room: room.name,
          duration: months,
          total
        };

        // Optionally: you could POST details to server here
        // fetch('/api/bookings', { method: 'POST', body: JSON.stringify(details), headers: {'Content-Type':'application/json'} })

        showConfirmation(details);
      }, 900);
    });

  });
})();
