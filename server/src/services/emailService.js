const logger = require('../utils/logger');

// ✅ Safe imports — never crash
let sendEmail;
let emailTemplates;

try {
  const emailConfig = require('../config/email');
  sendEmail = emailConfig.sendEmail;
} catch (error) {
  logger.warn(`⚠️ Email config not available: ${error.message}`);
  sendEmail = async ({ to, subject }) => {
    logger.info(`📧 [MOCK] Email to ${to}: ${subject}`);
    return { messageId: 'mock' };
  };
}

try {
  emailTemplates = require('../utils/emailTemplates');
} catch (error) {
  logger.warn(`⚠️ Email templates not available: ${error.message}`);
  emailTemplates = {
    welcomeEmail: (name) => `<p>Welcome ${name}!</p>`,
    passwordResetEmail: (name, url) => `<p>Hi ${name}, reset: ${url}</p>`,
    projectInviteEmail: () => '<p>Project invite</p>',
    burnoutAlertEmail: () => '<p>Burnout alert</p>'
  };
}

class EmailService {
  /**
   * Send welcome email to new user
   */
  static async sendWelcomeEmail(user) {
    try {
      const html = emailTemplates.welcomeEmail(user.firstName);

      await sendEmail({
        to: user.email,
        subject: '🚀 Welcome to WorkPulse AI!',
        html,
        text: `Welcome to WorkPulse AI, ${user.firstName}! Your account has been created successfully.`
      });

      logger.info(`✅ Welcome email sent to ${user.email}`);
    } catch (error) {
      logger.warn(`⚠️ Welcome email failed for ${user.email}: ${error.message}`);
      // Don't throw — email failure shouldn't block registration
    }
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(user, resetToken) {
    try {
      const resetUrl = `${process.env.CLIENT_URL || process.env.FRONTEND_URL || 'https://workpluse.vercel.app'}/reset-password/${resetToken}`;
      const html = emailTemplates.passwordResetEmail(user.firstName, resetUrl);

      await sendEmail({
        to: user.email,
        subject: '🔐 Password Reset Request — WorkPulse AI',
        html,
        text: `Hi ${user.firstName}, reset your password here: ${resetUrl}. This link expires in 10 minutes.`
      });

      logger.info(`✅ Password reset email sent to ${user.email}`);
    } catch (error) {
      logger.error(`❌ Password reset email failed for ${user.email}: ${error.message}`);
      throw new Error('Failed to send password reset email. Please try again later.');
    }
  }

  /**
   * Send project invitation email
   */
  static async sendProjectInviteEmail(inviter, inviteeEmail, project, role) {
    try {
      const inviteUrl = `${process.env.CLIENT_URL || process.env.FRONTEND_URL || 'https://workpluse.vercel.app'}/projects/${project._id}`;
      const html = emailTemplates.projectInviteEmail(
        inviter.fullName,
        project.name,
        role,
        inviteUrl
      );

      await sendEmail({
        to: inviteeEmail,
        subject: `📧 You've been invited to ${project.name} — WorkPulse AI`,
        html,
        text: `${inviter.fullName} has invited you to join "${project.name}" as ${role}.`
      });

      logger.info(`✅ Project invite email sent to ${inviteeEmail}`);
    } catch (error) {
      logger.warn(`⚠️ Invite email failed for ${inviteeEmail}: ${error.message}`);
    }
  }

  /**
   * Send burnout alert email to manager
   */
  static async sendBurnoutAlertEmail(manager, developer, riskScore, riskLevel) {
    try {
      const html = emailTemplates.burnoutAlertEmail(
        manager.firstName,
        developer.fullName,
        riskScore,
        riskLevel
      );

      await sendEmail({
        to: manager.email,
        subject: `🚨 Burnout Alert: ${developer.fullName} — WorkPulse AI`,
        html,
        text: `Burnout alert: ${developer.fullName} has a ${riskLevel} risk score of ${riskScore}/100.`
      });

      logger.info(`✅ Burnout alert sent to ${manager.email}`);
    } catch (error) {
      logger.warn(`⚠️ Burnout alert email failed: ${error.message}`);
    }
  }

  /**
   * Send password changed confirmation
   */
  static async sendPasswordChangedEmail(user) {
    try {
      await sendEmail({
        to: user.email,
        subject: '🔒 Password Changed — WorkPulse AI',
        html: `<p>Hi ${user.firstName},</p><p>Your password has been changed successfully. If you didn't make this change, please contact support immediately.</p>`,
        text: `Hi ${user.firstName}, your password has been changed successfully.`
      });

      logger.info(`✅ Password changed email sent to ${user.email}`);
    } catch (error) {
      logger.warn(`⚠️ Password changed email failed: ${error.message}`);
    }
  }
}

module.exports = EmailService;