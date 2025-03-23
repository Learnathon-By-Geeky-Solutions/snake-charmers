import React from "react";
import OngoingTripDetails from "../OngoingTripDetails/OngoingTripDetails";
import { SendMessage } from "../../controllers/websocket/handler";
import { useSelector, useDispatch } from "react-redux";
import { setIsOnATrip } from "../../store/slices/running-trip-indicator-slice";
const OngoingTrip = () => {

  const {trip_id, rider_id} = useSelector(state => state.ongoingTripDetails)
  const {role} = useSelector(state => state.user);
  const dispatch = useDispatch();

  const handleEndTrip = ()=>{
    dispatch(setIsOnATrip({isOnATrip: false}));
    SendMessage({
      name: "end-trip",
      data:{
        trip_id,
        rider_id
      }
    })
  }
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center p-6">
      {/* Top Banner */}
      <div className="w-full max-w-3xl flex justify-between items-center bg-black text-white p-3 rounded-lg shadow-md">
        <p className="text-lg font-semibold">On a Trip</p>
        {role === "driver" &&
          <button 
            className="bg-red-600 px-6 py-2 rounded-md text-white shadow-md"
            onClick={handleEndTrip}
          >
          End Trip
          </button>
        }
      </div>

      {/* Google Map */}
      <div className="w-full max-w-3xl mt-4">
        <iframe
          title="Google Map"
          width="100%"
          height="350"
          className="rounded-lg shadow-lg"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.9025243794027!2d90.39945271538538!3d23.750895984589494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755bfe69b9a52e5%3A0x9c1a85a6d3f75823!2sDhaka!5e0!3m2!1sen!2sbd!4v1649757295978!5m2!1sen!2sbd"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>

      {/* Trip Details Component */}
      <div className="mt-4 flex justify-center w-2/3">
        <OngoingTripDetails/>
      </div>

    </div>
  );
};

export default OngoingTrip;
