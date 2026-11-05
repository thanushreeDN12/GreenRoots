import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const YourImpactGallery = () => {
  const [impactData, setImpactData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImpact = async () => {
      try {
        const profile = JSON.parse(localStorage.getItem("profile"));
        if (!profile?.token) return;

        const response = await axios.get('/api/users/me/impact', {
          headers: { Authorization: `Bearer ${profile.token}` }
        });
        setImpactData(response.data);
      } catch (error) {
        console.error("Error fetching impact gallery:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImpact();
  }, []);

  if (loading) {
    return <div style={styles.loading}>Loading your impact...</div>;
  }

  if (impactData.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <h3 style={styles.emptyTitle}>Your Impact Gallery</h3>
        <p style={styles.emptyText}>You haven't funded any trees yet! Start your journey by donating to a program.</p>
        <Link to="/programs" style={styles.linkButton}>Explore Programs</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Your Impact Gallery</h3>
      <p style={styles.subtitle}>Here are some of the actual trees planted because of your donations.</p>
      
      {impactData.map((program) => (
        <div key={program._id} style={styles.programCard}>
          <div style={styles.programHeader}>
            <h4 style={styles.programTitle}>{program.programName}</h4>
            <span style={styles.donationAmount}>You donated: ₹{program.totalDonated}</span>
          </div>
          
          {program.trees && program.trees.length > 0 ? (
            <div style={styles.photoGrid}>
              {program.trees.map((tree) => (
                <div key={tree._id} style={styles.photoCard}>
                  {tree.photoUrl ? (
                    <img src={tree.photoUrl} alt="Tree planted" style={styles.photo} loading="lazy" />
                  ) : (
                    <img src={`/api/admin/getPhoto/${tree.imageId}`} alt="Tree planted" style={styles.photo} loading="lazy" />
                  )}
                  {tree.description && <p style={styles.photoDesc}>{tree.description}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.noPhotos}>Planting in progress... Check back soon for photos!</p>
          )}
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    margin: '30px 0',
    padding: '20px',
    backgroundColor: '#f8fdf8',
    borderRadius: '12px',
    border: '1px solid #e0f2e0'
  },
  title: {
    fontSize: '1.5rem',
    color: '#154734',
    marginBottom: '5px',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#555',
    marginBottom: '20px',
  },
  emptyContainer: {
    margin: '30px 0',
    padding: '30px 20px',
    backgroundColor: '#f8fdf8',
    borderRadius: '12px',
    border: '1px dashed #c1dcc0',
    textAlign: 'center'
  },
  emptyTitle: {
    fontSize: '1.4rem',
    color: '#154734',
    marginBottom: '10px'
  },
  emptyText: {
    color: '#666',
    marginBottom: '20px'
  },
  linkButton: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#2e8b57',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: 'bold'
  },
  programCard: {
    marginBottom: '25px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  programHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    marginBottom: '15px'
  },
  programTitle: {
    margin: 0,
    fontSize: '1.2rem',
    color: '#333'
  },
  donationAmount: {
    fontSize: '0.95rem',
    fontWeight: 'bold',
    color: '#2e8b57',
    backgroundColor: '#e6f4ea',
    padding: '4px 10px',
    borderRadius: '12px'
  },
  photoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '15px'
  },
  photoCard: {
    borderRadius: '6px',
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    border: '1px solid #eee'
  },
  photo: {
    width: '100%',
    height: '120px',
    objectFit: 'cover',
    display: 'block'
  },
  photoDesc: {
    margin: '0',
    padding: '8px',
    fontSize: '0.8rem',
    color: '#555',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  noPhotos: {
    color: '#888',
    fontStyle: 'italic',
    fontSize: '0.9rem'
  },
  loading: {
    padding: '20px',
    textAlign: 'center',
    color: '#666'
  }
};

export default YourImpactGallery;
