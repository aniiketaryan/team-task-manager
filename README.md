<div align="center">

# ❋ Nexus

### Team Task Manager — Built for teams who care about clarity.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Frontend-4a7c59?style=for-the-badge)](https://team-task-frontend-3o3s.onrender.com)
[![API](https://img.shields.io/badge/⚡_API-Backend-2c5f3f?style=for-the-badge)](https://team-task-manager-l9ru.onrender.com)

<br/>

> A simplified yet powerful Trello/Asana-style project management tool.  
> Create projects, assign tasks, track progress — all with role-based access control.

<br/>

![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=black)

</div>

---

## ✨ What is Nexus?

Nexus is a full-stack team collaboration tool I designed and built from scratch. Users can organize work into **projects**, break them down into **tasks**, and collaborate with their team — all while respecting **role-based permissions**.

Think of it as a lightweight version of Asana or Trello — minus the bloat.

---

## 🚀 Features

### 🔐 Authentication
- Secure signup & login with **JWT tokens**
- Persistent sessions via token stored in localStorage
- Protected routes — unauthenticated users redirected to login

### 📁 Project Management
- Create unlimited projects with name & description
- **Project creator automatically becomes Admin**
- Admin can add members by email or remove them anytime
- Each user sees only their own projects

### ✅ Task Management
- Full task creation: **Title, Description, Due Date, Priority**
- Assign tasks to specific team members
- Visual **Kanban board** — To Do / In Progress / Done
- Edit and delete tasks (Admin only)

### 📊 Dashboard
- Total task count at a glance
- Tasks broken down **by status**
- **Workload per member** with visual progress bars
- **Overdue task alerts** highlighted in red

### 🛡️ Role-Based Access Control

| Permission | Admin | Member |
|:-----------|:-----:|:------:|
| Create / Edit / Delete tasks | ✅ | ❌ |
| Add / Remove team members | ✅ | ❌ |
| Update status of assigned tasks | ✅ | ✅ |
| View all project tasks | ✅ | ✅ |
| View dashboard & members | ✅ | ✅ |

> Roles are **project-scoped** — the same user can be Admin in one project and Member in another. This mirrors how real-world tools like Trello and Asana work.

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| **Frontend** | React 18 + Vite | UI framework & build tool |
| **Routing** | React Router v6 | Client-side navigation |
| **HTTP Client** | Axios | API calls with JWT interceptor |
| **Backend** | Node.js + Express | REST API server |
| **Database** | SQLite3 | Lightweight persistent storage |
| **Auth** | JWT + bcryptjs | Secure token-based authentication |
| **Deployment** | Render | Cloud hosting (frontend + backend) |

---

## 📁 Project Structure

```
nexus/
├── 📂 backend/
│   └── src/
│       ├── db/index.js          # SQLite setup & query helpers
│       ├── middleware/auth.js   # JWT verification middleware
│       └── routes/
│           ├── auth.js          # POST /signup, /login, GET /me
│           ├── projects.js      # Project CRUD + member management
│           ├── tasks.js         # Task CRUD + status updates
│           └── dashboard.js     # Aggregated stats endpoint
│
└── 📂 frontend/
    └── src/
        ├── api/axios.js         # Configured Axios instance
        ├── context/
        │   └── AuthContext.jsx  # Global auth state
        └── pages/
            ├── Login.jsx        # Sign in page
            ├── Signup.jsx       # Create account page
            ├── Projects.jsx     # Projects listing page
            └── ProjectDetail.jsx # Kanban + Dashboard + Members
```

---

## 🗄️ Database Schema

```sql
-- Users
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,       -- bcrypt hashed
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Projects
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  created_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Project Members (with roles)
CREATE TABLE project_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER,
  user_id INTEGER,
  role TEXT DEFAULT 'member',   -- 'admin' | 'member'
  UNIQUE(project_id, user_id)
);

-- Tasks
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT,
  priority TEXT DEFAULT 'medium',  -- 'low' | 'medium' | 'high'
  status TEXT DEFAULT 'todo',      -- 'todo' | 'inprogress' | 'done'
  project_id INTEGER,
  assigned_to INTEGER,
  created_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📡 API Reference

```
Auth
  POST   /api/auth/signup               Register new user
  POST   /api/auth/login                Login and receive JWT
  GET    /api/auth/me                   Get current user info

Projects
  GET    /api/projects                  List user's projects
  POST   /api/projects                  Create new project
  GET    /api/projects/:id              Get project with members
  POST   /api/projects/:id/members      Add member by email  [Admin]
  DELETE /api/projects/:id/members/:uid Remove member        [Admin]

Tasks
  GET    /api/tasks/project/:projectId  List all tasks in project
  POST   /api/tasks                     Create task           [Admin]
  PUT    /api/tasks/:id                 Edit task             [Admin]
  DELETE /api/tasks/:id                 Delete task           [Admin]
  PATCH  /api/tasks/:id/status          Update task status    [Admin | Assigned Member]

Dashboard
  GET    /api/dashboard/:projectId      Get project stats & analytics
```

---

## ⚙️ Local Development

### Prerequisites
- Node.js v18+
- npm

### 1. Run the Backend

```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

```bash
node src/index.js
# ✅ Server running on http://localhost:5000
```

### 2. Run the Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
# ✅ App running on http://localhost:5173
```

---

## ☁️ Deployment

Deployed on **Render** — backend as a Web Service, frontend as a Static Site.

### Backend — Render Web Service

| Setting | Value |
|:--------|:------|
| Root Directory | `backend` |
| Build Command | `npm install && npm rebuild sqlite3` |
| Start Command | `node src/index.js` |

**Environment Variables:**
```env
PORT=5000
JWT_SECRET=your_production_secret
NODE_ENV=production
FRONTEND_URL=https://your-frontend.onrender.com
```

### Frontend — Render Static Site

| Setting | Value |
|:--------|:------|
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

**Environment Variables:**
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

**Rewrite Rule:** `/* → /index.html` *(required for React Router)*

---

## ⚠️ Known Limitations

- **Cold Starts** — Free tier backend sleeps after 15 min of inactivity. First request may take up to 60 seconds to wake up.
- **Ephemeral Storage** — SQLite resets on every Render redeploy. For production, migrate to PostgreSQL.
- **No Role Promotion UI** — Admins can add/remove members but cannot promote a Member to Admin via the UI (backend supports it).

---

<div align="center">

Made with 🌿 and a lot of commits.

</div>