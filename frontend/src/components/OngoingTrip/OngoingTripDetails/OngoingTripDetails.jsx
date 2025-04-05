import React from "react";
import { useSelector } from "react-redux";
import { User, Phone, DollarSign, MapPin, Navigation } from 'lucide-react';

const OngoingTripDetails = () => {
  const {
    fare, 
    rider_name, 
    rider_mobile, 
    driver_name,
    driver_mobile,
    pickup_location,
    destination
  } = useSelector(state => state.ongoingTripDetails);
  
  const {role} = useSelector(state => state.user);
  
  return (
    <div className="space-y-5">
      {/* Passenger/Driver Details Card */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 flex items-center space-x-3">
          <User className="w-6 h-6 text-white" />
          <h2 className="text-white font-semibold text-base">
            {role === "driver" ? "Patient Details" : "Driver Details"}
          </h2>
        </div>
        
        <div className="p-5 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="bg-red-50 p-2.5 rounded-xl">
              <User className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Name</p>
              <p className="text-gray-800 font-semibold">
                {role === "driver" ? rider_name : driver_name}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-green-50 p-2.5 rounded-xl">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Phone</p>
              <p className="text-gray-800 font-semibold">
                {role === "driver" ? rider_mobile : driver_mobile}
              </p>
            </div>
          </div>

            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 p-2.5 rounded-xl">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider">Pickup</p>
                <p className="text-gray-800 font-semibold">{pickup_location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-purple-50 p-2.5 rounded-xl">
                <Navigation className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider">Dropoff</p>
                <p className="text-gray-800 font-semibold">{destination}</p>
              </div>
            </div>
        </div>
      </div>

      {/* Fare Card */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 flex items-center space-x-3">
          <DollarSign className="w-6 h-6 text-white" />
          <h2 className="text-white font-semibold text-base">Trip Fare</h2>
        </div>
        
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-green-50 p-2.5 rounded-xl">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Total Fare</p>
              <p className="text-gray-800 font-semibold">Estimated Cost</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">{fare} tk</p>
            <p className="text-xs text-gray-500">Includes all charges</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OngoingTripDetails;