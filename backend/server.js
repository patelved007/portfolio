require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./models/Task");
const User = require("./models/User");
const auth = require("./middleware/auth");
const validateTask = require("./middleware/validateTask");
const {
  cache,
  ALL_TASKS_KEY,
  taskKey,
  recordHit,
  recordMiss,
  getStats,
  invalidateTasks,
} = require("./cache");
const { taskEmitter, timestamp } = require("./taskEvents");
const { generateTaskDescription } = require("./aiService");


const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/task-manager";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret_jwt_key_24it080";


app.use(cors());
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

app.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    next(err);
  }
});

app.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    next(err);
  }
});

app.get("/me", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

app.get("/cache-stats", auth, (req, res) => {
  res.status(200).json(getStats());
});

app.get("/tasks", auth, async (req, res, next) => {
  try {
    const started = Date.now();
    const cached = cache.get(ALL_TASKS_KEY);

    if (cached) {
      recordHit();
      res.set("X-Cache", "HIT");
      res.set("X-Response-Time", `${Date.now() - started}ms`);
      return res.status(200).json(cached);
    }

    recordMiss();
    const tasks = await Task.find().sort({ createdAt: -1 }).lean();
    cache.set(ALL_TASKS_KEY, tasks);
    res.set("X-Cache", "MISS");
    res.set("X-Response-Time", `${Date.now() - started}ms`);
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

app.get("/tasks/:id", auth, validateTaskId, async (req, res, next) => {
  try {
    const key = taskKey(req.params.id);
    const cached = cache.get(key);

    if (cached) {
      recordHit();
      res.set("X-Cache", "HIT");
      return res.status(200).json(cached);
    }

    recordMiss();
    const task = await Task.findById(req.params.id).lean();

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    cache.set(key, task);
    res.set("X-Cache", "MISS");
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

app.post("/tasks", auth, validateTask, async (req, res, next) => {
  try {
    console.log(`[${timestamp()}] Creating task...`);

    const task = await Task.create(req.body);
    console.log(`[${timestamp()}] Task saved successfully.`);

    invalidateTasks();

    taskEmitter.emit("task-created", {
      id: task._id,
      title: task.title,
      assignedUser: req.body.assignedUser || req.user.email || req.user.id,
      createdAt: task.createdAt,
    });
    console.log(`[${timestamp()}] task-created event emitted.`);

    res.location(`/tasks/${task._id}`);
    res.status(201).json(task);
    console.log(`[${timestamp()}] API response sent to client.`);
  } catch (err) {
    next(err);
  }
});

app.put("/tasks/:id", auth, validateTaskId, validateTask, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    invalidateTasks(req.params.id);
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

app.delete("/tasks/:id", auth, validateTaskId, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    invalidateTasks(req.params.id);
    res.status(200).json({
      message: "Task deleted successfully",
      deletedTask: task,
    });
  } catch (err) {
    next(err);
  }
});

// Practical 13: AI Generation Endpoint with Rate Limiting & Graceful Degradation
const aiRateLimits = new Map();

app.post("/api/ai/generate-description", auth, async (req, res) => {
  try {
    const userId = req.user?.id || req.ip;
    const now = Date.now();
    const lastCall = aiRateLimits.get(userId) || 0;

    // Rate limiting (min 3 seconds between AI calls per user)
    if (now - lastCall < 3000) {
      return res.status(429).json({
        error: "Rate limit: Please wait a moment before requesting another AI description.",
        fallback: true,
      });
    }

    aiRateLimits.set(userId, now);

    const { title } = req.body;
    const result = await generateTaskDescription(title);
    res.status(200).json(result);
  } catch (err) {
    res.status(200).json({
      description: "",
      fallback: true,
      error: err.message,
    });
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

if (require.main === module) {
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
}

module.exports = app;




