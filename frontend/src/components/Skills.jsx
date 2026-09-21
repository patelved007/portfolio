function Skills({ skillList }) {
  return (
    <section className="panel">
      <p className="eyebrow">Skills</p>
      <h2 className="section-title">Toolkit</h2>
      <ul className="skill-list">
        {skillList.map((skill) => (
          <li key={skill} className="chip">
            {skill}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Skills;
