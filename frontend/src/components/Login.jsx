import { useEffect, useState } from "react";
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
          window.dispatchEvent(new Event("auth-change"));
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
          window.dispatchEvent(new Event("auth-change"));
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
    window.dispatchEvent(new Event("auth-change"));
    setToken("");
    setUser(null);
    showToast("Logged out successfully.");
  };

  return (
    <section className="panel auth-panel">
      <p className="eyebrow">Account</p>
      <h2 className="section-title">{token && user ? "You are in" : isRegistering ? "Create account" : "Welcome back"}</h2>
      <p className="lede">
        {token && user
          ? "JWT is stored in the browser and sent with every task request."
          : "Register or log in to access protected task routes."}
      </p>

      {error && <ErrorMessage message={error} />}

      {token && user ? (
        <div>
          <p><strong>Email:</strong> {user.email}</p>
          <p className="meta"><strong>User ID:</strong> {user._id || user.id}</p>
          <button type="button" className="btn btn--danger" onClick={handleLogout} style={{ marginTop: 16 }}>
            Logout
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h3>{isRegistering ? "Register" : "Login"}</h3>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="actions">
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Processing..." : isRegistering ? "Register" : "Login"}
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
              }}
            >
              {isRegistering ? "Have an account? Login" : "Need an account? Register"}
            </button>
          </div>
        </form>
      )}

      <Toast message={toast} />
    </section>
  );
}

export default Login;
