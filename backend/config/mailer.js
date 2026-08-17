import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = Number(process.env.SMTP_PORT || 465);
const smtpSecure = String(process.env.SMTP_SECURE || "true").toLowerCase() === "true";

const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendVerificationEmail = async ({ to, name, token }) => {
    const frontendUrl = String(process.env.FRONTEND_URL || "").trim().replace(/\/$/, "");
    if (!frontendUrl) {
        throw new Error("FRONTEND_URL is missing in backend/.env. Example: FRONTEND_URL=http://localhost:5174");
    }
    const verifyUrl = `${frontendUrl}/verify-email?token=${encodeURIComponent(token)}`;
    const from = process.env.MAIL_FROM || process.env.SMTP_USER;

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !from) {
        throw new Error("Email service is not configured. Check SMTP_USER, SMTP_PASS and MAIL_FROM in backend/.env");
    }

    await transporter.sendMail({
        from,
        to,
        subject: "Verify your email - Ecommerce App",
        text: `Hi ${name},\n\nVERIFY YOUR EMAIL\n\nOpen this verification link:\n${verifyUrl}\n\nIf the link is not clickable, copy and paste the full URL above into your browser.\n\nThis verification link expires in 30 minutes.\n\nIf you did not create this account, you can ignore this email.`,
        html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;color:#222">
              <h2>Verify your email</h2>
              <p>Hi ${String(name).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]))},</p>
              <p>Thanks for creating an account. Click the button below to verify your email address.</p>
              <p><a href="${verifyUrl}" style="display:inline-block;background:#111;color:#fff;padding:12px 20px;text-decoration:none;border-radius:4px">Verify Email</a></p>
              <p>If the button does not work, open this link:</p>
              <p style="word-break:break-all;background:#f5f5f5;padding:12px;border-radius:4px"><a href="${verifyUrl}">${verifyUrl}</a></p>
              <p>This link expires in 30 minutes.</p>
              <p>If you did not create this account, you can ignore this email.</p>
            </div>
        `,
    });
};
