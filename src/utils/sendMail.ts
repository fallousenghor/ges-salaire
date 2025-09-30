import nodemailer from 'nodemailer';

export async function sendMail({ to, subject, text }: { to: string; subject: string; text: string }) {
  // Configurez le transporteur selon votre fournisseur SMTP
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@ges-employe.com',
    to,
    subject,
    text,
  });
}
