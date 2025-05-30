// LocationService.js
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLocationUpdateState } from '../../store/slices/location-update-state-slice';
import store from '../../store';
import { setUser } from "../../store/slices/user-slice";

/**
 * Gets the current coordinates
 * @returns {Promise<{latitude: number, longitude: number}>} Coordinates
 */
const getCoordinates = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
};

/**
 * Prepares the location update message based on store state
 * @param {string} id - Driver ID
 * @param {Object} coords - Coordinates object with latitude and longitude
 * @returns {Object} Formatted message object
 */
const prepareLocationMessage = (id, coords) => {
  const isAdded = store.getState().locationUpdateState.isAdded;
  return {
    name: isAdded ? "update-location" : "add-location",
    data: {
      driver_id: id,
      latitude: coords.latitude,
      longitude: coords.longitude
    }
  };
};

/**
 * Handles the location update callback
 * @param {Function} onLocationUpdate - Callback function to handle location updates
 * @param {string} id - Driver ID
 * @param {Object} coords - Coordinates object
 * @param {Function} dispatch - Redux dispatch function
 */
const handleLocationCallback = (onLocationUpdate, id, coords, dispatch) => {
  if (!onLocationUpdate || typeof onLocationUpdate !== 'function') {
    return;
  }

  const message = prepareLocationMessage(id, coords);
  const isAdded = store.getState().locationUpdateState.isAdded;
  
  if (isAdded) {
    onLocationUpdate(message);
    return;
  }
  
  // Wait for the connection to be established first
  setTimeout(async () => {
    const ok = await onLocationUpdate(message);
    if (ok === true) {
      dispatch(setLocationUpdateState());
    }
  }, 2000);
};

/**
 * React hook for location tracking with flexible configuration
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.trackPeriodically - Whether to track periodically (for drivers) or just once (for riders)
 * @param {boolean} options.isActive - Whether tracking should be active (useful for toggling driver availability)
 * @param {number} options.interval - Interval in milliseconds for periodic tracking (default: 30000ms = 30s)
 * @param {function} options.onLocationUpdate - Callback function to handle new coordinates (e.g., send to DB)
 * @returns {Object} Location data and control functions
 */
const useLocation = ({
  trackPeriodically = false,
  isActive = true,
  interval = 30000,
  id,
  onLocationUpdate = null
} = {}) => {
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  
  // Get current location and handle the result
  const updateLocation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const coords = await getCoordinates();
      setCoordinates(coords);
      dispatch(setUser({latitude: coords.latitude, longitude: coords.longitude}));
      setLoading(false);

      // Handle location update callback if provided
      handleLocationCallback(onLocationUpdate, id, coords, dispatch);
      
      return coords;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  };

  // Setup and teardown effect for tracking
  useEffect(() => {
    // For one-time fetching (rider) or immediate fetching when driver becomes available
    if (isActive) {
      updateLocation();
    }
    
    // Only set up interval for periodic tracking (driver mode) when active
    let intervalId = null;
    if (trackPeriodically && isActive) {
      intervalId = setInterval(updateLocation, interval);
    }
    
    // Clean up the interval when component unmounts or tracking becomes inactive
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isActive, trackPeriodically, interval]);

  return { 
    coordinates, 
    error, 
    loading, 
    updateLocation // Exposed so it can be manually triggered if needed
  };
};

export { getCoordinates, useLocation };