import React from "react";

const Footer = () => (
  <footer style={styles.wrap} role="contentinfo">
    <div style={styles.container}>
      <div style={styles.grid}>
        <div>
          <strong>GreenRoots Foundation</strong>
          <p style={styles.p}>Bengaluru, Karnataka • CIN: 1234 • 000/000 Registered</p>
        </div>
        <nav aria-label="Footer navigation" style={styles.links}>
          <a href="#mission" style={styles.link}>Mission</a>
          <a href="#programs" style={styles.link}>Programs</a>
          <a href="#impact" style={styles.link}>Impact</a>
          <a href="/donate" style={styles.link}>Donate</a>
        </nav>
      </div>
      <p style={styles.copy}>© {new Date().getFullYear()} GreenRoots Foundation</p>
    </div>
  </footer>
);

const styles = {
  wrap: { padding: "2rem 1rem", background: "#0f2d22", color: "#d8efe3" },
  container: { maxWidth: 1080, margin: "0 auto" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.2rem",
    alignItems: "center",
  },
  p: { margin: "0.25rem 0" },
  links: { display: "flex", gap: "1rem", flexWrap: "wrap" },
  link: { color: "#d8efe3", textDecoration: "none" },
  copy: { marginTop: "0.75rem", fontSize: "0.9rem", opacity: 0.9 },
};

export default Footer;
