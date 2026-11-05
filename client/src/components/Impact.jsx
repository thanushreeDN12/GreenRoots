import React from "react";

const stats = [
  { label: "Trees planted", value: "1,20,000+" },
  { label: "Communities served", value: "80+" },
  { label: "CO₂ sequestered (est.)", value: "2,900+ t" },
  { label: "Water bodies restored", value: "25" },
];

const Impact = () => (
  <section id="impact" style={styles.wrap} aria-labelledby="impact-title">
    <div style={styles.container}>
      <h2 id="impact-title" style={styles.h2}>Our impact</h2>
      <p style={styles.note}>
        Transparent, verifiable outcomes help build donor trust and long‑term engagement.
      </p>
      <div style={styles.grid}>
        {stats.map((s) => (
          <div key={s.label} style={styles.card} role="group" aria-label={s.label}>
            <div style={styles.value}>{s.value}</div>
            <div style={styles.label}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const styles = {
  wrap: { padding: "3rem 1rem", background: "#d4e8d3" },
  container: { maxWidth: 1080, margin: "0 auto" },
  h2: { color: "#154734", marginBottom: "0.5rem" },
  note: { margin: "0 0 1rem" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "1rem",
  },
  card: {
    background: "#fff",
    border: "1px solid #e0efe6",
    borderRadius: 12,
    padding: "1rem",
    textAlign: "center",
  },
  value: { fontSize: "1.5rem", fontWeight: 800, color: "#1f5f47" },
  label: { marginTop: 4, color: "#2b6e55" },
};

export default Impact;
