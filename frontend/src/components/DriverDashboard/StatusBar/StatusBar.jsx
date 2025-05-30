import { FaAmbulance } from "react-icons/fa";
import PropTypes from "prop-types";

const StatusBar = ({ isAvailable, toggleAvailability }) => {
  return (
    <div className="mt-16 sm:mt-20 lg:mt-28">
      <div className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[67%] mx-auto py-2 sm:py-4 px-3 sm:px-6">
        <div className="bg-purple-50 rounded-xl shadow-md p-3 sm:p-4 border border-gray-100 transition-all duration-300">
          <div className="flex items-center justify-between flex-wrap sm:flex-nowrap gap-3">
            {/* Left side with icon and status */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className={`rounded-lg p-2 sm:p-3 shadow-md transition-all duration-300 ${
                isAvailable ? "bg-gradient-to-br from-red-500 to-red-600" : "bg-gradient-to-br from-gray-500 to-gray-600"
              }`}>
                <FaAmbulance className="text-white text-lg sm:text-2xl" />
              </div>
              <div>
                <h2 className="font-bold text-base sm:text-xl text-gray-800">Emergency Response</h2>
                <div className="flex items-center mt-1">
                  <span className={`inline-block w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full ${
                    isAvailable ? "bg-green-500 animate-pulse" : "bg-red-500"
                  }`}></span>
                  <span className={`ml-2 text-xs sm:text-sm font-medium ${
                    isAvailable ? "text-green-600" : "text-red-500"
                  }`}>
                    {isAvailable ? "Active" : "Offline"}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Right side with toggle */}
            <div className="flex items-center space-x-3 sm:space-x-6 ml-auto">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs sm:text-sm text-gray-500 mb-1 font-medium">Response Status</span>
                <span className={`text-xs sm:text-sm font-medium ${
                  isAvailable ? "text-green-600" : "text-red-500"
                }`}>
                  {isAvailable ? "Available for Emergencies" : "Currently Offline"}
                </span>
              </div>
              
              <div className="relative">
                <label className="flex items-center cursor-pointer" aria-label="Toggle Availability">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isAvailable}
                    onChange={toggleAvailability}
                  />
                  <div className="w-12 sm:w-14 h-6 sm:h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer 
                      peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                      after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 sm:after:h-6 after:w-5 sm:after:w-6 
                      after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-400 peer-checked:to-green-500 
                      shadow-inner transition-all duration-300">
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

StatusBar.propTypes = {
  isAvailable: PropTypes.bool.isRequired,
  toggleAvailability: PropTypes.func.isRequired,
};

export default StatusBar;