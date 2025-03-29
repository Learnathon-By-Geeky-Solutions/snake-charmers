import React from "react";
import FareDetails from "../FareDetails/FareDetails";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useSelector } from "react-redux";

const TripCheckout = () => {
  const { pickup_location, destination } = useSelector(state => state.tripCheckout);
  
  return (
    <div className="bg-white text-gray-800 p-6 rounded-lg shadow-md flex flex-col space-y-6 h-full border border-blue-100">
      <div className="w-full bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start mb-5">
          <div className="bg-green-100 p-2 rounded-full text-green-600 mr-3">
            <FaMapMarkerAlt size={16} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-600 font-medium">PATIENT LOCATION</p>
            <p className="text-md font-medium">{pickup_location}</p>
          </div>
        </div>
        
        <div className="border-l-2 border-blue-200 h-4 ml-5 mb-2"></div>
        
        <div className="flex items-start">
          <div className="bg-blue-100 p-2 rounded-full text-blue-600 mr-3">
            <FaMapMarkerAlt size={16} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-600 font-medium">MEDICAL FACILITY</p>
            <p className="text-md font-medium">{destination}</p>
          </div>
        </div>
      </div>
      
      <FareDetails />
    </div>
  );
};

export default TripCheckout;