import React from "react";

const FareDetails = ({ tripNumber, fareAmount }) => {
  return (
    <div className="bg-black text-white w-[300px] md:w-full p-4 rounded-lg shadow-lg flex flex-col items-center">
      <p className="text-lg font-semibold">Trip {tripNumber} Details</p>
      <p className="text-md my-2">Current Fare: <b>{fareAmount} tk</b></p>

      {/* Offer Fair Input */}
      <div className="w-full">
        <p className="text-sm mb-1">Offer your fair</p>
        <input
          type="text"
          placeholder="Write amount"
          className="w-full p-2 rounded bg-gray-800 text-white mb-2"
        />
        <button className="bg-blue-600 w-full py-2 rounded">Ask</button>
      </div>

      {/* Confirm & Decline Buttons */}
      <div className="flex justify-between w-full mt-4">
        <button className="bg-green-600 px-6 py-2 rounded-md w-[45%]">
          Confirm
        </button>
        <button className="bg-red-600 px-6 py-2 rounded-md w-[45%]">
          Decline
        </button>
      </div>
    </div>
  );
};

export default FareDetails;
