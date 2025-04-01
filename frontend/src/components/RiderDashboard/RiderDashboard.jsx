import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import GoogleMap from "../Map/Map";
import { ConnectToserver, SendMessage, DisconnectFromServer } from "../../controllers/websocket/handler";
import { getCoordinates } from "../Geolocation/Geolocation";
import { setRiderWaitingStatus } from "../../store/slices/rider-waiting-status-slice";
import OngoingTrip from '../OngoingTrip/OngoingTrip'
import RideRequest from "./RideRequest.jsx/RideRequest";
import { setUser } from "../../store/slices/user-slice";
import {FaMapMarkerAlt} from "react-icons/fa";
import WebSocketController from "../../controllers/websocket/ConnectionManger";

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
        console.log(latitude, longitude);
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
    <div className="min-h-screen  flex flex-col items-center p-8">
      
      {/* Container for Form, Image, and Map */}
      {isOnATrip ? 
        <div className="mt-16 w-full">
          <OngoingTrip/>
        </div> 
        :
        <div className="flex flex-col mt-20 items-center w-full max-w-4xl space-y-20">
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
            <h1 className="text-3xl font-bold text-gray-800 mb-12 flex items-center px-6 py-3 rounded-lg">
              <span className="bg-red-500 p-2 rounded-full mr-3 shadow-sm">
                <FaMapMarkerAlt className="text-white text-lg" />
              </span>
              <span className="tracking-wide">Your Location</span>
            </h1>
            <GoogleMap 
              pickupLocation={pickupLocation}  
              dropoffLocation={dropoffLocation}
            />
          </div>
      </div>}
  </div>
  );
};

export default RiderDashboard;