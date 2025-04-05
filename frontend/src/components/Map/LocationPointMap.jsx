import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const LocationPointerMap = ({ 
  latitude = 22.3752, 
  longitude = 91.8349, 
  zoom = 13, 
  height = '690px',
  markerColor = '#4CAF50',
  markerBorderColor = '#2E7D32',
  title = 'Location'
}) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // Create map only if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map('location-map').setView([latitude, longitude], zoom);
      
      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      // Add custom CSS for tooltips
      const style = document.createElement('style');
      style.innerHTML = `
        .map-tooltip {
          background: rgba(255,255,255,0.8);
          border: 2px solid #333;
          border-radius: 4px;
          padding: 5px 10px;
          font-weight: bold;
        }
      `;
      document.head.appendChild(style);
    } else {
      // Just update the view if map already exists
      mapRef.current.setView([latitude, longitude], zoom);
    }

    // Remove existing marker if any
    if (markerRef.current) {
      markerRef.current.remove();
    }

    // Create marker for the location
    markerRef.current = L.circleMarker([latitude, longitude], {
      radius: 17,
      fillColor: markerColor,
      color: markerBorderColor,
      fillOpacity: 0.7,
      weight: 3
    })
    .addTo(mapRef.current)
    .bindTooltip(
      `<div class="map-tooltip">
        <div>${title}</div>
        <div>Lat: ${latitude.toFixed(6)}</div>
        <div>Lng: ${longitude.toFixed(6)}</div>
      </div>`, 
      { 
        permanent: false, 
        direction: 'top',
        className: 'map-tooltip'
      }
    );

    // Cleanup function
    return () => {
      if (mapRef.current) {
        // Remove marker
        if (markerRef.current) {
          markerRef.current.remove();
        }
        
        // Remove map
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, zoom, markerColor, markerBorderColor, title]);

  // Handle prop changes for existing map
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      // Update marker position
      markerRef.current.setLatLng([latitude, longitude]);
      
      // Update view
      mapRef.current.setView([latitude, longitude], zoom);
    }
  }, [latitude, longitude, zoom]);

  return (
    <div>
      <div 
        id="location-map" 
        style={{ 
          height: height, 
          width: '100%',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }} 
      />
    </div>
  );
};

LocationPointerMap.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  zoom: PropTypes.number,
  height: PropTypes.string,
  markerColor: PropTypes.string,
  markerBorderColor: PropTypes.string,
  title: PropTypes.string
};

export default LocationPointerMap;