const Lead = require('../models/Lead');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const token = crypto.randomBytes(20).toString('hex');

  const newLead = new Lead({ name, email, password, verificationToken: token });
  await newLead.save();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your Email',
    html: `<h2>Verify your email</h2><p>Click the link: <a href="http://localhost:5000/verify/${token}">Verify</a></p>`
  };

  await transporter.sendMail(mailOptions);

  res.status(200).json({ message: 'Verification email sent!' });
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  const lead = await Lead.findOne({ verificationToken: token });

  if (!lead) return res.status(400).json({ message: 'Invalid or expired token' });

  lead.isVerified = true;
  lead.verificationToken = undefined;
  await lead.save();

  res.redirect('/thank-you.html'); // Your thank-you dashboard
};
