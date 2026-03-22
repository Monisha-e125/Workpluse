/**
 * Email Templates — HTML generators
 */

const welcomeEmail = (firstName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f172a; color: #e2e8f0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 12px; padding: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: bold; color: #818cf8; }
        h1 { color: #f1f5f9; font-size: 24px; }
        p { color: #94a3b8; line-height: 1.6; font-size: 16px; }
        .btn { display: inline-block; background: #818cf8; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Work<span style="color:#a78bfa">Pulse</span> AI</div>
        </div>
        <h1>Welcome, ${firstName}! 🎉</h1>
        <p>Your account has been created successfully. You're now part of the WorkPulse AI team productivity platform.</p>
        <p>Here's what you can do:</p>
        <ul style="color: #94a3b8;">
          <li>📊 Track projects and tasks</li>
          <li>🤖 Get AI-powered insights</li>
          <li>💬 Collaborate with your team</li>
          <li>📈 Monitor productivity analytics</li>
        </ul>
        <div class="footer">
          <p>© ${new Date().getFullYear()} WorkPulse AI. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const passwordResetEmail = (firstName, resetUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f172a; color: #e2e8f0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 12px; padding: 40px; }
        .logo { font-size: 28px; font-weight: bold; color: #818cf8; text-align: center; margin-bottom: 30px; }
        h1 { color: #f1f5f9; font-size: 24px; }
        p { color: #94a3b8; line-height: 1.6; font-size: 16px; }
        .btn { display: inline-block; background: #818cf8; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
        .warning { color: #fbbf24; font-size: 14px; }
        .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">Work<span style="color:#a78bfa">Pulse</span> AI</div>
        <h1>Password Reset Request 🔐</h1>
        <p>Hi ${firstName},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center;">
          <a href="${resetUrl}" class="btn">Reset Password</a>
        </div>
        <p class="warning">⚠️ This link expires in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
        <div class="footer">
          <p>© ${new Date().getFullYear()} WorkPulse AI. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const projectInviteEmail = (inviterName, projectName, role, inviteUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f172a; color: #e2e8f0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 12px; padding: 40px; }
        .logo { font-size: 28px; font-weight: bold; color: #818cf8; text-align: center; margin-bottom: 30px; }
        h1 { color: #f1f5f9; font-size: 24px; }
        p { color: #94a3b8; line-height: 1.6; font-size: 16px; }
        .btn { display: inline-block; background: #818cf8; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
        .highlight { color: #818cf8; font-weight: 600; }
        .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">Work<span style="color:#a78bfa">Pulse</span> AI</div>
        <h1>Project Invitation 📧</h1>
        <p><span class="highlight">${inviterName}</span> has invited you to join the project <span class="highlight">"${projectName}"</span> as <span class="highlight">${role}</span>.</p>
        <div style="text-align: center;">
          <a href="${inviteUrl}" class="btn">View Project</a>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} WorkPulse AI. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const burnoutAlertEmail = (managerName, developerName, riskScore, riskLevel) => {
  const levelColors = {
    LOW: '#22c55e',
    MEDIUM: '#eab308',
    HIGH: '#f97316',
    CRITICAL: '#ef4444'
  };
  const color = levelColors[riskLevel] || '#ef4444';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f172a; color: #e2e8f0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 12px; padding: 40px; }
        .logo { font-size: 28px; font-weight: bold; color: #818cf8; text-align: center; margin-bottom: 30px; }
        h1 { color: #f1f5f9; font-size: 24px; }
        p { color: #94a3b8; line-height: 1.6; font-size: 16px; }
        .alert-box { background: #1a1a2e; border: 2px solid ${color}; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
        .score { font-size: 48px; font-weight: bold; color: ${color}; }
        .level { font-size: 18px; color: ${color}; font-weight: 600; text-transform: uppercase; }
        .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">Work<span style="color:#a78bfa">Pulse</span> AI</div>
        <h1>🚨 Burnout Alert</h1>
        <p>Hi ${managerName},</p>
        <p>Our AI has detected a potential burnout risk for <strong>${developerName}</strong>.</p>
        <div class="alert-box">
          <div class="score">${riskScore}/100</div>
          <div class="level">${riskLevel} RISK</div>
        </div>
        <p>We recommend scheduling a 1-on-1, adjusting workload, or suggesting time off.</p>
        <div class="footer">
          <p>© ${new Date().getFullYear()} WorkPulse AI. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  welcomeEmail,
  passwordResetEmail,
  projectInviteEmail,
  burnoutAlertEmail
};