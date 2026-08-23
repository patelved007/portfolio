import { Link } from "react-router-dom";

function NavBar({ darkMode, onToggleTheme }) {
  const token = localStorage.getItem("token");

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        padding: "12px 20px",
        backgroundColor: "#333",
        flexWrap: "wrap",
      }}
    >
      <Link to="/" style={linkStyle}>
        Home
      </Link>
      <Link to="/projects" style={linkStyle}>
        Tasks
      </Link>
      <Link to="/contact" style={linkStyle}>
        Contact
      </Link>
      <Link to="/login" style={linkStyle}>
        {token ? "Account / Logout" : "Login"}
      </Link>
      <button type="button" onClick={onToggleTheme} style={buttonStyle}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </nav>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
};

const buttonStyle = {
  padding: "6px 12px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  backgroundColor: "#4f46e5",
  color: "white",
};

export default NavBar;
