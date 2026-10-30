import { Link } from "react-router-dom";

function Header({ name }) {
  return (
    <header className="hero">
      <p className="eyebrow">ITUE301 · 24IT080</p>
      <h1>
        Hi, I am {name}.
        <br />
        <em>I build full-stack apps.</em>
      </h1>
      <p className="lede">
        React frontend, Express API, MongoDB storage, JWT auth, and now
        in-memory caching for faster task reads.
      </p>
      <div className="actions">
        <Link className="btn" to="/projects">
          Open tasks
        </Link>
        <Link className="btn btn--ghost" to="/login">
          Login
        </Link>
      </div>
    </header>
  );
}

export default Header;
