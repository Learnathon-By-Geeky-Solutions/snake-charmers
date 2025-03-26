import React from "react";
import { useSelector } from "react-redux";
import { Clock, User, Phone, DollarSign } from 'lucide-react';

const OngoingTripDetails = () => {
  const {
    pickup_location, 
    destination, 
    fare, 
    rider_name, 
    rider_mobile, 
    estimated_arrival_time
  } = useSelector(state => state.ongoingTripDetails);
  
  return (
    <div className="space-y-4">
      {/* Estimated Arrival */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <Clock className="w-5 h-5 text-red-600" />
          <div>
            <p className="text-xs text-gray-500">Estimated Arrival</p>
            <p className="font-semibold text-gray-800">{estimated_arrival_time || 'Calculating...'}</p>
          </div>
        </div>
      </div>

      {/* Passenger Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
        <div className="flex items-center space-x-3 mb-2">
          <User className="w-5 h-5 text-red-600" />
          <p className="font-semibold text-gray-800">Passenger Details</p>
        </div>
        <div className="space-y-2">
          <p className="flex items-center">
            <span className="w-20 text-gray-500 text-sm">Name:</span>
            <span className="text-gray-800">{rider_name}</span>
          </p>
          <p className="flex items-center">
            <Phone className="w-4 h-4 text-red-600 mr-2" />
            <span className="w-20 text-gray-500 text-sm">Phone:</span>
            <span className="text-gray-800">{rider_mobile}</span>
          </p>
        </div>
      </div>

      {/* Fare */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <DollarSign className="w-5 h-5 text-red-600" />
          <p className="text-gray-500">Total Fare</p>
        </div>
        <p className="font-bold text-green-600 text-lg">{fare} tk</p>
      </div>
    </div>
  );
};

export default OngoingTripDetails;