import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "your_api_key");

async function testResend() {
  console.log("Testing Resend API...");

  // Try sending a test email to the account owner or verified email
  // First, check API key validity by calling resend.apiKeys or sending an email
  try {
    const res = await resend.emails.send({
      from: "Raj Healthcare <onboarding@resend.dev>",
      to: ["delivered@resend.dev"], // Resend's official test delivery address that always succeeds!
      subject: "Raj Healthcare — Test Booking Confirmation",
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
          <h2 style="color: #047857;">Raj Healthcare — Appointment Confirmed</h2>
          <p>This is a live test email confirming your Resend integration is working.</p>
          <p><strong>Service:</strong> General Physician Consultation</p>
          <p><strong>Fee:</strong> ₹499</p>
          <p><strong>Reference:</strong> RH-LIVE01</p>
        </div>
      `,
    });

    console.log("Resend response to delivered@resend.dev:", res);
  } catch (err) {
    console.error("Resend error:", err);
  }
}

testResend();

