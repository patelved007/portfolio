import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getCacheStats,
  generateAiDescription,
} from "../api";
import Spinner from "./Spinner";
import ErrorMessage from "./ErrorMessage";
import Toast from "./Toast";

const TaskSummary = lazy(() => import("./TaskSummary"));

function Projects() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDisclaimer, setAiDisclaimer] = useState("");
  const [toast, setToast] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [editingId, setEditingId] = useState(null);
  const [cacheStats, setCacheStats] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  const loadCacheStats = () => {
    getCacheStats()
      .then(setCacheStats)
      .catch(() => setCacheStats(null));
  };

  const fetchTasks = () => {
    setLoading(true);
    setError(null);

    getTasks()
      .then((data) => {
        setTasks(data);
        loadCacheStats();
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setEditingId(null);
    setAiDisclaimer("");
  };

  const handleGenerateAiDescription = () => {
    if (!title.trim()) {
      showToast("Please enter a task title first!");
      return;
    }

    setAiLoading(true);
    setAiDisclaimer("");

    generateAiDescription(title)
      .then((res) => {
        if (res.description) {
          setDescription(res.description);
        }
        if (res.suggestedPriority) {
          setPriority(res.suggestedPriority);
        }
        if (res.disclaimer) {
          setAiDisclaimer(res.disclaimer);
        }
        showToast(
          res.fallback
            ? "AI suggestion generated (offline template)"
            : "AI description generated!"
        );
      })
      .catch((err) => {
        showToast("AI suggestion error: " + err.message);
      })
      .finally(() => setAiLoading(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);

    const payload = { title, description, priority };
    const request = editingId
      ? updateTask(editingId, payload)
      : createTask(payload);

    request
      .then(() => {
        showToast(editingId ? "Task updated" : "Task created");
        resetForm();
        return getTasks();
      })
      .then((data) => {
        setTasks(data);
        loadCacheStats();
      })
      .catch((err) => setError(err.message))
      .finally(() => setActionLoading(false));
  };

  const handleToggleComplete = (task) => {
    setActionLoading(true);
    setError(null);

    updateTask(task._id, { completed: !task.completed })
      .then(() => {
        showToast("Task updated");
        return getTasks();
      })
      .then((data) => {
        setTasks(data);
        loadCacheStats();
      })
      .catch((err) => setError(err.message))
      .finally(() => setActionLoading(false));
  };

  const handleEdit = (task) => {
    setEditingId(task._id);
    setTitle(task.title);
    setDescription(task.description || "");
    setPriority(task.priority || "medium");
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Delete this task?");
    if (!confirmed) {
      return;
    }

    setActionLoading(true);
    setError(null);

    deleteTask(id)
      .then(() => {
        showToast("Task deleted");
        if (editingId === id) {
          resetForm();
        }
        return getTasks();
      })
      .then((data) => {
        setTasks(data);
        loadCacheStats();
      })
      .catch((err) => setError(err.message))
      .finally(() => setActionLoading(false));
  };

  if (loading) {
    return <Spinner />;
  }

  const needsLogin =
    error &&
    (error.toLowerCase().includes("denied") ||
      error.toLowerCase().includes("unauthorized") ||
      error.toLowerCase().includes("token") ||
      error.toLowerCase().includes("log in"));

  return (
    <section>
      <div className="page-head">
        <div>
          <p className="eyebrow">Workspace</p>
          <h2 className="section-title">Tasks</h2>
          <p className="lede">Create, update, and delete tasks stored in MongoDB.</p>
        </div>
        {cacheStats && (
          <div className="cache-chip">
            <span>Cache</span>
            <strong>{cacheStats.hits} hits</strong>
            <em>{cacheStats.misses} misses</em>
          </div>
        )}
      </div>

      {error && (
        <div className="banner">
          <ErrorMessage message={error} onRetry={fetchTasks} />
          {needsLogin && (
            <p className="lede">
              Please <Link to="/login">log in</Link> to manage tasks.
            </p>
          )}
        </div>
      )}

      <Suspense fallback={<p className="meta">Loading stats...</p>}>
        <TaskSummary tasks={tasks} />
      </Suspense>

      <div className="grid-2">
        <form className="panel" onSubmit={handleSubmit}>
          <h3>{editingId ? "Update task" : "New task"}</h3>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            required
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "6px",
            }}
          >
            <label htmlFor="description" style={{ margin: 0 }}>
              Description
            </label>
            <button
              type="button"
              className="btn btn--ghost"
              style={{
                fontSize: "12px",
                padding: "3px 8px",
                borderRadius: "8px",
              }}
              disabled={aiLoading || !title.trim()}
              onClick={handleGenerateAiDescription}
            >
              {aiLoading ? "✨ Generating..." : "✨ Generate with AI"}
            </button>
          </div>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Optional notes or click 'Generate with AI'"
          />
          {aiDisclaimer && (
            <p
              style={{
                fontSize: "11px",
                color: "var(--muted)",
                marginTop: "-10px",
                marginBottom: "12px",
              }}
            >
              💡 {aiDisclaimer}
            </p>
          )}

          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <div className="actions">
            <button type="submit" className="btn" disabled={actionLoading}>
              {actionLoading ? "Saving..." : editingId ? "Save changes" : "Add task"}
            </button>
            {editingId && (
              <button type="button" className="btn btn--ghost" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div>
          {tasks.length === 0 ? (
            <div className="empty-state panel">
              <p className="eyebrow">Empty</p>
              <h3>No tasks yet</h3>
              <p className="lede">Add one on the left. Data stays in MongoDB after refresh.</p>
            </div>
          ) : (
            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task._id} className={task.completed ? "task-card is-done" : "task-card"}>
                  <div className="task-card__top">
                    <h3>{task.title}</h3>
                    <span className={`badge badge--${task.priority || "medium"}`}>
                      {task.priority || "medium"}
                    </span>
                  </div>
                  <p>{task.description || "No description"}</p>
                  <p className="meta">{task.completed ? "Completed" : "Open"}</p>
                  <div className="actions">
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => handleToggleComplete(task)}
                      disabled={actionLoading}
                    >
                      {task.completed ? "Reopen" : "Complete"}
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => handleEdit(task)}
                      disabled={actionLoading}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn--danger"
                      onClick={() => handleDelete(task._id)}
                      disabled={actionLoading}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Toast message={toast} />
    </section>
  );
}

export default Projects;
