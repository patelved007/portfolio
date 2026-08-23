import { useState, useEffect } from "react";
import { loginUser, registerUser, getMe } from "../api";
import Toast from "./Toast";
import ErrorMessage from "./ErrorMessage";

function Login() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  useEffect(() => {
    if (token) {
      getMe()
        .then((data) => setUser(data))
        .catch(() => {
          localStorage.removeItem("token");
          setToken("");
          setUser(null);
        });
    }
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const action = isRegistering
      ? registerUser({ email, password })
      : loginUser({ email, password });

    action
      .then((data) => {
        if (isRegistering) {
          showToast("Registration successful! Please log in.");
          setIsRegistering(false);
        } else {
          showToast("Login successful!");
          localStorage.setItem("token", data.token);
          setToken(data.token);
          setUser(data.user);
          setEmail("");
          setPassword("");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    showToast("Logged out successfully.");
  };

  return (
    <section style={{ padding: "20px", maxWidth: "450px", margin: "0 auto" }}>
      <h2>Account Authentication</h2>

      {error && <ErrorMessage message={error} />}

      {token && user ? (
        <div style={cardStyle}>
          <h3>User Profile</h3>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user._id || user.id}</p>
          <button
            type="button"
            onClick={handleLogout}
            style={{ ...buttonStyle, backgroundColor: "#dc2626", marginTop: "10px" }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div style={cardStyle}>
          <h3>{isRegistering ? "Register New Account" : "User Login"}</h3>
          <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />

            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading
                ? "Processing..."
                : isRegistering
                ? "Register"
                : "Login"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
              }}
              style={{ ...buttonStyle, marginLeft: "8px", backgroundColor: "#6b7280" }}
            >
              {isRegistering
                ? "Already have an account? Login"
                : "Need an account? Register"}
            </button>
          </form>
        </div>
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
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  textAlign: "left",
};

export default Login;
