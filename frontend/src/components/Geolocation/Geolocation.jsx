// LocationService.js
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLocationUpdateState } from '../../store/slices/location-update-state-slice';
import store from '../../store';
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
      setLoading(false);
      
      // If a callback was provided, call it with the new coordinates
      if (onLocationUpdate && typeof onLocationUpdate === 'function') {

        const isAdded = store.getState().locationUpdateState.isAdded;
        let msg = {
          name: (isAdded === true ? "update-location" : "add-location"),
          data: {
            driver_id: id,
            latitude: coords.latitude,
            longitude: coords.longitude
          }
        }
        
        if(isAdded) onLocationUpdate(msg);
        else{
          // wait for the connection to  be established firsst
          setTimeout(async () => {
            let ok = await onLocationUpdate(msg);
            if (ok === true) {
              dispatch(setLocationUpdateState());
            }
          }, 2000);
        }
      }
      return coords;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  };

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