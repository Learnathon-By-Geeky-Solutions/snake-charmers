import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import GoogleMap from "../Map/Map";
import { ConnectToserver, SendMessage, DisconnectFromServer } from "../../controllers/websocket/handler";
import { getCoordinates } from "../Geolocation/Geolocation";
import { PuffLoaderComponent } from "../PuffLoader/PuffLoader";
import { setRiderWaitingStatus } from "../../store/slices/rider-waiting-status-slice";
import DriverResponse from "../DriverResponse/DriverResponse";
import RideSearchForm from "../RideSearchForm/RideSearchForm";
import OngoingTrip from '../OngoingTrip/OngoingTrip'

const RideRequestPage = () => {
  // const navigate = useNavigate();
  
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



  // Check if all fields have valid values
  const isFormValid = 
    pickupLocation.trim() !== "" && 
    dropoffLocation.trim() !== "" && 
    fare !== "" && 
    !isNaN(parseInt(fare)) && 
    parseInt(fare) > 0;


  // Handle form submission
  const handleSearch = async () => {    
    
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      
      {/* Container for Form, Image, and Map */}
      <div className="flex flex-col items-center w-full max-w-4xl space-y-20">
        
        {/* Upper Section (Form + Image) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center w-full">
          
          {/* Left Side - Centered Ride Search Form */}
          <RideSearchForm
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

          {/* Right Side - Ride Request Image */}
          {isRequested ? (
            (  <DriverResponse 
                pickup_location = {pickupLocation}
                destination = {dropoffLocation}
                fare = {parseInt(fare)}
              />
            )
          ) : (
            <div className="flex justify-center">
              <img
                src="/src/assets/images/driverPageRequest 1.png"
                alt="Ride Request"
                className="w-80 h-80 rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>

        {/* Google Map (Aligned with Image & Form) */}
        <GoogleMap 
          pickupLocation={pickupLocation}  
          dropoffLocation={dropoffLocation}
        />
        {isOnATrip && <OngoingTrip/>}
      </div>
    </div>
  );
};

export default RideRequestPage;