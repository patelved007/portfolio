import { useState } from "react";

function Contact() {
  const [message, setMessage] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  return (
    <section className="panel contact-panel">
      <p className="eyebrow">Contact</p>
      <h2 className="section-title">Say hello</h2>
      <p className="lede">Write a short note. The preview updates as you type.</p>

      <div className="actions" style={{ margin: "16px 0" }}>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => setShowHelp(!showHelp)}
        >
          {showHelp ? "Hide help" : "Show help"}
        </button>
      </div>

      {showHelp && (
        <p className="help-box">
          Type below. Character count and live preview are shown instantly.
        </p>
      )}

      <label htmlFor="message">Your message</label>
      <textarea
        id="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={6}
        placeholder="Hello Ved..."
      />

      <p className="meta">{message.length} characters</p>

      {message && (
        <div className="preview-box">
          <strong>Live preview</strong>
          <p>{message}</p>
        </div>
      )}
    </section>
  );
}

export default Contact;
