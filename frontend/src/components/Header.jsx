function Header({ name }) {
  return (
    <header className="hero">
      <p className="eyebrow">Full-stack portfolio</p>
      <h1>Welcome to {name}'s studio.</h1>
      <p>
        React developer, student, and builder. This space grows with each
        practical — components, routing, APIs, MongoDB, auth, and now faster
        loads through code splitting.
      </p>
    </header>
  );
}

export default Header;
