import React, { useState, useEffect } from "react";

const PublicTreeGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalPhoto, setActiveModalPhoto] = useState(null);
  const [cheerMap, setCheerMap] = useState({});

  useEffect(() => {
    const loadPublicPhotos = async () => {
      try {
        let res = await fetch("/api/photos/public");
        if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
          res = await fetch("/photos/public");
        }
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setPhotos(data);
            const initialCheers = {};
            data.forEach((p) => {
              initialCheers[p._id] = p.cheers || 0;
            });
            setCheerMap(initialCheers);
          }
        }
      } catch (err) {
        console.warn("PublicTreeGallery background sync:", err?.message || err);
      } finally {
        setLoading(false);
      }
    };

    loadPublicPhotos();
  }, []);

  const handleCheer = (e, photoId) => {
    e.stopPropagation();
    setCheerMap((prev) => ({
      ...prev,
      [photoId]: (prev[photoId] || 0) + 1,
    }));
  };

  const categories = [
    { id: "all", label: "All Plantations" },
    { id: "mangrove", label: "Mangrove & Coastal" },
    { id: "rainforest", label: "Western Ghats Rainforest" },
    { id: "himalayan", label: "Himalayan & Mountain" },
    { id: "urban", label: "Urban & Miyawaki" },
    { id: "sacred", label: "Sacred & Native Groves" },
  ];

  const filteredPhotos = photos.filter((p) => {
    const speciesLower = (p.treeSpecies || "").toLowerCase();
    const titleLower = (p.program?.title || "").toLowerCase();
    const descLower = (p.description || "").toLowerCase();
    const donorLower = (p.donorUsername || "").toLowerCase();
    const dedicationLower = (p.dedication || "").toLowerCase();

    // Category filter
    let matchesCategory = true;
    if (selectedCategory === "mangrove") {
      matchesCategory = speciesLower.includes("mangrove") || titleLower.includes("mangrove") || titleLower.includes("wetland");
    } else if (selectedCategory === "rainforest") {
      matchesCategory = speciesLower.includes("rosewood") || titleLower.includes("western ghats") || titleLower.includes("rainforest");
    } else if (selectedCategory === "himalayan") {
      matchesCategory = speciesLower.includes("oak") || speciesLower.includes("chinar") || titleLower.includes("himalayan") || titleLower.includes("kashmir");
    } else if (selectedCategory === "urban") {
      matchesCategory = speciesLower.includes("miyawaki") || titleLower.includes("mumbai") || titleLower.includes("bengaluru") || titleLower.includes("lake");
    } else if (selectedCategory === "sacred") {
      matchesCategory = speciesLower.includes("peepal") || speciesLower.includes("khejri") || speciesLower.includes("shola") || speciesLower.includes("teak");
    }

    // Search filter
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      speciesLower.includes(query) ||
      titleLower.includes(query) ||
      descLower.includes(query) ||
      donorLower.includes(query) ||
      dedicationLower.includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="public-tree-gallery" style={styles.section} aria-labelledby="gallery-heading">
      <div style={styles.container}>
        <div style={styles.header}>
          <span style={styles.eyebrowBadge}>🌱 Live Verification Stream</span>
          <h2 id="gallery-heading" style={styles.title}>
            Community Forest Gallery
          </h2>
          <p style={styles.subtitle}>
            Explore verified tree plantations sponsored by our donors across 20 conservation zones in India. Publicly viewable anytime without logging in.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div style={styles.controlsRow}>
          <div style={styles.tabsContainer}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={selectedCategory === cat.id ? styles.activeTab : styles.tab}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div style={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search by tree, donor, state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div style={styles.loadingBox}>
            <p>Loading verified tree photos from our field programs...</p>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div style={styles.emptyBox}>
            <p>No photos found matching your criteria.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredPhotos.map((photo) => {
              const cheers = cheerMap[photo._id] || photo.cheers || 0;
              return (
                <div
                  key={photo._id}
                  style={styles.card}
                  onClick={() => setActiveModalPhoto(photo)}
                >
                  <div style={styles.imageContainer}>
                    <img
                      src={photo.photoUrl}
                      alt={photo.treeSpecies || "Planted tree"}
                      style={styles.cardImage}
                      loading="lazy"
                    />
                    <span style={styles.verifiedTag}>
                      ✅ Verified Plantation
                    </span>
                    {photo.program?.donationCost && (
                      <span style={styles.costBadge}>
                        ₹{photo.program.donationCost} / tree
                      </span>
                    )}
                  </div>

                  <div style={styles.cardBody}>
                    <div style={styles.speciesRow}>
                      <h3 style={styles.speciesName}>
                        🌿 {photo.treeSpecies || "Native Tree"}
                      </h3>
                    </div>

                    {photo.program && (
                      <p style={styles.programName}>
                        📍 {photo.program.title}
                        {photo.program.state && ` (${photo.program.state})`}
                      </p>
                    )}

                    {photo.dedication && (
                      <p style={styles.dedicationText}>
                        "{photo.dedication}"
                      </p>
                    )}

                    <p style={styles.description}>
                      {photo.description}
                    </p>

                    <div style={styles.footerRow}>
                      <div style={styles.donorInfo}>
                        <span style={styles.donorLabel}>Planted for:</span>
                        <strong style={styles.donorName}>
                          @{photo.donorUsername}
                        </strong>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleCheer(e, photo._id)}
                        style={styles.cheerBtn}
                        title="Cheer this tree planting!"
                      >
                        💚 {cheers}
                      </button>
                    </div>

                    {photo.checkIns && photo.checkIns.length > 0 && (
                      <div style={styles.checkInTeaser}>
                        <span>🌱 {photo.checkIns.length} Verified Growth Check-in available</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Lightbox for detailed view */}
        {activeModalPhoto && (
          <div style={styles.modalOverlay} onClick={() => setActiveModalPhoto(null)}>
            <div className="modal-responsive-content" style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button
                style={styles.closeBtn}
                onClick={() => setActiveModalPhoto(null)}
                aria-label="Close modal"
              >
                ✕
              </button>

              <div className="modal-responsive-grid" style={styles.modalGrid}>
                <div style={styles.modalImageSide}>
                  <img
                    src={activeModalPhoto.photoUrl}
                    alt={activeModalPhoto.treeSpecies}
                    style={styles.modalImg}
                  />
                  {activeModalPhoto.checkIns && activeModalPhoto.checkIns.length > 0 && (
                    <div style={styles.modalCheckInsBox}>
                      <h4 style={styles.checkInHeading}>Growth Timeline & Field Updates:</h4>
                      <div style={styles.checkInRow}>
                        {activeModalPhoto.checkIns.map((ci, idx) => (
                          <div key={idx} style={styles.checkInItem}>
                            <img
                              src={ci.photoUrl}
                              alt="Growth Check-in"
                              style={styles.checkInThumb}
                            />
                            <p style={styles.checkInText}>{ci.note}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div style={styles.modalDetailsSide}>
                  <div style={styles.modalTagRow}>
                    <span style={styles.verifiedTagModal}>✅ Verified & Geo-Tagged</span>
                    {activeModalPhoto.program?.donationCost && (
                      <span style={styles.costBadgeModal}>
                        ₹{activeModalPhoto.program.donationCost} / Tree
                      </span>
                    )}
                  </div>

                  <h3 style={styles.modalTitle}>
                    🌿 {activeModalPhoto.treeSpecies}
                  </h3>

                  {activeModalPhoto.program && (
                    <p style={styles.modalLocation}>
                      📍 {activeModalPhoto.program.title}
                      <br />
                      <span style={{ fontSize: "0.85rem", color: "#52796f" }}>
                        {activeModalPhoto.program.location || activeModalPhoto.program.state}
                      </span>
                    </p>
                  )}

                  {activeModalPhoto.dedication && (
                    <div style={styles.modalDedication}>
                      <strong>Donor Dedication:</strong>
                      <p style={{ margin: "4px 0 0", fontStyle: "italic" }}>
                        "{activeModalPhoto.dedication}"
                      </p>
                    </div>
                  )}

                  <div style={styles.modalDonorBox}>
                    <span>Sponsoring Eco Hero:</span>
                    <strong style={{ color: "#154734", fontSize: "1.05rem" }}>
                      @{activeModalPhoto.donorUsername} ({activeModalPhoto.donorEmail})
                    </strong>
                  </div>

                  <p style={styles.modalDesc}>
                    {activeModalPhoto.description}
                  </p>

                  {activeModalPhoto.location?.coordinates && (
                    <div style={styles.coordsBox}>
                      <strong>GPS Coordinates:</strong>{" "}
                      {activeModalPhoto.location.coordinates[1]?.toFixed(4)}° N,{" "}
                      {activeModalPhoto.location.coordinates[0]?.toFixed(4)}° E
                    </div>
                  )}

                  <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
                    <button
                      style={styles.modalCheerBtn}
                      onClick={(e) => handleCheer(e, activeModalPhoto._id)}
                    >
                      💚 Cheer this Tree ({cheerMap[activeModalPhoto._id] || activeModalPhoto.cheers || 0})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const styles = {
  section: {
    padding: "4rem 1rem",
    backgroundColor: "#f4f8f5",
    borderTop: "1px solid #e1ece4",
    borderBottom: "1px solid #e1ece4",
  },
  container: {
    maxWidth: 1180,
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "2.5rem",
  },
  eyebrowBadge: {
    display: "inline-block",
    padding: "4px 14px",
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    borderRadius: 20,
    fontSize: "0.82rem",
    fontWeight: "700",
    marginBottom: "10px",
  },
  title: {
    fontSize: "2.2rem",
    color: "#154734",
    margin: "0 0 0.6rem",
    fontWeight: "700",
  },
  subtitle: {
    color: "#4a6c5a",
    fontSize: "1.02rem",
    maxWidth: 720,
    margin: "0 auto",
    lineHeight: 1.6,
  },
  controlsRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
    marginBottom: "2rem",
  },
  tabsContainer: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  tab: {
    padding: "8px 16px",
    backgroundColor: "#ffffff",
    border: "1px solid #c9decb",
    color: "#2e563e",
    borderRadius: "20px",
    fontSize: "0.86rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  activeTab: {
    padding: "8px 16px",
    backgroundColor: "#1f5f47",
    border: "1px solid #1f5f47",
    color: "#ffffff",
    borderRadius: "20px",
    fontSize: "0.86rem",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(31, 95, 71, 0.25)",
  },
  searchWrapper: {
    flex: "1 1 240px",
    maxWidth: 320,
  },
  searchInput: {
    width: "100%",
    padding: "9px 14px",
    borderRadius: "20px",
    border: "1px solid #c9decb",
    fontSize: "0.88rem",
    outline: "none",
    backgroundColor: "#ffffff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    border: "1px solid #e0ebe3",
    overflow: "hidden",
    boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    display: "flex",
    flexDirection: "column",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: "210px",
    backgroundColor: "#e8efe9",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  verifiedTag: {
    position: "absolute",
    top: "10px",
    left: "10px",
    backgroundColor: "rgba(21, 71, 52, 0.9)",
    color: "#ffffff",
    fontSize: "0.74rem",
    fontWeight: "700",
    padding: "4px 8px",
    borderRadius: "6px",
    backdropFilter: "blur(4px)",
  },
  costBadge: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    color: "#154734",
    fontSize: "0.78rem",
    fontWeight: "800",
    padding: "4px 10px",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  cardBody: {
    padding: "1.2rem",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  speciesRow: {
    marginBottom: "4px",
  },
  speciesName: {
    margin: 0,
    fontSize: "1.1rem",
    color: "#154734",
    fontWeight: "700",
  },
  programName: {
    margin: "0 0 8px",
    fontSize: "0.85rem",
    color: "#3a6b54",
    fontWeight: "600",
  },
  dedicationText: {
    margin: "0 0 10px",
    fontSize: "0.84rem",
    fontStyle: "italic",
    color: "#2e7d32",
    backgroundColor: "#f0f8f2",
    padding: "6px 10px",
    borderRadius: "6px",
    borderLeft: "3px solid #4caf50",
  },
  description: {
    fontSize: "0.85rem",
    color: "#555555",
    lineHeight: "1.5",
    margin: "0 0 12px",
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
  footerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "10px",
    borderTop: "1px solid #f0f4f1",
  },
  donorInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  donorLabel: {
    fontSize: "0.72rem",
    color: "#768c7e",
  },
  donorName: {
    fontSize: "0.88rem",
    color: "#154734",
  },
  cheerBtn: {
    padding: "6px 12px",
    backgroundColor: "#e8f5e9",
    border: "1px solid #c8e6c9",
    borderRadius: "16px",
    fontSize: "0.85rem",
    fontWeight: "700",
    color: "#2e7d32",
    cursor: "pointer",
    transition: "transform 0.15s ease",
  },
  checkInTeaser: {
    marginTop: "10px",
    fontSize: "0.74rem",
    color: "#2d6a4f",
    backgroundColor: "#eaf5ed",
    padding: "4px 8px",
    borderRadius: "4px",
    textAlign: "center",
    fontWeight: "600",
  },
  loadingBox: {
    textAlign: "center",
    padding: "3rem",
    color: "#4a705e",
  },
  emptyBox: {
    textAlign: "center",
    padding: "3rem",
    color: "#6c8c7c",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "1rem",
  },
  modalContent: {
    position: "relative",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    maxWidth: "850px",
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
    padding: "1.8rem",
  },
  closeBtn: {
    position: "absolute",
    top: "14px",
    right: "14px",
    background: "#f0f4f1",
    border: "none",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "1rem",
    color: "#333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "1.5rem",
  },
  modalImageSide: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  modalImg: {
    width: "100%",
    height: "280px",
    objectFit: "cover",
    borderRadius: "12px",
  },
  modalCheckInsBox: {
    backgroundColor: "#f4faf5",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #dbeee0",
  },
  checkInHeading: {
    margin: "0 0 8px",
    fontSize: "0.85rem",
    color: "#154734",
  },
  checkInRow: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  checkInItem: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  checkInThumb: {
    width: "55px",
    height: "55px",
    borderRadius: "6px",
    objectFit: "cover",
    flexShrink: 0,
  },
  checkInText: {
    margin: 0,
    fontSize: "0.78rem",
    color: "#444444",
    lineHeight: "1.4",
  },
  modalDetailsSide: {
    display: "flex",
    flexDirection: "column",
  },
  modalTagRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "10px",
  },
  verifiedTagModal: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    fontSize: "0.78rem",
    fontWeight: "700",
    padding: "4px 10px",
    borderRadius: "8px",
  },
  costBadgeModal: {
    backgroundColor: "#e0f2f1",
    color: "#00695c",
    fontSize: "0.78rem",
    fontWeight: "700",
    padding: "4px 10px",
    borderRadius: "8px",
  },
  modalTitle: {
    margin: "0 0 6px",
    fontSize: "1.4rem",
    color: "#154734",
  },
  modalLocation: {
    margin: "0 0 12px",
    fontSize: "0.95rem",
    color: "#2e6f40",
    fontWeight: "600",
  },
  modalDedication: {
    backgroundColor: "#f0f9f3",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "12px",
    fontSize: "0.88rem",
    color: "#1b4332",
    borderLeft: "3px solid #2e7d32",
  },
  modalDonorBox: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    fontSize: "0.82rem",
    color: "#52796f",
    marginBottom: "12px",
  },
  modalDesc: {
    fontSize: "0.9rem",
    color: "#444",
    lineHeight: 1.6,
    marginBottom: "12px",
  },
  coordsBox: {
    fontSize: "0.8rem",
    color: "#6c8c7c",
    backgroundColor: "#f7fbf8",
    padding: "6px 10px",
    borderRadius: "6px",
    marginBottom: "14px",
  },
  modalCheerBtn: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#2e7d32",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
};

export default PublicTreeGallery;
