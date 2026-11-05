import React from "react";

const DonateCTA = () => (
  <section id="donate" style={styles.wrap} aria-labelledby="donate-title">
    <div style={styles.container}>
      <h2 id="donate-title" style={styles.h2}>Make a difference today</h2>
      <p style={styles.p}>
        Your support plants native trees, funds community nurseries, and maintains water bodies.
      </p>
      <div style={styles.actions}>
        <a href="/donate" style={styles.primary}>Donate ₹500</a>
        <a href="/donate" style={styles.secondary}>Custom amount</a>
      </div>
      <p style={styles.note}>
        Prefer a softer CTA for first‑time visitors if donations are unlikely on the first visit.
      </p>
    </div>
  </section>
);

const styles = {
  wrap: { padding: "3rem 1rem", background: "#a3b18a" },
  container: { maxWidth: 800, margin: "0 auto", textAlign: "center" },
  h2: { color: "#154734", marginBottom: "0.25rem" },
  p: { margin: "0.25rem 0 1rem" },
  actions: { display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" },
  primary: {
    background: "#2e8b57",
    color: "#fff",
    padding: "0.75rem 1.25rem",
    borderRadius: 8,
    textDecoration: "none",
    fontWeight: 700,
  },
  secondary: {
    background: "#fff",
    color: "#2e8b57",
    border: "1px solid #2e8b57",
    padding: "0.75rem 1.25rem",
    borderRadius: 8,
    textDecoration: "none",
    fontWeight: 700,
  },
  note: { marginTop: "0.75rem", fontSize: "0.95rem", color: "#1f5f47" },
};

export default DonateCTA;
