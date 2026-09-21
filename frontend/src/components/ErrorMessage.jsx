function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-box">
      <p>Error: {message}</p>
      {onRetry && (
        <button type="button" className="btn" onClick={onRetry} style={{ marginTop: 10 }}>
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
