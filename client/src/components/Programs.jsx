import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchprograms } from "../actions/programs";
import { useNavigate } from "react-router-dom";
import { defaultProgramsData } from "../constants/defaultPrograms";

const Programs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const programsFromRedux = useSelector((state) => state.programs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("All");

  // Fetch programs from backend on mount
  useEffect(() => {
    dispatch(fetchprograms());
  }, [dispatch]);

  // Combine Redux programs with defaults if empty
  const allPrograms = useMemo(() => {
    if (Array.isArray(programsFromRedux) && programsFromRedux.length > 0) {
      return programsFromRedux;
    }
    return defaultProgramsData;
  }, [programsFromRedux]);

  // Extract unique states for filter
  const stateOptions = useMemo(() => {
    const states = new Set();
    allPrograms.forEach(p => {
      if (p.state) {
        p.state.split('&').forEach(s => states.add(s.trim()));
      }
    });
    return ["All", ...Array.from(states).sort()];
  }, [allPrograms]);

  // Filtered programs
  const filteredPrograms = useMemo(() => {
    return allPrograms.filter(p => {
      const matchesSearch = !searchTerm || 
        (p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.location && p.location.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesState = selectedState === "All" || 
        (p.state && p.state.toLowerCase().includes(selectedState.toLowerCase()));

      return matchesSearch && matchesState;
    });
  }, [allPrograms, searchTerm, selectedState]);

  const onLearnMore = (id) => {
    navigate(`/program/${id}`);
  };

  return (
    <section id="programs" style={styles.wrap} aria-labelledby="programs-title">
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <div>
            <h2 id="programs-title" style={styles.h2}>
              Forestry & Conservation Programs
            </h2>
            <p style={styles.subtitle}>
              Explore 20 active native tree planting programs across India with transparent sponsorship costs.
            </p>
          </div>
          <span style={styles.badgeCount}>
            {filteredPrograms.length} of {allPrograms.length} Programs
          </span>
        </div>

        {/* Filter and Search Bar */}
        <div style={styles.filterBar}>
          <input
            type="text"
            placeholder="🔍 Search programs, species, or regions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Region:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              style={styles.selectInput}
            >
              {stateOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.grid}>
          {filteredPrograms.length > 0 ? (
            filteredPrograms.map((card) => {
              const programId = card._id || card.id;
              const raised = Number(card.raisedAmount || 0);
              const target = Number(card.targetAmount || 100000);
              const percent = Math.min(100, Math.round((raised / target) * 100));

              return (
                <article key={programId} style={styles.card}>
                  <div style={styles.cardTop}>
                    {card.location ? (
                      <span style={styles.locationBadge}>📍 {card.location}</span>
                    ) : (
                      <span style={styles.locationBadge}>📍 India</span>
                    )}
                    <span style={styles.costBadge}>
                      ₹{card.donationCost || 500} / tree
                    </span>
                  </div>

                  <h3 style={styles.h3}>{card.title || "Native Afforestation"}</h3>
                  <p style={styles.p}>
                    {card.description || "Active native tree planting initiative restoring indigenous biodiversity."}
                  </p>

                  <div style={styles.progressContainer}>
                    <div style={styles.progressBar}>
                      <div
                        style={{
                          ...styles.progressFill,
                          width: `${percent}%`
                        }}
                      />
                    </div>
                    <div style={styles.progressStats}>
                      <span>₹{raised.toLocaleString()} raised</span>
                      <span>Target: ₹{target.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    style={styles.link}
                    aria-label={`Learn more about ${card.title}`}
                    onClick={() => onLearnMore(programId)}
                  >
                    Sponsor & Learn more →
                  </button>
                </article>
              );
            })
          ) : (
            <div style={styles.emptyContainer}>
              <p style={{ color: "#52796f", fontSize: "1.1rem" }}>No matching programs found for "{searchTerm}".</p>
              <button
                style={styles.resetButton}
                onClick={() => { setSearchTerm(""); setSelectedState("All"); }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const styles = {
  wrap: { padding: "3.5rem 1rem", background: "#fcfdfc" },
  container: { maxWidth: 1140, margin: "0 auto" },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexWrap: "wrap",
    gap: "1rem",
    marginBottom: "2rem"
  },
  h2: { color: "#154734", margin: "0 0 0.4rem", fontSize: "1.9rem" },
  subtitle: { color: "#4a705e", margin: 0, fontSize: "0.98rem" },
  badgeCount: {
    padding: "6px 14px",
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    borderRadius: 20,
    fontWeight: 700,
    fontSize: "0.85rem"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.4rem",
  },
  card: {
    position: "relative",
    background: "#ffffff",
    border: "1px solid #e2ece5",
    borderRadius: 14,
    padding: "1.3rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
    display: "flex",
    flexDirection: "column"
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
    marginBottom: "0.75rem"
  },
  locationBadge: {
    fontSize: "0.78rem",
    fontWeight: "600",
    color: "#3a6b54",
    backgroundColor: "#eef6f1",
    padding: "3px 8px",
    borderRadius: 6
  },
  costBadge: {
    fontSize: "0.85rem",
    fontWeight: "800",
    color: "#154734",
    backgroundColor: "#e1f2e6",
    padding: "3px 9px",
    borderRadius: 6
  },
  h3: { margin: "0 0 0.5rem", color: "#1f5f47", fontSize: "1.15rem" },
  p: {
    color: "#555",
    fontSize: "0.88rem",
    lineHeight: "1.5",
    margin: "0 0 1rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    flex: 1
  },
  progressContainer: {
    marginTop: "auto",
    marginBottom: "1rem"
  },
  progressBar: {
    width: "100%",
    height: "7px",
    backgroundColor: "#e6eee8",
    borderRadius: 4,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2e8b57",
    borderRadius: 4,
    transition: "width 0.3s ease"
  },
  progressStats: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.76rem",
    color: "#6c8c7c",
    marginTop: "5px"
  },
  link: {
    color: "#1b4332",
    backgroundColor: "#edf7f1",
    border: "1px solid #b7e4c7",
    padding: "8px 14px",
    borderRadius: 8,
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "0.9rem",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.2s"
  },
  filterBar: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: "1.8rem",
    backgroundColor: "#ffffff",
    padding: "1rem",
    borderRadius: "12px",
    border: "1px solid #e2ece5",
    boxShadow: "0 1px 4px rgba(0,0,0,0.02)"
  },
  searchInput: {
    flex: "1 1 280px",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #c9dcd0",
    fontSize: "0.92rem",
    outline: "none",
    color: "#1b4332"
  },
  filterGroup: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  filterLabel: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#4a705e"
  },
  selectInput: {
    padding: "9px 12px",
    borderRadius: "8px",
    border: "1px solid #c9dcd0",
    fontSize: "0.88rem",
    color: "#1b4332",
    backgroundColor: "#ffffff",
    outline: "none",
    cursor: "pointer"
  },
  emptyContainer: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "3rem 1rem",
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    border: "1px dashed #b7e4c7"
  },
  resetButton: {
    padding: "8px 18px",
    backgroundColor: "#2e7d32",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.88rem",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "0.75rem"
  }
};

export default Programs;
