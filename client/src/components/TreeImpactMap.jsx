import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom distinct icon for user's own trees
const userTreeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const TreeImpactMap = ({ userEmail, title }) => {
  const [trees, setTrees] = useState([]);
  const [viewMode, setViewMode] = useState('all'); // 'all' | 'mine'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrees = async () => {
      try {
        setLoading(true);
        const url = (viewMode === 'mine' && userEmail)
          ? `/admin/map?userEmail=${encodeURIComponent(userEmail)}`
          : '/admin/map';

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setTrees(data || []);
        }
      } catch (error) {
        console.error("Error fetching map data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrees();
  }, [viewMode, userEmail]);

  return (
    <div style={{ marginTop: '1.5rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid #c1dcc0', backgroundColor: '#fdfdfd' }}>
      
      {/* Map Header with Controls & Counts */}
      <div style={{ padding: '12px 16px', backgroundColor: '#f0f7f3', borderBottom: '1px solid #c1dcc0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <strong style={{ color: '#154734', fontSize: '1rem' }}>
            {title || (viewMode === 'mine' ? '📍 Your Personal Plantations' : '🌍 Nationwide Reforestation Sites')}
          </strong>
          <span style={{ fontSize: '0.85rem', color: '#2d6a4f', marginLeft: '10px', backgroundColor: '#e2f0e6', padding: '3px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
            {trees.length} Plantations Tracked
          </span>
        </div>

        {/* Toggle between All Community Trees vs Only My Trees (when logged in) */}
        {userEmail && (
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setViewMode('all')}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                border: '1px solid #2d6a4f',
                backgroundColor: viewMode === 'all' ? '#2d6a4f' : '#ffffff',
                color: viewMode === 'all' ? '#ffffff' : '#2d6a4f',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              All 25 Plantations
            </button>
            <button
              type="button"
              onClick={() => setViewMode('mine')}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                border: '1px solid #2d6a4f',
                backgroundColor: viewMode === 'mine' ? '#2d6a4f' : '#ffffff',
                color: viewMode === 'mine' ? '#ffffff' : '#2d6a4f',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Only My Trees
            </button>
          </div>
        )}
      </div>

      {/* Leaflet Map Canvas */}
      <div style={{ height: '440px', width: '100%', position: 'relative' }}>
        <MapContainer center={[22.5937, 78.9629]} zoom={5} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MarkerClusterGroup chunkedLoading maxClusterRadius={35}>
            {trees.map((tree) => {
              const isMyTree = userEmail && tree.uploadedBy && tree.uploadedBy.toLowerCase() === userEmail.toLowerCase();
              return (
                <Marker 
                  key={tree._id} 
                  position={[tree.lat, tree.lng]}
                  icon={isMyTree ? userTreeIcon : new L.Icon.Default()}
                >
                  <Popup>
                    <div style={{ minWidth: '180px', padding: '2px' }}>
                      {tree.photoUrl && (
                        <img 
                          src={tree.photoUrl} 
                          alt={tree.species} 
                          style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '4px', marginBottom: '6px' }} 
                        />
                      )}
                      <strong style={{ color: '#154734', fontSize: '0.95rem', display: 'block' }}>
                        🌿 {tree.species || "Native Tree"}
                      </strong>
                      
                      {tree.programTitle && (
                        <span style={{ fontSize: '0.8rem', color: '#2d6a4f', display: 'block', margin: '2px 0' }}>
                          📍 {tree.programTitle}
                        </span>
                      )}

                      <span style={{ fontSize: '0.78rem', color: '#555', display: 'block' }}>
                        Planted for: <strong>@{tree.uploadedBy ? tree.uploadedBy.split('@')[0] : 'Donor'}</strong>
                      </span>

                      {tree.dedication && (
                        <div style={{ marginTop: '5px', fontStyle: 'italic', fontSize: '0.78rem', color: '#2e8b57', backgroundColor: '#f0f7f3', padding: '4px', borderRadius: '4px' }}>
                          "{tree.dedication}"
                        </div>
                      )}

                      {tree.cheers > 0 && (
                        <div style={{ marginTop: '4px', fontSize: '0.8rem', color: '#28a745' }}>
                          💚 {tree.cheers} Cheers
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
};

export default TreeImpactMap;
