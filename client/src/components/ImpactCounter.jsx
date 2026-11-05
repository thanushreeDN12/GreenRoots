import React, { useEffect, useState, useRef } from 'react';

// A single animated number
const AnimatedNumber = ({ value, duration = 1500 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTime = useRef(null);
  
  useEffect(() => {
    if (value === 0) return;
    
    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = timestamp - startTime.current;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function (easeOutExpo)
      const easeOut = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      const currentVal = Math.floor(easeOut * value);
      
      setCount(currentVal);
      
      if (percentage < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };
    
    requestAnimationFrame(animate);
    
    return () => {
      startTime.current = null;
    };
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

const ImpactCounter = () => {
  const [impactData, setImpactData] = useState({
    totalTrees: 148,
    totalUsers: 34,
    totalFunds: 685000,
    totalCarbon: 4250
  });

  useEffect(() => {
    // Fetch live impact data safely
    const loadImpact = async () => {
      try {
        let res = await fetch('/api/impact/summary');
        if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
          res = await fetch('/impact/summary');
        }
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const data = await res.json();
          if (data && typeof data === 'object') {
            setImpactData(prev => ({ ...prev, ...data }));
            
            // Part D: Milestone Celebration logic
            const lastKnownTrees = parseInt(localStorage.getItem('greenroots_last_known_trees') || '0', 10);
            if (data.totalTrees > lastKnownTrees) {
               const currentMilestone = Math.floor(data.totalTrees / 1000) * 1000;
               const previousMilestone = Math.floor(lastKnownTrees / 1000) * 1000;
               
               if (currentMilestone > previousMilestone && currentMilestone > 0) {
                  triggerCelebration(currentMilestone);
               }
               localStorage.setItem('greenroots_last_known_trees', data.totalTrees.toString());
            }
          }
        }
      } catch (err) {
        console.warn("ImpactCounter background sync:", err?.message || err);
      }
    };

    loadImpact();
  }, []);

  // Simple CSS-based celebratory toast for Part D
  const triggerCelebration = (milestone) => {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = '#28a745';
    toast.style.color = '#fff';
    toast.style.padding = '1rem 2rem';
    toast.style.borderRadius = '50px';
    toast.style.fontWeight = 'bold';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    toast.style.zIndex = '9999';
    toast.style.transition = 'all 0.5s ease';
    toast.innerHTML = `🎉 GreenRoots just crossed ${milestone.toLocaleString()} trees planted!`;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.top = '-50px';
      setTimeout(() => document.body.removeChild(toast), 500);
    }, 4000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.statBox}>
        <div style={styles.number}><AnimatedNumber value={impactData.totalTrees} /></div>
        <div style={styles.label}>Trees Planted</div>
      </div>
      <div style={styles.statBox}>
        <div style={styles.number}><AnimatedNumber value={impactData.totalCarbon} /></div>
        <div style={styles.label}>kg CO₂ Offset</div>
      </div>
      <div style={styles.statBox}>
        <div style={styles.number}><AnimatedNumber value={impactData.totalUsers} /></div>
        <div style={styles.label}>Active Planters</div>
      </div>
      <div style={styles.statBox}>
        <div style={styles.number}>₹<AnimatedNumber value={impactData.totalFunds} /></div>
        <div style={styles.label}>Funds Raised</div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
    marginTop: '2rem',
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(8px)',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.2)'
  },
  statBox: {
    textAlign: 'center',
    minWidth: '120px'
  },
  number: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#fff',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
    margin: 0,
    lineHeight: 1
  },
  label: {
    fontSize: '0.9rem',
    color: '#e0f2e9',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginTop: '0.5rem'
  }
};

export default ImpactCounter;
