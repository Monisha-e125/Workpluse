const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

let transporter = null;

/**
 * Initialize email transporter
 * Won't crash if email config is missing
 */
const initTransporter = () => {
  try {
    // Check if email config exists
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      logger.warn('⚠️ Email not configured — SMTP_HOST, SMTP_USER, or SMTP_PASS missing');
      logger.warn('⚠️ Emails will be logged to console instead of sent');
      return null;
    }

    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    logger.info('✅ Email transporter initialized');
    return transporter;
  } catch (error) {
    logger.warn(`⚠️ Email transporter init failed: ${error.message}`);
    return null;
  }
};

/**
 * Send email — safe wrapper that never crashes
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    // Initialize transporter on first use
    if (!transporter) {
      initTransporter();
    }

    // If still no transporter, log and return
    if (!transporter) {
      logger.info(`📧 [EMAIL NOT CONFIGURED] Would send to: ${to}`);
      logger.info(`📧 Subject: ${subject}`);
      logger.info(`📧 Text: ${text || '(HTML only)'}`);
      return { messageId: 'not-configured', logged: true };
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || `"WorkPulse AI" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`📧 Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`📧 Failed to send email to ${to}: ${error.message}`);
    throw error;
  }
};

module.exports = { sendEmail, initTransporter };