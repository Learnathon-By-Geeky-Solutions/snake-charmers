import React from "react";

const Fare = ({ currentFare }) => {
  return (
    <div className="bg-black text-white p-2 rounded-lg text-center w-full shadow-md">
      <p className="font-bold text-sm">Raise Fare</p>
      <p className="text-sm font-semibold">Current Fare: {currentFare}</p>
      <div className="flex justify-between mt-2">
        <button className="bg-green-700 px-6 py-2 rounded-md text-sm">-100</button>
        <button className="bg-green-700 px-6 py-2 rounded-md text-sm">+100</button>
      </div>
    </div>
  );
};

export default Fare;
