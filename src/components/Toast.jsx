function Toast({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "#166534",
        color: "white",
        padding: "12px 16px",
        borderRadius: "6px",
        zIndex: 1000,
      }}
    >
      {message}
    </div>
  );
}

export default Toast;
