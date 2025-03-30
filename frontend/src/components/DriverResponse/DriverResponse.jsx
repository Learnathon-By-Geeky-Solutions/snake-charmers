import React, { useState } from "react";
import PropTypes from 'prop-types';
import AlignDriverInfo from "../AlignDriverInfo/AlignDriverInfo";
import { useDispatch, useSelector } from "react-redux";
import { SendMessage } from "../../controllers/websocket/handler";
import { clearDriverResponses } from "../../store/slices/driver-response-slice";
import { FaPlus, FaMinus, FaPaperPlane, FaLocationArrow, FaRegClock } from "react-icons/fa";
import LoadingIndicator from "./LoadingIndicator";


export const DriverResponse = ({ pickup_location, destination, fare }) => {
  const drivers = useSelector(state => state.driverResponses);
  const dispatch = useDispatch();
  // State for current fare amount
  const [currentFare, setCurrentFare] = useState(fare);
  
  // Handler for fare changes via buttons
  const handleFareChange = (amount) => {
    setCurrentFare(prev => {
      // Convert to number if it's a string
      const currentValue = typeof prev === 'string' ? (parseInt(prev) || 0) : prev;
      const newValue = currentValue + amount;
      // Ensure fare doesn't go below 0
      return Math.max(0, newValue);
    });
  };

  // Handler for manual fare input
  const handleFareInput = (e) => {
    const value = e.target.value;
    
    // Allow empty string or valid non-negative numbers
    if (value === '') {
      setCurrentFare('');
    } else if (!isNaN(value)) {
      const numValue = parseInt(value) || 0;
      // Ensure the fare is not negative
      setCurrentFare(numValue < 0 ? 0 : numValue);
    }
  };

  // Handler for sending the fare
  const handleSendFare = () => {
    const fareToSend = currentFare === '' ? 0 : currentFare;
    console.log(`Sending updated fare: ${fareToSend}`);
    dispatch(clearDriverResponses());
    SendMessage({
      name: "place-bid-rider",
      data: {
        req_id: drivers.length > 0 ? drivers[0].req_id : null,
        amount: fareToSend
      }
    });
  };

  // Handler for input blur to ensure empty values become 0
  const handleInputBlur = () => {
    if (currentFare === '') {
      setCurrentFare(0);
    }
  };

  return (
    <div className="w-full h-[58vh] max-w-8xl flex bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Combined header and driver responses container */}
      <div className="flex flex-col w-[60%]">
        {/* Header section */}
        <div className="w-full bg-purple-600 text-white p-4">
          {/* Destination info */}
          <div className=" bg-white/10 p-3 rounded-lg flex items-center space-x-2">
            <FaLocationArrow className="text-purple-200" />
            <div>
              <p className="text-xs text-purple-100">Your destination</p>
              <p className="text-sm font-medium">{destination || "Central Business District, Kolkata"}</p>
            </div>
          </div>
        </div>
        
        {/* Driver responses area with fixed height */}
        <div className="w-full flex-grow h-64 overflow-y-auto bg-gray-50">
          {drivers.length > 0 ? (
            <div className="p-3 space-y-3">
              {[...drivers]
                .sort((a, b) => b.id - a.id)
                .map((driver) => (
                  <div key={driver.driver_id} className="transition-all duration-200 hover:translate-y-px">
                    <AlignDriverInfo 
                      driver_name={driver.name} 
                      driver_mobile={driver.mobile} 
                      req_id={driver.req_id}
                      fare={driver.amount}
                      driver_id={driver.driver_id}
                      pickup_location={pickup_location}
                      destination={destination}
                    />
                  </div>
                ))}
            </div>
          ) : (
            <LoadingIndicator text="Waiting for drivers to respond." />
          )}
        </div>
      </div>

      {/* Fare input section - modernized container */}
      <div className="w-[40%] bg-gradient-to-b from-purple-50 to-white border-l border-gray-100 flex flex-col">
        {/* Fare header section */}
        <div className="p-6 pb-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">Your Fare</p>
              <div className="flex items-baseline">
                <p className="text-gray-900 font-bold text-3xl">₹{currentFare === '' ? '0' : currentFare}</p>
                <span className="ml-2 text-purple-500 text-sm font-medium">INR</span>
              </div>
            </div>
            
            <div className="bg-purple-100 px-3 py-2 rounded-full shadow-sm">
              <div className="flex items-center">
                <FaRegClock className="text-purple-500 mr-1 text-xs" />
                <p className="text-purple-700 text-xs font-medium">~4.5 km</p>
              </div>
            </div>
          </div>
          
          {/* Fare input - modernized */}
          <div className="mb-6">
            <div className="flex items-center bg-white rounded-xl border-2 border-purple-200 focus-within:ring-4 focus-within:ring-purple-200 focus-within:border-purple-400 transition-all duration-200 shadow-sm">
              <div className="bg-purple-100 px-4 py-3 rounded-l-xl border-r border-purple-200">
                <span className="text-purple-700 font-bold text-lg">₹</span>
              </div>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={currentFare}
                onChange={handleFareInput}
                onBlur={handleInputBlur}
                className="bg-transparent text-gray-800 text-xl font-medium flex-1 p-3 outline-none w-full"
                style={{ 
                  MozAppearance: 'textfield',
                  WebkitAppearance: 'none',
                  margin: 0
                }}
                placeholder="Enter fare amount"
              />
            </div>
          </div>
          
          {/* Fare adjustment buttons - modernized */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button 
              onClick={() => handleFareChange(-100)}
              className="bg-white text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors font-medium flex items-center justify-center gap-2 text-sm shadow-sm border border-gray-200"
              disabled={currentFare < 100}
            >
              <div className="bg-gray-200 p-1 rounded-full">
                <FaMinus className="text-xs text-gray-700" />
              </div>
              <span>₹100</span>
            </button>
            
            <button 
              onClick={() => handleFareChange(100)}
              className="bg-white text-purple-700 py-3 px-4 rounded-xl hover:bg-purple-50 transition-colors font-medium flex items-center justify-center gap-2 text-sm shadow-sm border border-purple-200"
            >
              <div className="bg-purple-200 p-1 rounded-full">
                <FaPlus className="text-xs text-purple-700" />
              </div>
              <span>₹100</span>
            </button>
          </div>
        </div>
        
        {/* Fare suggestion chips */}
        <div className="px-6 mb-4">
          <p className="text-xs text-gray-500 mb-2 font-medium">Suggested Fares</p>
          <div className="flex flex-wrap gap-2">
            {[250, 300, 350, 400].map(amount => (
              <button 
                key={amount}
                onClick={() => setCurrentFare(amount)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                  currentFare === amount 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ₹{amount}
              </button>
            ))}
          </div>
        </div>
        
        {/* Send fare button - modernized */}
        <div className="px-6 mt-auto pb-6">
        <button 
          onClick={handleSendFare}
          disabled={drivers.length === 0}
          className={`bg-purple-600 text-white py-4 px-4 rounded-xl transition-all duration-200 font-medium text-base w-full flex items-center justify-center gap-2 transform ${
          drivers.length === 0 ? 
            'opacity-50 cursor-not-allowed' 
            : 
            'hover:bg-purple-700 hover:shadow-xl hover:-translate-y-1 shadow-lg'
          }`}
        >
            <FaPaperPlane className="text-sm" /> Send Fare
          </button>
          <p className="text-xs text-center text-gray-500 mt-2">Drivers will be notified of your fare</p>
        </div>
      </div>
    </div>
  );
};

DriverResponse.propTypes = {
  pickup_location: PropTypes.string.isRequired,
  destination: PropTypes.string.isRequired,
  fare: PropTypes.number.isRequired,
};

export default DriverResponse;