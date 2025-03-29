import React from "react";
import TripDetails from "../TripDetails/TripDetails";
import { FaAmbulance, FaHeartbeat } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { removeTripReq } from "../../store/slices/trip-request-slice";

const IncomingTrips = () => {
  const trips = useSelector(state => state.tripRequests);
  const dispatch = useDispatch();

  const handleTripExpire = (reqID) => {
    dispatch(removeTripReq(reqID))
  };

  return (
    <div className="w-full h-[65vh] bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-red-50 border-b border-red-100 p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FaAmbulance className="text-red-500" />
          <h2 className="font-medium text-gray-700">Emergency Requests</h2>
        </div>
        <div className="flex items-center text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full">
          <span className="font-medium">{trips.length}</span>
          <span className="ml-1">active</span>
        </div>
      </div>
      
      {/* Trips container */}
      {trips.length > 0 ? (
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
          {trips.map((trip) => (
            <TripDetails 
              key={trip.req_id}
              req_id={trip.req_id}
              pickup_location={trip.pickup_location}
              destination={trip.destination}
              fare={trip.fare}
              latitude={trip.latitude}
              longitude={trip.longitude}
              onExpire={() => handleTripExpire(trip.req_id)}
              expiryTime={30}
            />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-3">
            <FaHeartbeat className="text-red-400 text-xl" />
          </div>
          <p className="font-medium text-gray-600">No emergency requests</p>
          <p className="text-sm text-gray-500 mt-1">System monitoring for new requests</p>
        </div>
      )}
      
      {/* Footer */}
      <div className="bg-red-50 border-t border-red-100 text-gray-600 p-2 text-center text-xs font-medium">
        <p>Emergency requests require immediate response - expires in 30 seconds</p>
      </div>
    </div>
  );
};

export default IncomingTrips;