import { Resend } from "resend";
import { Appointment, Service } from "../types";
import { getCustomerBookingEmailHtml, getAdminNotificationEmailHtml } from "./templates";

const resendApiKey = process.env.RESEND_API_KEY;
const senderEmail = process.env.RESEND_FROM_EMAIL || "bookings@resend.dev";
const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

export const isResendConfigured = Boolean(
  resendApiKey && 
  !resendApiKey.includes("placeholder") && 
  resendApiKey.startsWith("re_")
);

const resend = isResendConfigured ? new Resend(resendApiKey) : null;

export async function sendBookingEmails(appointment: Appointment, service: Service) {
  if (!isResendConfigured || !resend) {
    console.log(
      `[Resend Simulated] Email notifications simulated for booking ${appointment.booking_reference} to ${appointment.customer_email}. (Add RESEND_API_KEY to send real emails)`
    );
    return { success: true, simulated: true };
  }

  const results = {
    customerEmailSent: false,
    adminEmailSent: false,
    errors: [] as string[],
  };

  try {
    // 1. Send confirmation email to Customer
    const customerResult = await resend.emails.send({
      from: senderEmail,
      to: appointment.customer_email,
      subject: `Booking Confirmed: ${service.name} (${appointment.appointment_date})`,
      html: getCustomerBookingEmailHtml(appointment, service),
    });

    if (customerResult.error) {
      results.errors.push(`Customer email failed: ${customerResult.error.message}`);
    } else {
      results.customerEmailSent = true;
    }

    // 2. Send notification to Admin (if configured)
    if (adminEmail) {
      const adminResult = await resend.emails.send({
        from: senderEmail,
        to: adminEmail,
        subject: `New Booking: ${appointment.customer_name} - ${service.name}`,
        html: getAdminNotificationEmailHtml(appointment, service),
      });

      if (adminResult.error) {
        results.errors.push(`Admin email failed: ${adminResult.error.message}`);
      } else {
        results.adminEmailSent = true;
      }
    }

    return {
      success: results.customerEmailSent || !customerResult.error,
      simulated: false,
      details: results,
    };
  } catch (err: any) {
    console.error("[Resend Error]:", err);
    return {
      success: false,
      simulated: false,
      error: err.message || "Failed to send email",
    };
  }
}

