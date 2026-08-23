function Spinner() {
  return (
    <div style={{ padding: "40px 20px", textAlign: "center" }}>
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid #e5e7eb",
          borderTopColor: "#4f46e5",
          borderRadius: "50%",
          margin: "0 auto 12px",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <p>Loading...</p>
    </div>
  );
}

export default Spinner;
