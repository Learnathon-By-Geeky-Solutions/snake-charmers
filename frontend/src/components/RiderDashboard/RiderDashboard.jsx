import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ConnectToserver, SendMessage, DisconnectFromServer } from "../../controllers/websocket/handler";
import { getCoordinates } from "../Geolocation/Geolocation";
import { setRiderWaitingStatus } from "../../store/slices/rider-waiting-status-slice";
import OngoingTrip from '../OngoingTrip/OngoingTrip'
import RideRequest from "./RideRequest.jsx/RideRequest";
import { setUser } from "../../store/slices/user-slice";
import { FaMapMarkerAlt } from "react-icons/fa";
import WebSocketController from "../../controllers/websocket/ConnectionManger";
import LocationPointerMap from "../Map/LocationPointMap";

const RiderDashboard = () => {
  
  // State to track input values
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [error, setError] = useState("");    
  const [fare, setFare] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const {id, role} = useSelector(state => state.user);
  const [coords, setCoords] = useState({})
  const [isRequested, setIsRequested] = useState(false)
  const {isOnATrip} = useSelector(state => state.isOnATrip);
  const dispatch = useDispatch();

  useEffect(()=>{
    if(isOnATrip){
      setIsRequested(false);
      setIsLoading(false);
    }
  }, [isOnATrip])

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const { latitude, longitude } = await getCoordinates();
        dispatch(setUser({latitude, longitude}));
        setCoords({latitude, longitude});

      } catch (error) {
        console.error("Error getting coordinates:", error);
      }
    };
    console.log(id);
    if(id !== 0) {
      fetchCoordinates();
      if(!WebSocketController.isConnected()) ConnectToserver(id, role);
    }
    // Cleanup function to disconnect when component unmounts
    return () => {
      DisconnectFromServer();
    };
  }, [id]);

  // Check if all fields have valid values
  const isFormValid = 
    pickupLocation.trim() !== "" && 
    dropoffLocation.trim() !== "" && 
    fare !== "" && 
    !isNaN(parseInt(fare)) && 
    parseInt(fare) > 0;

  // Handle form submission
  const handleSearch = async () => {    
    
    if(role !== "rider"){
      alert("You are not authorized to perform this action.");
      return;
    }
    setIsRequested(true);
    dispatch(setRiderWaitingStatus({isWaiting: true}));
    setIsLoading(true);
    setError("");

    try {
      await SendMessage({
        name: "request-trip",
        data:{
          rider_id: id, 
          pickup_location: pickupLocation,
          fare: parseInt(fare),
          destination: dropoffLocation,
          latitude: coords.latitude,
          longitude: coords.longitude
        }
      })
      
    } catch (err) {
      // Handle API errors
      setError(err.message || "Failed to request ride. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8">
      {/* Container for Form, Image, and Map */}
      {isOnATrip ? 
        <div className="mt-4 md:mt-16 w-full">
          <OngoingTrip/>
        </div> 
        :
        <div className="flex flex-col mt-4 md:mt-20 items-center w-full max-w-4xl space-y-8 md:space-y-20">
          {/* Upper Section (Form + Image) */}
          <RideRequest
            isRequested={isRequested}
            pickupLocation={pickupLocation}
            dropoffLocation={dropoffLocation}
            setPickupLocation={setPickupLocation}
            setDropoffLocation={setDropoffLocation}
            handleSearch={handleSearch}
            isFormValid={isFormValid}
            isLoading={isLoading}
            error={error}
            fare={fare}
            setFare={setFare}
          />

          {/* Lower section -> Map Component */}
          <div className="w-full flex flex-col items-center">
            <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-12 flex items-center px-4 py-2 md:px-6 md:py-3 rounded-lg">
              <span className="bg-red-500 p-1 md:p-2 rounded-full mr-2 md:mr-3 shadow-sm">
                <FaMapMarkerAlt className="text-white text-sm md:text-lg" />
              </span>
              <span className="tracking-wide">Your Location</span>
            </h1>
            <div className="w-full lg:w-[65%] mt-4 sm:mt-6 flex flex-col h-[40vh] sm:h-[50vh] lg:h-[70vh]">
                <div className="bg-white shadow-lg overflow-hidden flex-grow border border-gray-200 rounded-md">
                  <LocationPointerMap
                    latitude={coords.latitude}
                    longitude={coords.longitude}
                  />
                </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default RiderDashboard;