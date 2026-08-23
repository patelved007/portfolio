require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Task = require("./models/Task");
const User = require("./models/User");
const authMiddleware = require("./middleware/auth");
const validateTaskInput = require("./middleware/validateTask");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/task-manager";
const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

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

// User Registration Route
app.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Validation failed",
        details: ["Email and password are required."],
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        error: "Validation failed",
        details: ["User with this email already exists."],
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

// User Login Route
app.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Validation failed",
        details: ["Email and password are required."],
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    next(err);
  }
});

// Get Logged-in User Details Route
app.get("/me", authMiddleware, async (req, res, next) => {
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

// Protected Task Routes
app.get("/tasks", authMiddleware, async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

app.get("/tasks/:id", authMiddleware, validateTaskId, async (req, res, next) => {
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

app.post("/tasks", authMiddleware, validateTaskInput, async (req, res, next) => {
  try {
    const task = await Task.create(req.body);

    res.location(`/tasks/${task._id}`);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

app.put("/tasks/:id", authMiddleware, validateTaskId, validateTaskInput, async (req, res, next) => {
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

app.delete("/tasks/:id", authMiddleware, validateTaskId, async (req, res, next) => {
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
