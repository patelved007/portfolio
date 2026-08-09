require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Task = require("./models/Task");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/task-manager";

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
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      error: "Invalid task ID format",
    });
  }
  next();
}

app.get("/tasks", async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

app.get("/tasks/:id", validateTaskId, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

app.post("/tasks", async (req, res, next) => {
  try {
    const task = await Task.create(req.body);

    res.location(`/tasks/${task._id}`);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

app.put("/tasks/:id", validateTaskId, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

app.delete("/tasks/:id", validateTaskId, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
      deletedTask: task,
    });
  } catch (err) {
    next(err);
  }
});

app.use((req, res) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.url} not found`,
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    const details = Object.values(err.errors).map((item) => item.message);

    return res.status(400).json({
      error: "Validation failed",
      details,
    });
  }

  res.status(500).json({
    error: "Internal Server Error",
  });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
