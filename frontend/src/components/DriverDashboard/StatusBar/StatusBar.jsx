import { FaAmbulance } from "react-icons/fa";
import PropTypes from "prop-types";

const StatusBar = ({isAvailable, toggleAvailability}) =>{


    return (
        <div className="bg-white shadow-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto py-4 px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-red-600 rounded-full p-3 shadow-md">
                    <FaAmbulance className="text-white text-2xl" />
                  </div>
                  <div>
                    <h2 className="font-bold text-2xl text-gray-800">Emergency Response</h2>
                    <p className="text-gray-500 text-sm flex items-center">
                      <span className={`inline-block w-3 h-3 rounded-full m-2 ${isAvailable ? "bg-green-500" : "bg-red-500"}`}></span>
                      Driver Status: {isAvailable ? "Active" : "Offline"}
                    </p>
                    </div>
                </div>      
                {/* Availability Toggle - Enhanced */}
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-gray-500 mb-1">Driver Availability</span>
                    <span className={`text-sm font-medium ${isAvailable ? "text-green-600" : "text-red-500"}`}>
                      {isAvailable ? "Available for Emergencies" : "Currently Offline"}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer" aria-label="Toggle Availability">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isAvailable}
                      onChange={toggleAvailability}
                    />
                    <div className="w-16 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </div>
            </div>
        </div>
    )
}
StatusBar.propTypes = {
    isAvailable: PropTypes.bool.isRequired,
    toggleAvailability: PropTypes.func.isRequired,
};

export default StatusBar;