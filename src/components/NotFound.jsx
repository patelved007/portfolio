import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section style={{ padding: "40px 20px" }}>
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Go back to Home</Link>
    </section>
  );
}

export default NotFound;
