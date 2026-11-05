import React, { useState, useEffect } from 'react';
import exifr from 'exifr';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leafet default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const TreeLocationPicker = ({ file, onLocationSelect }) => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [source, setSource] = useState(null); // 'exif', 'geolocation', 'manual-pin'
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [message, setMessage] = useState('');

  // Default center to India if nothing is found
  const defaultCenter = [20.5937, 78.9629]; 
  const defaultZoom = 4;

  useEffect(() => {
    const fetchLocation = async () => {
      if (!file) return;
      
      setLoading(true);
      setMessage('Analyzing photo for location data...');
      setLat(null);
      setLng(null);
      setSource(null);
      setShowMap(false);

      try {
        // 1. EXIF GPS extraction (primary)
        // exifr parses GPS data and automatically converts it to decimal lat/lng
        const gpsData = await exifr.gps(file);
        
        if (gpsData && gpsData.latitude && gpsData.longitude) {
          setLat(gpsData.latitude);
          setLng(gpsData.longitude);
          setSource('exif');
          setMessage('📍 Location detected from photo');
          onLocationSelect({ lat: gpsData.latitude, lng: gpsData.longitude, locationSource: 'exif' });
          setLoading(false);
          return; // Success!
        }
      } catch (err) {
        console.warn("EXIF extraction failed or missing:", err);
      }

      // 2. Browser Geolocation API (fallback)
      setMessage('No photo location found. Attempting device location...');
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLat(position.coords.latitude);
            setLng(position.coords.longitude);
            setSource('geolocation');
            setMessage('📍 Location detected from device');
            onLocationSelect({ lat: position.coords.latitude, lng: position.coords.longitude, locationSource: 'geolocation' });
            setLoading(false);
          },
          (error) => {
            console.warn("Geolocation denied or failed:", error);
            setMessage('📍 Please confirm location on map (Location permissions denied/failed)');
            setSource('manual-pin');
            setShowMap(true);
            setLoading(false);
          },
          { timeout: 10000 }
        );
      } else {
        setMessage('📍 Please confirm location on map (Geolocation not supported)');
        setSource('manual-pin');
        setShowMap(true);
        setLoading(false);
      }
    };

    fetchLocation();
  }, [file]); // Re-run when file changes

  const handleMapClick = (latlng) => {
    setLat(latlng.lat);
    setLng(latlng.lng);
    setSource('manual-pin');
    setMessage('📍 Location manually pinned');
    onLocationSelect({ lat: latlng.lat, lng: latlng.lng, locationSource: 'manual-pin' });
  };

  const center = (lat && lng) ? [lat, lng] : defaultCenter;
  const zoom = (lat && lng) ? 13 : defaultZoom;

  return (
    <div style={{ margin: '15px 0', padding: '15px', backgroundColor: '#f9fcf9', border: '1px solid #c1dcc0', borderRadius: '8px' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#154734' }}>
        Tree Location
      </label>
      
      {loading ? (
        <p style={{ fontStyle: 'italic', color: '#666', fontSize: '0.9rem' }}>{message}</p>
      ) : (
        <>
          {message && (
            <p style={{ margin: '0 0 10px', fontSize: '0.95rem', color: source === 'manual-pin' ? '#856404' : '#2e8b57', fontWeight: '500' }}>
              {message}
            </p>
          )}

          {/* Show the selected coordinates in a read-only format */}
          {(lat && lng) && (
            <div style={{ marginBottom: '10px', fontSize: '0.85rem', color: '#444' }}>
              <span>Latitude: {lat.toFixed(6)}</span> | <span>Longitude: {lng.toFixed(6)}</span>
              {source !== 'manual-pin' && (
                <button 
                  type="button" 
                  onClick={() => setShowMap(!showMap)}
                  style={{ marginLeft: '10px', background: 'none', border: 'none', color: '#0066cc', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  {showMap ? 'Hide map' : 'Adjust location'}
                </button>
              )}
            </div>
          )}

          {/* Interactive Map Picker (fallback or manual adjustment) */}
          {(!lat || !lng || showMap) && (
            <div style={{ height: '250px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
              <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapClickHandler onMapClick={handleMapClick} />
                {(lat && lng) && (
                  <Marker position={[lat, lng]} />
                )}
              </MapContainer>
            </div>
          )}
          {showMap && source !== 'manual-pin' && (
            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
              Click on the map to place a new pin if the detected location is incorrect.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default TreeLocationPicker;
