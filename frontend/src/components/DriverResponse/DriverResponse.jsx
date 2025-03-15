import React, { useState } from "react";
import AlignDriverInfo from "../AlignDriverInfo/AlignDriverInfo";
import { useDispatch, useSelector } from "react-redux";
import { SendMessage } from "../../controllers/websocket/handler";
import { FaTaxi, FaPlus, FaMinus, FaPaperPlane, FaLocationArrow, FaRegClock } from "react-icons/fa";
import { PuffLoaderComponent } from "../PuffLoader/PuffLoader";
import { clearDriverResponses } from "../../store/slices/driver-response-slice";

export const DriverResponse = ({destination, fare}) => {
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
    <div className="w-full max-w-lg bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
      {/* Header section */}
      <div className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <FaTaxi className="text-2xl" />
            </div>
            <div>
              <p className="font-bold text-xl">Driver Responses</p>
              <p className="text-indigo-200 text-sm mt-0.5">Choose your ride</p>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg px-3 py-1 flex items-center gap-2">
            <FaRegClock className="text-indigo-200" />
            <span className="text-white text-sm font-medium">5 mins away</span>
          </div>
        </div>
        
        <div className="mt-4 bg-white/10 p-3 rounded-lg flex items-center gap-3">
          <FaLocationArrow className="text-indigo-200" />
          <div className="text-sm">
            <p className="text-white/70">Your destination</p>
            <p className="text-white font-medium">{destination || "Central Business District, Kolkata"}</p>
          </div>
        </div>
      </div>
      
      {/* Scrollable area for driver responses - fixed height with no internal scrolling when PuffLoader is shown */}
      <div className="w-full h-80 overflow-y-auto bg-gradient-to-b from-indigo-100/60 to-purple-100/60">
        {drivers.length > 0 ? (
          <div className="p-2 space-y-4">
            {[...drivers]
              .sort((a, b) => b.id - a.id)
              .map((driver) => (
                <div key={driver.driver_id} className="w-full transform transition-all duration-300 hover:-translate-y-1">
                  <AlignDriverInfo 
                    name={driver.name} 
                    mobile={driver.mobile} 
                    req_id={driver.req_id}
                    amount={driver.amount}
                  />
                </div>
              ))}
          </div>
        ) : (
          <PuffLoaderComponent
            text={"Fare sent. Waiting for drivers to respond."}
          />
        )}
      </div>

      {/* Fixed Fare component at the bottom */}
      <div className="w-full bg-gradient-to-b from-indigo-900 to-indigo-950 p-6 shadow-inner">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-indigo-300 text-sm font-medium">Your Fare</p>
            <p className="text-white font-bold text-2xl mt-1">₹{currentFare === '' ? '0' : currentFare}</p>
          </div>
          
          <div className="bg-indigo-800/50 px-3 py-1 rounded-full">
            <p className="text-indigo-200 text-sm">~4.5 km</p>
          </div>
        </div>
        
        {/* Manual input fare */}
        <div className="mb-5">
          <div className="flex items-center bg-indigo-800/50 rounded-lg overflow-hidden border border-indigo-700/50 focus-within:ring-2 focus-within:ring-indigo-400 transition">
            <span className="text-white font-bold text-lg pl-4">₹</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={currentFare}
              onChange={handleFareInput}
              onBlur={handleInputBlur}
              className="bg-indigo-800/50 text-white text-lg font-bold flex-1 p-3.5 outline-none appearance-none w-full"
              style={{ 
                MozAppearance: 'textfield',
                WebkitAppearance: 'none',
                margin: 0
              }}
            />
          </div>
        </div>
        
        {/* Fare adjustment buttons */}
        <div className="flex justify-between items-center mb-5">
          <button 
            onClick={() => handleFareChange(-100)}
            className="bg-indigo-700/80 text-white py-3 px-4 rounded-lg hover:bg-indigo-600 transition-colors font-medium w-32 flex items-center justify-center gap-2 shadow-md"
            disabled={currentFare < 100}
          >
            <FaMinus className="text-xs" /> <span>₹100</span>
          </button>
          
          <button 
            onClick={() => handleFareChange(100)}
            className="bg-indigo-500 text-white py-3 px-4 rounded-lg hover:bg-indigo-400 transition-colors font-medium w-32 flex items-center justify-center gap-2 shadow-md"
          >
            <FaPlus className="text-xs" /> <span>₹100</span>
          </button>
        </div>
        
        {/* Send fare button */}
        <div className="flex justify-center">
          <button 
            onClick={handleSendFare}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 px-6 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 font-semibold text-md w-full flex items-center justify-center gap-2 shadow-lg"
          >
            <FaPaperPlane /> Send Fare Offer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverResponse;