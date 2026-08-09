const express = require("express");

const app = express();
const PORT = 5000;

const tasks = [];
let nextId = 1;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

app.use((req, res, next) => {
  if (
    (req.method === "POST" || req.method === "PUT") &&
    !req.is("application/json")
  ) {
    return res.status(400).json({
      error: "Content-Type must be application/json",
    });
  }
  next();
});

function validateTaskId(req, res, next) {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      error: "Invalid task ID",
    });
  }

  req.taskId = id;
  next();
}

app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

app.post("/tasks", (req, res) => {
  const { title, completed } = req.body;

  if (!title) {
    return res.status(400).json({
      error: "Title is required",
    });
  }

  const task = {
    id: nextId++,
    title,
    completed: completed ?? false,
  };

  tasks.push(task);

  res.location(`/tasks/${task.id}`);
  res.status(201).json(task);
});

app.put("/tasks/:id", validateTaskId, (req, res) => {
  const task = tasks.find((t) => t.id === req.taskId);

  if (!task) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  const { title, completed } = req.body;

  if (title !== undefined) {
    task.title = title;
  }

  if (completed !== undefined) {
    task.completed = completed;
  }

  res.status(200).json(task);
});

app.delete("/tasks/:id", validateTaskId, (req, res) => {
  const index = tasks.findIndex((t) => t.id === req.taskId);

  if (index === -1) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  const deletedTask = tasks.splice(index, 1)[0];

  res.status(200).json({
    message: "Task deleted successfully",
    deletedTask,
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.url} not found`,
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    error: "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
