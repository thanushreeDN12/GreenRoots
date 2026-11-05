import React, { useEffect, useState } from "react";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/users/leaderboard");
        if (response.ok) {
          const data = await response.json();
          setLeaderboard(data);
        } else {
          console.error("Failed to fetch leaderboard");
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <section id="leaderboard" style={styles.wrap} aria-labelledby="leaderboard-title">
      <div style={styles.container}>
        <h2 id="leaderboard-title" style={styles.h2}>Top Tree Planters 🏆</h2>
        <p style={styles.note}>
          Recognizing the top contributors who are making a real difference in restoring our planet.
        </p>

        {loading ? (
          <p>Loading leaderboard...</p>
        ) : (
          <div style={styles.list}>
            {leaderboard.length === 0 ? (
              <p>No trees planted yet. Be the first!</p>
            ) : (
              leaderboard.map((user, index) => (
                <div key={user._id} style={styles.card}>
                  <div style={styles.rank}>#{index + 1}</div>
                  <div style={styles.userInfo}>
                    <div style={styles.email}>{user._id || "Anonymous"}</div>
                  </div>
                  <div style={styles.stats}>
                    <span style={styles.treeCount}>{user.treesPlanted}</span>
                    <span style={styles.treeLabel}>Trees Planted</span>
                  </div>
                  {user.carbonOffset !== undefined && (
                    <div style={{...styles.stats, marginLeft: "1.5rem"}}>
                      <span style={styles.treeCount}>{user.carbonOffset.toFixed(1)}</span>
                      <span style={styles.treeLabel}>kg CO₂</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
};

const styles = {
  wrap: { padding: "3rem 1rem", background: "#f0f7f3" },
  container: { maxWidth: 800, margin: "0 auto", textAlign: "center" },
  h2: { color: "#154734", marginBottom: "0.5rem", fontSize: "2rem" },
  note: { margin: "0 auto 2rem", color: "#4a6c4a", maxWidth: "600px" },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  card: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "0.75rem",
    background: "#fff",
    border: "1px solid #c1dcc0",
    borderRadius: "12px",
    padding: "1rem 1.25rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  rank: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: "#2b6e55",
    minWidth: "40px",
    textAlign: "left",
  },
  userInfo: {
    flex: "1 1 180px",
    textAlign: "left",
  },
  email: {
    fontSize: "1.05rem",
    fontWeight: "600",
    color: "#154734",
    wordBreak: "break-word",
  },
  stats: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  treeCount: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#228b22",
  },
  treeLabel: {
    fontSize: "0.85rem",
    color: "#4a6c4a",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
};

export default Leaderboard;
