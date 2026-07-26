import { useState } from "react";

function Contact() {
  const [message, setMessage] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  return (
    <section style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h2>Contact Me</h2>
      <p>Send a message using the form below.</p>

      <button
        type="button"
        onClick={() => setShowHelp(!showHelp)}
        style={{ marginBottom: "12px", cursor: "pointer" }}
      >
        {showHelp ? "Hide Help" : "Show Help"}
      </button>

      {showHelp && (
        <p
          style={{
            backgroundColor: "#eef2ff",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "16px",
          }}
        >
          Type your message in the box below. Your input is shown in real time.
        </p>
      )}

      <label htmlFor="message">Your Message</label>
      <textarea
        id="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        style={{
          width: "100%",
          marginTop: "8px",
          padding: "8px",
          boxSizing: "border-box",
        }}
      />

      <p style={{ marginTop: "8px" }}>Character count: {message.length}</p>

      {message && (
        <div style={{ marginTop: "16px", textAlign: "left" }}>
          <strong>Live Preview:</strong>
          <p>{message}</p>
        </div>
      )}
    </section>
  );
}

export default Contact;
