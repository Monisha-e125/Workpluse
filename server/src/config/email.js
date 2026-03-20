const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

let transporter = null;

const createEmailTransporter = () => {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    logger.info('✅ Email transporter created');
    return transporter;
  } catch (error) {
    logger.warn(`⚠️ Email transporter failed: ${error.message}`);
    return null;
  }
};

const verifyEmailTransporter = async () => {
  try {
    if (!transporter) {
      createEmailTransporter();
    }

    if (transporter) {
      await transporter.verify();
      logger.info('✅ Email transporter verified');
      return true;
    }
    return false;
  } catch (error) {
    logger.warn(`⚠️ Email verification failed: ${error.message}`);
    return false;
  }
};

const getEmailTransporter = () => {
  if (!transporter) {
    createEmailTransporter();
  }
  return transporter;
};

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (!transporter) {
      createEmailTransporter();
    }

    if (!transporter) {
      logger.warn('Email transporter not available. Skipping email.');
      return null;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'WorkPulse AI <noreply@workpulse.ai>',
      to,
      subject,
      html,
      text
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`📧 Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`📧 Email send failed: ${error.message}`);
    throw error;
  }
};

module.exports = {
  createEmailTransporter,
  verifyEmailTransporter,
  getEmailTransporter,
  sendEmail
};