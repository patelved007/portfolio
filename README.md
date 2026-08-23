# Ved Portfolio

Personal portfolio application built with React and Vite.

## Practical 1

- Reusable components: Header, About, Skills, Footer
- Props used to pass data between components

## Practical 2 - Routes Added

- `/` - Home (Header, About, Skills)
- `/projects` - Projects page
- `/contact` - Contact form with controlled input and useState
- `*` - 404 Not Found page

## Practical 3 - API Integration

- Projects page fetches repositories from the [GitHub REST API](https://docs.github.com/en/rest)
- API URL: `https://api.github.com/users/patelved007/repos`
- `useEffect` runs the fetch when the page loads
- `useState` for `repos`, `loading`, and `error`
- `Spinner` while loading, `ErrorMessage` with retry on failure
- `RepoList` shows repository name, URL, and star count
- Search input filters repositories by name

No API key is required for public GitHub user repositories.

## Practical 4 - Task Manager API (Backend)

Separate Express backend in `task-manager-api-24IT080/`:

- REST CRUD endpoints: GET, POST, PUT, DELETE `/tasks`
- Logging middleware, Content-Type validation, ID validation
- 404 handler for undefined routes and global error handler

## Practical 5 - MongoDB Integration

Updated `task-manager-api-24IT080/` with:

- MongoDB connection using Mongoose and `.env` (`MONGO_URI`)
- Task schema: title, description, completed, createdAt, priority
- In-memory storage replaced with database CRUD
- `GET /tasks/:id` with 404 handling
- Structured validation error responses

See `task-manager-api-24IT080/README.md` for setup and Postman testing.

## Practical 6 - Full Stack Integration

The React UI now talks to the Express + MongoDB backend.

- CORS enabled on the backend (`app.use(cors())`)
- Shared frontend API file: `src/api.js` (`http://localhost:5000`)
- Tasks page (`/projects`) replaces the GitHub repo list with live `/tasks` CRUD
- Create, view, update, and delete tasks from the UI
- Loading and error handling on every API call
- Delete confirmation dialog
- Toast message after successful create, update, and delete

### Run both servers

Terminal 1 (backend):

```bash
cd task-manager-api-24IT080
npm install
copy .env.example .env
npm start
```

Terminal 2 (frontend):

```bash
npm install
npm run dev
```

Open `http://localhost:5173`, go to **Tasks**, then create / update / delete a task. Refresh the browser to confirm data stays in MongoDB.

## Assignment W4 – Richardson Maturity Model

Folder: `assignment-w4-24IT080/`

- `MATURITY.md` – Level 0–3 evaluation table, HATEOAS example, reflection
- `server.js` – API evaluated at **Level 2** (POST returns `Location` header on 201)

Push `assignment-w4-24IT080` to GitHub as `assignment-w4-24IT080` for submission.

## Features

- React Router v6 for client-side navigation
- NavBar with `Link` components (no full page reload)
- `useState` for contact form input and help tooltip toggle
- Live character count on the contact form
- Dark/light mode toggle

## Run the App

```bash
npm install
npm run dev
```
