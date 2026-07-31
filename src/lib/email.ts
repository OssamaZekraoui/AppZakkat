import nodemailer from "nodemailer";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] || character);
}

export async function sendRegistrationOtp(email: string, name: string, otp: string) {
  const gmailUser = process.env.GMAIL_USER;
  const appPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  if (!gmailUser || !appPassword) throw new Error("Gmail SMTP is not configured");

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: gmailUser, pass: appPassword },
  });

  const safeName = escapeHtml(name);
  await transporter.sendMail({
    from: `Diyae <${gmailUser}>`,
    to: email,
    subject: "Votre code d’activation Diyae",
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#0b3d2e"><h1 style="color:#0b3d2e">Diyae</h1><p>Bonjour ${safeName},</p><p>Utilisez ce code pour activer votre compte :</p><p style="font-size:32px;font-weight:700;letter-spacing:8px;color:#b58b2a">${otp}</p><p>Ce code expire dans 10 minutes. Ne le communiquez à personne.</p></div>`,
    text: `Bonjour ${name}, votre code d’activation Diyae est ${otp}. Il expire dans 10 minutes.`,
  });
}
