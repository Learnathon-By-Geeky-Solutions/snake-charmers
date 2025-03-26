import IncomingTrips from "../../IncomingTrips/IncomingTrips"
import GoogleMap from "../../Map/Map"
import TripCheckout from "../../TripCheckout/TripCheckout"
import { FaToggleOff, FaAmbulance, FaUserMd, FaMapMarkedAlt } from "react-icons/fa";


const MainContent = ({isAvailable, isCheckedOut, toggleAvailability, totalIncomingRequests}) => {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col ml-20 mr-20">
        <div className="flex-grow flex">
        {/* Left Panel - Map */}
        <div className="w-1/2 p-6 ml-12 flex flex-col">
            <div className="flex items-center mb-4">
              <FaMapMarkedAlt className="text-blue-700 text-xl mr-2" />
              <h3 className="text-xl font-semibold text-gray-800">Current Location</h3>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex-grow border border-gray-200">
              <GoogleMap className="w-full h-full" />
            </div>
        </div>

        {/* Right Panel - Trip Info */}
          <div className="w-1/2 p-6 mr-12 flex flex-col">
            <div className="flex items-center mb-4">
              <FaUserMd className="text-blue-700 text-xl mr-2" />
              <h3 className="text-xl font-semibold text-gray-800">Patient Requests</h3>
            </div>
            <div className="bg-white rounded-xl shadow-lg flex-grow">
              {/* When offline, show offline message */}
              {!isAvailable && (
                <div className="flex flex-col items-center justify-center h-full p-8">
                  <div className="bg-gray-100 rounded-full p-6 mb-6">
                    <FaToggleOff className="text-red-500 text-6xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Driver Mode: Offline
                  </h3>
                  <p className="text-gray-600 text-center max-w-md">
                    Toggle your availability to start receiving emergency transport requests from patients in need.
                  </p>
                  <button 
                    onClick={toggleAvailability}
                    className="mt-6 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-medium"
                  >
                    Go Online Now
                  </button>
                </div>
              )}

              {/* When searching for rides */}
              {isAvailable && totalIncomingRequests === 0 && (
                <div className="flex flex-col items-center justify-center h-full p-8"> 
                  <div className="relative mb-6">
                    <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <FaAmbulance className="text-blue-700 text-xl" />
                    </div>
                  </div>
                  <p className="text-xl font-medium text-gray-700 mb-3">
                    On Standby for Emergencies
                  </p>
                  <p className="text-gray-500 text-center max-w-md">
                    Your ambulance is ready to respond. We'll alert you as soon as a patient needs emergency transport.
                  </p>
                  <div className="mt-6 flex items-center text-sm text-green-600">
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
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Incoming Patient Requests
                          </h3>
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                            {totalIncomingRequests} {totalIncomingRequests === 1 ? 'Request' : 'Requests'}
                          </span>
                        </div>
                      </div>
                      <div className="flex-grow overflow-y-auto p-4">
                        <IncomingTrips />
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
      </div>
    </div>
  )
}

export default MainContent;