/**
 * Email HTML Templates for WorkPulse AI
 */

// Base template wrapper
const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WorkPulse AI</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #0f172a;
      color: #e2e8f0;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .card {
      background-color: #1e293b;
      border-radius: 12px;
      padding: 32px;
      margin: 20px 0;
      border: 1px solid #334155;
    }
    .logo {
      text-align: center;
      padding: 20px 0;
    }
    .logo h1 {
      color: #818cf8;
      font-size: 28px;
      margin: 0;
    }
    .logo span {
      color: #6366f1;
    }
    h2 {
      color: #f1f5f9;
      font-size: 22px;
      margin-bottom: 16px;
    }
    p {
      color: #94a3b8;
      font-size: 15px;
      line-height: 1.6;
      margin: 8px 0;
    }
    .btn {
      display: inline-block;
      background-color: #6366f1;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .btn:hover {
      background-color: #4f46e5;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #64748b;
      font-size: 12px;
    }
    .highlight {
      color: #818cf8;
      font-weight: 600;
    }
    .code {
      background-color: #334155;
      padding: 4px 12px;
      border-radius: 6px;
      font-family: monospace;
      font-size: 18px;
      color: #818cf8;
      letter-spacing: 4px;
    }
    .divider {
      border-top: 1px solid #334155;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <h1>🚀 Work<span>Pulse</span> AI</h1>
    </div>
    <div class="card">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} WorkPulse AI. All rights reserved.</p>
      <p>This email was sent by WorkPulse AI — Intelligent Team Productivity Platform</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Welcome Email
 */
const welcomeEmail = (userName) => {
  return baseTemplate(`
    <h2>Welcome to WorkPulse AI! 🎉</h2>
    <p>Hi <span class="highlight">${userName}</span>,</p>
    <p>Your account has been successfully created. You're now part of the
       most intelligent team productivity platform.</p>
    <div class="divider"></div>
    <p>Here's what you can do:</p>
    <p>📋 Manage projects with real-time Kanban boards</p>
    <p>🧠 Get AI-powered task assignments</p>
    <p>🔥 Monitor team burnout risk</p>
    <p>💚 Track team mood and wellness</p>
    <p>📊 View powerful analytics dashboards</p>
    <div class="divider"></div>
    <div style="text-align: center;">
      <a href="${process.env.CLIENT_URL}/dashboard" class="btn">Go to Dashboard →</a>
    </div>
    <p>Happy building! 🚀</p>
    <p>— The WorkPulse AI Team</p>
  `);
};

/**
 * Password Reset Email
 */
const passwordResetEmail = (userName, resetUrl) => {
  return baseTemplate(`
    <h2>Password Reset Request 🔐</h2>
    <p>Hi <span class="highlight">${userName}</span>,</p>
    <p>We received a request to reset your password. Click the button below
       to set a new password:</p>
    <div style="text-align: center;">
      <a href="${resetUrl}" class="btn">Reset Password →</a>
    </div>
    <div class="divider"></div>
    <p>⚠️ This link will expire in <strong>10 minutes</strong>.</p>
    <p>If you didn't request this, please ignore this email.
       Your password will remain unchanged.</p>
    <p>— The WorkPulse AI Team</p>
  `);
};

/**
 * Project Invitation Email
 */
const projectInviteEmail = (inviterName, projectName, role, inviteUrl) => {
  return baseTemplate(`
    <h2>You've Been Invited! 🎯</h2>
    <p><span class="highlight">${inviterName}</span> has invited you to join
       the project:</p>
    <h2 style="color: #818cf8; text-align: center;">${projectName}</h2>
    <p>Your role: <span class="highlight">${role}</span></p>
    <div style="text-align: center;">
      <a href="${inviteUrl}" class="btn">Accept Invitation →</a>
    </div>
    <div class="divider"></div>
    <p>If you weren't expecting this invitation, you can safely ignore this email.</p>
    <p>— The WorkPulse AI Team</p>
  `);
};

/**
 * Burnout Alert Email (for Managers)
 */
const burnoutAlertEmail = (managerName, developerName, riskScore, riskLevel) => {
  const levelEmoji = riskLevel === 'CRITICAL' ? '🚨' :
    riskLevel === 'HIGH' ? '🔴' : '🟡';

  return baseTemplate(`
    <h2>${levelEmoji} Burnout Risk Alert</h2>
    <p>Hi <span class="highlight">${managerName}</span>,</p>
    <p>Our AI system has detected a <strong>${riskLevel}</strong> burnout risk for
       team member <span class="highlight">${developerName}</span>.</p>
    <div style="text-align: center; margin: 20px 0;">
      <span class="code">Risk Score: ${riskScore}/100</span>
    </div>
    <div class="divider"></div>
    <p><strong>Recommended Actions:</strong></p>
    <p>💬 Schedule a 1-on-1 check-in</p>
    <p>📋 Review their current workload</p>
    <p>🏖️ Suggest time off if needed</p>
    <p>📊 Redistribute tasks if overloaded</p>
    <div style="text-align: center;">
      <a href="${process.env.CLIENT_URL}/team/burnout" class="btn">
        View Burnout Dashboard →
      </a>
    </div>
    <p>— WorkPulse AI Engine 🧠</p>
  `);
};

/**
 * Weekly Report Email
 */
const weeklyReportEmail = (userName, stats) => {
  return baseTemplate(`
    <h2>📊 Your Weekly Report</h2>
    <p>Hi <span class="highlight">${userName}</span>,
       here's your week in review:</p>
    <div class="divider"></div>
    <p>✅ Tasks Completed: <span class="highlight">${stats.tasksCompleted}</span></p>
    <p>📋 Tasks Created: <span class="highlight">${stats.tasksCreated}</span></p>
    <p>⏱️ Avg Completion Time: <span class="highlight">${stats.avgCompletionTime}</span></p>
    <p>💚 Mood Average: <span class="highlight">${stats.avgMood}/5</span></p>
    <p>🔥 Burnout Risk: <span class="highlight">${stats.burnoutLevel}</span></p>
    <div class="divider"></div>
    <div style="text-align: center;">
      <a href="${process.env.CLIENT_URL}/analytics" class="btn">
        View Full Analytics →
      </a>
    </div>
    <p>Keep up the great work! 🚀</p>
    <p>— WorkPulse AI</p>
  `);
};

module.exports = {
  welcomeEmail,
  passwordResetEmail,
  projectInviteEmail,
  burnoutAlertEmail,
  weeklyReportEmail
};