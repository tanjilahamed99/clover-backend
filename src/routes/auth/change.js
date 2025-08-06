const router = require('express').Router();
const AuthCode = require('../../models/AuthCode');
const Email = require('../../models/Email');
const User = require('../../models/User');
const config = require('../../../config');
const moment = require('moment');
const argon2 = require('argon2');
const sendBrevoCampaign = require('../../utils/brevoEmail');

router.post('*', async (req, res) => {
  let { code, email, password } = req.fields;

  let user;
  let authCode;

  if (!email) {
    return res.status(404).json({ status: 'error', code: 'email required' });
  }

  if (!code) {
    return res.status(404).json({ status: 'error', code: 'auth code required' });
  }

  try {
    user = await User.findOne({ email });
  } catch (e) {
    return res.status(404).json({ status: 'error', code: 'error while reading database' });
  }

  if (!user) {
    return res.status(404).json({ status: 'error', code: 'the associated user is no longer valid' });
  }

  try {
    authCode = await AuthCode.findOne({ code, user, valid: true });
  } catch (e) {
    return res.status(404).json({ status: 'error', code: 'error while reading database' });
  }

  if (!authCode) {
    return res.status(404).json({ status: 'error', code: 'auth code not found' });
  }

  if (moment(authCode.expires).isBefore(moment())) {
    return res.status(404).json({ status: 'error', code: 'auth code expired' });
  }

  if (password.length < 6) {
    return res.status(400).json({ status: 'error', password: 'password too short, must be at least 6 characters' });
  }

  user.password = await argon2.hash(password);

  await user.save();

  const entry = Email({
    from: config.nodemailer.from,
    to: user.email,
    subject: `${config.appTitle || config.appName || 'Clover'} - Password changed`,
    html: `<p>Hello ${user.firstName},<br/><br/>Your password has been changed!<br/><br/>Timestamp: ${moment().format(
      'HH:mm - D MMMM YYYY',
    )}</p>`,
  });

  await sendBrevoCampaign({
    subject: `${config.appTitle || config.appName || 'Sawamahe'} - Password Changed Successfully`,
    senderName: 'Sawamahe.in',
    senderEmail: process.env.BREVO_EMAIL,
    htmlContent: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h2 style="color: #333;">Hello ${user.firstName},</h2>
      <p style="font-size: 16px; color: #555;">
        This is a confirmation that your account password was successfully changed.
      </p>

      <p style="font-size: 16px; color: #555;">
        If you made this change, no further action is needed.
      </p>

      <p style="font-size: 16px; color: #555;">
        Thank you for taking steps to keep your account secure.
      </p>

      <p style="font-size: 14px; color: #999; margin-top: 40px;">
        Warm regards,<br/>
        <strong>The Sawamahe Team</strong>
      </p>

      <hr style="margin-top: 40px; border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 12px; color: #aaa; text-align: center;">
        © ${new Date().getFullYear()} Sawamahe.in — All rights reserved.
      </p>
    </div>
  </div>
  `,
    to: email,
  });

  entry.save();

  res.status(200).json({ status: 'status', message: 'email queued' });
});

module.exports = router;
