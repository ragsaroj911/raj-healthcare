import { Appointment, Service } from "../types";
import { formatCurrency, formatDuration, formatTime12h } from "../utils";

export function getCustomerBookingEmailHtml(appointment: Appointment, service: Service): string {
  const formattedTime = `${formatTime12h(appointment.start_time)} - ${formatTime12h(appointment.end_time)}`;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #0f172a; padding: 32px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; }
    .header p { margin: 8px 0 0; color: #94a3b8; font-size: 14px; }
    .body { padding: 32px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #edf2f7; font-size: 14px; }
    .detail-row:last-child { border-bottom: none; }
    .label { color: #64748b; font-weight: 500; }
    .value { color: #0f172a; font-weight: 600; text-align: right; }
    .ref-badge { display: inline-block; background: #e0e7ff; color: #3730a3; padding: 4px 12px; border-radius: 9999px; font-family: monospace; font-weight: 700; font-size: 13px; }
    .footer { text-align: center; padding: 24px 32px; color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Booking Confirmed</h1>
      <p>We look forward to meeting with you!</p>
    </div>
    <div class="body">
      <p>Hi <strong>${appointment.customer_name}</strong>,</p>
      <p>Your appointment has been scheduled successfully. Here are your booking details:</p>
      
      <div class="card">
        <div class="detail-row">
          <span class="label">Reference ID</span>
          <span class="ref-badge">${appointment.booking_reference}</span>
        </div>
        <div class="detail-row">
          <span class="label">Service</span>
          <span class="value">${service.name}</span>
        </div>
        <div class="detail-row">
          <span class="label">Date</span>
          <span class="value">${appointment.appointment_date}</span>
        </div>
        <div class="detail-row">
          <span class="label">Time</span>
          <span class="value">${formattedTime}</span>
        </div>
        <div class="detail-row">
          <span class="label">Duration</span>
          <span class="value">${formatDuration(service.duration_minutes)}</span>
        </div>
        <div class="detail-row">
          <span class="label">Price</span>
          <span class="value">${formatCurrency(service.price)}</span>
        </div>
      </div>

      ${appointment.notes ? `<p style="font-size: 14px; color: #64748b;"><strong>Your Notes:</strong> ${appointment.notes}</p>` : ''}
      
      <p style="font-size: 14px; line-height: 1.6; color: #475569;">
        Need to reschedule or cancel? Keep your Reference ID handy and reply to this email or contact support.
      </p>
    </div>
    <div class="footer">
      <p>Appointment Booking System • Modern & Secure</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function getAdminNotificationEmailHtml(appointment: Appointment, service: Service): string {
  const formattedTime = `${formatTime12h(appointment.start_time)} - ${formatTime12h(appointment.end_time)}`;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; }
    .badge { background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 4px; font-weight: 600; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>New Appointment Booked <span class="badge">New</span></h2>
    <p>A new customer booking has been registered in the system:</p>
    <ul>
      <li><strong>Customer:</strong> ${appointment.customer_name} (${appointment.customer_email})</li>
      <li><strong>Phone:</strong> ${appointment.customer_phone}</li>
      <li><strong>Service:</strong> ${service.name} (${formatDuration(service.duration_minutes)} - ${formatCurrency(service.price)})</li>
      <li><strong>Scheduled:</strong> ${appointment.appointment_date} at ${formattedTime}</li>
      <li><strong>Reference:</strong> ${appointment.booking_reference}</li>
      ${appointment.notes ? `<li><strong>Notes:</strong> ${appointment.notes}</li>` : ''}
    </ul>
    <p>Visit the admin dashboard to manage this appointment.</p>
  </div>
</body>
</html>
  `.trim();
}

