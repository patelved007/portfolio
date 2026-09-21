import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="panel" style={{ textAlign: "center" }}>
      <h2 className="section-title">404 — lost in the grid</h2>
      <p className="lede">The page you are looking for does not exist.</p>
      <Link to="/" className="btn" style={{ marginTop: 16, display: "inline-flex" }}>
        Go back to Home
      </Link>
    </section>
  );
}

export default NotFound;
