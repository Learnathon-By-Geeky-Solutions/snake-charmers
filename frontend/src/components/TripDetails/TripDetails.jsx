// TripDetails.jsx
import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaUser, FaMoneyBillWave, FaClock } from "react-icons/fa";
import { changeCheckoutStatus } from "../../store/slices/checkout-status-slice";
import { settripCheckout } from "../../store/slices/trip-checkout-slice";
import { useDispatch, useSelector } from "react-redux";
import { SendMessage } from "../../controllers/websocket/handler";

const TripDetails = ({ req_id , pickup_location, destination, /*fare, passenger, */ onExpire, expiryTime = 30 }) => {
  const driver_id = useSelector(state => state.user.id);
  const [timeLeft, setTimeLeft] = useState(expiryTime);
  const [isExpiring, setIsExpiring] = useState(false);
  const dispatch = useDispatch();
  const handleCheckout = () =>{
    dispatch(changeCheckoutStatus());
    dispatch(settripCheckout({
      req_id,
      pickup_location,
      destination
    }))
    SendMessage({
      name: "checkout-trip",
      data:{
        req_id,
        driver_id
      }
    })
  }
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          // Signal to parent component that this trip has expired
          onExpire && onExpire();
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
    <div className={`bg-black text-white w-full p-3 rounded-lg transition-all duration-200 hover:scale-[1.01] relative ${isExpiring ? 'animate-pulse' : ''}`}
         style={{ 
           boxShadow: '0 0 0 0 rgba(255, 255, 255, 0)', 
           transition: 'all 0.2s ease-in-out'
         }}
         onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 0 8px 2px rgba(255, 255, 255, 0.3)'}
         onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 0 0 0 rgba(255, 255, 255, 0)'}
    >
      {/* Timer bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-700 rounded-t overflow-hidden">
        <div 
          className={`h-full ${getTimerColor()} transition-all duration-1000 ease-linear`} 
          style={{ width: timerWidth }}
        ></div>
      </div>
      
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center">
          <p className="text-lg font-semibold">Trip #{req_id}</p>
          <span className="ml-2 text-xs flex items-center text-gray-400">
            <FaClock className="mr-1" /> {timeLeft}s
          </span>
        </div>
        {/* <p className="text-green-400 font-bold">₹{fare}</p> */}
      </div>
      
      <div className="mt-2 text-sm">
        <div className="flex items-center mb-1">
          <FaMapMarkerAlt className="text-red-500 mr-2" />
          <p>Pickup: {pickup_location}</p>
        </div>
        <div className="flex items-center mb-1">
          <FaMapMarkerAlt className="text-green-500 mr-2" />
          <p>Dropoff: {destination}</p>
        </div>
        <div className="flex items-center mb-2">
          <FaUser className="text-blue-400 mr-2" />
          {/* <p>Passenger: {passenger}</p> */}
        </div>
      </div>
      
      <div className="flex justify-between mt-3">
        <button 
          className="bg-green-600 hover:bg-green-500 px-4 py-1.5 rounded text-sm transition-colors duration-200"
          onClick={handleCheckout}
        >
          Checkout
        </button>
        <button className="bg-red-600 hover:bg-red-500 px-4 py-1.5 rounded text-sm transition-colors duration-200">
          Decline
        </button>
      </div>
    </div>
  );
};


export default TripDetails;