import React from "react";

const Partners = () => (
  <section id="partners" style={styles.wrap} aria-labelledby="partners-title">
    <div style={styles.container}>
      <h2 id="partners-title" style={styles.h2}>Partners</h2>
      <div style={styles.row}>
        {["School networks", "Local govt", "CSR teams", "Research orgs", "Community groups"].map(
          (p) => (
            <div key={p} style={styles.badge} aria-label={`Partner: ${p}`}>
              {p}
            </div>
          )
        )}
      </div>
    </div>
  </section>
);

const styles = {
  wrap: { padding: "3rem 1rem", background: "#d4e8d3" },
  container: { maxWidth: 1080, margin: "0 auto" },
  h2: { color: "#154734", marginBottom: "1rem" },
  row: { display: "flex", gap: "0.75rem", flexWrap: "wrap" },
  badge: {
    background: "#ffffff",
    border: "1px solid #e0efe6",
    padding: "0.5rem 0.75rem",
    borderRadius: 999,
  },
};

export default Partners;
