import React from "react";
import PropTypes from "prop-types";

const Fare = ({ currentFare, onFareChange }) => {
  const handleDecrease = () => {
    if (currentFare >= 100) {
      onFareChange(currentFare - 100);
    }
  };

  const handleIncrease = () => {
    onFareChange(currentFare + 100);
  };

  return (
    <div className="bg-gray-800 text-white p-3 text-center w-full">
      <p className="font-bold text-green-400">Raise Fare</p>
      <p className="text-sm font-semibold my-1">Current Fare: ₹{currentFare}</p>
      <div className="flex justify-between mt-2">
        <button 
          onClick={handleDecrease} 
          className="bg-green-600 px-6 py-2 rounded-md text-sm transition-colors duration-200 disabled:opacity-50"
          disabled={currentFare < 100}
        >
          -100
        </button>
        <button 
          onClick={handleIncrease} 
          className="bg-green-600 px-6 py-2 rounded-md text-sm transition-colors duration-200"
        >
          +100
        </button>
      </div>
    </div>
  );
};
Fare.propTypes = {
  currentFare: PropTypes.number.isRequired,
  onFareChange: PropTypes.func.isRequired,
};

export default Fare;