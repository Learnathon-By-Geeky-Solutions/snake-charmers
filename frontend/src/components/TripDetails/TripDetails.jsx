import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { FaMapMarkerAlt, FaHeartbeat } from "react-icons/fa";
import { changeCheckoutStatus } from "../../store/slices/checkout-status-slice";
import { settripCheckout } from "../../store/slices/trip-checkout-slice";
import { useDispatch, useSelector } from "react-redux";
import { SendMessage } from "../../controllers/websocket/handler";
import { setRiderResponse } from "../../store/slices/rider-response-slice";

const TripDetails = ({ req_id, pickup_location, destination, latitude, longitude, fare, onExpire, expiryTime = 30 }) => {
  const driver_id = useSelector(state => state.user.id);
  const [timeLeft, setTimeLeft] = useState(expiryTime);
  const [isExpiring, setIsExpiring] = useState(false);
  const dispatch = useDispatch();
  
  const handleCheckout = () => {
    dispatch(changeCheckoutStatus());
    dispatch(settripCheckout({
      req_id,
      pickup_location,
      destination,
      latitude,
      longitude,
      fare
    }));
    dispatch(setRiderResponse({ fare }));
    SendMessage({
      name: "checkout-trip",
      data: {
        req_id,
        driver_id
      }
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onExpire?.();
          return 0;
        }
        if (prevTime <= 6 && !isExpiring) {
          setIsExpiring(true);
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onExpire, isExpiring]);

  // Calculate width percentage for timer
  const timerWidth = `${(timeLeft / expiryTime) * 100}%`;
  
  // Determine timer color based on time left
  const getTimerColor = () => {
    if (timeLeft > 20) return "bg-green-500";
    if (timeLeft > 10) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className={`bg-white border-l-4 border-l-red-500 border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-all duration-200 ${isExpiring ? 'animate-pulse' : ''}`}>
      {/* Progress bar */}
      <div className="h-1 bg-gray-100 w-full">
        <div 
          className={`h-full ${getTimerColor()} transition-all duration-1000 ease-linear`} 
          style={{ width: timerWidth }}
          aria-hidden="true"
        ></div>
      </div>
      
      {/* Content container */}
      <div className="p-4">
        {/* Header with emergency badge and timer */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-red-50 text-red-600 text-xs font-medium px-2 py-1 rounded-full flex items-center">
              <FaHeartbeat className="mr-1" /> Emergency #{req_id}
            </span>
          </div>
          <div className="bg-blue-50 text-blue-600 font-medium px-3 py-1 rounded-full text-sm">
            ৳{fare}
          </div>
        </div>
        
        {/* Trip info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2">
            <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="text-xs text-gray-500 mb-0">Patient Location</p>
              <p className="text-sm text-gray-700 font-medium">{pickup_location}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <FaMapMarkerAlt className="text-blue-500 mt-1 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="text-xs text-gray-500 mb-0">Medical Facility</p>
              <p className="text-sm text-gray-700 font-medium">{destination}</p>
            </div>
          </div>
        </div>
        
        {/* Accept button */}
        <button 
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          onClick={handleCheckout}
          aria-label={`Accept emergency request ${req_id} from ${pickup_location} to ${destination}`}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

TripDetails.propTypes = {
  req_id: PropTypes.number.isRequired,
  pickup_location: PropTypes.string.isRequired,
  destination: PropTypes.string.isRequired,
  fare: PropTypes.number.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  onExpire: PropTypes.func,
  expiryTime: PropTypes.number
};

export default TripDetails;