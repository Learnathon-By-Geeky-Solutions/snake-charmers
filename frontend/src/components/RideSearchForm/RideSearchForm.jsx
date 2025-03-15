import { FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";
import { useState } from "react";

const RideSearchForm = ({
  pickupLocation, 
  dropoffLocation, 
  setPickupLocation, 
  setDropoffLocation, 
  handleSearch, 
  isFormValid, 
  isLoading, 
  error,
  fare,
  setFare
}) => {
  return (
    <div className="flex justify-center">
      <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-xl w-96 flex flex-col justify-center border border-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">Get an ambulance</h2>

        {/* Display error message if any */}
        {error && (
          <div className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Pickup Location */}
          <div className="flex items-center space-x-3 border border-gray-200 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <FaMapMarkerAlt className="text-blue-600 text-lg" />
            <input
              type="text"
              placeholder="Pickup location"
              className="w-full focus:outline-none text-gray-700"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            />
          </div>
          
          {/* Dropoff Location */}
          <div className="flex items-center space-x-3 border border-gray-200 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <FaMapMarkerAlt className="text-red-600 text-lg" />
            <input
              type="text"
              placeholder="Dropoff location"
              className="w-full focus:outline-none text-gray-700"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
            />
          </div>
          
          {/* Fare Input - Normal text input without increment/decrement buttons */}
          <div className="flex items-center space-x-3 border border-gray-200 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <FaMoneyBillWave className="text-green-600 text-lg" />
            <input
              type="text"
              placeholder="Maximum fare"
              className="w-full focus:outline-none text-gray-700"
              value={fare}
              onChange={(e) => setFare(e.target.value)}
            />
          </div>
          
          {/* Search Button - Disabled unless both fields have values */}
          <button
            onClick={handleSearch}
            disabled={!isFormValid || isLoading}
            className={`w-full ${
              !isFormValid 
                ? "bg-gray-400 cursor-not-allowed" 
                : isLoading 
                  ? "bg-blue-400" 
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            } text-white py-3 rounded-xl flex justify-center items-center transition-all duration-300 mt-2 font-medium shadow-md`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </>
            ) : (
              "Request Service"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideSearchForm;