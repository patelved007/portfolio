function ErrorMessage({ message, onRetry }) {
  return (
    <div
      style={{
        padding: "20px",
        margin: "20px",
        backgroundColor: "#fee2e2",
        border: "1px solid #fca5a5",
        borderRadius: "6px",
        textAlign: "center",
      }}
    >
      <p style={{ margin: "0 0 12px", color: "#991b1b" }}>
        Failed to load repositories: {message}
      </p>
      {onRetry && (
        <button type="button" onClick={onRetry} style={buttonStyle}>
          Retry
        </button>
      )}
    </div>
  );
}

const buttonStyle = {
  padding: "8px 16px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  backgroundColor: "#4f46e5",
  color: "white",
};

export default ErrorMessage;
