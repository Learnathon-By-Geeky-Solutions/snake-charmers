import { FaMapMarkerAlt, FaMoneyBillWave, FaAmbulance } from "react-icons/fa";
import PropTypes from 'prop-types';

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
  // Extract the button class logic to a separate function
  const getButtonClass = () => {
    if (!isFormValid) {
      return "bg-gray-300 cursor-not-allowed";
    } else if (isLoading) {
      return "bg-red-400";
    } else {
      return "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700";
    }
  };

  return (
    <div className="flex justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="flex items-center justify-center mb-6">
          <FaAmbulance className="text-red-500 text-3xl mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Find Emergency Transport</h2>
        </div>

        {/* Emergency badge */}
        <div className="mb-6 flex justify-center">
          <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-medium inline-flex items-center">
            <span className="animate-pulse mr-2 h-2 w-2 rounded-full bg-red-500"></span>
            Emergency Medical Service
          </span>
        </div>

        {/* Display error message if any */}
        {error && (
          <div className="text-white text-sm mb-4 text-center bg-red-500 p-3 rounded-lg shadow-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Pickup Location */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Pickup Location</label>
            <div className="flex items-center space-x-3 border border-gray-200 p-4 rounded-xl bg-white shadow-sm hover:shadow-md focus-within:ring-2 focus-within:ring-red-400 focus-within:border-transparent transition-all duration-300">
              <FaMapMarkerAlt className="text-red-500 text-lg" />
              <input
                type="text"
                placeholder="Patient's current location"
                className="w-full focus:outline-none text-gray-700"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
              />
            </div>
          </div>
          
          {/* Dropoff Location */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Destination</label>
            <div className="flex items-center space-x-3 border border-gray-200 p-4 rounded-xl bg-white shadow-sm hover:shadow-md focus-within:ring-2 focus-within:ring-red-400 focus-within:border-transparent transition-all duration-300">
              <FaMapMarkerAlt className="text-blue-600 text-lg" />
              <input
                type="text"
                placeholder="Hospital or medical facility"
                className="w-full focus:outline-none text-gray-700"
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
              />
            </div>
          </div>
          
          {/* Fare Input */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Budget Limit</label>
            <div className="flex items-center space-x-3 border border-gray-200 p-4 rounded-xl bg-white shadow-sm hover:shadow-md focus-within:ring-2 focus-within:ring-red-400 focus-within:border-transparent transition-all duration-300">
              <FaMoneyBillWave className="text-green-600 text-lg" />
              <input
                type="text"
                placeholder="Maximum budget for service"
                className="w-full focus:outline-none text-gray-700"
                value={fare}
                onChange={(e) => setFare(e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 ml-1">Enter the maximum amount you're willing to pay</p>
          </div>
          
          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={!isFormValid || isLoading}
            className={`w-full ${getButtonClass()} text-white py-4 rounded-xl flex justify-center items-center transition-all duration-300 mt-4 font-medium shadow-md`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Finding Nearby Ambulances...
              </>
            ) : (
              <>
                <FaAmbulance className="mr-2" />
                Request Ambulance Now
              </>
            )}
          </button>
          
          {/* Additional info */}
          <p className="text-center text-xs text-gray-500 mt-4">
            Emergency services will be dispatched based on availability and your location
          </p>
        </div>
      </div>
    </div>
  );
};

RideSearchForm.propTypes = {
  pickupLocation: PropTypes.string.isRequired,
  dropoffLocation: PropTypes.string.isRequired,
  setPickupLocation: PropTypes.func.isRequired,
  setDropoffLocation: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  isFormValid: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  fare: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setFare: PropTypes.func.isRequired,
};

export default RideSearchForm;