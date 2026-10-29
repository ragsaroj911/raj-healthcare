import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "your_api_key");

async function sendBatchEmails() {
  console.log("Sending test emails...");

  // Email 1: General Physician Booking
  const email1 = await resend.emails.send({
    from: "Raj Healthcare <onboarding@resend.dev>",
    to: ["delivered@resend.dev"],
    subject: "Raj Healthcare Appointment 1: General Physician (₹499)",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #047857; margin-top: 0;">Raj Healthcare</h2>
        <p>Dear Patient,</p>
        <p>Your appointment has been confirmed:</p>
        <ul>
          <li><strong>Service:</strong> General Physician Consultation</li>
          <li><strong>Timing:</strong> 10:00 AM - 10:30 AM</li>
          <li><strong>Consultation Fee:</strong> ₹499 (Pay at clinic)</li>
          <li><strong>Reference:</strong> RH-94281A</li>
        </ul>
        <p style="color: #64748b; font-size: 12px;">Please arrive 5 minutes early.</p>
      </div>
    `,
  });
  console.log("Email 1 Result:", email1);

  // Email 2: Specialist Care Consultation
  const email2 = await resend.emails.send({
    from: "Raj Healthcare <onboarding@resend.dev>",
    to: ["delivered@resend.dev"],
    subject: "Raj Healthcare Appointment 2: Specialist Care (₹999)",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #047857; margin-top: 0;">Raj Healthcare</h2>
        <p>Dear Patient,</p>
        <p>Your appointment has been confirmed:</p>
        <ul>
          <li><strong>Service:</strong> Specialist Consultation (Cardiology)</li>
          <li><strong>Timing:</strong> 02:00 PM - 02:45 PM</li>
          <li><strong>Consultation Fee:</strong> ₹999 (Pay at clinic)</li>
          <li><strong>Reference:</strong> RH-51034B</li>
        </ul>
        <p style="color: #64748b; font-size: 12px;">Bring previous medical reports or prescription slips.</p>
      </div>
    `,
  });
  console.log("Email 2 Result:", email2);

  // Email 3: Comprehensive Health Check
  const email3 = await resend.emails.send({
    from: "Raj Healthcare <onboarding@resend.dev>",
    to: ["delivered@resend.dev"],
    subject: "Raj Healthcare Appointment 3: Comprehensive Health Assessment (₹1,499)",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #047857; margin-top: 0;">Raj Healthcare</h2>
        <p>Dear Patient,</p>
        <p>Your appointment has been confirmed:</p>
        <ul>
          <li><strong>Service:</strong> Comprehensive Health Assessment</li>
          <li><strong>Timing:</strong> 11:00 AM - 12:00 PM</li>
          <li><strong>Consultation Fee:</strong> ₹1,499 (Pay at clinic)</li>
          <li><strong>Reference:</strong> RH-78219C</li>
        </ul>
        <p style="color: #64748b; font-size: 12px;">Includes BP, vitals monitoring, and lifestyle consultation.</p>
      </div>
    `,
  });
  console.log("Email 3 Result:", email3);
}

sendBatchEmails();

