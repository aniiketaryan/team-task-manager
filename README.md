# Team Task Manager

A full-stack collaborative task management web application built with React and Node.js.

## Live Demo
- Frontend: YOUR_FRONTEND_URL
- Backend: YOUR_BACKEND_URL

## Tech Stack
- **Frontend:** React, Vite, React Router, Axios
- **Backend:** Node.js, Express
- **Database:** SQLite3
- **Auth:** JWT + bcryptjs
- **Deployment:** Render

## Features
- User signup and login with JWT authentication
- Create projects (creator becomes Admin)
- Admin can add/remove members
- Create, edit, delete tasks (Admin only)
- Assign tasks to members
- Update task status: To Do, In Progress, Done
- Dashboard with total tasks, status breakdown, overdue tasks
- Role-based access (Admin vs Member)

## Local Setup

### Backend
```bash
cd backend
npm install
```
Create `backend/.env`:
```
PORT=5000
JWT_SECRET=yoursecretkey
FRONTEND_URL=http://localhost:5173
```
```bash
node src/index.js
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
```

## API Endpoints
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/projects
- POST /api/projects
- GET /api/projects/:id
- POST /api/projects/:id/members
- GET /api/tasks/project/:projectId
- POST /api/tasks
- PATCH /api/tasks/:id/status
- GET /api/dashboard/:projectId

## Deployment
Deployed on Render:
- Backend: Node web service with build command `npm install && npm rebuild sqlite3`
- Frontend: Static site with rewrite rule `/* -> /index.html`
