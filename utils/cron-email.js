const cron = require('node-cron');
const nodemailer = require('nodemailer');
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: __dirname + '/../.env' });

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_TO) {
  console.log('ENV CHECK: undefined NO PASS');
  process.exit(1);
}
console.log('ENV CHECK: PASS');

// Environment sanity check
console.log('ENV CHECK:', process.env.EMAIL_USER ? 'PASS' : 'NO PASS');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // Use TLS - true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Cron job to run every minute for testing (change to your desired interval)
cron.schedule('0 9 1 * *', async () => {
  console.log(`[${new Date().toISOString()}] [NODE-CRON] Starting payroll sync...`);

  try {
    // Trigger your sync endpoint
    const response = await axios.post('http://localhost:3000/sync');
    console.log('✅ Sync successful:', response.data);

    // Send notification email
    const mailOptions = {
      from: `"EAI Middleware" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: '✅ Payroll Sync Completed',
      text: 'The payroll sync completed successfully.',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
  } catch (error) {
    console.error('❌ Sync or Email failed:', error.message);

    // Optional: Send failure email
    try {
      await transporter.sendMail({
        from: `"EAI Middleware" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: '❌ Payroll Sync Failed',
        text: `The payroll sync failed.\n\nError: ${error.message}`,
      });
      console.log('⚠️ Failure email sent');
    } catch (emailError) {
      console.error('❌ Failed to send error email:', emailError.message);
    }
  }
});
