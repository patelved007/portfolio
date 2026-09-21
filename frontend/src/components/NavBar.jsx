import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function NavBar({ darkMode, onToggleTheme }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    const sync = () => setToken(localStorage.getItem("token") || "");
    window.addEventListener("auth-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("auth-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__brand">
        Ved Patel
      </Link>
      <div className="navbar__links">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/projects" className="nav-link">
          Tasks
        </Link>
        <Link to="/contact" className="nav-link">
          Contact
        </Link>
        <Link to="/login" className="nav-link">
          {token ? "Account" : "Login"}
        </Link>
        <button type="button" className="nav-btn nav-btn--accent" onClick={onToggleTheme}>
          {darkMode ? "Light" : "Dark"}
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
