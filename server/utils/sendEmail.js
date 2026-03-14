// server/utils/sendEmail.js

const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter (the email service)
  const transporter = nodemailer.createTransport({
    service: 'gmail', // We will use Gmail for now
    auth: {
      user: process.env.EMAIL_USER, // Your developer gmail
      pass: process.env.EMAIL_PASS, // Your special App Password
    },
  });

  // 2. Define the email options
  const mailOptions = {
    from: `"Connect Sphere Admin" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // You can also use html: options.html if you want to make the email look fancy later!
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;