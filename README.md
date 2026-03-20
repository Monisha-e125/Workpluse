<div align="center">

# 🚀 WorkPulse AI

### Intelligent Team Productivity & Wellness Platform

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7+-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4+-010101?logo=socket.io)](https://socket.io/)

<p align="center">
  <strong>AI-powered workload balancing • Burnout detection • Real-time Kanban • Team mood tracking</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-installation">Installation</a> •
  
  <a href="#-api-documentation">API Docs</a> •
  <a href="#-architecture">Architecture</a>
</p>

---

</div>

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Problem Statement](#-problem-statement)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Database Schema](#-database-schema)
- [Installation](#-installation)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [AI Algorithms](#-ai-algorithms)
- [Real-Time Features](#-real-time-features)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🎯 About The Project

**WorkPulse AI** is a full-stack web application that combines **real-time project management** with **AI-powered workload balancing**, **developer burnout detection**, **automated daily standups**, and **team mood/sentiment analysis** — creating a sustainable and high-performing engineering culture.

Unlike traditional project management tools (Jira, Trello, ClickUp) that only focus on task tracking, WorkPulse AI goes further by:

- 🧠 **Intelligently assigning tasks** based on skills, capacity, and burnout risk
- 🔥 **Detecting burnout early** using a 7-factor risk analysis algorithm
- 💚 **Tracking team wellness** through daily mood check-ins and sentiment trends
- 🤖 **Automating daily standups** by analyzing activity data
- 📊 **Providing actionable insights** through interactive analytics dashboards

---

## ❗ Problem Statement

In modern software teams, **83% of developers experience burnout** (Stack Overflow Survey 2023), and managers have **zero visibility** into uneven workload distribution until it's too late. Existing tools like Jira and Trello focus *only* on task tracking, completely **ignoring developer well-being, expertise-based task matching, and intelligent workload distribution**.

### Solution

WorkPulse AI is the **first team productivity platform** that combines real-time project management with AI-powered workload balancing, developer burnout risk detection, automated daily standups, and team mood/sentiment analysis.

---

## ✨ Features

### 📋 Core Project Management
| Feature | Description |
|---------|-------------|
| **Kanban Board** | Drag-and-drop task management with 6 status columns (Backlog → Done) |
| **Project Management** | Create projects, manage members, configure settings |
| **Sprint Management** | Plan, start, and complete sprints with velocity tracking |
| **Task Management** | Create tasks with priority, type, story points, labels, due dates |
| **My Tasks** | Personal task dashboard with status change, quick-complete, and filters |
| **Comments** | Add comments on tasks with AI sentiment analysis |
| **File Attachments** | Upload files to tasks via Cloudinary |

### 🧠 AI Engine (Unique Features)
| Feature | Description |
|---------|-------------|
| **AI Workload Balancer** | Analyzes 5 weighted factors to optimally distribute tasks across team |
| **AI Auto-Assign** | Automatically assigns tasks to the best-fit developer |
| **Skill-Based Matching** | Matches task requirements with developer expertise and proficiency |
| **Burnout Detection** | 7-factor burnout risk analysis with severity scoring (0-100) |
| **Sprint Prediction** | AI predicts sprint completion likelihood and health |
| **AI Recommendations** | Actionable suggestions for workload redistribution and wellness |

### 💚 Team Wellness
| Feature | Description |
|---------|-------------|
| **Mood Check-In** | Daily emoji-based mood tracking with factor selection |
| **Mood Trends** | Visual mood trend charts over time |
| **Team Mood Dashboard** | Manager view of entire team's mood and sentiment |
| **Factor Analysis** | Identifies top factors affecting team mood |

### 🤖 Auto Standups
| Feature | Description |
|---------|-------------|
| **AI Standup Generation** | Automatically generates standup reports from activity data |
| **Yesterday/Today/Blockers** | Standard standup format auto-populated from task data |
| **Sprint Health Score** | AI-calculated sprint health percentage |
| **AI Insights** | At-risk items, velocity comparison, and recommendations |

### ⚡ Real-Time Features
| Feature | Description |
|---------|-------------|
| **Real-Time Kanban** | Live task updates across all connected clients via WebSocket |
| **Team Chat** | Project-based real-time messaging with typing indicators |
| **Live Notifications** | Instant push notifications with toast popups |
| **Online Presence** | Real-time connection status indicator |

### 📊 Analytics Dashboard
| Feature | Description |
|---------|-------------|
| **Task Status Distribution** | Interactive donut chart of task statuses |
| **Priority Breakdown** | Horizontal bar chart of task priorities |
| **Completion Trend** | Area chart of tasks completed over 30 days |
| **Team Workload** | Grouped bar chart comparing member workloads |
| **Mood Trend** | Line chart of team mood over 30 days |
| **Activity Heatmap** | GitHub-style contribution heatmap |
| **Sprint Velocity** | Bar chart of story points per sprint |

### 🔐 Authentication & Security
| Feature | Description |
|---------|-------------|
| **JWT Auth** | Access token + Refresh token flow |
| **Role-Based Access** | 4 roles: Admin, Manager, Developer, Viewer |
| **Password Security** | bcrypt hashing, change password, forgot/reset password |
| **Rate Limiting** | API rate limiting to prevent abuse |
| **Input Validation** | Server-side validation with express-validator |

### ⚙️ Settings & Customization
| Feature | Description |
|---------|-------------|
| **Profile Management** | Update name, bio, department, social links |
| **Skills Manager** | Add/remove skills with proficiency stars (1-5) |
| **Password Change** | Secure password update flow |
| **Notification Preferences** | Toggle email, push, weekly reports, mood reminders |
| **Theme Switching** | Dark mode and Light mode with persistence |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React.js 18** | UI library with functional components & hooks |
| **Redux Toolkit** | State management with async thunks |
| **React Router v6** | Client-side routing with protected routes |
| **Tailwind CSS** | Utility-first CSS framework |
| **Vite** | Build tool and dev server |
| **Socket.io Client** | Real-time WebSocket communication |
| **Recharts** | Interactive chart library |
| **@hello-pangea/dnd** | Drag-and-drop for Kanban board |
| **Framer Motion** | Animations and transitions |
| **Lucide React** | Icon library |
| **React Hot Toast** | Toast notifications |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js 18+** | JavaScript runtime |
| **Express.js** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | ODM for MongoDB |
| **Socket.io** | Real-time bidirectional communication |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **express-validator** | Input validation |
| **Nodemailer** | Email service |
| **Winston** | Logging |
| **Cloudinary** | File storage |
| **Redis/ioredis** | Caching (optional) |

### DevOps
| Technology | Purpose |
|-----------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **GitHub Actions** | CI/CD pipeline |
| **Nginx** | Reverse proxy for production |

---

## 🏗️ System Architecture 
┌─────────────────────────────────────────────────────────────────┐
│ CLIENT (React.js) │
│ ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌──────────────────┐ │
│ │ Dashboard│ │ Kanban │ │ Mood │ │ AI Insights │ │
│ │ Analytics│ │ Board │ │ Tracker │ │ Panel │ │
│ └────┬─────┘ └────┬─────┘ └─────┬─────┘ └────────┬─────────┘ │
│ │ │ │ │ │
│ ┌────▼─────────────▼─────────────▼─────────────────▼────────┐ │
│ │ Redux Toolkit (State Management) │ │
│ └────────────────────────┬──────────────────────────────────┘ │
└───────────────────────────┼─────────────────────────────────────┘
│ HTTP / WebSocket
┌───────────────────────────▼─────────────────────────────────────┐
│ API SERVER (Express.js) │
│ ┌─────────┐ ┌──────────┐ ┌───────────┐ ┌───────────────────┐ │
│ │ Auth │ │ Project │ │ AI Engine │ │ Notification │ │
│ │ Service │ │ Service │ │ Service │ │ Service │ │
│ └────┬────┘ └────┬─────┘ └─────┬─────┘ └─────────┬─────────┘ │
│ │ │ │ │ │
│ ┌────▼───────────▼─────────────▼───────────────────▼────────┐ │
│ │ MongoDB (Database) │ │
│ └───────────────────────────────────────────────────────────┘ │
│ ┌────────────────┐ ┌──────────────┐ ┌─────────────────────┐ │
│ │ Redis Cache │ │ Socket.io │ │ Cloudinary (Files) │ │
│ └────────────────┘ └──────────────┘ └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

---

## 📊 Database Schema

### Collections

| Collection | Description | Key Fields |
|-----------|-------------|------------|
| **Users** | User accounts & profiles | email, password, role, skills, burnoutProfile |
| **Projects** | Project details & settings | name, key, owner, members, sprints, settings |
| **Tasks** | Task details & history | title, status, priority, assignee, statusHistory, comments |
| **MoodCheckIns** | Daily mood records | user, mood (1-5), factors, note |
| **Standups** | Auto-generated reports | project, entries, aiInsights |
| **ChatMessages** | Project chat messages | project, sender, text |
| **Notifications** | User notifications | recipient, type, title, isRead |
| **ActivityLogs** | User activity tracking | user, action, details, timestamp |

### Relationships
User ──┬──< Project (owner)
├──< Task (assignee/reporter)
├──< MoodCheckIn
├──< ChatMessage (sender)
├──< Notification (recipient)
└──< ActivityLog

Project ──┬──< Task
├──< ChatMessage
├──< Standup
└──< Members (User[])

---

## 📦 Installation

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** v7 or higher
- **Redis** v7 (optional — app works without it)
- **Git**

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Monisha-e125/workpulse-ai.git
cd workpulse-ai

# 2. Setup Backend
cd server
cp .env.example .env          # Edit .env with your values
npm install
npm run dev                    # Starts on http://localhost:5001

# 3. Setup Frontend (new terminal)
cd client
cp .env.example .env
npm install
npm run dev                    # Starts on http://localhost:5173

Environment Variables
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/workpulse-ai
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRE=30d
CLIENT_URL=http://localhost:5173
REDIS_URL=redis://localhost:6379
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

Client 
VITE_API_URL=http://localhost:5001/api/v1
VITE_SOCKET_URL=http://localhost:5001

Docker Setup
# Run everything with Docker Compose
docker-compose up -d

# Access:
# Frontend: http://localhost:80
# Backend:  http://localhost:5001
# MongoDB:  localhost:27017
# Redis:    localhost:6379
📡 API Documentation
Base URL: http://localhost:5001/api/v1
Authentication APIs
Method	Endpoint	Description
POST	/auth/register	Register new user
POST	/auth/login	Login with credentials
POST	/auth/logout	Logout user
GET	/auth/me	Get current user profile
PUT	/auth/profile	Update profile
PUT	/auth/change-password	Change password
POST	/auth/forgot-password	Send reset email
POST	/auth/reset-password/:token	Reset password
POST	/auth/refresh-token	Refresh access token
User APIs
Method	Endpoint	Description
GET	/users	List all users
GET	/users/search?q=	Search users
GET	/users/:id	Get user by ID
PUT	/users/skills	Update user skills
PUT	/users/:id/role	Update user role (Admin)
Project APIs
Method	Endpoint	Description
GET	/projects	List user's projects
POST	/projects	Create project
GET	/projects/:id	Get project details
PUT	/projects/:id	Update project
DELETE	/projects/:id	Delete project
GET	/projects/:id/members	Get project members
POST	/projects/:id/members	Add member
DELETE	/projects/:id/members/:userId	Remove member
Task APIs
Method	Endpoint	Description
GET	/tasks	List tasks (with filters)
POST	/tasks	Create task
GET	/tasks/my-tasks	Get my assigned tasks
GET	/tasks/kanban/:projectId	Get Kanban board data
GET	/tasks/:id	Get task details
PUT	/tasks/:id	Update task
PATCH	/tasks/:id/status	Update task status
DELETE	/tasks/:id	Delete task
POST	/tasks/:id/comments	Add comment
AI Engine APIs ⭐
Method	Endpoint	Description
POST	/ai/auto-assign	AI auto-assign task
GET	/ai/workload/:projectId	Team workload analysis
GET	/ai/burnout/:userId	Individual burnout risk
GET	/ai/burnout/team/:projectId	Team burnout overview
GET	/ai/skill-match/:projectId	Skill matching
GET	/ai/sprint-prediction/:projectId/:sprintId	Sprint prediction
Mood APIs
Method	Endpoint	Description
POST	/mood/check-in	Submit mood check-in
GET	/mood/history	Get mood history
GET	/mood/team/:projectId	Get team mood
Standup APIs
Method	Endpoint	Description
POST	/standups/:projectId/generate	Generate AI standup
GET	/standups/:projectId	Get standups
GET	/standups/:projectId/latest	Get latest standup
Chat APIs
Method	Endpoint	Description
GET	/chat/:projectId/messages	Get chat messages
POST	/chat/:projectId/messages	Send message
DELETE	/chat/messages/:id	Delete message
Notification APIs
Method	Endpoint	Description
GET	/notifications	Get notifications
GET	/notifications/unread-count	Get unread count
PUT	/notifications/:id/read	Mark as read
PUT	/notifications/read-all	Mark all as read
DELETE	/notifications/clear-all	Clear all
Analytics APIs
Method	Endpoint	Description
GET	/analytics/dashboard	Dashboard summary
GET	/analytics/project/:projectId	Project analytics
GET	/analytics/heatmap/:userId	Activity heatmap
GET	/analytics/mood/:projectId	Mood analytics
Total: 50+ API Endpoints

🧠 AI Algorithms
1. Workload Balancer Algorithm
The AI Workload Balancer uses a weighted scoring system to determine the optimal developer for each task:

text

Total Score = (TaskLoad × 0.30) + (SkillMatch × 0.25) + 
              (Complexity × 0.15) + (BurnoutFactor × 0.20) + 
              (Speed × 0.10)

Where:
- TaskLoad: 1 - (currentTasks / maxTasks)
- SkillMatch: Proficiency + RecencyBonus for each required skill
- Complexity: avgComplexityHandled / 10
- BurnoutFactor: 1 - (burnoutRisk / 100)
- Speed: benchmarkHours / avgCompletionTime
2. Burnout Detection Algorithm
The 7-factor burnout detection system scores each factor and aggregates:

Factor	Max Score	Trigger
Task Overload	20	> 2x team average tasks
Overdue Tasks	20	> 5 overdue tasks
Task Complexity	15	Avg complexity > 8/10
Time Off Gap	15	> 90 days since PTO
Priority Load	15	> 5 critical/high tasks
Activity Volume	10	> 20 actions/day
Comment Sentiment	5	> 5 negative comments/week
Risk Levels: LOW (0-30) → MEDIUM (31-50) → HIGH (51-70) → CRITICAL (71-100)

3. Skill Matching Algorithm
text

MatchScore = Σ (Proficiency/5 + RecencyBonus) × SkillWeight / TotalWeight

RecencyBonus = max(0, 0.2 × (1 - daysSinceUsed/365))
⚡ Real-Time Features
WorkPulse AI uses Socket.io for real-time communication:

Event	Description
task-created	New task notification to project room
task-status-changed	Kanban board live update
task-assigned	Direct notification to assignee
new-message	Chat message broadcast
user-typing	Typing indicator
notification	Push notification to specific user
join-project	Join project room for updates
📁 Project Structure
text

workpulse-ai/
├── server/                          # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/                  # Database, Redis, Socket, Email configs
│   │   ├── models/                  # Mongoose schemas (8 models)
│   │   ├── controllers/            # Request handlers (10 controllers)
│   │   ├── routes/                  # API routes (10 route files)
│   │   ├── middleware/              # Auth, RBAC, validation, rate limiting
│   │   ├── services/               # Business logic
│   │   │   ├── aiEngine/           # AI algorithms
│   │   │   ├── emailService.js
│   │   │   ├── notificationService.js
│   │   │   └── analyticsService.js
│   │   ├── validators/             # Input validation rules
│   │   └── utils/                  # Helpers, logger, response handler
│   ├── server.js                   # Entry point
│   └── package.json
│
├── client/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/             # Reusable components
│   │   │   ├── common/             # Button, Input, Modal, Avatar...
│   │   │   ├── layout/             # Sidebar, Navbar, UserMenu
│   │   │   ├── kanban/             # TaskCard, CreateTaskModal
│   │   │   ├── ai/                 # AI components
│   │   │   ├── mood/               # Mood components
│   │   │   ├── standup/            # Standup components
│   │   │   ├── charts/             # Recharts components
│   │   │   ├── chat/               # Chat components
│   │   │   ├── notifications/      # Notification components
│   │   │   └── settings/           # Settings components
│   │   ├── pages/                  # Page components
│   │   │   ├── Auth/               # Login, Register, ForgotPassword
│   │   │   ├── Dashboard/          # Main dashboard
│   │   │   ├── Projects/           # Project list & detail
│   │   │   ├── Tasks/              # Kanban board & My Tasks
│   │   │   ├── AI/                 # Workload analysis & AI insights
│   │   │   ├── Team/               # Team members & Burnout
│   │   │   ├── Mood/               # Mood dashboard
│   │   │   ├── Standups/           # Auto standups
│   │   │   ├── Chat/               # Project chat
│   │   │   ├── Analytics/          # Charts dashboard
│   │   │   ├── Notifications/      # Notification center
│   │   │   └── Settings/           # User settings
│   │   ├── store/                  # Redux Toolkit store & slices
│   │   ├── services/               # API service layer (Axios)
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── utils/                  # Helper functions & constants
│   │   └── context/                # React context providers
│   └── package.json
│
├── docker-compose.yml
├── .github/workflows/              # CI/CD pipeline
└── README.md
Total: 350+ files | 50+ API endpoints | 12+ feature modules


 
🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
📄 License
This project is licensed under the MIT License — see the LICENSE file for details.

👨‍💻 Author
Monisha E

💼 LinkedIn: https://www.linkedin.com/in/monisha-e-000a59332/
🐙 GitHub: https://github.com/Monisha-e125/Workpluse
📧 Email: monishae2830@gmail.com
⭐ Show Your Support
If you found this project useful, please consider giving it a ⭐ on GitHub!

<div align="center">
Built with ❤️ using MERN Stack

WorkPulse AI — Where Productivity Meets Wellness

</div> ```
