import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { setIsOnATrip } from "../../store/slices/running-trip-indicator-slice";
import { SendMessage } from "../../controllers/websocket/handler";
import OngoingTripDetails from './OngoingTripDetails/OngoingTripDetails';
import RouteMap from '../Map/RouteMap';
import Header from './Header/Header';
import LocationBar from './LocationBar/LocationBar';
import Eta from './ETA/ETA';
import Distance from './Distance/Distance';

const OngoingTrip = () => {
  const { trip_id, rider_id, pickup_location, destination, driver_id } = useSelector(state => state.ongoingTripDetails);
  const { role } = useSelector(state => state.user);
  const dispatch = useDispatch();


  const [tripStatus, setTripStatus] = useState('Emergency Response');


  useEffect(() => {
    let timer;
    if(role === "rider"){
      timer = setInterval(() => {
        SendMessage({
          name: "get-location-of-driver",
          data:{
            driver_id
          }
        })
      }, 15000);
    }
    return () => clearInterval(timer);
  }, []);

  
  const handleEndTrip = () => {
    dispatch(setIsOnATrip({isOnATrip: false}));
    SendMessage({
      name: "end-trip",
      data: {
        trip_id,
        rider_id
      }
    });
  };

  return (
    <div className="flex justify-center pt-10">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <Header
          role={role}
          handleEndTrip={handleEndTrip}
        />

        {/* Content Container */}
        <div className="grid md:grid-cols-2 gap-6 pt-5">
          {/* Map Section */}
          <RouteMap/>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Status and Location Bar */}
            <LocationBar
              tripStatus={tripStatus}
              pickup_location={pickup_location}
              destination={destination}
            />
            {/* Time to Reach */}
            {role === "rider" ? <Eta/> : <Distance/>}

            {/* Trip Details */}
            <div className="bg-slate-50 rounded-2xl">
              <OngoingTripDetails />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OngoingTrip;