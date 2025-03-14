import React, { useState, useEffect } from "react";
import TripDetails from "../TripDetails/TripDetails";
import { FaRoute } from "react-icons/fa";
import {useSelector, useDispatch} from 'react-redux'
import { removeTripReq } from "../../store/slices/trip-request-slice";

const ShowAvailableTrip = () => {
  // Sample state for trips - in a real app, this would likely come from props or API
  const trips = useSelector(state => state.tripRequests);
  const dispatch = useDispatch();

  // Function to handle trip expiration
  const handleTripExpire = (reqID) => {
    dispatch(removeTripReq(reqID))
  };


  return (
    <div className="w-full h-[710px] bg-gray-400 rounded-lg shadow-lg flex flex-col items-center overflow-hidden">
      {/* Header section */}
      <div className="w-full bg-gray-600 text-white p-2 text-center">
        <div className="flex items-center justify-center">
          <FaRoute className="mr-2" />
          <p className="font-bold">Available Trips</p>
        </div>
      </div>
      
      {/* Scrollable area for trip details */}
      <div className="w-full flex-1 overflow-y-auto p-2">
        {trips.length > 0 ? (
          trips.map((trip, index) => (
            <div key={trip.req_id} className={index < trips.length - 1 ? "mb-2" : ""}>
              <TripDetails 
                tripNumber={trip.req_id}
                pickup={trip.pickup_location}
                dropoff={trip.destination}
                // fare={trip.fare}
                // passenger={trip.passenger}
                onExpire={() => handleTripExpire(trip.req_id)}
                expiryTime={30} // 30 seconds timer
              />
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-600">
            <p>No trips available at the moment</p>
          </div>
        )}
      </div>
      
      {/* Footer section with trip summary */}
      <div className="w-full bg-gray-800 text-white p-3 text-center">
        <p className="font-medium text-sm">{trips.length} Available Trips</p>
        <p className="text-xs text-gray-300 mt-1">Trips expire after 30 seconds</p>
      </div>
    </div>
  );
};

export default ShowAvailableTrip;