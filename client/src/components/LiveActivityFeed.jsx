import React, { useEffect, useState } from 'react';

const formatTimeAgo = (dateString) => {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};

const defaultLiveActivities = [
  {
    _id: "act-1",
    username: "kavita_deshmukh",
    species: "Red Sandalwood (Pterocarpus santalinus)",
    city: "Hyderabad",
    uploadDate: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    dedication: "Support for dryland farming families and biodiversity"
  },
  {
    _id: "act-2",
    username: "arjun_nair",
    species: "Royal Kashmiri Chinar (Platanus orientalis)",
    city: "Delhi",
    uploadDate: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    dedication: "May the majestic Chinar shade generations to come"
  },
  {
    _id: "act-3",
    username: "ananya_iyer",
    species: "Sacred Peepal (Ficus religiosa)",
    city: "Bengaluru",
    uploadDate: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    dedication: "For a greener, cooler Garden City Bengaluru!"
  },
  {
    _id: "act-4",
    username: "sneha_reddy",
    species: "Shola Cloud Forest Sapling (Syzygium densiflorum)",
    city: "Wayanad",
    uploadDate: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    dedication: "Bringing back the mystical Nilgiri Shola forests"
  },
  {
    _id: "act-5",
    username: "ananya_iyer",
    species: "Miyawaki Native Canopy Mix (Jamun & Neem)",
    city: "Mumbai",
    uploadDate: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    dedication: "Breathing fresh life into our Mumbai skyline"
  }
];

const LiveActivityFeed = () => {
  const [activities, setActivities] = useState(defaultLiveActivities);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchActivity = async () => {
    try {
      let res = await fetch('/api/activity/recent');
      if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
        res = await fetch('/activity/recent');
      }

      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setIsRefreshing(true);
          setTimeout(() => {
            setActivities(data);
            setIsRefreshing(false);
          }, 300);
        }
      }
    } catch (err) {
      // Soft background warning, keeps current activities smoothly visible
      console.warn("LiveActivityFeed background sync:", err?.message || err);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchActivity();

    // Auto-refresh every 25 seconds
    const interval = setInterval(fetchActivity, 25000);
    return () => clearInterval(interval);
  }, []);

  if (activities.length === 0) return null;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>
        <span style={styles.liveIndicator}></span> Live Activity
      </h3>
      <div style={styles.feedWrapper}>
        <div style={{ ...styles.feedList, opacity: isRefreshing ? 0.5 : 1 }}>
          {activities.map((act) => (
            <div key={act._id} style={styles.activityItem}>
              <div style={styles.avatar}>
                {act.username.charAt(0).toUpperCase()}
              </div>
              <div style={styles.details}>
                <p style={styles.text}>
                  <strong>{act.username}</strong> planted a <strong>{act.species}</strong> in <strong>{act.city}</strong>
                </p>
                {act.dedication && (
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', fontStyle: 'italic', color: '#2e8b57' }}>
                    "{act.dedication}"
                  </p>
                )}
                <p style={styles.time}>{formatTimeAgo(act.uploadDate)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    border: '1px solid #e2f0e6',
    width: '100%',
    maxWidth: '350px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '400px'
  },
  title: {
    margin: 0,
    padding: '1rem',
    background: '#f9fcfa',
    borderBottom: '1px solid #e2f0e6',
    fontSize: '1rem',
    color: '#154734',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  liveIndicator: {
    width: '8px',
    height: '8px',
    background: '#ff4757',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'pulse 1.5s infinite'
  },
  feedWrapper: {
    overflowY: 'auto',
    padding: '0.5rem 1rem',
    flex: 1
  },
  feedList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    transition: 'opacity 0.3s ease'
  },
  activityItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    animation: 'slideIn 0.4s ease-out forwards'
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#4a6c4a',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    flexShrink: 0
  },
  details: {
    flex: 1
  },
  text: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#333',
    lineHeight: 1.4
  },
  time: {
    margin: '4px 0 0',
    fontSize: '0.75rem',
    color: '#777'
  }
};

// Add global styles for the pulse and slide animations
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes pulse {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(255, 71, 87, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 71, 87, 0); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleSheet);

export default LiveActivityFeed;
