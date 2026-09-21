import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTasks, createTask, updateTask, deleteTask } from "../api";
import Spinner from "./Spinner";
import ErrorMessage from "./ErrorMessage";
import Toast from "./Toast";

const TaskSummary = lazy(() => import("./TaskSummary"));

function Projects() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [editingId, setEditingId] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  const fetchTasks = () => {
    setLoading(true);
    setError(null);

    getTasks()
      .then((data) => setTasks(data))
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
        showToast(editingId ? "Task updated successfully" : "Task created successfully");
        resetForm();
        return getTasks();
      })
      .then((data) => setTasks(data))
      .catch((err) => setError(err.message))
      .finally(() => setActionLoading(false));
  };

  const handleToggleComplete = (task) => {
    setActionLoading(true);
    setError(null);

    updateTask(task._id, { completed: !task.completed })
      .then(() => {
        showToast("Task updated successfully");
        return getTasks();
      })
      .then((data) => setTasks(data))
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
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (!confirmed) {
      return;
    }

    setActionLoading(true);
    setError(null);

    deleteTask(id)
      .then(() => {
        showToast("Task deleted successfully");
        if (editingId === id) {
          resetForm();
        }
        return getTasks();
      })
      .then((data) => setTasks(data))
      .catch((err) => setError(err.message))
      .finally(() => setActionLoading(false));
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <section>
      <p className="eyebrow">Workspace</p>
      <h2 className="section-title">Tasks</h2>

      {error && (
        <div style={{ marginBottom: 16 }}>
          <ErrorMessage message={error} onRetry={fetchTasks} />
          {(error.toLowerCase().includes("denied") ||
            error.toLowerCase().includes("unauthorized") ||
            error.toLowerCase().includes("token")) && (
            <p className="lede">
              Please <Link to="/login">log in</Link> to view and manage tasks.
            </p>
          )}
        </div>
      )}

      <Suspense fallback={<p className="meta">Loading stats...</p>}>
        <TaskSummary tasks={tasks} />
      </Suspense>

      <div className="grid-2">
        <form className="panel" onSubmit={handleSubmit}>
          <h3>{editingId ? "Update task" : "Create task"}</h3>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label htmlFor="description">Description</label>
          <input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>

          <div className="actions">
            <button type="submit" className="btn" disabled={actionLoading}>
              {actionLoading ? "Saving..." : editingId ? "Update Task" : "Add Task"}
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
            <p className="lede">No tasks yet. Add one using the form.</p>
          ) : (
            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task._id} className={task.completed ? "task-card is-done" : "task-card"}>
                  <h3>{task.title}</h3>
                  <p>{task.description || "No description"}</p>
                  <p className="meta">
                    Priority: {task.priority} · Completed: {task.completed ? "Yes" : "No"}
                  </p>
                  <div className="actions">
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => handleToggleComplete(task)}
                      disabled={actionLoading}
                    >
                      {task.completed ? "Mark Incomplete" : "Mark Complete"}
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
