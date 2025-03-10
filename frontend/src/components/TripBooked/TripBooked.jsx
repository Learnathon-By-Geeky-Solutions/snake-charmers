import React from "react";

const TripBooked = () => {
  return (
    <div className="bg-green-600 text-white w-[300px] md:w-[400px] h-96 p-6 rounded-lg shadow-lg flex flex-col justify-start items-center ml-14">
      {/* Red Banner - Trip Booked Message */}
      <div className="bg-red-600 w-full text-center py-3 rounded-lg mb-4">
        <p className="text-lg font-semibold">Sorry the trip was booked</p>
      </div>

      {/* Search for Another Trip Button */}
      <button className="bg-green-800 px-6 py-3 rounded-lg shadow-md text-white text-lg w-full">
        Search for another trip
      </button>
    </div>
  );
};

export default TripBooked;
