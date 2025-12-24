const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});

async function sendMail(to, subject, text, html = null, opts = {}) {
  if (!process.env.SENDER_EMAIL) {
    throw new Error('Missing SENDER_EMAIL in environment variables');
  }

  const info = await transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    text,
    html,
    ...opts
  });

  console.log(`Email sent to ${to}`);
  return info;
}

module.exports = { sendMail };
