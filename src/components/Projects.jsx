import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTasks, createTask, updateTask, deleteTask } from "../api";
import Spinner from "./Spinner";
import ErrorMessage from "./ErrorMessage";
import Toast from "./Toast";

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
    <section style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      <h2>Tasks</h2>

      {error && (
        <div style={{ marginBottom: "15px" }}>
          <ErrorMessage message={error} onRetry={fetchTasks} />
          {error.toLowerCase().includes("denied") || error.toLowerCase().includes("unauthorized") || error.toLowerCase().includes("token") ? (
            <p style={{ marginTop: "10px" }}>
              Please <Link to="/login" style={{ color: "#4f46e5", fontWeight: "bold" }}>Log In</Link> to view and manage tasks.
            </p>
          ) : null}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ margin: "20px 0", textAlign: "left" }}>
        <h3>{editingId ? "Update Task" : "Create Task"}</h3>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={inputStyle}
        />

        <label htmlFor="description">Description</label>
        <input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={inputStyle}
        />

        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={inputStyle}
        >
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>

        <button type="submit" disabled={actionLoading} style={buttonStyle}>
          {actionLoading ? "Saving..." : editingId ? "Update Task" : "Add Task"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            style={{ ...buttonStyle, marginLeft: "8px", backgroundColor: "#6b7280" }}
          >
            Cancel
          </button>
        )}
      </form>

      {tasks.length === 0 ? (
        <p>No tasks yet. Add one using the form above.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((task) => (
            <li key={task._id} style={cardStyle}>
              <h3
                style={{
                  margin: "0 0 8px",
                  textDecoration: task.completed ? "line-through" : "none",
                }}
              >
                {task.title}
              </h3>
              <p>{task.description || "No description"}</p>
              <p>
                Priority: {task.priority} | Completed: {task.completed ? "Yes" : "No"}
              </p>
              <button
                type="button"
                onClick={() => handleToggleComplete(task)}
                disabled={actionLoading}
                style={buttonStyle}
              >
                {task.completed ? "Mark Incomplete" : "Mark Complete"}
              </button>
              <button
                type="button"
                onClick={() => handleEdit(task)}
                disabled={actionLoading}
                style={{ ...buttonStyle, marginLeft: "8px" }}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(task._id)}
                disabled={actionLoading}
                style={{ ...buttonStyle, marginLeft: "8px", backgroundColor: "#dc2626" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <Toast message={toast} />
    </section>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "8px",
  margin: "6px 0 12px",
  boxSizing: "border-box",
};

const buttonStyle = {
  padding: "8px 16px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  backgroundColor: "#4f46e5",
  color: "white",
};

const cardStyle = {
  marginBottom: "16px",
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  textAlign: "left",
};

export default Projects;
