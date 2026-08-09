# Task Manager API (24IT080)

RESTful Task Management backend with Express, MongoDB, and Mongoose.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file and set your MongoDB URI:

```bash
copy .env.example .env
```

For **local MongoDB**:

```
MONGO_URI=mongodb://127.0.0.1:27017/task-manager
```

For **MongoDB Atlas**, replace with your Atlas connection string.

3. Start the server:

```bash
npm start
```

## Task Schema

| Field | Type | Rules |
|-------|------|-------|
| title | String | required, trimmed |
| description | String | optional |
| completed | Boolean | default: false |
| priority | String | enum: low, medium, high (default: medium) |
| createdAt | Date | default: Date.now |

## API Endpoints

| Method | Route | Description | Status Codes |
|--------|-------|-------------|--------------|
| GET | `/tasks` | Get all tasks | 200 |
| GET | `/tasks/:id` | Get one task | 200, 404, 400 |
| POST | `/tasks` | Create a task | 201, 400 |
| PUT | `/tasks/:id` | Update a task | 200, 404, 400 |
| DELETE | `/tasks/:id` | Delete a task | 200, 404, 400 |

POST and PUT require header: `Content-Type: application/json`

## Example POST Body

```json
{
  "title": "Complete lab work",
  "description": "Practical 5 MongoDB integration",
  "completed": false,
  "priority": "high"
}
```

## Validation Errors

Mongoose validation errors return structured JSON:

```json
{
  "error": "Validation failed",
  "details": ["Title is required"]
}
```

Data persists in MongoDB after server restart.
