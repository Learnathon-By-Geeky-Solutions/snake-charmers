import React, { useState, useEffect } from "react";
import IncomingTrips from "../IncomingTrips/IncomingTrips";
import GoogleMap from "../Map/Map";
import { useLocation } from "../Geolocation/Geolocation";
import { unsetLocationUpdateState } from "../../store/slices/location-update-state-slice";
import { useDispatch, useSelector } from "react-redux";
import {ConnectToserver, DisconnectFromServer } from "../../controllers/websocket/handler";
import { SendMessage } from "../../controllers/websocket/handler";
import TripCheckout from "../TripCheckout/TripCheckout";
import OngoingTrip from '../OngoingTrip/OngoingTrip'

import { FaToggleOff, FaSpinner, FaCar, FaAmbulance, FaUserMd, FaMapMarkedAlt } from "react-icons/fa";

const DriverDashboard = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  // const [hasRequests, setHasRequests] = useState(false);
  // const [isSearching, setIsSearching] = useState(false);
  const { id, role } = useSelector((state) => state.user);
  const totalIncomingRequests = useSelector((state) => state.tripRequests.length);
  const {isCheckedOut} = useSelector((state) => state.checkout);
  const {isOnATrip} = useSelector(state => state.isOnATrip);

  const dispatch = useDispatch();


  const { coordinates, error } = useLocation({
    trackPeriodically: true,       // Periodic updates
    isActive: isAvailable,         // Only when driver is available
    interval: 30000,
    id,               
    onLocationUpdate: SendMessage
  });

  useEffect(()=>{
    if(!isAvailable){
      console.log("dispatching");
      dispatch(unsetLocationUpdateState());
      DisconnectFromServer()
    }else if(id != 0){
        ConnectToserver(id, role, dispatch)
    }
  }, [isAvailable])


  const toggleAvailability = () => {
    const newStatus = !isAvailable;
    setIsAvailable(newStatus);

    if (newStatus) {
      // setIsSearching(true);
      // setHasRequests(false);

      // setTimeout(() => {
      //   setIsSearching(false);
      //   setHasRequests(true);
      // }, 5000);
    } else {
      // setIsSearching(false);
      // setHasRequests(false);
    }
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
              <label className="relative inline-flex items-center cursor-pointer">
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
      <div className="flex-grow flex">
        {/* Left Panel - Map */}
        <div className="w-1/2 p-6 ml-12 flex flex-col">
          {isOnATrip ? 
            (<OngoingTrip/>)
            :
            (<>
              <div className="flex items-center mb-4">
                <FaMapMarkedAlt className="text-blue-700 text-xl mr-2" />
                <h3 className="text-xl font-semibold text-gray-800">Current Location</h3>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden flex-grow border border-gray-200">
                <GoogleMap className="w-full h-full" />
              </div>
            </>
          )}
        </div>

        {/* Right Panel - Trip Info */}
        <div className="w-1/2 p-6 mr-12 flex flex-col">
          <div className="flex items-center mb-4">
            <FaUserMd className="text-blue-700 text-xl mr-2" />
            <h3 className="text-xl font-semibold text-gray-800">Patient Requests</h3>
          </div>
          <div className="bg-white rounded-xl shadow-lg flex-grow">
            {/* When offline, show offline message */}
            {!isAvailable && (
              <div className="flex flex-col items-center justify-center h-full p-8">
                <div className="bg-gray-100 rounded-full p-6 mb-6">
                  <FaToggleOff className="text-red-500 text-6xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Driver Mode: Offline
                </h3>
                <p className="text-gray-600 text-center max-w-md">
                  Toggle your availability to start receiving emergency transport requests from patients in need.
                </p>
                <button 
                  onClick={toggleAvailability}
                  className="mt-6 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-medium"
                >
                  Go Online Now
                </button>
              </div>
            )}

            {/* When searching for rides */}
            {isAvailable && totalIncomingRequests === 0 && (
              <div className="flex flex-col items-center justify-center h-full p-8"> 
                <div className="relative mb-6">
                  <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <FaAmbulance className="text-blue-700 text-xl" />
                  </div>
                </div>
                <p className="text-xl font-medium text-gray-700 mb-3">
                  On Standby for Emergencies
                </p>
                <p className="text-gray-500 text-center max-w-md">
                  Your ambulance is ready to respond. We'll alert you as soon as a patient needs emergency transport.
                </p>
                <div className="mt-6 flex items-center text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Active and monitoring incoming requests
                </div>
              </div>
            )}

            {/* When there are ride requests */}
            {isAvailable && totalIncomingRequests > 0 && (
              isCheckedOut ? 
                <TripCheckout/>
                :
                (
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Incoming Patient Requests
                        </h3>
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                          {totalIncomingRequests} {totalIncomingRequests === 1 ? 'Request' : 'Requests'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-grow overflow-y-auto p-4">
                      <IncomingTrips />
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-800 text-white py-2 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-sm">Driver ID: {id} • Role: {role}</div>
          <div className="text-sm">Emergency Dispatch: +1-800-AMBULANCE</div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;