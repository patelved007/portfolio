function RepoList({ repos }) {
  if (repos.length === 0) {
    return <p style={{ padding: "20px" }}>No repositories match your search.</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {repos.map((repo) => (
        <li
          key={repo.id}
          style={{
            marginBottom: "16px",
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            textAlign: "left",
          }}
        >
          <h3 style={{ margin: "0 0 8px" }}>{repo.name}</h3>
          <p style={{ margin: "0 0 8px" }}>
            Stars: {repo.stargazers_count ?? 0}
          </p>
          <a href={repo.html_url} target="_blank" rel="noreferrer">
            {repo.html_url}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default RepoList;
