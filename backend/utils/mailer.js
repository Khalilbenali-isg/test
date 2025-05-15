import nodemailer from "nodemailer";
import 'dotenv/config';

console.log('Email credentials:', {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS ? 'Password exists (not showing for security)' : 'Password is missing',
  service: 'gmail'
});


const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
 
  tls: {
    rejectUnauthorized: false 
  },
  debug: true,
});

const sendVerificationEmail = async (email, code) => {
  try {
    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email',
      text: `Your verification code is: ${code}`,
     
      html: `<p>Your verification code is: <strong>${code}</strong></p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; 
  }
};
const sendPasswordResetEmail = async (email, resetToken) => {
  
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const mailOptions = {
    from: `"E-plant" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request',
    text: `You requested a password reset. Please click on the following link to reset your password: ${resetUrl}. This link will expire in 1 hour.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #4CAF50;">Password Reset Request</h2>
        <p>You requested a password reset for your E-plant account.</p>
        <p>Please click the button below to reset your password. This link will expire in 1 hour.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset My Password</a>
        </div>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p style="word-break: break-all;">${resetUrl}</p>
      </div>
    `
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error; 
  }
};
export { sendVerificationEmail, sendPasswordResetEmail };
export default sendVerificationEmail;