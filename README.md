# 🚀 WorkPulse AI

### Intelligent Team Productivity & Wellness Platform

WorkPulse AI is a full-stack web application that combines **real-time project management** with **AI-powered workload balancing**, **developer burnout detection**, **automated daily standups**, and **team mood/sentiment analysis**.

---

## 🌟 Key Features

- 📋 **Kanban Board** — Drag & drop task management with real-time sync
- 🧠 **AI Workload Balancer** — Intelligent task assignment based on skills, capacity & burnout risk
- 🔥 **Burnout Detection** — 7-factor burnout risk analysis with recommendations
- 💚 **Mood Tracking** — Daily mood check-ins with team sentiment dashboard
- 🤖 **Auto Standups** — AI-generated daily standup reports from activity data
- 💬 **Real-time Chat** — Project-based team communication
- 📊 **Analytics Dashboard** — Sprint velocity, team performance & health metrics
- 🔐 **Role-Based Access** — Admin, Manager, Developer, Viewer roles

---

## 🛠️ Tech Stack

| Layer      | Technology                                      |
|------------|------------------------------------------------|
| Frontend   | React.js, Redux Toolkit, Tailwind CSS, Vite    |
| Backend    | Node.js, Express.js                             |
| Database   | MongoDB (Mongoose ODM)                          |
| Real-time  | Socket.io                                       |
| Cache      | Redis                                           |
| Auth       | JWT (Access + Refresh Tokens)                   |
| File Store | Cloudinary                                      |
| DevOps     | Docker, GitHub Actions                          |

---

## 📦 Installation

### Prerequisites
- Node.js v18+
- MongoDB v7+
- Redis v7+
- Git

### Setup

```bash
# Clone repository
git clone https://github.com/yourusername/workpulse-ai.git
cd workpulse-ai

# Setup Backend
cd server
cp .env.example .env    # Edit .env with your values
npm install
npm run dev

# Setup Frontend (new terminal)
cd client
cp .env.example .env
npm install
npm run dev

Access :
Frontend: http://localhost:5173
Backend API: http://localhost:5000/api/v1
Health Check: http://localhost:5000/api/health

📁 Project Structure
workpulse-ai/
├── server/          # Node.js + Express backend
├── client/          # React.js frontend
├── docs/            # Documentation
└── docker-compose.yml

👨‍💻 Author

Your Name — Full Stack Developer

Portfolio: [your-portfolio.com]
LinkedIn: [linkedin.com/in/yourprofile]
GitHub: [github.com/yourusername]

📄 License

This project is licensed under the MIT License.
