# 🗂️ Team Task Manager

A full-stack collaborative task management application built with React and Node.js — designed to help teams organize projects, assign tasks, and track progress in real time.

## 🚀 Live Demo
> Coming soon / [Add your deployed link here]

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure login and protected routes via middleware
- 📋 **Project Management** — Create and manage multiple projects with ease
- ✅ **Task Tracking** — Assign tasks, set statuses, and monitor progress
- 📊 **Dashboard Analytics** — View total tasks, breakdown by status, by user, and overdue items
- 👥 **Multi-user Support** — Team-based task assignment and collaboration
- 🗄️ **SQLite Database** — Lightweight, file-based database for fast local development

---

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- JavaScript (ES6+)
- CSS3

### Backend
- Node.js
- Express.js
- JWT (JSON Web Tokens)
- SQLite (via better-sqlite3 / database.sqlite)

---

## 📁 Project Structure

```
team-task-manager/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── dashboard.js
│   │   │   ├── projects.js
│   │   │   └── tasks.js
│   │   └── index.js
│   ├── database.sqlite
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   └── package.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- npm

### 1. Clone the repository
```bash
git clone https://github.com/siddhidokania/team-task-manager.git
cd team-task-manager
```

### 2. Setup Backend
```bash
cd backend
npm install
node src/index.js
```
Backend runs on `http://localhost:5000`

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

---

## 🔑 Environment Variables

Create a `.env` file inside `/backend`:

```env
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

---

## 📌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create a new project |
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a new task |
| GET | `/api/dashboard/:projectId` | Get dashboard stats |

---

## 👩‍💻 Author

**Siddhi Dokania**
- Portfolio: [siddhi-portfolio-green.vercel.app](https://siddhi-portfolio-green.vercel.app)
- GitHub: [@siddhidokania](https://github.com/siddhidokania)
- LinkedIn: [linkedin.com/in/siddhi-dokania](https://linkedin.com/in/siddhi-dokania)
- Email: siddhidokania@gmail.com

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).