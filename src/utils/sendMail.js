import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = async ({ to, subject, html }) => {
  return await resend.emails.send({
    from: 'SarnyFish <noreply@sarnyfish.com>',
    to,
    subject,
    html,
  });
};
