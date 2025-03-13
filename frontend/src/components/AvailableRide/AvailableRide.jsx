import React, { useState, useEffect } from "react";
import ShowAvailableTrip from "../ShowAvailableTrip/ShowAvailableTrip";
import GoogleMap from "../Map/Map";
import DetailAvailableTrip from "../DetailAvailableTrip/DetailAvailableTrip";
import { useLocation } from "../Geolocation/Geolocation";
import { unsetLocationUpdateState } from "../../store/slices/location-update-state-slice";
import { useDispatch, useSelector } from "react-redux";
import {ConnectToserver, DisconnectFromServer } from "../../controllers/websocket/handler";
import { SendMessage } from "../../controllers/websocket/handler";

import { FaToggleOff, FaSpinner, FaCar } from "react-icons/fa";

const AvailableRide = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [hasRequests, setHasRequests] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { id, role } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { coordinates, error } = useLocation({
    trackPeriodically: true,       // Periodic updates
    isActive: isAvailable,         // Only when driver is available
    interval: 5000,
    id,               // Every 5 seconds
    onLocationUpdate: SendMessage
  });

  useEffect(()=>{
    if(!isAvailable){
      console.log("dispatching");
      dispatch(unsetLocationUpdateState());
      DisconnectFromServer()
    }else{
      if(id !== 0){
        ConnectToserver(id, role)
      }
    }
  }, [isAvailable])

  const toggleAvailability = () => {
    const newStatus = !isAvailable;
    setIsAvailable(newStatus);

    if (newStatus) {
      setIsSearching(true);
      setHasRequests(false);

      setTimeout(() => {
        setIsSearching(false);
        setHasRequests(true);
      }, 5000);
    } else {
      setIsSearching(false);
      setHasRequests(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-md p-4 mb-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 rounded-full p-2">
              <FaCar className="text-white text-xl" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Driver Dashboard</h2>
              <p className="text-sm text-gray-600">
                You're currently {isAvailable ? "online" : "offline"}
              </p>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center space-x-2">
            <span
              className={`text-sm font-medium ${
                isAvailable ? "text-green-600" : "text-red-500"
              }`}
            >
              {isAvailable ? "Available" : "Unavailable"}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isAvailable}
                onChange={toggleAvailability}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Main Content Layout - NARROWER CONTAINER */}
      <div className="flex-grow px-4 pb-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column - Driver Image */}
          <div className="bg-white p-4 rounded-lg shadow-md flex justify-center items-center h-80 w-full overflow-hidden">
            <img
              src="/src/assets/images/driverPage 1.png"
              alt="Driver at Work"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Right Column - Status Messages or Requests */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center h-80 w-full">
            {/* When offline, show offline message */}
            {!isAvailable && (
              <>
                <div className="text-amber-500 text-5xl mb-4">
                  <FaToggleOff />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  You're currently offline
                </h3>
                <p className="text-gray-600 text-center">
                  Set your status to available to start receiving ride requests
                  from patients in need.
                </p>
              </>
            )}

            {/* When searching for rides */}
            {isAvailable && isSearching && !hasRequests && (
              <>
                <FaSpinner className="animate-spin text-blue-500 text-4xl mb-4" />
                <p className="text-lg font-medium text-gray-700">
                  Searching for ride requests...
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Please wait while we find patients in need
                </p>
              </>
            )}

            {/* When there are ride requests */}
            {isAvailable && hasRequests && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full">
                <ShowAvailableTrip />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section - Google Map */}
        <div className="max-w-4xl mx-auto mt-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden h-64 lg:h-96 w-full border border-gray-200">
            <GoogleMap className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableRide;