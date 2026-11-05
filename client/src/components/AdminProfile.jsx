import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchprograms, addprogram } from "../actions/programs.js";
import { uploadPhoto } from '../actions/uploadPhoto.js';
import TreeLocationPicker from './TreeLocationPicker';

const AdminProfile = () => {
  const [activeForm, setActiveForm] = useState(null); // 'program' | 'photos' | 'checkin'
  const [program, setProgram] = useState({ title: "", description: "" });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [description, setDescription] = useState('');
  const [treeSpecies, setTreeSpecies] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locationSource, setLocationSource] = useState('manual-pin');
  const [dedication, setDedication] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [refreshPhotos, setRefreshPhotos] = useState(0);

  // Filter & Search states for tracking photos
  const [filterUserEmail, setFilterUserEmail] = useState("");
  const [filterProgramId, setFilterProgramId] = useState("");

  // Admin Check-in state
  const [checkInTargetPhoto, setCheckInTargetPhoto] = useState(null);
  const [checkInNote, setCheckInNote] = useState("");
  const [checkInFile, setCheckInFile] = useState(null);
  const [checkInUrl, setCheckInUrl] = useState("");
  const [checkInSubmitting, setCheckInSubmitting] = useState(false);
  const [checkInSuccess, setCheckInSuccess] = useState(false);

  // Use composite index-based keys (programIndex-userIndex) for checkbox state
  const [checkedDonors, setCheckedDonors] = useState(() => {
    const saved = localStorage.getItem('checkedDonors');
    return saved ? JSON.parse(saved) : {};
  });

  const [dbSpecies, setDbSpecies] = useState([]);
  const [dbCities, setDbCities] = useState([]);

  const dispatch = useDispatch();
  const programs = useSelector((state) => state.programs);

  // Fetch all existing photos, species, and cities from MongoDB
  useEffect(() => {
    const fetchSafeJson = async (url) => {
      try {
        const res = await fetch(url);
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          return await res.json();
        }
      } catch (err) {
        console.warn(`Fetch notice for ${url}:`, err.message);
      }
      return null;
    };

    fetchSafeJson('/api/photos/public').then(data => {
      if (Array.isArray(data)) setExistingPhotos(data);
    });

    fetchSafeJson('/api/species').then(data => {
      if (Array.isArray(data)) setDbSpecies(data);
    });

    fetchSafeJson('/api/cities').then(data => {
      if (Array.isArray(data)) setDbCities(data);
    });
  }, [refreshPhotos]);

  // Persist checkedDonors whenever changed
  useEffect(() => {
    localStorage.setItem('checkedDonors', JSON.stringify(checkedDonors));
  }, [checkedDonors]);

  // Fetch programs on mount
  useEffect(() => {
    const fetchAllPrograms = async () => {
      try {
        setLoading(true);
        await dispatch(fetchprograms());
      } catch (err) {
        console.error("Error loading programs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllPrograms();
  }, [dispatch]);

  // Program form handlers
  const handleProgramChange = (e) => {
    const { name, value } = e.target;
    setProgram({ ...program, [name]: value });
  };

  const handleProgramSubmit = (e) => {
    e.preventDefault();
    if (!program.title || !program.description) return alert("Fill all fields.");
    dispatch(addprogram(program));
    setProgram({ title: "", description: "" });
    alert("Program added!");
  };

  // Photo form handlers
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setImagePreview(URL.createObjectURL(file));
    setVerificationError("");
    setUploadSuccess(false);
  };

  const handleSelectDonorForPhoto = (donorEmail, programId, donorUsername, programTitle) => {
    setUserEmail(donorEmail);
    setSelectedProgram(programId || "");
    setDedication(`Planted in recognition of @${donorUsername}'s tree sponsorship in ${programTitle}`);
    if (!treeSpecies) setTreeSpecies("Native Forest Sapling");
    if (!latitude) setLatitude("20.5937");
    if (!longitude) setLongitude("78.9629");
    setActiveForm("photos");
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  const handlePhotoSubmit = (e) => {
    e.preventDefault();
    if (!image && !photoUrlInput) return alert("Please select an image file or provide a photo URL.");
    if (!userEmail) return alert("Enter user email.");
    
    const formData = new FormData();
    formData.append('userEmail', userEmail);
    formData.append('description', description);
    formData.append('treeSpecies', treeSpecies || 'Native Tree');
    formData.append('latitude', latitude || '20.5937');
    formData.append('longitude', longitude || '78.9629');
    formData.append('locationSource', locationSource);
    if(selectedProgram) formData.append('programId', selectedProgram);
    if(dedication) formData.append('dedication', dedication);
    if (image) formData.append('photo', image);
    if (photoUrlInput) formData.append('photoUrl', photoUrlInput);
    
    dispatch(uploadPhoto(formData, setIsVerifying, setVerificationError, (success) => {
      if(success) {
        setImage(null);
        setImagePreview("");
        setPhotoUrlInput("");
        setUserEmail("");
        setDescription('');
        setTreeSpecies('');
        setLatitude('');
        setLongitude('');
        setLocationSource('manual-pin');
        setDedication('');
        setSelectedProgram('');
        setUploadSuccess(true);
        setRefreshPhotos(prev => prev + 1);
        setTimeout(() => setUploadSuccess(false), 4000);
      }
    }));
  };

  // Checkbox toggle handler using composite key "programIndex-userIndex"
  const handleDonorCheckboxChange = (key) => {
    setCheckedDonors(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('checkedDonors', JSON.stringify(updated));
      return updated;
    });
  };

  // Open Check-in Modal / Form for a specific photo
  const handleOpenCheckIn = (photo) => {
    setCheckInTargetPhoto(photo);
    setCheckInNote("");
    setCheckInFile(null);
    setCheckInUrl("");
    setCheckInSuccess(false);
    setActiveForm("checkin");
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  // Submit growth check-in by Admin
  const handleCheckInSubmit = async (e) => {
    e.preventDefault();
    if (!checkInTargetPhoto) return;
    if (!checkInFile && !checkInUrl) {
      return alert("Please select a check-in photo file or provide an image URL.");
    }

    setCheckInSubmitting(true);
    const formData = new FormData();
    formData.append('photoId', checkInTargetPhoto._id);
    formData.append('note', checkInNote);
    if (checkInFile) formData.append('photo', checkInFile);
    if (checkInUrl) formData.append('photoUrl', checkInUrl);

    try {
      const res = await fetch('/admin/checkin', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        setCheckInSuccess(true);
        setCheckInNote("");
        setCheckInFile(null);
        setCheckInUrl("");
        setRefreshPhotos(prev => prev + 1);
        setTimeout(() => {
          setCheckInSuccess(false);
          setActiveForm(null);
          setCheckInTargetPhoto(null);
        }, 2500);
      } else {
        const err = await res.json();
        alert(err.message || 'Check-in upload failed');
      }
    } catch (err) {
      console.error("Check-in error:", err);
      alert('Network error while uploading check-in');
    } finally {
      setCheckInSubmitting(false);
    }
  };

  // Filtered photos for tracking specific user and/or program
  const filteredPhotos = existingPhotos.filter(p => {
    const matchEmail = filterUserEmail
      ? (p.donorEmail || "").toLowerCase().includes(filterUserEmail.toLowerCase()) ||
        (p.donorUsername || "").toLowerCase().includes(filterUserEmail.toLowerCase())
      : true;

    const matchProgram = filterProgramId
      ? p.program?.id === filterProgramId || p.program?._id === filterProgramId || (p.program?.title || "").toLowerCase().includes(filterProgramId.toLowerCase())
      : true;

    return matchEmail && matchProgram;
  });

  return (
    <div>
      <div className="admin-container" style={styles.container}>
        <h2 style={styles.title}>Admin Control Center</h2>
        <p style={{ textAlign: "center", color: "#555", marginTop: "-15px", marginBottom: "25px", fontSize: "0.95rem" }}>
          Manage reforestation programs, upload field photos for donors, and add verified tree growth check-ins.
        </p>

        {/* Toggle buttons */}
        <div className="admin-btn-group" style={styles.buttonGroup}>
          <button 
            style={{ ...styles.toggleBtn, backgroundColor: activeForm === "program" ? "#1b4332" : "#28a745" }} 
            onClick={() => setActiveForm(activeForm === "program" ? null : "program")}
          >
            ➕ Add Program
          </button>
          <button 
            style={{ ...styles.toggleBtn, backgroundColor: activeForm === "photos" ? "#1b4332" : "#28a745" }} 
            onClick={() => setActiveForm(activeForm === "photos" ? null : "photos")}
          >
            📸 Upload Tree Photo
          </button>
          <button 
            style={{ ...styles.toggleBtn, backgroundColor: "#154734" }} 
            onClick={() => {
              const el = document.getElementById("photo-tracker-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            🔍 Track User Photos ({existingPhotos.length})
          </button>
        </div>

        {/* Add Program Form */}
        {activeForm === "program" && (
          <form onSubmit={handleProgramSubmit} style={styles.form}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, color: "#154734" }}>Launch New Reforestation Program</h3>
              <button type="button" onClick={() => setActiveForm(null)} style={{ border: "none", background: "none", cursor: "pointer", fontSize: "1.2rem" }}>✕</button>
            </div>
            <label style={styles.label}>Title</label>
            <input type="text" name="title" value={program.title} onChange={handleProgramChange} style={styles.input} required placeholder="e.g. Western Ghats Rain Forest Recovery" />
            <label style={styles.label}>Description</label>
            <textarea name="description" value={program.description} onChange={handleProgramChange} style={styles.textarea} required placeholder="Describe ecological significance, target species, and location..." />
            <button type="submit" style={styles.submitBtn}>Upload Program</button>
          </form>
        )}

        {/* Growth Check-In Form (Admin only) */}
        {activeForm === "checkin" && checkInTargetPhoto && (
          <form onSubmit={handleCheckInSubmit} style={{ ...styles.form, border: "2px solid #2d6a4f", backgroundColor: "#f4fbf6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, color: "#1b4332" }}>
                🌱 Add Growth Check-In for Tree #{checkInTargetPhoto._id.slice(-6)}
              </h3>
              <button type="button" onClick={() => { setActiveForm(null); setCheckInTargetPhoto(null); }} style={{ border: "none", background: "none", cursor: "pointer", fontSize: "1.2rem" }}>✕</button>
            </div>

            <div style={{ display: "flex", gap: "15px", alignItems: "center", backgroundColor: "#fff", padding: "10px", borderRadius: "8px", border: "1px solid #c8e6c9" }}>
              <img 
                src={checkInTargetPhoto.photoUrl} 
                alt="Original tree" 
                style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "6px" }} 
              />
              <div style={{ fontSize: "0.85rem", color: "#333" }}>
                <strong style={{ color: "#154734" }}>🌿 {checkInTargetPhoto.treeSpecies}</strong><br />
                <span>Donor: <strong>@{checkInTargetPhoto.donorUsername}</strong> ({checkInTargetPhoto.donorEmail})</span><br />
                <span>Program: {checkInTargetPhoto.program?.title || "Pan-India"}</span>
              </div>
            </div>

            <label style={styles.label}>Check-in Note / Tree Health Status</label>
            <input 
              type="text" 
              value={checkInNote} 
              onChange={(e) => setCheckInNote(e.target.value)} 
              placeholder="e.g. Month 6 check-in: Healthy sapling growth, 15cm taller with lush leaves" 
              style={styles.input} 
              required 
            />

            <label style={styles.label}>Check-in Photo (Image URL OR File Upload)</label>
            <input 
              type="url" 
              value={checkInUrl} 
              onChange={(e) => setCheckInUrl(e.target.value)} 
              placeholder="Paste check-in photo URL (optional)" 
              style={styles.input} 
            />
            <span style={{ fontSize: "0.8rem", color: "#666", textAlign: "center" }}>— OR SELECT LOCAL PHOTO FILE —</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setCheckInFile(e.target.files[0])} 
              style={styles.input} 
            />

            {checkInSuccess && (
              <p style={{ color: "green", fontWeight: "bold", margin: 0 }}>
                ✅ Growth check-in photo successfully added!
              </p>
            )}

            <button 
              type="submit" 
              disabled={checkInSubmitting} 
              style={{ ...styles.submitBtn, backgroundColor: "#1b4332", opacity: checkInSubmitting ? 0.7 : 1 }}
            >
              {checkInSubmitting ? "Uploading Check-In..." : "Save Growth Check-In"}
            </button>
          </form>
        )}

        {/* Add Photo Form */}
        {activeForm === "photos" && (
          <form id="admin-photo-form" onSubmit={handlePhotoSubmit} style={styles.form}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, color: "#154734" }}>Upload Verified Tree Photo for Donor</h3>
              <button type="button" onClick={() => setActiveForm(null)} style={{ border: "none", background: "none", cursor: "pointer", fontSize: "1.2rem" }}>✕</button>
            </div>

            <div style={{ backgroundColor: "#e8f5e9", padding: "10px 14px", borderRadius: "8px", border: "1px solid #c8e6c9" }}>
              <span style={{ fontSize: "0.88rem", color: "#2e7d32", fontWeight: "600" }}>
                🌿 Uploading field photo for a user's tree donation. Once uploaded, it will appear on the donor's dashboard and the front page gallery!
              </span>
            </div>

            <label style={styles.label}>User Email</label>
            <input 
              type="email" 
              value={userEmail} 
              onChange={(e) => setUserEmail(e.target.value)} 
              style={styles.input} 
              required 
              placeholder="Enter donor email (e.g. donor@gmail.com)" 
            />
            
            <label style={styles.label}>Tree Species (From MongoDB Catalog)</label>
            <div style={{ display: "flex", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
              <select 
                value={treeSpecies} 
                onChange={(e) => setTreeSpecies(e.target.value)} 
                style={{ ...styles.input, flex: "1 1 200px" }}
              >
                <option value="">-- Choose from MongoDB Species --</option>
                {dbSpecies.map(s => (
                  <option key={s._id || s.commonName} value={s.commonName}>
                    🌿 {s.commonName} ({s.scientificName || s.nativeRegion}) - ~{s.carbonRateKgPerYear || 20}kg CO2/yr
                  </option>
                ))}
              </select>
              <input 
                type="text" 
                value={treeSpecies} 
                onChange={(e) => setTreeSpecies(e.target.value)} 
                style={{ ...styles.input, flex: "1 1 200px" }} 
                placeholder="Or custom species name" 
              />
            </div>

            <label style={styles.label}>Quick City Location Preset (From MongoDB)</label>
            <select 
              onChange={(e) => {
                if (!e.target.value) return;
                const selectedCity = dbCities.find(c => c.name === e.target.value);
                if (selectedCity) {
                  setLatitude(String(selectedCity.lat));
                  setLongitude(String(selectedCity.lng));
                  setLocationSource('manual-pin');
                }
              }}
              style={{ ...styles.input, marginBottom: "10px" }}
            >
              <option value="">-- Choose City Coordinates from MongoDB (Optional) --</option>
              {dbCities.map(c => (
                <option key={c._id || c.name} value={c.name}>
                  📍 {c.name}, {c.state} ({c.lat}, {c.lng})
                </option>
              ))}
            </select>

            <label style={styles.label}>Link to Program</label>
            <select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)} style={styles.input}>
              <option value="">Select a Program (Optional)</option>
              {programs.map(p => (
                <option key={p._id} value={p._id}>{p.title} {p.location ? `(${p.location})` : ''}</option>
              ))}
            </select>

            <label style={styles.label}>Dedication / Note</label>
            <input type="text" value={dedication} onChange={(e) => setDedication(e.target.value)} style={styles.input} placeholder="e.g. In appreciation of donor's generous sponsorship" />

            <label style={styles.label}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...styles.input, height: '80px' }} placeholder="Field notes on sapling health, soil conditions, and coordinates..." />

            <TreeLocationPicker 
              file={image} 
              onLocationSelect={(loc) => {
                setLatitude(loc.lat);
                setLongitude(loc.lng);
                setLocationSource(loc.source);
              }} 
            />

            <label style={styles.label}>Photo Source (File Upload OR Image URL)</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <input 
                type="url" 
                value={photoUrlInput} 
                onChange={(e) => {
                  setPhotoUrlInput(e.target.value);
                  if (e.target.value) setImagePreview(e.target.value);
                }} 
                style={styles.input} 
                placeholder="Paste web photo URL (e.g. https://images.unsplash.com/...)" 
              />
              <span style={{ fontSize: "0.8rem", color: "#666", textAlign: "center" }}>— OR SELECT LOCAL FILE —</span>
              <input type="file" accept="image/*" onChange={handleImageChange} style={styles.input} />
            </div>

            {imagePreview && (
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <img src={imagePreview} alt="Preview" style={styles.preview} />
              </div>
            )}
            {verificationError && <p style={{ color: "red", fontWeight: "bold" }}>{verificationError}</p>}
            {uploadSuccess && <p style={{ color: "green", fontWeight: "bold" }}>✅ Photo successfully uploaded and linked to donor!</p>}
            <button type="submit" disabled={isVerifying} style={{...styles.submitBtn, opacity: isVerifying ? 0.7 : 1}}>
              {isVerifying ? "Uploading Photo..." : "Upload Tree Photo"}
            </button>
          </form>
        )}

        {/* PHOTO TRACKING & MANAGEMENT SECTION */}
        <section id="photo-tracker-section" style={{ marginTop: "40px", backgroundColor: "#ffffff", padding: "24px", borderRadius: "10px", border: "1px solid #d8e2dc", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ borderBottom: "2px solid #e8f5e9", paddingBottom: "12px", marginBottom: "18px" }}>
            <h3 style={{ color: "#1b4332", fontSize: "1.35rem", margin: "0 0 6px" }}>
              🔎 Track & Manage Photos by Donor & Program
            </h3>
            <p style={{ color: "#555", fontSize: "0.88rem", margin: 0 }}>
              Filter photos uploaded for any user or program, track existing growth check-ins, or upload new check-ins.
            </p>
          </div>

          {/* Filter Bar */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px", backgroundColor: "#f8fdf9", padding: "14px", borderRadius: "8px", border: "1px solid #c8e6c9" }}>
            <div style={{ flex: "1 1 220px" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "bold", color: "#154734", marginBottom: "4px" }}>
                Filter by Donor (Email or Username):
              </label>
              <input 
                type="text" 
                value={filterUserEmail} 
                onChange={(e) => setFilterUserEmail(e.target.value)} 
                placeholder="e.g. manish.kumar or aarav" 
                style={{ ...styles.input, width: "100%", boxSizing: "border-box" }} 
              />
            </div>

            <div style={{ flex: "1 1 220px" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "bold", color: "#154734", marginBottom: "4px" }}>
                Filter by Program:
              </label>
              <select 
                value={filterProgramId} 
                onChange={(e) => setFilterProgramId(e.target.value)} 
                style={{ ...styles.input, width: "100%", boxSizing: "border-box" }}
              >
                <option value="">-- All Programs ({programs.length}) --</option>
                {programs.map(p => (
                  <option key={p._id} value={p._id}>{p.title}</option>
                ))}
              </select>
            </div>

            {(filterUserEmail || filterProgramId) && (
              <div style={{ alignSelf: "flex-end" }}>
                <button 
                  type="button" 
                  onClick={() => { setFilterUserEmail(""); setFilterProgramId(""); }}
                  style={{ padding: "10px 14px", backgroundColor: "#e0e0e0", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600" }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontSize: "0.9rem", color: "#2d6a4f", fontWeight: "bold" }}>
              Showing {filteredPhotos.length} of {existingPhotos.length} tree photos
            </span>
          </div>

          {filteredPhotos.length === 0 ? (
            <div style={{ padding: "30px", textAlign: "center", backgroundColor: "#f9f9f9", borderRadius: "8px", border: "1px dashed #ccc" }}>
              <p style={{ color: "#666", margin: "0 0 10px" }}>No photos match your current filter.</p>
              <span style={{ fontSize: "0.85rem", color: "#888" }}>Try changing the email or selecting a different program above.</span>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {filteredPhotos.map((p) => (
                <div key={p._id} style={{ backgroundColor: "#ffffff", borderRadius: "10px", overflow: "hidden", border: "1px solid #d8e2dc", boxShadow: "0 2px 6px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>
                  <div style={{ position: "relative" }}>
                    <img src={p.photoUrl} alt={p.treeSpecies} style={{ width: "100%", height: "160px", objectFit: "cover" }} />
                    <span style={{ position: "absolute", top: "8px", right: "8px", backgroundColor: "rgba(21, 71, 52, 0.85)", color: "#fff", padding: "3px 8px", borderRadius: "12px", fontSize: "0.72rem", fontWeight: "bold" }}>
                      Verified ✓
                    </span>
                  </div>

                  <div style={{ padding: "12px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <strong style={{ fontSize: "0.95rem", color: "#154734", marginBottom: "4px" }}>
                      🌿 {p.treeSpecies}
                    </strong>

                    <div style={{ fontSize: "0.82rem", color: "#333", marginBottom: "6px" }}>
                      <span>👤 Donor: <strong>@{p.donorUsername}</strong></span><br />
                      <span style={{ color: "#666", fontSize: "0.78rem" }}>📧 {p.donorEmail}</span>
                    </div>

                    <div style={{ fontSize: "0.8rem", color: "#2d6a4f", backgroundColor: "#eef7f1", padding: "6px 8px", borderRadius: "6px", marginBottom: "8px" }}>
                      📍 <strong>Program:</strong> {p.program?.title || "Pan-India Reforestation"}
                      {p.program?.location && ` (${p.program.location})`}
                    </div>

                    {p.dedication && (
                      <div style={{ fontSize: "0.78rem", color: "#555", fontStyle: "italic", marginBottom: "8px" }}>
                        "{p.dedication}"
                      </div>
                    )}

                    {/* Growth Check-Ins Display */}
                    <div style={{ marginTop: "auto", paddingTop: "8px", borderTop: "1px solid #f0f0f0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#1b4332" }}>
                          Growth Updates ({p.checkIns?.length || 0}):
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOpenCheckIn(p)}
                          style={{
                            padding: "4px 8px",
                            backgroundColor: "#2d6a4f",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                            fontWeight: "600"
                          }}
                        >
                          ➕ Add Check-In
                        </button>
                      </div>

                      {p.checkIns && p.checkIns.length > 0 ? (
                        <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }}>
                          {p.checkIns.map((ci, cidx) => (
                            <div key={cidx} style={{ position: "relative", flexShrink: 0 }}>
                              <img 
                                src={ci.photoUrl} 
                                alt="Check-in" 
                                style={{ width: "45px", height: "45px", objectFit: "cover", borderRadius: "4px", border: "1px solid #4CAF50" }} 
                                title={ci.note || "Growth check-in"} 
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: "0.75rem", color: "#888", fontStyle: "italic" }}>
                          No check-ins yet for this tree.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Programs & Donors List with One-Click Upload Binding */}
        <section style={{ marginTop: "40px" }}>
          <h3 style={{ color: "#1b4332", fontSize: "1.3rem", marginBottom: "0.5rem" }}>
            All Reforestation Programs & Active Donors
          </h3>
          <p style={{ color: "#666", fontSize: "0.88rem", marginBottom: "1rem" }}>
            Click "Add Tree Photo for @user" next to any donor to immediately open the photo upload form pre-linked to that donor and program.
          </p>

          {loading ? (
            <p>Loading programs...</p>
          ) : !Array.isArray(programs) || programs.length === 0 ? (
            <p>No programs found.</p>
          ) : (
            <div>
              {programs.map((program, programIndex) =>
                program ? (
                  <div style={styles.programCard} key={program._id}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
                      <div>
                        <h4 style={{ margin: "0 0 4px", fontSize: "1.1rem", color: "#154734" }}>{program.title || "No Title"}</h4>
                        {program.location && (
                          <span style={{ fontSize: "0.82rem", color: "#40916c", fontWeight: "600" }}>📍 {program.location}</span>
                        )}
                      </div>
                      <span style={{ fontSize: "0.85rem", fontWeight: "700", backgroundColor: "#e8f5e9", color: "#2e7d32", padding: "4px 10px", borderRadius: "12px" }}>
                        ₹{program.donationCost || 500} / tree
                      </span>
                    </div>

                    <strong>Donors ({program.donatedUsers?.length || 0}):</strong>
                    {program.donatedUsers && program.donatedUsers.length > 0 ? (
                      <ul style={{ listStyle: "none", padding: 0, marginTop: "8px" }}>
                        {program.donatedUsers.map((user, userIndex) => {
                          const compositeKey = `${programIndex}-${userIndex}`;
                          return (
                            <li 
                              key={compositeKey}
                              style={{ 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "space-between", 
                                gap: "8px", 
                                margin: "6px 0", 
                                padding: "8px 12px", 
                                backgroundColor: "#ffffff", 
                                borderRadius: "8px", 
                                border: "1px solid #e1eee4",
                                flexWrap: "wrap"
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <input
                                  type="checkbox"
                                  checked={!!checkedDonors[compositeKey]}
                                  onChange={() => handleDonorCheckboxChange(compositeKey)}
                                />
                                <span><strong>@{user.username}</strong> ({user.email})</span>
                              </div>

                              <div style={{ display: "flex", gap: "6px" }}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFilterUserEmail(user.email);
                                    setFilterProgramId(program._id);
                                    const el = document.getElementById("photo-tracker-section");
                                    if (el) el.scrollIntoView({ behavior: "smooth" });
                                  }}
                                  style={{
                                    padding: "5px 10px",
                                    backgroundColor: "#e8f5e9",
                                    color: "#1b4332",
                                    border: "1px solid #a3d9b1",
                                    borderRadius: "6px",
                                    fontSize: "0.8rem",
                                    fontWeight: "600",
                                    cursor: "pointer"
                                  }}
                                >
                                  🔍 View Photos
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleSelectDonorForPhoto(user.email, program._id, user.username, program.title)}
                                  style={{
                                    padding: "5px 12px",
                                    backgroundColor: "#2d6a4f",
                                    color: "#ffffff",
                                    border: "none",
                                    borderRadius: "6px",
                                    fontSize: "0.8rem",
                                    fontWeight: "600",
                                    cursor: "pointer"
                                  }}
                                >
                                  📸 Add Photo
                                </button>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p style={{ fontSize: "0.88rem", color: "#888", marginTop: "6px" }}>No donors yet.</p>
                    )}
                  </div>
                ) : null
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "920px",
    margin: "40px auto",
    padding: "30px",
    backgroundColor: "#f9fafc",
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    fontFamily: "'Inter', sans-serif",
  },
  title: {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "700",
    color: "#154734",
    marginBottom: "20px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "30px",
  },
  toggleBtn: {
    padding: "10px 18px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#28a745",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    marginBottom: "30px",
  },
  label: {
    fontWeight: "600",
    fontSize: "14px",
    color: "#333",
  },
  input: {
    padding: "10px 12px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
  },
  textarea: {
    minHeight: "100px",
    resize: "vertical",
    padding: "10px 12px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
  },
  submitBtn: {
    marginTop: "10px",
    padding: "12px",
    fontSize: "15px",
    fontWeight: "600",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  preview: {
    marginTop: "10px",
    maxWidth: "100%",
    maxHeight: "220px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    objectFit: "cover"
  },
  programCard: {
    marginBottom: "20px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
};

export default AdminProfile;
