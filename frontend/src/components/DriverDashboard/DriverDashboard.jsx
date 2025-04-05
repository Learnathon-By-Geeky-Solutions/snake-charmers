import React, { useState, useEffect } from "react";
import { useLocation } from "../Geolocation/Geolocation";
import { unsetLocationUpdateState } from "../../store/slices/location-update-state-slice";
import { useDispatch, useSelector } from "react-redux";
import {ConnectToserver, DisconnectFromServer, SendMessage } from "../../controllers/websocket/handler";
import OngoingTrip from '../OngoingTrip/OngoingTrip'
import MainContent from "./MainContent/MainContent";
import StatusBar from "./StatusBar/StatusBar";

const DriverDashboard = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const { id, role } = useSelector((state) => state.user);
  const totalIncomingRequests = useSelector((state) => state.tripRequests.length);
  const {isCheckedOut} = useSelector((state) => state.checkout);
  const {isOnATrip} = useSelector(state => state.isOnATrip);

  const dispatch = useDispatch();

  useLocation({
    trackPeriodically: true,       // Periodic updates
    isActive: isAvailable,         // Only when driver is available
    interval: 15000,
    id,               
    onLocationUpdate: SendMessage
  });

  useEffect(()=>{
    return () => {
      DisconnectFromServer();
    };
  }, []);

  useEffect(()=>{
    if(!isAvailable){
      console.log("dispatching");
      dispatch(unsetLocationUpdateState());
      DisconnectFromServer();
    } else if (id != 0) {
        ConnectToserver(id, role);
    }
  }, [isAvailable])

  const toggleAvailability = () => {
    if(role !== "driver"){
      alert("You are not authorized to perform this action.");
      return;
    }
    const newStatus = !isAvailable;
    setIsAvailable(newStatus);
  };

  return (
    <div className="bg-white min-h-screen bg-gray-100 flex flex-col">
      {/* Header - Sleek design with status indicator */}
      <StatusBar
        isAvailable={isAvailable}
        setIsAvailable={setIsAvailable}
        toggleAvailability={toggleAvailability}
      />
     
      {/* Main Content - Full height with sidebar layout */}
      {isOnATrip ? 
        <div className="md:mt-16 w-full">
          <OngoingTrip/>
        </div> 
        : 
        <MainContent
          isAvailable={isAvailable} 
          totalIncomingRequests={totalIncomingRequests} 
          isCheckedOut={isCheckedOut}
          toggleAvailability={toggleAvailability}
        /> 
      }
      {/* <RouteMap/> */}
    </div>
  );
};

export default DriverDashboard;