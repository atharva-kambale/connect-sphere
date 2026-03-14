// server/utils/sendEmail.js
const { Resend } = require('resend');

const sendEmail = async (options) => {
  // Pulls the key you added to Render/ENV
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: 'Connect Sphere <onboarding@resend.dev>',
      to: options.email,
      subject: options.subject,
      text: options.message,
    });
    console.log(`✅ Email sent successfully to ${options.email}`);
  } catch (error) {
    console.error("❌ Resend API Error:", error);
    // We throw the error so the controller knows it failed
    throw new Error('Email delivery failed');
  }
};

module.exports = sendEmail;