import { useState } from "react";

function Contact() {
  const [message, setMessage] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  return (
    <section className="panel" style={{ maxWidth: 640, margin: "0 auto" }}>
      <p className="eyebrow">Contact</p>
      <h2 className="section-title">Say hello</h2>
      <p className="lede">Send a message using the form below.</p>

      <button
        type="button"
        className="btn btn--ghost"
        onClick={() => setShowHelp(!showHelp)}
        style={{ margin: "16px 0" }}
      >
        {showHelp ? "Hide Help" : "Show Help"}
      </button>

      {showHelp && (
        <p className="help-box">
          Type your message in the box below. Your input is shown in real time.
        </p>
      )}

      <label htmlFor="message">Your Message</label>
      <textarea
        id="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={5}
      />

      <p className="meta">Character count: {message.length}</p>

      {message && (
        <div className="preview-box">
          <strong>Live Preview</strong>
          <p>{message}</p>
        </div>
      )}
    </section>
  );
}

export default Contact;
