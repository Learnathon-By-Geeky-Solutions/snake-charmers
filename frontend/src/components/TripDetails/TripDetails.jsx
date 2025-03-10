import React from "react";

const TripDetails = ({ tripNumber }) => {
  return (
    <div className="bg-black text-white w-[300px] md:w-full p-4 rounded-lg shadow-lg">
      <p className="text-lg font-semibold">Trip {tripNumber} Details</p>
      <div className="flex justify-between mt-2">
        <button className="text-green-400">Check out</button>
        <button className="text-red-500">Decline</button>
      </div>
    </div>
  );
};

export default TripDetails;
