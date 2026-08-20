import sendEmail from '../utils/sendEmail.js';
import contactEmailTemplate from '../templates/contactEmailTemplate.js';
import whatsappService from '../utils/whatsappService.js';

export const sendContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const recipientEmail = process.env.ADMIN_EMAIL || 'orders@dailyfixcare.com';

    const emailHtml = contactEmailTemplate({ name, email, phone, subject, message });

    const result = await sendEmail({
      to: recipientEmail,
      subject: `[Contact Form] ${subject}`,
      html: emailHtml,
      text: `New Contact Form Submission:\n\nFrom: ${name} <${email}>\nPhone: ${phone || 'N/A'}\nSubject: ${subject}\n\nMessage:\n${message}`
    });

    // Trigger WhatsApp notification for admin
    whatsappService.notifyContactInquiryAdmin({ name, email, phone, subject, message }).catch((e) => {
      console.log('[WhatsApp] Contact alert skipped:', e.message);
    });

    if (!result) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send message. Please try again later.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.'
    });

  } catch (error) {
    console.error('❌ Contact form error:', error.message);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later.'
    });
  }
};
