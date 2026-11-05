import React, { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  return (
    <section id="newsletter" style={styles.wrap} aria-labelledby="newsletter-title">
      <div style={styles.container}>
        <h2 id="newsletter-title" style={styles.h2}>Stay informed</h2>
        <p style={styles.p}>Get updates on projects, impact, and volunteering.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert(`Subscribed: ${email}`);
            setEmail("");
          }}
          style={styles.form}
          aria-label="Newsletter signup form"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={styles.input}
            aria-label="Email address"
          />
          <button type="submit" style={styles.btn}>Subscribe</button>
        </form>
      </div>
    </section>
  );
};

const styles = {
  wrap: { padding: "3rem 1rem", background: "#fff" },
  container: { maxWidth: 700, margin: "0 auto", textAlign: "center" },
  h2: { color: "#154734", marginBottom: "0.25rem" },
  p: { margin: "0 0 1rem" },
  form: { display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" },
  input: {
    padding: "0.75rem",
    minWidth: 240,
    border: "1px solid #cfe3d7",
    borderRadius: 8,
    outlineColor: "#2e8b57",
  },
  btn: {
    padding: "0.75rem 1rem",
    background: "#2e8b57",
    color: "#fff",
    borderRadius: 8,
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
  },
};

export default Newsletter;
