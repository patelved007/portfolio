function TaskSummary({ tasks }) {
  const total = tasks.length;
  const done = tasks.filter((task) => task.completed).length;
  const open = total - done;
  const high = tasks.filter((task) => task.priority === "high" && !task.completed).length;

  return (
    <div className="stats-grid">
      <article className="stat-card">
        <span className="stat-card__label">Total</span>
        <strong>{total}</strong>
      </article>
      <article className="stat-card">
        <span className="stat-card__label">Open</span>
        <strong>{open}</strong>
      </article>
      <article className="stat-card">
        <span className="stat-card__label">Done</span>
        <strong>{done}</strong>
      </article>
      <article className="stat-card">
        <span className="stat-card__label">High priority</span>
        <strong>{high}</strong>
      </article>
    </div>
  );
}

export default TaskSummary;
