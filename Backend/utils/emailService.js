const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail', // or use a different email provider
    port: 587,  // Use 587 for TLS or 465 for SSL
  secure: false, // Set to true if using port 465 (SSL)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    debug: true, // Add this line
});

const sendEmail = async (to, subject, text) => {


    
   const data = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    });
};

module.exports = sendEmail;
