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
    .header { background: #047857; padding: 32px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; }
    .header p { margin: 8px 0 0; color: #d1fae5; font-size: 14px; }
    .body { padding: 32px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #edf2f7; font-size: 14px; }
    .detail-row:last-child { border-bottom: none; }
    .label { color: #64748b; font-weight: 500; }
    .value { color: #0f172a; font-weight: 600; text-align: right; }
    .ref-badge { display: inline-block; background: #ecfdf5; color: #065f46; padding: 4px 12px; border-radius: 9999px; font-family: monospace; font-weight: 700; font-size: 13px; border: 1px solid #a7f3d0; }
    .checklist { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 13px; color: #166534; }
    .footer { text-align: center; padding: 24px 32px; color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Raj Healthcare</h1>
      <p>Doctor Consultation Appointment Pass</p>
    </div>
    <div class="body">
      <p>Dear <strong>${appointment.customer_name}</strong>,</p>
      <p>Your appointment at <strong>Raj Healthcare</strong> has been reserved successfully. Please find your visit details below:</p>
      
      <div class="card">
        <div class="detail-row">
          <span class="label">Patient Reference ID</span>
          <span class="ref-badge">${appointment.booking_reference}</span>
        </div>
        <div class="detail-row">
          <span class="label">Consultation Type</span>
          <span class="value">${service.name}</span>
        </div>
        <div class="detail-row">
          <span class="label">Appointment Date</span>
          <span class="value">${appointment.appointment_date}</span>
        </div>
        <div class="detail-row">
          <span class="label">Reserved Slot</span>
          <span class="value">${formattedTime}</span>
        </div>
        <div class="detail-row">
          <span class="label">Doctor Session Duration</span>
          <span class="value">${formatDuration(service.duration_minutes)}</span>
        </div>
        <div class="detail-row">
          <span class="label">Consultation Fee</span>
          <span class="value">${formatCurrency(service.price)}</span>
        </div>
      </div>

      <div class="checklist">
        <strong>Patient Checklist for your visit:</strong>
        <ul style="margin: 8px 0 0; padding-left: 18px;">
          <li>Please arrive 5 minutes prior to your slot time.</li>
          <li>Carry your Reference ID <strong>${appointment.booking_reference}</strong>.</li>
          <li>Bring previous medical reports or current medicine prescriptions if applicable.</li>
        </ul>
      </div>

      ${appointment.notes ? `<p style="font-size: 13px; color: #64748b;"><strong>Reported Symptoms / Notes:</strong> ${appointment.notes}</p>` : ''}
      
      <p style="font-size: 13px; line-height: 1.6; color: #475569;">
        Need to reschedule or have questions? Simply reply to this email with your reference code.
      </p>
    </div>
    <div class="footer">
      <p>Raj Healthcare Clinic & Diagnostic Consultations &bull; Dedicated to Your Well-being</p>
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
    <h2>Raj Healthcare — New Patient Appointment <span class="badge">New Patient</span></h2>
    <p>A new consultation has been booked on the patient portal:</p>
    <ul>
      <li><strong>Patient:</strong> ${appointment.customer_name} (${appointment.customer_email})</li>
      <li><strong>Phone:</strong> ${appointment.customer_phone || "Not provided"}</li>
      <li><strong>Service:</strong> ${service.name} (${formatDuration(service.duration_minutes)} - ${formatCurrency(service.price)})</li>
      <li><strong>Appointment Date:</strong> ${appointment.appointment_date} at ${formattedTime}</li>
      <li><strong>Reference ID:</strong> ${appointment.booking_reference}</li>
      ${appointment.notes ? `<li><strong>Patient Notes / Symptoms:</strong> ${appointment.notes}</li>` : ''}
    </ul>
    <p>Please log in to the Raj Healthcare Admin Dashboard to manage clinic schedules.</p>
  </div>
</body>
</html>
  `.trim();
}
