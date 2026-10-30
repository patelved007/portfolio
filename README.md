# Portfolio & Task Management Application

![CI Pipeline](https://github.com/patelved007/portfolio/actions/workflows/ci.yml/badge.svg)

Advanced Web Development Frameworks (ITUE301) — Portfolio Project

Author: **Ved Patel (24IT080)**

---

## Project Structure

The codebase is structured into `frontend` and `backend` directories:

```
portfolio/
├── frontend/                 # React 18 + Vite frontend application
│   ├── src/
│   │   ├── components/       # Pages & UI components (Projects, Contact, Login, etc.)
│   │   ├── api.js            # Task & Auth API client with JWT header injection
│   │   ├── App.jsx           # Route container with React.lazy & Suspense code splitting
│   │   ├── index.css         # Modern glassmorphism theme & dark/light mode styles
│   │   └── main.jsx          # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Node.js + Express + MongoDB REST API
│   ├── models/               # Mongoose schemas (Task.js, User.js)
│   ├── middleware/           # Auth (JWT) & validation middleware
│   ├── server.js             # Express API server (Auth, Tasks CRUD)
│   └── package.json
│
└── README.md
```

---

## Practical 8: Performance Optimization Metrics

### Architecture & Code Splitting
Route-based code splitting was implemented using `React.lazy()` and `<Suspense fallback={<PageLoader />}>`:

```jsx
const Projects = lazy(() => import("./components/Projects"));
const Contact = lazy(() => import("./components/Contact"));
const Login = lazy(() => import("./components/Login"));
```

### Bundle Size & Build Comparison

| Metric | Before Lazy Loading (Single Bundle) | After Practical 8 (Code-Split Chunks) | Optimization Gain |
| :--- | :--- | :--- | :--- |
| **Initial JS Bundle** | `244.01 kB` (gzip: `77.64 kB`) | `235.35 kB` (gzip: `75.55 kB`) | **~8.66 kB smaller initial load** |
| **`Projects.chunk.js`** | Included upfront | `4.30 kB` (gzip: `1.64 kB`) | Deferred until `/projects` route visited |
| **`Login.chunk.js`** | Included upfront | `2.61 kB` (gzip: `1.13 kB`) | Deferred until `/login` route visited |
| **`Contact.chunk.js`** | Included upfront | `1.13 kB` (gzip: `0.61 kB`) | Deferred until `/contact` route visited |

### Performance Impact:
- **Faster Initial Load**: Users landing on the home page download only core app code. Route-specific code (`Projects`, `Login`, `Contact`) is fetched on-demand.
- **Graceful Fallback UI**: Integrated `<PageLoader />` spinner renders during chunk retrieval on slower connections (e.g. Slow 3G throttling).

---

## How to Run locally

### 1. Backend Server
```bash
cd backend
npm install
npm start
```
> Server runs on `http://localhost:5000` connected to MongoDB.

### 2. Frontend Application
```bash
cd frontend
npm install
npm run dev
```
> Application runs on `http://localhost:5173`.

---

## Practical Progression History

1. **Practical 1**: Reusable UI Components & State Management
2. **Practical 2**: React Router SPA Navigation
3. **Practical 3**: API Integration & Asynchronous State
4. **Practical 4**: Express.js REST API with CRUD Operations
5. **Practical 5**: MongoDB & Mongoose Schema Integration
6. **Practical 6**: Full-Stack Task Management Integration
7. **Practical 7**: JWT Authentication & Server-Side Input Validation Pipeline
8. **Practical 8**: Performance Optimization & Lazy Loading in React
9. **Practical 9**: In-Memory Caching (`node-cache`) and cache invalidation on writes
10. **Practical 10**: Asynchronous processing with Node.js `EventEmitter` (`task-created` background notification)
11. **Practical 11**: Containerization with Docker and Docker Compose (`docker-compose.yml`, multi-stage builds, named volumes, inter-container networking)
12. **Practical 12**: CI/CD Pipeline with GitHub Actions (`.github/workflows/ci.yml`, automated Jest testing on push, build validation)
13. **Practical 13**: AI API Integration with Graceful Degradation (`/api/ai/generate-description`, rate limiting, AI disclaimer, offline fallback)

See `backend/CACHE.md` for cache keys, debug endpoint, and response-time comparison.


