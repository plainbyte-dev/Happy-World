import nodemailer, { type Transporter } from 'nodemailer';

let transporter: Transporter | null = null;

// Lazily created so a missing GMAIL_USER/GMAIL_APP_PASSWORD only breaks the
// specific request that tries to send mail, not every cold start of the app.
function getTransporter(): Transporter {
  if (transporter) return transporter;

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error('GMAIL_USER and GMAIL_APP_PASSWORD environment variables are required to send mail');
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
  return transporter;
}

export async function sendAdminMail(subject: string, text: string): Promise<void> {
  const from = process.env.GMAIL_USER;
  const to = process.env.ADMIN_EMAIL || process.env.GMAIL_USER;
  await getTransporter().sendMail({ from, to, subject, text });
}
