import React from "react";
import nature from '../assets/nature.png';
import ImpactCounter from './ImpactCounter';
import LiveActivityFeed from './LiveActivityFeed';

const Hero = () => {
  return (
    <header
      style={styles.hero}
      role="banner"
      aria-label="Hero section with mission call-to-action"
    >
      <div style={styles.overlay} />
      
      <div className="hero-flex-wrapper" style={styles.heroContent}>
        <div className="hero-text-col" style={styles.mainText}>
          <h1 style={styles.title}>Plant Green, Change Lives</h1>
          <p style={styles.subtitle}>
            Join our mission to restore ecosystems, support local communities, and
            build a climate-resilient future.
          </p>
          <div className="hero-actions" style={styles.actions}>
            <a href="#donate" style={styles.primaryBtn}>Donate now</a>
            <a href="#programs" style={styles.secondaryBtn}>Explore programs</a>
          </div>
          
          <div style={{ marginTop: '2.5rem' }}>
            <ImpactCounter />
          </div>
        </div>
        
        <div className="hero-feed-col" style={styles.feedContainer}>
          <LiveActivityFeed />
        </div>
      </div>
    </header>
  );
};

const styles = {
  hero: {
    position: "relative",
    minHeight: "85vh",
    backgroundImage: `linear-gradient(rgba(0,60,30,0.5), rgba(0,60,30,0.7)), url(${nature})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4rem 1rem",
  },
  overlay: { display: "none" },
  heroContent: { 
    maxWidth: 1200, 
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '3rem',
    flexWrap: 'wrap'
  },
  mainText: {
    flex: '1 1 500px',
    textAlign: 'left'
  },
  feedContainer: {
    flex: '0 0 auto',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '350px'
  },
  title: { fontSize: "clamp(2.5rem, 5vw, 4rem)", margin: "0 0 1rem", lineHeight: 1.1 },
  subtitle: { fontSize: "clamp(1rem, 2.5vw, 1.25rem)", marginBottom: "2rem", opacity: 0.9, maxWidth: '600px' },
  actions: { display: "flex", gap: "1rem", flexWrap: "wrap" },
  primaryBtn: {
    background: "#28a745",
    color: "#fff",
    padding: "0.85rem 1.5rem",
    borderRadius: 8,
    textDecoration: "none",
    fontWeight: 600,
    fontSize: '1.1rem',
    transition: 'background 0.2s'
  },
  secondaryBtn: {
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    padding: "0.85rem 1.5rem",
    borderRadius: 8,
    textDecoration: "none",
    fontWeight: 600,
    fontSize: '1.1rem',
    border: "1px solid rgba(255,255,255,0.3)",
    backdropFilter: "blur(4px)",
    transition: 'background 0.2s'
  },
};

// Add responsive layout adjustment
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @media (max-width: 900px) {
    header > div:last-child {
      flex-direction: column !important;
      text-align: center !important;
    }
    header > div:last-child > div:first-child {
      text-align: center !important;
    }
    header > div:last-child > div:first-child p {
      margin-left: auto;
      margin-right: auto;
    }
    header > div:last-child > div:first-child .actions {
      justify-content: center;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Hero;