const nodemailer = require('nodemailer');

const sendOTP = async (email, otp) => {
  // Create a transporter using environment credentials
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Maharashtra Diaries" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verification Code for Maharashtra Diaries',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #FF6B00; border-radius: 10px;">
        <h2 style="color: #FF6B00; text-align: center;">Welcome to Maharashtra Diaries!</h2>
        <p>You're almost there! Please use the following One-Time Password (OTP) to verify your email address. This code will expire in 10 minutes.</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1a1a2e;">${otp}</span>
        </div>
        <p>If you didn't request this code, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777; text-align: center;">Maharashtra Diaries - Discover the beauty of Maharashtra</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

const sendWelcomeEmail = async (email, username) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Maharashtra Diaries" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Welcome to Maharashtra Diaries!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #FF6B00; border-radius: 20px; background-color: #0f0f1a; color: #ffffff;">
        <h1 style="color: #FF6B00; text-align: center; font-size: 28px;">Namaste, ${username}! 🙏</h1>
        <p style="font-size: 16px; line-height: 1.6;">Thank you for joining <strong>Maharashtra Diaries</strong>. We're thrilled to have you as part of our community of explorers.</p>
        <p style="font-size: 16px; line-height: 1.6;">Maharashtra is a land of incredible diversity—from the misty Sahyadri peaks to the pristine Konkan coast. Now you're all set to:</p>
        <ul style="font-size: 15px; line-height: 1.8;">
          <li>Plan detailed itineraries with our smart builder</li>
          <li>Discover hidden gems and heritage sites</li>
          <li>Save your favorite destinations</li>
          <li>Export your travel plans as premium PDFs</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:5173/dashboard" style="background-color: #FF6B00; color: #000000; padding: 12px 25px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px;">Go to Dashboard</a>
        </div>
        <p style="font-size: 14px; text-align: center; color: #777; margin-top: 40px;">Happy Traveing!<br>The Maharashtra Diaries Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

module.exports = { sendOTP, sendWelcomeEmail };
