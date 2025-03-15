import React from "react";
import FareDetails from "../FareDetails/FareDetails";
import { FaMapMarkerAlt, FaArrowDown, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";

const TripCheckout = () => {
  const {pickup_location, destination} = useSelector(state => state.tripCheckout);
  return (
    <div className="bg-black text-white p-4 rounded-lg shadow-lg flex flex-col space-y-4 h-full">
       <div className="w-full bg-gray-900 p-3 rounded-lg">
        {/* <p className="text-xl font-semibold text-center mb-3">Trip Details</p> */}
        
        <div className="flex items-start mb-2">
          <div className="text-green-500 mt-1 mr-3">
            <FaMapMarkerAlt size={18} />
          </div>
          <div className="flex-1 mb-5">
            <p className="text-sm text-gray-400">Pickup</p>
            <p className="text-md">{pickup_location}</p>
          </div>
        </div>
        
        {/* <div className="flex justify-center my-1">
          <FaArrowDown className="text-gray-500" />
        </div> */}
        
        <div className="flex items-start mb-2">
          <div className="text-red-500 mt-1 mr-3">
            <FaMapMarkerAlt size={18} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-400">Destination</p>
            <p className="text-md">{destination}</p>
          </div>
        </div>
        
        {/* <div className="flex items-center mt-3 pt-2 border-t border-gray-700">
          <FaUser className="text-blue-400 mr-3" size={16} />
          <div>
            <p className="text-sm text-gray-400">Rider</p>
            <p className="text-md">{rider || "Anonymous"}</p>
          </div>
        </div> */}
      </div>
      <FareDetails/>
    </div>
  );
};

export default TripCheckout;
