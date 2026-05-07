import nodemailer from 'nodemailer';

// ─── Transporter ────────────────────────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // TLS on port 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// ─── Types ───────────────────────────────────────────────────────────────────
export interface BookingEmailData {
  guestName: string;
  guestEmail: string;
  bookingId: string;
  roomType: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalAmount: number;
  nights: number;
}

// ─── Booking Confirmation Email ───────────────────────────────────────────────
export async function sendBookingConfirmationEmail(data: BookingEmailData): Promise<void> {
  const transporter = createTransporter();

  const checkIn = new Date(data.checkInDate).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const checkOut = new Date(data.checkOutDate).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Confirmation</title>
</head>
<body style="margin:0;padding:0;background:#111;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#111;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#1a1a1a;border-radius:16px;overflow:hidden;border:1px solid rgba(197,160,89,0.2);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a1a 0%,#2a2200 100%);padding:40px 32px;text-align:center;border-bottom:1px solid rgba(197,160,89,0.2);">
              <p style="margin:0 0 8px;font-size:12px;letter-spacing:4px;text-transform:uppercase;color:#C5A059;">Vitamin Sea Hotel &amp; Hostel</p>
              <h1 style="margin:0;font-size:28px;font-weight:400;color:#F5F5F7;letter-spacing:1px;">Booking Confirmed</h1>
              <div style="width:40px;height:2px;background:#C5A059;margin:16px auto 0;"></div>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:32px 32px 0;">
              <p style="margin:0 0 8px;font-size:16px;color:#F5F5F7;">Dear <strong style="color:#C5A059;">${data.guestName}</strong>,</p>
              <p style="margin:0;font-size:14px;line-height:1.6;color:rgba(245,245,247,0.6);">
                Your reservation at Vitamin Sea Hotel has been confirmed. We look forward to welcoming you!
              </p>
            </td>
          </tr>

          <!-- Booking Reference Box -->
          <tr>
            <td style="padding:24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(197,160,89,0.08);border:1px solid rgba(197,160,89,0.2);border-radius:12px;padding:20px;">
                <tr>
                  <td align="center">
                    <p style="margin:0 0 4px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(245,245,247,0.4);">Booking Reference</p>
                    <p style="margin:0;font-size:22px;font-weight:700;color:#C5A059;letter-spacing:2px;">#${data.bookingId.toUpperCase()}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Stay Details -->
          <tr>
            <td style="padding:0 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:16px;">
                    <p style="margin:0 0 12px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(245,245,247,0.4);">Stay Details</p>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding:12px 16px;background:rgba(245,245,247,0.04);border-radius:8px 0 0 8px;border-right:1px solid rgba(245,245,247,0.06);">
                    <p style="margin:0 0 4px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(245,245,247,0.35);">Room</p>
                    <p style="margin:0;font-size:15px;font-weight:600;color:#F5F5F7;">${data.roomType}</p>
                    <p style="margin:0;font-size:12px;color:rgba(245,245,247,0.4);">Room ${data.roomNumber}</p>
                  </td>
                  <td width="50%" style="padding:12px 16px;background:rgba(245,245,247,0.04);border-radius:0 8px 8px 0;">
                    <p style="margin:0 0 4px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(245,245,247,0.35);">Guests</p>
                    <p style="margin:0;font-size:15px;font-weight:600;color:#F5F5F7;">${data.numberOfGuests} Guest${data.numberOfGuests > 1 ? 's' : ''}</p>
                    <p style="margin:0;font-size:12px;color:rgba(245,245,247,0.4);">${data.nights} Night${data.nights > 1 ? 's' : ''}</p>
                  </td>
                </tr>
                <tr><td colspan="2" height="12"></td></tr>
                <tr>
                  <td width="50%" style="padding:12px 16px;background:rgba(245,245,247,0.04);border-radius:8px 0 0 8px;border-right:1px solid rgba(245,245,247,0.06);">
                    <p style="margin:0 0 4px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(245,245,247,0.35);">Check-in</p>
                    <p style="margin:0;font-size:13px;font-weight:600;color:#4ade80;">${checkIn}</p>
                    <p style="margin:0;font-size:12px;color:rgba(245,245,247,0.4);">From 2:00 PM</p>
                  </td>
                  <td width="50%" style="padding:12px 16px;background:rgba(245,245,247,0.04);border-radius:0 8px 8px 0;">
                    <p style="margin:0 0 4px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(245,245,247,0.35);">Check-out</p>
                    <p style="margin:0;font-size:13px;font-weight:600;color:#F5F5F7;">${checkOut}</p>
                    <p style="margin:0;font-size:12px;color:rgba(245,245,247,0.4);">By 12:00 PM</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Total Amount -->
          <tr>
            <td style="padding:0 32px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(197,160,89,0.1);border:1px solid rgba(197,160,89,0.3);border-radius:12px;padding:20px;">
                <tr>
                  <td>
                    <p style="margin:0;font-size:13px;color:rgba(245,245,247,0.5);">Total Amount</p>
                    <p style="margin:4px 0 0;font-size:28px;font-weight:700;color:#C5A059;">$${data.totalAmount.toLocaleString()}</p>
                  </td>
                  <td align="right" valign="middle">
                    <span style="display:inline-block;padding:6px 14px;background:rgba(197,160,89,0.15);border:1px solid rgba(197,160,89,0.3);border-radius:20px;font-size:11px;color:#C5A059;letter-spacing:1px;text-transform:uppercase;">Payment Pending</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hotel Info -->
          <tr>
            <td style="padding:24px 32px;background:rgba(245,245,247,0.03);border-top:1px solid rgba(245,245,247,0.06);">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(245,245,247,0.3);">Need Help?</p>
              <p style="margin:0;font-size:13px;color:rgba(245,245,247,0.5);line-height:1.6;">
                📍 Nilaveli Road, Trincomalee, Sri Lanka<br/>
                📞 +94 (77) 123-4567<br/>
                ✉️ reservations@vitaminsea.com
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:11px;color:rgba(245,245,247,0.2);">
                © ${new Date().getFullYear()} Vitamin Sea Hotel. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'Vitamin Sea Hotel <noreply@vitaminsea.com>',
    to: data.guestEmail,
    subject: `✅ Booking Confirmed – #${data.bookingId.toUpperCase()} | Vitamin Sea Hotel`,
    html,
  });

  console.log(`📧 Confirmation email sent to ${data.guestEmail}`);
}
