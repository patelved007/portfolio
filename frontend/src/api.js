const BASE_URL = "http://localhost:5000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("token");
      const err = new Error(data.error || "Session expired or unauthorized. Please log in.");
      err.status = 401;
      throw err;
    }
    const details = data.details ? `: ${data.details.join(", ")}` : "";
    throw new Error((data.error || "Request failed") + details);
  }

  return data;
}

export const registerUser = (credentials) =>
  fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  }).then(handleResponse);

export const loginUser = (credentials) =>
  fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  }).then(handleResponse);

export const getMe = () =>
  fetch(`${BASE_URL}/me`, {
    headers: {
      ...getAuthHeaders(),
    },
  }).then(handleResponse);

export const getCacheStats = () =>
  fetch(`${BASE_URL}/cache-stats`, {
    headers: {
      ...getAuthHeaders(),
    },
  }).then(handleResponse);

export const getTasks = () =>
  fetch(`${BASE_URL}/tasks`, {
    headers: {
      ...getAuthHeaders(),
    },
  }).then(handleResponse);

export const createTask = (task) =>
  fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(task),
  }).then(handleResponse);

export const updateTask = (id, task) =>
  fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(task),
  }).then(handleResponse);

export const deleteTask = (id) =>
  fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  }).then(handleResponse);

export const generateAiDescription = (title) =>
  fetch(`${BASE_URL}/api/ai/generate-description`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ title }),
  }).then(handleResponse);

