import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { useSelector } from 'react-redux';

const RouteMap = ({ zoom = 13, height = '690px' }) => {
  const mapRef = useRef(null);
  const routeControlRef = useRef(null);
  const markersRef = useRef([]);

  const { role } = useSelector(state => state.user);
  const driverLocation = useSelector(state => state.driverLocation);
  const ongoingTripDetails = useSelector(state => state.ongoingTripDetails);
  const userData = useSelector(state => state.user);
  const tripCheckout  = useSelector(state => state.tripCheckout)
  const {isOnATrip} = useSelector(state => state.isOnATrip);

  // console.log(ongoingTripDetails);
  // Memoized source and destination calculations
  const { source, destination } = useMemo(() => {
    let sourceCoords;
    if (role === "driver") {
      sourceCoords = [userData.latitude, userData.longitude];
    } else {
      sourceCoords = [driverLocation.latitude, driverLocation.longitude];
    }
    
    let destCoords;
    if (role === "driver") {
      
      if(isOnATrip){
        destCoords = [ongoingTripDetails.latitude, ongoingTripDetails.longitude];
      }else{
        destCoords = [tripCheckout.latitude, tripCheckout.longitude];
      }
    } else {
      destCoords = [userData.latitude, userData.longitude];
    }
  
    return {
      source: sourceCoords,
      destination: destCoords
    };
  }, [role, isOnATrip, userData, driverLocation, ongoingTripDetails, tripCheckout]);

  // Method to update route and markers
  const updateRoute = useCallback(() => {
    // Remove existing markers
    markersRef.current.forEach(marker => {
      if (mapRef.current) marker.remove();
    });
    markersRef.current = [];

    // Remove existing route control
    if (routeControlRef.current && mapRef.current) {
      mapRef.current.removeControl(routeControlRef.current);
    }

    // Validate coordinates
    if (!source[0] || !source[1] || !destination[0] || !destination[1]) {
      console.error('Invalid coordinates');
      return;
    }

    // Create custom markers with distinct styles
    const sourceMarker = L.circleMarker(source, {
      radius: 17,
      fillColor: '#4CAF50', // Green for start
      color: '#2E7D32', // Darker green border
      fillOpacity: 0.7,
      weight: 3
    })
    .addTo(mapRef.current);

    const destinationMarker = L.circleMarker(destination, {
      radius: 17,
      fillColor: '#F44336', // Red for destination
      color: '#B71C1C', // Darker red border
      fillOpacity: 0.7,
      weight: 3
    })
    .addTo(mapRef.current);

    markersRef.current = [sourceMarker, destinationMarker];

    // Create new route control
    routeControlRef.current = L.Routing.control({
      waypoints: [
        L.latLng(source[0], source[1]), 
        L.latLng(destination[0], destination[1])
      ],
      routeWhileDragging: true,
      createMarker: () => null, // Prevent default markers
      lineOptions: {
        styles: [{ 
          color: '#1E88E5', // Material Blue
          opacity: 0.9, 
          weight: 8 
        }]
      },
      // Hide routing details
      show: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      containerOptions: {
        style: { display: 'none' }
      }
    }).addTo(mapRef.current);

    // Fit bounds to show entire route
    const bounds = L.latLngBounds([source, destination]);
    mapRef.current.fitBounds(bounds, { 
      padding: [50, 50],
      maxZoom: zoom 
    });
  }, [source, destination, zoom]);

  // Initialize map on first render
  useEffect(() => {
    // Create map only if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map('route-map').setView(source, zoom);
      
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
    }

    // Update route
    updateRoute();

    // Cleanup function
    return () => {
      if (mapRef.current) {
        // Remove markers
        markersRef.current.forEach(marker => marker.remove());
        
        // Remove route control
        if (routeControlRef.current) {
          mapRef.current.removeControl(routeControlRef.current);
        }
        
        // Remove map
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [source, destination, zoom, updateRoute]);

  return (
    <div>
      <div 
        id="route-map" 
        style={{ 
          height: height, 
          width: '100%' 
        }} 
      />
    </div>
  );
};

RouteMap.propTypes = {
  zoom: PropTypes.number,
  height: PropTypes.string,
};

export default RouteMap;