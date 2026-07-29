import nodemailer from 'nodemailer';

// ─── Transporter ────────────────────────────────────────────────────────────
function createTransporter() {
  const user = process.env.SMTP_USER?.trim();
  const rawPass = process.env.SMTP_PASS || '';
  const pass = rawPass.replace(/\s+/g, '').trim();

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user,
      pass,
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

// ─── Invoice Email ─────────────────────────────────────────────────────────────
export interface InvoiceEmailItem {
  name: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

export interface InvoiceEmailData {
  _id: string;
  guestName: string;
  guestEmail?: string;
  guestType: 'Room' | 'External';
  roomNumber?: string;
  tableNumber?: string;
  checkInDate?: string;
  checkOutDate?: string;
  nights?: number;
  numberOfGuests?: number;
  roomCharge: number;
  foodItems: InvoiceEmailItem[];
  tourItems: InvoiceEmailItem[];
  foodTotal: number;
  tourTotal: number;
  grandTotal: number;
  advancePayment: number;
  balanceDue: number;
  paymentStatus: 'Paid' | 'Pending';
}

export interface SendInvoiceEmailParams {
  guestEmail: string;
  invoiceData: InvoiceEmailData;
  paymentMethod?: string;
}

export async function sendInvoiceEmail({ guestEmail, invoiceData, paymentMethod }: SendInvoiceEmailParams): Promise<void> {
  const transporter = createTransporter();

  const formatCurrency = (amount: number) =>
    `$${Number(amount).toFixed(2)}`;

  const checkIn = invoiceData.checkInDate
    ? new Date(invoiceData.checkInDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
    : null;
  const checkOut = invoiceData.checkOutDate
    ? new Date(invoiceData.checkOutDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
    : null;

  const rowStyle = 'padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.05);';
  const labelStyle = 'font-size:13px;color:rgba(245,245,247,0.55);';
  const valueStyle = 'font-size:13px;color:#F5F5F7;font-weight:600;text-align:right;';

  const buildItemRows = (items: InvoiceEmailItem[]) =>
    items.map(item => `
      <tr>
        <td style="${rowStyle}${labelStyle}">${item.name}</td>
        <td style="${rowStyle}${labelStyle}text-align:center;">${item.quantity}</td>
        <td style="${rowStyle}${labelStyle}text-align:right;">${formatCurrency(item.unitPrice)}</td>
        <td style="${rowStyle}${valueStyle}">${formatCurrency(item.subTotal)}</td>
      </tr>
    `).join('');

  const roomRows = invoiceData.guestType === 'Room' && invoiceData.roomCharge > 0 ? `
    <tr>
      <td colspan="4" style="padding:10px 16px 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(197,160,89,0.8);">Room Charges</td>
    </tr>
    <tr>
      <td style="${rowStyle}${labelStyle}">Room ${invoiceData.roomNumber || ''} – ${invoiceData.nights || 1} Night${(invoiceData.nights || 1) > 1 ? 's' : ''}</td>
      <td style="${rowStyle}${labelStyle}text-align:center;">${invoiceData.nights || 1}</td>
      <td style="${rowStyle}${labelStyle}text-align:right;">–</td>
      <td style="${rowStyle}${valueStyle}">${formatCurrency(invoiceData.roomCharge)}</td>
    </tr>
  ` : '';

  const foodRows = invoiceData.foodItems.length > 0 ? `
    <tr>
      <td colspan="4" style="padding:10px 16px 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(74,222,128,0.8);">Food & Beverage</td>
    </tr>
    ${buildItemRows(invoiceData.foodItems)}
  ` : '';

  const tourRows = invoiceData.tourItems.length > 0 ? `
    <tr>
      <td colspan="4" style="padding:10px 16px 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(251,191,36,0.8);">Tour Packages</td>
    </tr>
    ${buildItemRows(invoiceData.tourItems)}
  ` : '';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invoice – ${invoiceData._id}</title>
</head>
<body style="margin:0;padding:0;background:#111;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#111;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#1a1a1a;border-radius:16px;overflow:hidden;border:1px solid rgba(197,160,89,0.2);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a1a 0%,#2a2200 100%);padding:40px 32px;text-align:center;border-bottom:1px solid rgba(197,160,89,0.2);">
              <p style="margin:0 0 8px;font-size:12px;letter-spacing:4px;text-transform:uppercase;color:#C5A059;">Vitamin Sea Hotel &amp; Hostel</p>
              <h1 style="margin:0;font-size:26px;font-weight:400;color:#F5F5F7;letter-spacing:1px;">Tax Invoice</h1>
              <div style="width:40px;height:2px;background:#C5A059;margin:16px auto 0;"></div>
              <p style="margin:12px 0 0;font-size:13px;color:rgba(245,245,247,0.45);">Invoice #${invoiceData._id.slice(-8).toUpperCase()}</p>
            </td>
          </tr>

          <!-- Guest Info -->
          <tr>
            <td style="padding:28px 32px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:50%;vertical-align:top;">
                    <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(245,245,247,0.35);">Bill To</p>
                    <p style="margin:0;font-size:16px;font-weight:600;color:#F5F5F7;">${invoiceData.guestName}</p>
                    <p style="margin:4px 0 0;font-size:13px;color:rgba(245,245,247,0.5);">
                      ${invoiceData.guestType === 'Room' ? `Room #${invoiceData.roomNumber}` : `Table #${invoiceData.tableNumber}`}
                      ${invoiceData.guestType === 'Room' && invoiceData.numberOfGuests ? ` · ${invoiceData.numberOfGuests} Guest${invoiceData.numberOfGuests > 1 ? 's' : ''}` : ''}
                    </p>
                    ${checkIn ? `<p style="margin:4px 0 0;font-size:12px;color:rgba(245,245,247,0.4);">${checkIn} → ${checkOut}</p>` : ''}
                  </td>
                  <td style="width:50%;text-align:right;vertical-align:top;">
                    <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(245,245,247,0.35);">Date</p>
                    <p style="margin:0;font-size:13px;color:#F5F5F7;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p style="margin:8px 0 0;">
                      <span style="display:inline-block;padding:5px 12px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:1px;
                        ${invoiceData.paymentStatus === 'Paid'
                          ? 'background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.3);color:#4ade80;'
                          : 'background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.3);color:#fbbf24;'
                        }">
                        ${invoiceData.paymentStatus === 'Paid' ? '✓ PAID' : '⏳ PENDING'}
                      </span>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding:24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:rgba(255,255,255,0.03);border-radius:10px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);">
                <thead>
                  <tr style="background:rgba(255,255,255,0.05);">
                    <th style="padding:10px 16px;text-align:left;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(245,245,247,0.4);font-weight:500;">Description</th>
                    <th style="padding:10px 16px;text-align:center;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(245,245,247,0.4);font-weight:500;">Qty</th>
                    <th style="padding:10px 16px;text-align:right;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(245,245,247,0.4);font-weight:500;">Unit Price</th>
                    <th style="padding:10px 16px;text-align:right;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(245,245,247,0.4);font-weight:500;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${roomRows}${foodRows}${tourRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="padding:0 32px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:50%;"></td>
                  <td style="width:50%;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(197,160,89,0.07);border:1px solid rgba(197,160,89,0.2);border-radius:10px;overflow:hidden;">
                      <tr>
                        <td style="padding:10px 16px;font-size:13px;color:rgba(245,245,247,0.55);">Subtotal</td>
                        <td style="padding:10px 16px;font-size:13px;color:#F5F5F7;text-align:right;">${formatCurrency(invoiceData.grandTotal)}</td>
                      </tr>
                      ${invoiceData.advancePayment > 0 ? `
                      <tr>
                        <td style="padding:10px 16px;font-size:13px;color:rgba(74,222,128,0.8);">Advance Paid</td>
                        <td style="padding:10px 16px;font-size:13px;color:#4ade80;text-align:right;">-${formatCurrency(invoiceData.advancePayment)}</td>
                      </tr>` : ''}
                      ${paymentMethod ? `
                      <tr>
                        <td style="padding:10px 16px;font-size:12px;color:rgba(245,245,247,0.4);">Payment Method</td>
                        <td style="padding:10px 16px;font-size:12px;color:rgba(245,245,247,0.6);text-align:right;">${paymentMethod}</td>
                      </tr>` : ''}
                      <tr style="border-top:1px solid rgba(197,160,89,0.2);">
                        <td style="padding:14px 16px;font-size:15px;font-weight:700;color:#C5A059;">Balance Due</td>
                        <td style="padding:14px 16px;font-size:18px;font-weight:700;color:#C5A059;text-align:right;">${formatCurrency(invoiceData.balanceDue)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hotel Info -->
          <tr>
            <td style="padding:24px 32px;background:rgba(245,245,247,0.03);border-top:1px solid rgba(245,245,247,0.06);">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(245,245,247,0.3);">Vitamin Sea Hotel &amp; Hostel</p>
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
                Thank you for choosing Vitamin Sea Hotel. © ${new Date().getFullYear()} All rights reserved.
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
    to: guestEmail,
    subject: `🧾 Invoice #${invoiceData._id.slice(-8).toUpperCase()} – Vitamin Sea Hotel`,
    html,
  });

  console.log(`📧 Invoice email sent to ${guestEmail}`);
}
