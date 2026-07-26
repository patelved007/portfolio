import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import ErrorMessage from "./ErrorMessage";
import RepoList from "./RepoList";

const GITHUB_USERNAME = "patelved007";
const API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;

function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const fetchRepos = () => {
    setLoading(true);
    setError(null);

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setRepos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchRepos} />;
  }

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <section style={{ padding: "20px" }}>
      <h2>Projects (GitHub Repositories)</h2>
      <p>Repositories fetched from the GitHub API for @{GITHUB_USERNAME}</p>

      <input
        type="text"
        placeholder="Search repositories by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "8px",
          marginBottom: "16px",
          boxSizing: "border-box",
        }}
      />

      <RepoList repos={filteredRepos} />
    </section>
  );
}

export default Projects;
