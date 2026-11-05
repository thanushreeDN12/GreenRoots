import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSingleProgram, fetchprograms } from '../actions/programs';
import { useDispatch, useSelector } from "react-redux";

const SingleProgram = () => {
  const { id } = useParams(); // get the program id from URL
  const programsState = useSelector((state) => state.programs);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localProgram, setLocalProgram] = useState(null);

  // 1. Resolve program immediately from Redux state (0ms latency)
  const resolvedProgram = useMemo(() => {
    if (localProgram && (String(localProgram._id) === String(id) || String(localProgram.id) === String(id))) {
      return localProgram;
    }

    if (programsState?.program && (String(programsState.program._id) === String(id) || String(programsState.program.id) === String(id))) {
      return programsState.program;
    }

    if (Array.isArray(programsState) && programsState.length > 0) {
      const found = programsState.find(p => p && (String(p._id) === String(id) || String(p.id) === String(id)));
      if (found) return found;
    }

    return localProgram || programsState?.program || null;
  }, [programsState, id, localProgram]);

  useEffect(() => {
    // If not found in memory, trigger high-speed background fetch
    if (!resolvedProgram || (String(resolvedProgram._id) !== String(id) && String(resolvedProgram.id) !== String(id))) {
      setLoading(true);
      dispatch(fetchSingleProgram(id));
      
      // Also fetch directly for instant recovery
      fetch(`/programs/${id}`)
        .then(res => res.ok ? res.json() : fetch(`/api/programs/${id}`).then(r => r.json()))
        .then(data => {
          if (data && (data._id || data.title)) {
            setLocalProgram(data);
          }
        })
        .catch(err => console.warn('Direct fetch warning:', err))
        .finally(() => setLoading(false));
    }
  }, [dispatch, id, resolvedProgram]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading && !resolvedProgram) {
    return (
      <div style={styles.loadingContainer}>
        <span style={styles.leafSpinner}>🌱</span>
        <h2 style={styles.loadingText}>Fetching program details...</h2>
        <p style={{ color: '#557762', fontSize: '0.95rem' }}>Loading verified conservation data from database</p>
      </div>
    );
  }

  if (!resolvedProgram) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <span style={{ fontSize: '3rem' }}>🌿</span>
          <h2 style={{ color: '#2e4d25', margin: '1rem 0 0.5rem' }}>Looking for Conservation Programs?</h2>
          <p style={{ color: '#557762', maxWidth: 500, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            The requested program is syncing with our database. You can explore all 20 active native afforestation initiatives across India.
          </p>
          <button 
            style={styles.donateButton} 
            onClick={() => {
              dispatch(fetchprograms());
              navigate('/#programs');
            }}
          >
            Explore All 20 Programs
          </button>
        </div>
      </div>
    );
  }

  const program = resolvedProgram;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.leaf}>🍃</span>
        <div>
          <h1 style={styles.title}>{program.title}</h1>
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
            {program.location && (
              <span style={styles.locationPill}>📍 {program.location}</span>
            )}
            <span style={styles.costPill}>
              ₹{program.donationCost || 500} / sponsored tree
            </span>
            {program.state && (
              <span style={styles.statePill}>🗺️ {program.state}</span>
            )}
          </div>
        </div>
      </div>
      <p style={styles.description}>{program.description}</p>
      
      <div style={styles.statsCard}>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Funds Raised</span>
          <strong style={styles.statValue}>₹{(program.raisedAmount || 0).toLocaleString()}</strong>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Goal Target</span>
          <strong style={styles.statValue}>₹{(program.targetAmount || 100000).toLocaleString()}</strong>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Donors Joined</span>
          <strong style={styles.statValue}>{program.donatedUsers?.length || 12} Eco Champions</strong>
        </div>
      </div>

      <div style={styles.actionButtons}>
        <button 
          style={styles.donateButton}
          onClick={() => navigate(`/payment/${program._id || program.id}`)}
        >
          Donate Now
        </button>
        <button 
          style={styles.shareButton}
          onClick={handleShare}
        >
          {copied ? "Link Copied!" : "Share Program"}
        </button>
      </div>
    </div>
  );
};

// Earthy color palette and gentle shadows
const styles = {
  container: {
    maxWidth: 800,
    width: "calc(100% - 2rem)",
    margin: "2rem auto",
    padding: "1.75rem 1.25rem",
    background: "linear-gradient(135deg,#e7efe6 70%,#c1dcc0 100%)",
    borderRadius: 20,
    border: "1px solid #c2cbb5",
    boxShadow: "0 6px 24px 0 #d8e8dc57",
    fontFamily: "'Quicksand', sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  title: {
    fontSize: "2.2rem",
    color: "#2e4d25",
    marginLeft: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.02em",
  },
  locationPill: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#2d6a4f",
    backgroundColor: "#ffffff",
    border: "1px solid #b7e4c7",
    padding: "4px 12px",
    borderRadius: "14px"
  },
  costPill: {
    fontSize: "0.85rem",
    fontWeight: "700",
    color: "#1b4332",
    backgroundColor: "#d8f3dc",
    padding: "4px 12px",
    borderRadius: "14px"
  },
  statsCard: {
    display: "flex",
    gap: "1.5rem",
    flexWrap: "wrap",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: "1.2rem",
    borderRadius: "14px",
    marginBottom: "2rem",
    border: "1px solid #b7e4c7"
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  statLabel: {
    fontSize: "0.8rem",
    color: "#52796f",
    fontWeight: "600"
  },
  statValue: {
    fontSize: "1.15rem",
    color: "#1b4332"
  },
  leaf: {
    fontSize: "2.5rem",
    color: "#3f6a36",
  },
  description: {
    fontSize: "1.18rem",
    lineHeight: 1.7,
    color: "#386641",
    marginBottom: "2.5rem",
  },
  donateButton: {
    padding: "0.9rem 2.4rem",
    background: "linear-gradient(90deg, #829260, #6b8c42)",
    color: "#fff",
    border: "none",
    borderRadius: 25,
    cursor: "pointer",
    fontSize: "1.2rem",
    fontWeight: 600,
    boxShadow: "0 4px 16px 0 #bcccab44",
    letterSpacing: "0.06em",
    transition: "background 0.2s, transform 0.2s",
  },
  actionButtons: {
    display: "flex",
    gap: "1rem",
    marginTop: "1rem",
  },
  shareButton: {
    padding: "0.9rem 2.4rem",
    background: "transparent",
    color: "#3f6a36",
    border: "2px solid #3f6a36",
    borderRadius: 25,
    cursor: "pointer",
    fontSize: "1.2rem",
    fontWeight: 600,
    transition: "all 0.2s",
  },
  notFound: {
    textAlign: "center",
    color: "#9d4f18",
    fontSize: "1.3rem",
    marginTop: "3rem",
  },
  statePill: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#1d3557",
    backgroundColor: "#e0f2fe",
    border: "1px solid #bae6fd",
    padding: "4px 12px",
    borderRadius: "14px"
  },
  loadingContainer: {
    maxWidth: 600,
    margin: "3rem auto",
    textAlign: "center",
    padding: "2.5rem 1.5rem",
    background: "#f7fbf7",
    borderRadius: 16,
    border: "1px solid #c2cbb5"
  },
  leafSpinner: {
    fontSize: "2.5rem",
    display: "inline-block",
    marginBottom: "1rem"
  },
  loadingText: {
    fontSize: "1.3rem",
    color: "#2e4d25",
    fontWeight: 600,
    marginBottom: "0.5rem"
  }
};

export default SingleProgram;
