import { FaToggleOff, FaAmbulance, FaUserMd } from "react-icons/fa";
import IncomingTrips from "../../../IncomingTrips/IncomingTrips";
import TripCheckout from "../../../TripCheckout/TripCheckout";
import PropTypes from 'prop-types';

const PatientRequestComponent = ({isAvailable, isCheckedOut, toggleAvailability, totalIncomingRequests}) => {
    return (
      <div className="w-full lg:w-[35%] mt-4 sm:mt-6 flex flex-col h-[90vh] sm:h-[80vh] md:h-[70vh] lg:h-[70vh]">        
        <div className="flex items-center mb-2 sm:mb-4">
          <FaUserMd className="text-blue-700 text-lg sm:text-xl mr-2" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Patient Requests</h3>
        </div>
        <div className="bg-purple-50 shadow-lg flex-grow rounded-md">
          {/* When offline, show offline message */}
          {!isAvailable && (
            <div className="flex flex-col items-center justify-center h-full p-3 sm:p-5">
              <div className="bg-gray-100 rounded-full p-4 sm:p-6 mb-4 sm:mb-6">
                <FaToggleOff className="text-red-500 text-4xl sm:text-6xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 text-center">
                Driver Mode: Offline
              </h3>
              <p className="text-gray-600 text-center text-sm sm:text-base max-w-md px-2">
                Toggle your availability to start receiving emergency transport requests from patients in need.
              </p>
              <button 
                onClick={toggleAvailability}
                className="mt-4 sm:mt-6 px-4 sm:px-6 py-1.5 sm:py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-medium text-sm sm:text-base"
              >
                Go Online Now
              </button>
            </div>
          )}
          {/* When searching for rides */}
          {isAvailable && totalIncomingRequests === 0 && (
            <div className="flex flex-col items-center justify-center h-full p-4 sm:p-8"> 
              <div className="relative mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <FaAmbulance className="text-blue-700 text-base sm:text-xl" />
                </div>
              </div>
              <p className="text-lg sm:text-xl font-medium text-gray-700 mb-2 sm:mb-3 text-center">
                On Standby for Emergencies
              </p>
              <p className="text-gray-500 text-center text-xs sm:text-sm md:text-base max-w-md px-2">
                Your ambulance is ready to respond. We'll alert you as soon as a patient needs emergency transport.
              </p>
              <div className="mt-4 sm:mt-6 flex items-center text-xs sm:text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Active and monitoring incoming requests
              </div>
            </div>
          )}
          {/* When there are ride requests */}
          {isAvailable && totalIncomingRequests > 0 && (
            isCheckedOut ? 
              <TripCheckout/>
              :
              (
                <div className="h-full flex flex-col">
                  <div className="flex-grow overflow-y-auto">
                    <IncomingTrips/>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    )
}

PatientRequestComponent.propTypes = {
  isAvailable: PropTypes.bool.isRequired,
  isCheckedOut: PropTypes.bool.isRequired,
  toggleAvailability: PropTypes.func.isRequired,
  totalIncomingRequests: PropTypes.number.isRequired,
};

export default PatientRequestComponent