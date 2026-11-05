import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from '../actions/programs';
import TreeImpactMap from './TreeImpactMap';
import YourImpactGallery from './YourImpactGallery';
import UserCarbonImpactChart from './UserCarbonImpactChart';

const UserProfile = () => {
  const user = JSON.parse(localStorage.getItem("profile"));
  const userId = user?.result?._id || user?.newUser?._id;
  const dispatch = useDispatch();

  // Get user data from Redux store
  const reduxUserData = useSelector((state) => state.users);

  const [userData, setUserData] = useState(null);
  const [userPhotos, setUserPhotos] = useState([]);
  const [totalCarbon, setTotalCarbon] = useState(0);

  // Modal inspection state for growth check-ins and tree photos
  const [selectedInspectPhoto, setSelectedInspectPhoto] = useState(null);

  // Helper function to resolve photo URL
  const resolvePhotoUrl = (urlOrId) => {
    if (!urlOrId) return '';
    if (urlOrId.startsWith('http://') || urlOrId.startsWith('https://')) return urlOrId;
    if (urlOrId.startsWith('/admin/getPhoto/')) return urlOrId;
    return `/admin/getPhoto/${urlOrId}`;
  };

  // Fetch photos filtered by the user's email
  useEffect(() => {
    const fetchPhotos = async () => {
      if (userData?.email) {
        try {
          const response = await fetch(`/admin/getPhoto?userEmail=${encodeURIComponent(userData.email)}`);
          if (response.ok) {
            const data = await response.json();
            setUserPhotos(data.photos || []);
            setTotalCarbon(data.totalCarbon || 0);
          } else {
            console.error("Failed to fetch photos");
          }
        } catch (error) {
          console.error("Error fetching photos:", error);
        }
      }
    };

    fetchPhotos();
  }, [userData?.email]);

  // Dispatch action to fetch user details
  useEffect(() => {
    if (userId) {
      dispatch(getUser(userId));
    }
  }, [dispatch, userId]);

  // Update local state when Redux user data changes
  useEffect(() => {
    if (reduxUserData) {
      setUserData(reduxUserData);
    }
  }, [reduxUserData]);

  // Handle Cheer click
  const handleCheer = async (photoId) => {
    setUserPhotos(prevPhotos => prevPhotos.map(p => 
      p._id === photoId ? { ...p, cheers: (p.cheers || 0) + 1, _justCheered: true } : p
    ));
    try {
      await fetch(`/admin/photo/${photoId}/cheer`, { method: 'POST' });
    } catch (err) {
      console.error("Cheer failed", err);
    }
  };

  return (
    <div style={styles.container}>

      {/* User Info Header */}
      <header style={styles.header}>
        <h1 style={styles.userName}>Welcome {userData?.username || "Loading..."}</h1>
        <p style={styles.userEmail}>Your Email: {userData?.email || ""}</p>
      </header>

      {/* Content */}
      <div className="userprofile-layout" style={styles.content}>

        {/* Left Panel - Total Carbon Sequestered */}
        <aside className="userprofile-sidebar" style={styles.leftPanel}>
          <h2>Total Carbon Sequestered</h2>
          <div style={styles.carbonValue}>
            {totalCarbon} kg CO<sub>2</sub>
          </div>
          {totalCarbon > 0 && (
            <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(255,255,255,0.6)', borderRadius: '8px', fontSize: '0.9rem' }}>
              <p style={{ margin: '0 0 5px' }}><strong>🌱 Tangible Impact:</strong></p>
              <p style={{ margin: '3px 0' }}>📱 Charged <strong>{Math.round(totalCarbon * 122).toLocaleString()}</strong> smartphones</p>
              <p style={{ margin: '3px 0' }}>🚗 Offset <strong>{(totalCarbon * 4).toFixed(1)}</strong> km of driving</p>
            </div>
          )}
        </aside>

        {/* Right Panel - Programs Donated */}
        <section style={styles.programsPanel}>
          <h2>Programs Donated To</h2>
          {(userData?.donatedPrograms?.length || 0) === 0 ? (
            <p>No donation programs found.</p>
          ) : (
            <ul style={styles.programList}>
              {userData.donatedPrograms.map((program) => (
                <li key={program._id} style={styles.programItem}>
                  {program.title}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      
      {/* Emotional Impact Badges */}
      {userPhotos.length > 0 && (
        <section style={{ marginTop: "20px", padding: "15px", backgroundColor: "#e2f0e6", borderRadius: "12px", border: "1px solid #c1dcc0" }}>
          <h2 style={{ margin: '0 0 10px', fontSize: '1.2rem', color: '#154734' }}>Milestone Badges 🎖️</h2>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <div style={styles.badge}>🌱 Seedling Starter <span style={styles.badgeSub}>First Tree</span></div>
            {userPhotos.length >= 5 && <div style={styles.badge}>🌳 Grove Builder <span style={styles.badgeSub}>5+ Trees</span></div>}
            {userPhotos.length >= 10 && <div style={styles.badge}>🌲 Forest Maker <span style={styles.badgeSub}>10+ Trees</span></div>}
            {totalCarbon >= 100 && <div style={styles.badge}>🌍 Climate Champion <span style={styles.badgeSub}>100+ kg CO₂</span></div>}
          </div>
        </section>
      )}

      {/* Carbon Offset Visualization (Recharts) */}
      <UserCarbonImpactChart
        trees={userPhotos}
        userEmail={userData?.email}
        title="🌿 Your Carbon Offset Impact Over Time"
      />

      {/* Live Impact Map */}
      <section style={{ marginTop: "40px" }}>
        <h2 style={styles.userName}>Live Impact Map</h2>
        <TreeImpactMap userEmail={userData?.email} />
      </section>

      {/* Your Impact Gallery */}
      <YourImpactGallery />

      {/* User Photos Section */}
      <section style={{ marginTop: "40px" }}>
        <h2 style={styles.userName}>User Photos</h2>
        <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "-10px", marginBottom: "20px" }}>
          Click on any tree photo or growth check-in thumbnail to inspect the full-resolution image and field report.
        </p>
        {userPhotos.length === 0 ? (
          <p>No photos uploaded yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {userPhotos.map((photo) => {
              const primaryUrl = resolvePhotoUrl(photo.photoUrl || photo.imageId);
              return (
                <div key={photo._id} style={{ textAlign: 'left', backgroundColor: '#f0f7f3', padding: '14px', borderRadius: '12px', border: '1px solid #c1dcc0', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setSelectedInspectPhoto({ url: primaryUrl, title: photo.treeSpecies, note: photo.description || photo.dedication, date: photo.uploadDate, isCheckIn: false })}>
                    <img
                      src={primaryUrl}
                      alt={photo.description || 'User tree photo'}
                      style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px', transition: 'transform 0.2s' }}
                      loading="lazy"
                    />
                    <span style={{ position: "absolute", bottom: "14px", right: "8px", backgroundColor: "rgba(0,0,0,0.6)", color: "#fff", padding: "2px 8px", borderRadius: "4px", fontSize: "0.72rem" }}>
                      🔍 Click to enlarge
                    </span>
                  </div>

                  {photo.treeSpecies && (
                    <p style={{ margin: '4px 0', fontSize: '0.95rem', color: '#154734', fontWeight: 'bold' }}>
                      🌿 {photo.treeSpecies}
                    </p>
                  )}
                  
                  {photo.dedication && (
                    <p style={{ margin: '6px 0', fontSize: '0.85rem', fontStyle: 'italic', color: '#2e8b57', background: '#e2f0e6', padding: '6px 8px', borderRadius: '6px' }}>
                      "{photo.dedication}"
                    </p>
                  )}
                  
                  {photo.description && (
                    <p style={{ margin: '6px 0', fontSize: '0.85rem', color: '#444' }}>
                      {photo.description}
                    </p>
                  )}

                  {/* Growth Check-ins Gallery */}
                  {photo.checkIns && photo.checkIns.length > 0 && (
                    <div style={{ marginTop: '12px', padding: '10px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #d3e8d6' }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 'bold', color: '#1b4332' }}>
                          🌱 Growth Updates ({photo.checkIns.length}):
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#2d6a4f', fontStyle: 'italic' }}>
                          Click thumbnail to view
                        </span>
                      </div>

                      <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', paddingBottom: '4px' }}>
                        {photo.checkIns.map((ci, idx) => {
                          const checkInImgUrl = resolvePhotoUrl(ci.photoUrl);
                          return (
                            <div 
                              key={idx} 
                              onClick={() => setSelectedInspectPhoto({ 
                                url: checkInImgUrl, 
                                title: `Growth Check-In #${idx + 1}: ${photo.treeSpecies}`, 
                                note: ci.note, 
                                date: ci.date, 
                                isCheckIn: true 
                              })}
                              style={{ cursor: "pointer", textAlign: "center", flexShrink: 0 }}
                              title="Click to view growth photo"
                            >
                              <img 
                                src={checkInImgUrl} 
                                alt={ci.note || "Growth Check-in"} 
                                style={{ width: '65px', height: '65px', objectFit: 'cover', borderRadius: '6px', border: '2px solid #2d6a4f', transition: 'all 0.2s' }} 
                                onError={(e) => {
                                  // Fallback in case of broken path
                                  if (!e.target.src.includes('/admin/getPhoto/')) {
                                    e.target.src = resolvePhotoUrl(ci.photoUrl);
                                  }
                                }}
                              />
                              <span style={{ display: "block", fontSize: "0.68rem", color: "#555", marginTop: "2px", maxWidth: "65px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {ci.note || `Update #${idx + 1}`}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Cheer Button & Date */}
                  <div style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button 
                      onClick={() => handleCheer(photo._id)}
                      style={{ background: photo._justCheered ? '#e2f0e6' : 'white', border: '1px solid #c1dcc0', borderRadius: '20px', padding: '4px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: photo._justCheered ? '#28a745' : '#444', transition: 'all 0.2s' }}
                    >
                      💚 <span style={{ fontWeight: 'bold' }}>{photo.cheers || 0}</span>
                    </button>
                    <span style={{ fontSize: '0.75rem', color: '#888' }}>
                      {photo.uploadDate ? new Date(photo.uploadDate).toLocaleDateString() : ""}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* POPUP MODAL FOR CLICKABLE CHECK-IN AND TREE PHOTOS */}
      {selectedInspectPhoto && (
        <div 
          onClick={() => setSelectedInspectPhoto(null)} 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px"
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              maxWidth: "600px",
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
              position: "relative"
            }}
          >
            {/* Modal Header */}
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f8fdf9" }}>
              <strong style={{ fontSize: "1.05rem", color: "#154734" }}>
                {selectedInspectPhoto.title || "Tree Photo Inspection"}
              </strong>
              <button 
                onClick={() => setSelectedInspectPhoto(null)}
                style={{ border: "none", background: "none", fontSize: "1.3rem", cursor: "pointer", color: "#666" }}
              >
                ✕
              </button>
            </div>

            {/* Modal Image */}
            <div style={{ backgroundColor: "#000", textAlign: "center", maxHeight: "420px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img 
                src={selectedInspectPhoto.url} 
                alt="Enlarged view" 
                style={{ maxWidth: "100%", maxHeight: "420px", objectFit: "contain" }} 
              />
            </div>

            {/* Modal Body / Report */}
            <div style={{ padding: "16px 18px", backgroundColor: "#fff" }}>
              {selectedInspectPhoto.isCheckIn && (
                <span style={{ display: "inline-block", backgroundColor: "#e8f5e9", color: "#2e7d32", padding: "3px 8px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: "bold", marginBottom: "8px" }}>
                  🌱 Verified Growth Check-In
                </span>
              )}

              {selectedInspectPhoto.note && (
                <p style={{ margin: "4px 0 8px", fontSize: "0.92rem", color: "#333", fontWeight: "500" }}>
                  "{selectedInspectPhoto.note}"
                </p>
              )}

              {selectedInspectPhoto.date && (
                <span style={{ fontSize: "0.78rem", color: "#888", display: "block" }}>
                  Recorded on: {new Date(selectedInspectPhoto.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "10px 18px", borderTop: "1px solid #eee", textAlign: "right", backgroundColor: "#f9f9f9" }}>
              <button 
                onClick={() => setSelectedInspectPhoto(null)}
                style={{ padding: "8px 16px", backgroundColor: "#2d6a4f", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "0.85rem" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const styles = {
  container: {
    maxWidth: 960,
    margin: "2rem auto",
    padding: "0 1.25rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    borderBottom: "2px solid #ccc",
    paddingBottom: "1rem",
    marginBottom: "2rem",
  },
  userName: {
    fontSize: "2rem",
    margin: 0,
    color: "#154734",
  },
  userEmail: {
    fontSize: "1.1rem",
    margin: 0,
    color: "#4a6c4a",
  },
  content: {
    display: "flex",
    gap: "2rem",
  },
  leftPanel: {
    flex: "0 0 250px",
    border: "1px solid #c1dcc0",
    borderRadius: 12,
    padding: "1.5rem",
    backgroundColor: "#e7f1e7",
    textAlign: "center",
    color: "#2e4d25",
  },
  carbonValue: {
    marginTop: "1rem",
    fontSize: "2.2rem",
    fontWeight: "bold",
  },
  programsPanel: {
    flex: 1,
    border: "1px solid #c1dcc0",
    borderRadius: 12,
    padding: "1.5rem",
    backgroundColor: "#f7fbf8",
    color: "#386641",
  },
  programList: {
    listStyle: "none",
    paddingLeft: 0,
    marginTop: "1rem",
  },
  programItem: {
    padding: "0.5rem 0",
    borderBottom: "1px solid #d3e4d3",
  },
  badge: {
    background: '#fff',
    border: '1px solid #c1dcc0',
    padding: '8px 12px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: '#2e4d25',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  },
  badgeSub: {
    fontSize: '0.7rem',
    background: '#e2f0e6',
    padding: '2px 6px',
    borderRadius: '10px',
    fontWeight: 'normal',
    color: '#154734'
  }
};

export default UserProfile;
