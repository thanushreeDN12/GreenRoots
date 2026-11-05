import React, { useEffect, useState } from "react";

const defaultStories = [
  { _id: '1', name: 'Aarav Sharma', text: 'GreenRoots made sponsoring trees for our family anniversary seamless. We love seeing our native trees thrive!' },
  { _id: '2', name: 'Priya Patel', text: 'The geotagged verification gave our team total confidence. Real impact you can see on the map.' },
  { _id: '3', name: 'Rohit Verma', text: 'Restoring ancient Shola forests in the Western Ghats is the most meaningful climate action I have supported.' }
];

const Stories = () => {
  const [stories, setStories] = useState(defaultStories);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        let res = await fetch('/api/testimonials');
        if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
          res = await fetch('/testimonials');
        }
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setStories(data);
          }
        }
      } catch (err) {
        console.warn("Stories background sync:", err?.message || err);
      }
    };

    loadTestimonials();
  }, []);

  return (
    <section id="stories" style={styles.wrap} aria-labelledby="stories-title">
      <div style={styles.container}>
        <h2 id="stories-title" style={styles.h2}>Community Voices</h2>
        <div style={styles.grid}>
          {stories.map((s) => (
            <article key={s._id || s.name} style={styles.card}>
              <h3 style={styles.h3}>{s.name}</h3>
              <p style={styles.p}>"{s.text}"</p>
            </article>
          ))}
          {stories.length === 0 && <p>Loading stories...</p>}
        </div>
      </div>
    </section>
  );
};

const styles = {
  wrap: { padding: "3rem 1rem", background: "#fff" },
  container: { maxWidth: 1080, margin: "0 auto" },
  h2: { color: "#154734", marginBottom: "1rem" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "1rem",
  },
  card: {
    background: "#fdfdfd",
    border: "1px solid #eee",
    borderRadius: 12,
    padding: "1rem",
  },
  h3: { margin: "0 0 0.5rem", color: "#154734" },
  p: { margin: "0", fontStyle: 'italic', color: '#555', lineHeight: '1.4' },
};

export default Stories;
