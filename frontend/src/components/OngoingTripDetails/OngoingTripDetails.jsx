import React from "react";
import { useSelector } from "react-redux";

const OngoingTripDetails = () => {
  
  const {pickup_location, destination, fare, status, rider_name, rider_mobile, driver_name, driver_mobile} = useSelector(state => state.ongoingTripDetails);
  
  return (
    <div className="bg-black w-full max-w-3xl p-6 rounded-lg shadow-lg text-white text-center">
      <p className="text-lg font-bold mb-2">Trip Details</p>
      
      <p className="text-md"><b>From:</b> {pickup_location} <b>To:</b> {destination}</p>

      <div className="mt-3 text-left">
        <p><b>Rider Name:</b> {rider_name}</p>
        <p><b>Rider Phone:</b> {rider_mobile}</p>
        <p className="mt-2"><b>Driver Name:</b> {driver_name}</p>
        <p><b>Driver Phone:</b> {driver_mobile}</p>
        <p className="mt-2 text-red-600 font-semibold"><b>Fare:</b> {fare} tk</p>
      </div>
    </div>
  );
};

export default OngoingTripDetails;
