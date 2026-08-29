import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverEnvPath = path.join(__dirname, "..", ".env");
const rootEnvPath = path.join(__dirname, "..", "..", ".env");

if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
} else if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  dotenv.config();
}

export const ADMIN_NOTIFY_EMAILS = [
  "naimitraventurespvtltd@gmail.com",
  "admin@dailyfixcare.com",
  "orders@dailyfixcare.com",
];

export const getAdminNotifyEmails = () => {
  const envRaw = process.env.ADMIN_EMAIL || process.env.ADMIN_EMAILS || "";
  const envList = envRaw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const combined = new Set([...ADMIN_NOTIFY_EMAILS, ...envList]);
  return Array.from(combined);
};

let transporter = null;

if (process.env.SMTP_HOST && process.env.SMTP_USER) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 465,
    secure: parseInt(process.env.SMTP_PORT, 10) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporter.verify((error, success) => {
    if (error) {
      console.warn("⚠️ SMTP connection notice:", error.message);
    } else {
      console.log("✅ SMTP server is ready to send emails");
    }
  });
} else {
  console.log("ℹ️ SMTP configuration skipped (credentials not provided)");
}

const sendEmail = async ({ to, subject, html, text }) => {
  if (!transporter) {
    console.warn(`⚠️ Email to ${to} not sent: SMTP transporter not configured`);
    return null;
  }

  try {
    const fromName = process.env.SMTP_FROM_NAME || "DailyFixCare";
    const fromEmail =
      process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || "noreply@dailyfixcare.com";

    // Format recipient list: string or array
    const recipientTo = Array.isArray(to) ? to.join(", ") : to;

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: recipientTo,
      subject,
      html,
      text,
    };

    console.log(`📧 Sending email to: ${recipientTo} with subject: ${subject}`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully! Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    return null;
  }
};

export default sendEmail;
