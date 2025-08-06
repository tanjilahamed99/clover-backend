const router = require('express').Router();
const AuthCode = require('../../models/AuthCode');
const Email = require('../../models/Email');
const User = require('../../models/User');
const config = require('../../../config');
const randomstring = require('randomstring');
const moment = require('moment');
const isEmpty = require('../../utils/isEmpty');
const sendBrevoCampaign = require('../../utils/brevoEmail');

router.post('*', async (req, res) => {
  let { email } = req.fields;

  if (isEmpty(email)) {
    return res.status(400).json({ status: 'error', email: 'email required' });
  }

  let user;

  try {
    user = await User.findOne({ email });
  } catch (e) {
    return res.status(404).json({ status: 'error', email: 'error while reading database' });
  }

  if (!user) {
    return res.status(404).json({ status: 'error', email: 'no user matches this email address' });
  }

  await AuthCode.updateMany({ user }, { $set: { valid: false } });

  const authCode = AuthCode({
    code: randomstring.generate({ charset: 'numeric', length: 6 }),
    valid: true,
    user: user._id,
    expires: moment().add(10, 'minutes').toDate(),
  });

  authCode.save();

  const entry = Email({
    from: config.nodemailer.from,
    to: user.email,
    subject: `${config.appTitle || config.appName || 'Sawamahe'} - Authentication Code`,
    html: `<p>Hello ${user.firstName},<br/><br/>Here is your authentication code: ${authCode.code}</p>`,
  });

  entry.save();

  await sendBrevoCampaign({
    subject: `${config.appTitle || config.appName || 'Sawamahe'} - Password Reset Code`,
    senderName: 'Sawamahe.in',
    senderEmail: process.env.BREVO_EMAIL,
    htmlContent: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <h2 style="color: #333;">Hi ${user.firstName},</h2>
      <p style="font-size: 16px; color: #555;">We received a request to reset your password. Please use the authentication code below to proceed:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 28px; font-weight: bold; letter-spacing: 3px; color: #2e7dff; border: 2px dashed #2e7dff; padding: 12px 20px; display: inline-block; border-radius: 8px;">
          ${authCode.code}
        </span>
      </div>

      <p style="font-size: 14px; color: #777;">This code is valid for the next 10 minutes. If you didn’t request this, please ignore this email or contact support.</p>

      <p style="font-size: 14px; color: #999; margin-top: 40px;">Thanks,<br/>The Sawamahe Team</p>

      <hr style="margin-top: 40px; border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 12px; color: #aaa; text-align: center;">
        © ${new Date().getFullYear()} Sawamahe.in — All rights reserved.
      </p>
    </div>
  </div>
  `,
    to: email,
  });

  res.status(200).json({ status: 'status', message: 'email queued' });
});

module.exports = router;
