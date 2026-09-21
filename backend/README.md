# Task Manager API (backend)

Express + MongoDB API for the portfolio task manager.

## Setup

```bash
cd backend
npm install
copy .env.example .env
npm start
```

Runs on `http://localhost:5000`

## Environment

```
MONGO_URI=mongodb://127.0.0.1:27017/task-manager
PORT=5000
JWT_SECRET=your_jwt_secret_here
```

## Auth

| Method | Route | Auth |
|--------|-------|------|
| POST | `/register` | No |
| POST | `/login` | No |
| GET | `/me` | Bearer token |
| GET/POST | `/tasks` | Bearer token |
| GET/PUT/DELETE | `/tasks/:id` | Bearer token |

Passwords are hashed with bcrypt. JWT expires in 1 hour.
