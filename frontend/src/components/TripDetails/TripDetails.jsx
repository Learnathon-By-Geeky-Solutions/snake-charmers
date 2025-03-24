// TripDetails.jsx
import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { FaMapMarkerAlt, FaUser, FaClock } from "react-icons/fa";
import { changeCheckoutStatus } from "../../store/slices/checkout-status-slice";
import { settripCheckout } from "../../store/slices/trip-checkout-slice";
import { useDispatch, useSelector } from "react-redux";
import { SendMessage } from "../../controllers/websocket/handler";
import { setRiderResponse } from "../../store/slices/rider-response-slice";

const TripDetails = ({ req_id, pickup_location, destination, fare, onExpire, expiryTime = 30 }) => {
  const driver_id = useSelector(state => state.user.id);
  const [timeLeft, setTimeLeft] = useState(expiryTime);
  const [isExpiring, setIsExpiring] = useState(false);
  const [boxShadow, setBoxShadow] = useState('0 0 0 0 rgba(255, 255, 255, 0)');
  const dispatch = useDispatch();
  
  const handleCheckout = () => {
    dispatch(changeCheckoutStatus());
    dispatch(settripCheckout({
      req_id,
      pickup_location,
      destination,
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

  const handleMouseOver = () => {
    setBoxShadow('0 0 8px 2px rgba(255, 255, 255, 0.3)');
  };

  const handleMouseOut = () => {
    setBoxShadow('0 0 0 0 rgba(255, 255, 255, 0)');
  };

  const handleBlur = () => {
    setBoxShadow('0 0 0 0 rgba(255, 255, 255, 0)');
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          // Signal to parent component that this trip has expired
          onExpire?.();
          return 0;
        }
        // When 5 seconds remaining, show visual cue
        if (prevTime <= 6 && !isExpiring) {
          setIsExpiring(true);
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onExpire, isExpiring]);

  // Calculate width percentage for timer bar
  const timerWidth = `${(timeLeft / expiryTime) * 100}%`;
  
  // Determine timer bar color based on time left
  const getTimerColor = () => {
    if (timeLeft > 20) return "bg-green-500";
    if (timeLeft > 10) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className={`bg-black text-white w-full p-3 rounded-lg transition-all duration-200 hover:scale-[1.01] relative ${isExpiring ? 'animate-pulse' : ''}`}>
      {/* Timer bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-700 rounded-t overflow-hidden">
        <div 
          className={`h-full ${getTimerColor()} transition-all duration-1000 ease-linear`} 
          style={{ width: timerWidth }}
          aria-hidden="true"
        ></div>
      </div>
      
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center">
          <p className="text-lg font-semibold">Trip #{req_id}</p>
          <span className="ml-2 text-xs flex items-center text-gray-400">
            <FaClock className="mr-1" aria-hidden="true" /> {timeLeft}s
          </span>
        </div>
        <p className="text-green-400 font-bold">₹{fare}</p>
      </div>
      
      <div className="mt-2 text-sm">
        <div className="flex items-center mb-1">
          <FaMapMarkerAlt className="text-red-500 mr-2" aria-hidden="true" />
          <p>Pickup: {pickup_location}</p>
        </div>
        <div className="flex items-center mb-1">
          <FaMapMarkerAlt className="text-green-500 mr-2" aria-hidden="true" />
          <p>Dropoff: {destination}</p>
        </div>
        <div className="flex items-center mb-2">
          <FaUser className="text-blue-400 mr-2" aria-hidden="true" />
          {/* <p>Passenger: {passenger}</p> */}
        </div>
      </div>
      
      <div className="flex justify-center mt-3">
        <button 
          className="bg-green-600 w-full hover:bg-green-500 px-4 py-1.5 rounded text-sm transition-colors duration-200"
          onClick={handleCheckout}
          onMouseOver={handleMouseOver}
          onFocus={handleMouseOver}
          onMouseOut={handleMouseOut}
          onBlur={handleBlur}
          style={{ 
            boxShadow, 
            transition: 'all 0.2s ease-in-out'
          }}
          aria-label={`Checkout trip ${req_id} from ${pickup_location} to ${destination}`}
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
  onExpire: PropTypes.func,
  expiryTime: PropTypes.number
};

export default TripDetails;