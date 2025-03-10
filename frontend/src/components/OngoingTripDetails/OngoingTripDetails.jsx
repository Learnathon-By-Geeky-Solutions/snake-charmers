import React from "react";

const OngoingTripDetails = ({ pickup_location, destination, riderName, driverName, riderPhone, driverPhone, fare }) => {
  return (
    <div className="bg-black w-full max-w-3xl p-6 rounded-lg shadow-lg text-white text-center">
      <p className="text-lg font-bold mb-2">Trip Details</p>
      
      <p className="text-md"><b>From:</b> {pickup_location} <b>To:</b> {destination}</p>

      <div className="mt-3 text-left">
        <p><b>Rider Name:</b> {riderName}</p>
        <p><b>Rider Phone:</b> {riderPhone}</p>
        <p className="mt-2"><b>Driver Name:</b> {driverName}</p>
        <p><b>Driver Phone:</b> {driverPhone}</p>
        <p className="mt-2 text-red-600 font-semibold"><b>Fare:</b> {fare} - 500 tk</p>
      </div>
    </div>
  );
};

export default OngoingTripDetails;
