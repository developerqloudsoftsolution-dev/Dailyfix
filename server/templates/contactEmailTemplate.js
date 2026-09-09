/**
 * Contact Form Submission Email Template (for orders@dailyfixcare.com)
 */
const contactEmailTemplate = (contactData) => {
  const { name, email, subject, message } = contactData;
  const submittedAt = new Date().toLocaleString();

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form: ${subject}</title>
    </head>
    <body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f3f4f6;">
      <!-- Email Container -->
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f3f4f6;">
        <tr>
          <td align="center" style="padding:24px 16px;">
            <!-- Email Card -->
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:640px;background-color:#ffffff;border-radius:16px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td align="center" style="background:linear-gradient(135deg,#059669 0%,#047857 100%);padding:32px 24px;border-radius:16px 16px 0 0;">
                  <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">New Contact Message</h1>
                  <p style="margin:8px 0 0;color:#d1fae5;font-size:14px;">DailyfixCare Website</p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding:40px 32px 24px;">
                  <p style="margin:0 0 24px;color:#4b5563;font-size:16px;line-height:1.6;">
                    A new contact form has been submitted from the DailyfixCare website.
                  </p>

                  <!-- Contact Details -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
                    <tr>
                      <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
                        <span style="color:#6b7280;font-size:14px;font-weight:600;">Sender Name</span>
                      </td>
                      <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;text-align:right;">
                        <span style="color:#111827;font-size:15px;font-weight:700;">${name}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
                        <span style="color:#6b7280;font-size:14px;font-weight:600;">Reply Email</span>
                      </td>
                      <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;text-align:right;">
                        <a href="mailto:${email}" style="color:#059669;font-size:15px;font-weight:700;text-decoration:none;">${email}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
                        <span style="color:#6b7280;font-size:14px;font-weight:600;">Subject</span>
                      </td>
                      <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;text-align:right;">
                        <span style="color:#111827;font-size:15px;font-weight:700;">${subject}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
                        <span style="color:#6b7280;font-size:14px;font-weight:600;">Submitted At</span>
                      </td>
                      <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;text-align:right;">
                        <span style="color:#111827;font-size:14px;">${submittedAt}</span>
                      </td>
                    </tr>
                  </table>

                  <!-- Message -->
                  <h3 style="margin:0 0 12px;font-size:16px;color:#111827;font-weight:700;">Message</h3>
                  <div style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;">
                    <p style="margin:0;color:#111827;font-size:15px;line-height:1.8;white-space:pre-wrap;">${message}</p>
                  </div>

                </td>
              </tr>

              <!-- Quick Reply CTA -->
              <tr>
                <td style="padding:0 32px 32px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center">
                        <a href="mailto:${email}?subject=Re: ${subject}" 
                           style="display:inline-block;background:linear-gradient(135deg,#059669 0%,#047857 100%);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:700;font-size:15px;">
                          Reply to ${name}
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="background-color:#f9fafb;padding:20px 24px;border-radius:0 0 16px 16px;border-top:1px solid #e5e7eb;">
                  <p style="margin:0;color:#9ca3af;font-size:12px;">
                    This email was sent from the DailyfixCare contact form.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export default contactEmailTemplate;
