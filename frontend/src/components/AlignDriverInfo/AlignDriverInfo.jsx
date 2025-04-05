import React from "react";
import PropTypes from 'prop-types';
import { FaUserCircle, FaStar, FaPhone } from "react-icons/fa";
import { SendMessage } from "../../controllers/websocket/handler";
import { useSelector, useDispatch } from "react-redux";
import { clearDriverResponses } from "../../store/slices/driver-response-slice";
import { setIsOnATrip } from "../../store/slices/running-trip-indicator-slice";
import { setOngoingTripDetails } from "../../store/slices/ongoing-trip-details-slice";

const AlignDriverInfo = ({ driver_name, driver_mobile, req_id, fare, driver_id, pickup_location, destination }) => {

  const {id, name, mobile, latitude, longitude} = useSelector(state => state.user);
  const dispatch = useDispatch();

  const handleAccept = ()=> {
    
    dispatch(clearDriverResponses());
    dispatch(setIsOnATrip({isOnATrip: true}));
    dispatch(setOngoingTripDetails({
      driver_id,
      driver_name,
      driver_mobile,
      pickup_location,
      destination,
      fare,
      status: "ongoing"
    }))
    SendMessage({
      name: 'confirm-trip',
      data: {
        req_id,
        driver_id,
        pickup_location,
        destination,
        fare,
        latitude,
        longitude,
        driver_name,
        driver_mobile,
        rider_id: id,
        rider_name: name,
        rider_mobile: mobile,
        status: "ongoing",
      }
    });
  }
  return (
    <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 shadow-md border border-gray-300 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between flex-wrap md:flex-nowrap gap-2">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="bg-indigo-100 p-1 md:p-2 rounded-full">
            <FaUserCircle className="text-2xl md:text-3xl text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center gap-1 md:gap-2">
              <p className="font-semibold text-gray-800 text-sm md:text-base">{driver_name}</p>
              <div className="flex items-center bg-green-100 px-1 md:px-2 py-0.5 rounded text-xs text-green-700">
                <FaStar className="text-yellow-500 mr-1" /> 4.8
              </div>
            </div>
            <div className="flex items-center text-gray-600 text-xs md:text-sm mt-0.5 md:mt-1">
              <FaPhone className="text-xs mr-1" /> {driver_mobile}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-indigo-600 text-base md:text-lg">₹{fare}</p>
          <p className="text-xs text-gray-500">Fixed price</p>
        </div>
      </div>

      <div className="mt-2 md:mt-3">
        <button 
          className="bg-gradient-to-r from-indigo-600 to-indigo-700 w-full py-2 md:py-2.5 rounded-lg text-white font-medium text-xs md:text-sm hover:from-indigo-700 hover:to-indigo-800 transition duration-300 flex items-center justify-center gap-2"
          onClick={handleAccept}
        >
          Accept
        </button>
      </div>
    </div>
  );
};

AlignDriverInfo.propTypes = {
  driver_name: PropTypes.string.isRequired,
  driver_mobile: PropTypes.string.isRequired,
  req_id: PropTypes.number.isRequired,
  fare: PropTypes.number.isRequired,
  driver_id: PropTypes.number.isRequired,
  pickup_location: PropTypes.string.isRequired,
  destination: PropTypes.string.isRequired,
};

export default AlignDriverInfo;