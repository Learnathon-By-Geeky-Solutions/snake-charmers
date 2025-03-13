import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import GoogleMap from "../Map/Map";
import { ConnectToserver, SendMessage, DisconnectFromServer } from "../../controllers/websocket/handler";
import { getCoordinates } from "../Geolocation/Geolocation";
import { PuffLoaderComponent } from "../PuffLoader/PuffLoader";
// Assume this function is implemented elsewhere
// import { requestRide } from "../../services/rideService"; // You would create this file

const RideRequestPage = () => {
  const navigate = useNavigate();
  
  // State to track input values
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const {id, role} = useSelector(state => state.user);
  const [coords, setCoords] = useState({})
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const { latitude, longitude } = await getCoordinates();
        console.log(latitude, longitude);
        setCoords({latitude, longitude});

      } catch (error) {
        console.error("Error getting coordinates:", error);
      }
    };
    fetchCoordinates();
    if(id !== 0) {
      ConnectToserver(id, role);
    }
    // Cleanup function to disconnect when component unmounts
    return () => {
      DisconnectFromServer();
    };
  }, []);



  // Check if both fields have values
  const isFormValid = pickupLocation.trim() !== "" && dropoffLocation.trim() !== "";

  // Handle form submission
  const handleSearch = async () => {
    // Double-check validation (defensive programming)
    setIsSearching(true);

    if (!isFormValid) {
      setError("Please enter both pickup and dropoff locations");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await SendMessage({
        name: "request-trip",
        data:{
          rider_id: id, 
          pickup_location: pickupLocation,
          destination: dropoffLocation,
          latitude: coords.latitude,
          longitude: coords.longitude
        }
      })
      // setIsSearching(true);
      
    } catch (err) {
      // Handle API errors
      setError(err.message || "Failed to request ride. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      
      {/* Container for Form, Image, and Map */}
      <div className="flex flex-col items-center w-full max-w-4xl space-y-20">
        
        {/* Upper Section (Form + Image) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center w-full">
          
          {/* Left Side - Centered Ride Search Form */}
          <div className="flex justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 h-80 flex flex-col justify-center">
              <h2 className="text-2xl font-semibold mb-4 text-center">Get a Ride</h2>
              
              {/* Display error message if any */}
              {error && (
                <div className="text-red-500 text-sm mb-3 text-center">
                  {error}
                </div>
              )}
              
              <div className="space-y-3">
                {/* Pickup Location */}
                <div className="flex items-center space-x-2 border border-gray-300 p-3 rounded-md">
                  <FaMapMarkerAlt className="text-blue-600" />
                  <input
                    type="text"
                    placeholder="Pickup location"
                    className="w-full focus:outline-none"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                  />
                </div>

                {/* Dropoff Location */}
                <div className="flex items-center space-x-2 border border-gray-300 p-3 rounded-md">
                  <FaMapMarkerAlt className="text-red-600" />
                  <input
                    type="text"
                    placeholder="Dropoff location"
                    className="w-full focus:outline-none"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
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
                        : "bg-blue-600 hover:bg-blue-700"
                  } text-white py-2 rounded-md flex justify-center items-center transition-colors`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </>
                  ) : (
                    "Search"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Ride Request Image */}
          {isSearching ?
            (<PuffLoaderComponent/>)
            :  
            ( 
              <div className="flex justify-center">
                <img
                  src="/src/assets/images/driverPageRequest 1.png"
                  alt="Ride Request"
                  className="w-80 h-80 rounded-lg shadow-lg"
                />
              </div>
            )
          }
        </div>

        {/* Google Map (Aligned with Image & Form) */}
        <GoogleMap 
          pickupLocation={pickupLocation}  
          dropoffLocation={dropoffLocation}
        />
      </div>
    </div>
  );
};

export default RideRequestPage;