const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true,
});

const transporter2 = nodemailer.createTransport({
  host: "smtp.office365.com", // SMTP host for Outlook
  port: 587, // SMTP port for Outlook
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.EMAIL_USER, // Your Outlook email address
    pass: process.env.EMAIL_PASS, // Your Outlook email password or app password
  },
  tls: {
    ciphers: "SSLv3", // Ensure secure connection
  },
  debug: true, // Enable debug mode for troubleshooting
});



const sendEmail = async (to, subject, text) => {
  const data = await transporter2.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
