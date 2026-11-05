import React from "react";

const Mission = () => (
  <section id="mission" style={styles.wrap} aria-labelledby="mission-title">
    <div style={styles.container}>
      <h2 id="mission-title" style={styles.h2}>Our mission</h2>
      <p style={styles.lead}>
        We empower communities to plant native trees, protect water sources, and
        increase biodiversity while creating sustainable livelihoods.
      </p>
      <ul style={styles.bullets}>
        <li>Native species restoration</li>
        <li>Water and soil conservation</li>
        <li>Community-led stewardship</li>
      </ul>
    </div>
  </section>
);

const styles = {
  wrap: { padding: "3rem 1rem", background: "#d4e8d3" },
  container: { maxWidth: 1080, margin: "0 auto" },
  h2: { marginBottom: "0.5rem", color: "#154734" },
  lead: { maxWidth: 900, fontSize: "1.05rem", lineHeight: 1.7 },
  bullets: {
    marginTop: "1rem",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "0.5rem 1rem",
    paddingLeft: "1rem",
  },
};

export default Mission;
