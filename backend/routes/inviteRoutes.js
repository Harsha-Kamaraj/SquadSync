// Invite routes
const express = require('express');
const jwt = require('jsonwebtoken');
const { sendMail } = require('../config/mail'); // your sendMail helper
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'U9n3s4RBJwr5YdMmujWcQdf87xgKwt4r';

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ ok: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, message: 'Invalid token' });
  }
};

const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

function inviteHtmlTemplate({ personalName, inviterName, inviterEmail, teamName, message, inviteLink }) {
  return `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Invitation to join ${teamName}</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height:1.4; color:#222;">
    <h2>You're invited to join <span style="color:#2b6cb0">${teamName}</span></h2>
    <p>Hi ${personalName || 'there'},</p>
    <p>
      <strong>${inviterName}</strong> (<a href="mailto:${inviterEmail}">${inviterEmail}</a>) invited you to join the <strong>${teamName}</strong> workspace on SquadSync.
    </p>
    ${message ? `<blockquote style="border-left:3px solid #eee; padding-left:10px; color:#444">${message}</blockquote>` : ''}
    <hr/>
    <p style="font-size:12px; color:#666">If you didn't expect this invitation, you can ignore this email.</p>
  </body>
  </html>
  `;
}

// Send team invitations
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { inviterName, inviterEmail, teamName, invitees, message, inviteLink } = req.body;

    // Basic validation
    if (!inviterName || !inviterEmail || !teamName || !Array.isArray(invitees) || invitees.length === 0) {
      return res.status(400).json({ ok: false, message: 'Missing required fields: inviterName, inviterEmail, teamName, invitees (array).' });
    }
    if (!inviteLink) {
      // you may want to generate an inviteLink server-side in production
      return res.status(400).json({ ok: false, message: 'inviteLink is required (temporary or permanent link to accept invite).' });
    }

    // validate emails
    const invalid = invitees.filter((e) => !isValidEmail(e));
    if (invalid.length) {
      return res.status(400).json({ ok: false, message: 'Invalid invitee emails', invalid });
    }

    // send to each invitee individually
    const results = [];
    
    for (const to of invitees) {
      const personalName = to.split('@')[0];
      const subject = `${inviterName} invited you to join ${teamName} on SquadSync`;
      const html = inviteHtmlTemplate({ personalName, inviterName, inviterEmail, teamName, message, inviteLink });
      const text = `${inviterName} invited you to join ${teamName} on SquadSync. Accept here: ${inviteLink}`;

      try {
        const info = await sendMail(to, subject, text, html);
        results.push({ to, ok: true, info: info.response || info });
      } catch (err) {
        console.error('Invite email error for', to, err);
        results.push({ to, ok: false, error: err.message || err });
      }
    }

    return res.json({ ok: true, summary: results });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
