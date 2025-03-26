import React, { useState, useEffect } from "react";
import IncomingTrips from "../IncomingTrips/IncomingTrips";
import GoogleMap from "../Map/Map";
import { useLocation } from "../Geolocation/Geolocation";
import { unsetLocationUpdateState } from "../../store/slices/location-update-state-slice";
import { useDispatch, useSelector } from "react-redux";
import {ConnectToserver, DisconnectFromServer, SendMessage } from "../../controllers/websocket/handler";
import TripCheckout from "../TripCheckout/TripCheckout";
import OngoingTrip from '../OngoingTrip/OngoingTrip'
import MainContent from "./MainContent/MainContent";

import { FaToggleOff, FaAmbulance, FaUserMd, FaMapMarkedAlt } from "react-icons/fa";

const DriverDashboard = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const { id, role } = useSelector((state) => state.user);
  const totalIncomingRequests = useSelector((state) => state.tripRequests.length);
  const {isCheckedOut} = useSelector((state) => state.checkout);
  const {isOnATrip} = useSelector(state => state.isOnATrip);

  const dispatch = useDispatch();

  useLocation({
    trackPeriodically: true,       // Periodic updates
    isActive: isAvailable,         // Only when driver is available
    interval: 15000,
    id,               
    onLocationUpdate: SendMessage
  });

  useEffect(()=>{
    if(!isAvailable){
      console.log("dispatching");
      dispatch(unsetLocationUpdateState());
      DisconnectFromServer()
    } else if (id != 0) {
        ConnectToserver(id, role);
    }
  }, [isAvailable])


  const toggleAvailability = () => {
    const newStatus = !isAvailable;
    setIsAvailable(newStatus);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header - Sleek design with status indicator */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-red-600 rounded-full p-3 shadow-md">
                <FaAmbulance className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="font-bold text-2xl text-gray-800">Emergency Response</h2>
                <p className="text-gray-500 text-sm flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full m-2 ${isAvailable ? "bg-green-500" : "bg-red-500"}`}></span>
                  Driver Status: {isAvailable ? "Active" : "Offline"}
                </p>
              </div>
            </div>

            {/* Availability Toggle - Enhanced */}
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-end">
                <span className="text-sm text-gray-500 mb-1">Driver Availability</span>
                <span className={`text-sm font-medium ${isAvailable ? "text-green-600" : "text-red-500"}`}>
                  {isAvailable ? "Available for Emergencies" : "Currently Offline"}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer" aria-label="Toggle Availability">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isAvailable}
                  onChange={toggleAvailability}
                />
                <div className="w-16 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Full height with sidebar layout */}
      {isOnATrip ? 
        <OngoingTrip /> 
        : 
        <MainContent 
          isAvailable={isAvailable} 
          totalIncomingRequests={totalIncomingRequests} 
          isCheckedOut={isCheckedOut}
          toggleAvailability={toggleAvailability}
        /> 
      }

      {/* Status Bar */}
      {/* <div className="bg-gray-800 text-white py-2 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-sm">Driver ID: {id} • Role: {role}</div>
          <div className="text-sm">Emergency Dispatch: +1-800-AMBULANCE</div>
        </div>
      </div> */}
    </div>
  );
};

export default DriverDashboard;