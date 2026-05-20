# Nexus — Team Task Manager

A simplified Trello/Asana-style web application where teams can create projects, assign tasks, and track progress with role-based access control.

🔗 **Live Demo**
- Frontend: https://team-task-frontend-3o3s.onrender.com
- Backend API: https://team-task-manager-l9ru.onrender.com

---

## Features

- **User Authentication** — Signup/Login with JWT-based sessions
- **Project Management** — Create projects, invite members, manage your team
- **Role-Based Access** — Admins manage everything; Members update only their assigned tasks
- **Task Management** — Kanban board with To Do / In Progress / Done columns
- **Dashboard** — Task stats, workload per member, overdue task tracking
- **Member Management** — Add/remove members per project with role badges

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite, React Router v6, Axios |
| Backend | Node.js + Express |
| Database | SQLite3 |
| Auth | JWT + bcryptjs |
| Deployment | Render (Static Site + Web Service) |

---

## Project Structure

```
team-task-manager/
├── backend/
│   ├── src/
│   │   ├── db/index.js          # SQLite setup & helper methods
│   │   ├── middleware/auth.js   # JWT middleware
│   │   └── routes/
│   │       ├── auth.js          # Signup, Login, Me
│   │       ├── projects.js      # Project CRUD + members
│   │       ├── tasks.js         # Task CRUD + status update
│   │       └── dashboard.js     # Stats endpoint
│   ├── src/index.js             # Express app entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/axios.js         # Axios instance with JWT interceptor
│   │   ├── context/AuthContext.jsx
│   │   └── pages/
│   │       ├── Login.jsx
│   │       ├── Signup.jsx
│   │       ├── Projects.jsx
│   │       └── ProjectDetail.jsx
│   ├── App.jsx
│   ├── index.css
│   └── vite.config.js
└── README.md
```

---

## Database Schema

```sql
users          (id, name, email, password, created_at)
projects       (id, name, description, created_by, created_at)
project_members(id, project_id, user_id, role)
tasks          (id, title, description, due_date, priority, status, project_id, assigned_to, created_by, created_at)
```

> **Note:** SQLite data resets on every Render redeploy (ephemeral filesystem). Re-signup after each deploy.

---

## API Endpoints

```
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/me                        (JWT required)

GET    /api/projects                       (JWT required)
POST   /api/projects                       (JWT required)
GET    /api/projects/:id                   (JWT required)
POST   /api/projects/:id/members           (Admin only)
DELETE /api/projects/:id/members/:userId   (Admin only)

GET    /api/tasks/project/:projectId       (JWT required)
POST   /api/tasks                          (Admin only)
PATCH  /api/tasks/:id/status              (Admin or assigned Member)
PUT    /api/tasks/:id                      (Admin only)
DELETE /api/tasks/:id                      (Admin only)

GET    /api/dashboard/:projectId           (JWT required)
```

---

## Role-Based Access

| Action | Admin | Member |
|--------|-------|--------|
| Create/Edit/Delete tasks | ✅ | ❌ |
| Add/Remove members | ✅ | ❌ |
| Update status of assigned tasks | ✅ | ✅ |
| View project & tasks | ✅ | ✅ |

> Roles are **project-scoped**. The same user can be Admin in one project and Member in another. Project creators automatically become Admin.

---

## Local Development

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:
```
PORT=5000
JWT_SECRET=your_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

```bash
node src/index.js
# Runs on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
# Runs on http://localhost:5173
```

---

## Deployment (Render)

### Backend — Web Service
| Setting | Value |
|---------|-------|
| Root Directory | `backend` |
| Build Command | `npm install && npm rebuild sqlite3` |
| Start Command | `node src/index.js` |

Environment variables:
```
PORT=5000
JWT_SECRET=your_secret_key
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.onrender.com
```

### Frontend — Static Site
| Setting | Value |
|---------|-------|
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

Environment variables:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

Add a Rewrite Rule in Render dashboard: `/* → /index.html`

---

## Known Limitations

- **Cold starts** — Free tier backend sleeps after 15 min of inactivity. First request may take 50–60 seconds.
- **Ephemeral storage** — SQLite file resets on every redeploy. For persistent data, migrate to PostgreSQL.
- **No role promotion UI** — Admins can add/remove members but cannot promote a Member to Admin through the UI.