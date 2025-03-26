import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Ambulance, AlertTriangle, Stethoscope, Hospital, Navigation } from 'lucide-react';
import { useSelector, useDispatch } from "react-redux";
import { setIsOnATrip } from "../../store/slices/running-trip-indicator-slice";
import { SendMessage } from "../../controllers/websocket/handler";
import OngoingTripDetails from '../OngoingTripDetails/OngoingTripDetails';

const OngoingTrip = () => {
  const { trip_id, rider_id, pickup_location, destination } = useSelector(state => state.ongoingTripDetails);
  const { role } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const [progress, setProgress] = useState(0);
  const [tripStatus, setTripStatus] = useState('Emergency Response');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          setTripStatus('Patient Transferred');
          return 100;
        }
        return prevProgress + 1;
      });
    }, 300);

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
    <div className="bg-gradient-to-br from-slate-80 to-slate-100 flex justify-center p-4 pt-10">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden ring-4 ring-slate-200/50 transform transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Ambulance className="w-8 h-8 text-white stroke-[2]" />
            <div>
              <h2 className="font-bold text-xl tracking-tight">Critical Patient Transportation</h2>
              <p className="text-white/80 text-xs mt-1">Ensuring Timely Medical Assistance</p>
            </div>
          </div>
          {role === "driver" && (
            <button 
              onClick={handleEndTrip}
              className="bg-white/20 backdrop-blur-sm text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-white/30 transition-all duration-300 flex items-center space-x-2 group"
            >
              <AlertTriangle className="w-5 h-5 stroke-[2.5] group-hover:animate-pulse" />
              <span>End Response</span>
            </button>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="w-full bg-slate-200/50 h-1.5 relative">
          <div 
            className="bg-emerald-500 h-1.5 transition-all duration-300 ease-out"
            style={{width: `${progress}%`}}
          />
        </div>

        {/* Content Container */}
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Map Section */}
          <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-emerald-100/50 relative">
            <iframe
              title="Google Map"
              className="w-full h-[500px]"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.9025243794027!2d90.39945271538538!3d23.750895984589494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755bfe69b9a52e5%3A0x9c1a85a6d3f75823!2sDhaka!5e0!3m2!1sen!2sbd"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
            <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg">
              <Navigation className="w-5 h-5 text-emerald-600" />
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Status and Location Bar */}
            <div className="bg-slate-100 p-4 rounded-2xl shadow-xl border border-slate-200 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Stethoscope className="w-7 h-7 text-emerald-600 stroke-[2.5]" />
                <div>
                  <p className="text-xs text-slate-500">Current Status</p>
                  <span className="text-base font-semibold text-slate-800">{tripStatus}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-slate-600">
                <MapPin className="w-6 h-6 text-emerald-600 stroke-[2.5]" />
                <div>
                  <p className="text-xs text-slate-500">Route</p>
                  <span className="truncate text-sm font-medium">{pickup_location} → {destination}</span>
                </div>
              </div>
            </div>

            {/* Time to Reach */}
            <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-emerald-600 stroke-[2.5]" />
                <div>
                  <p className="text-xs text-slate-500 mb-1">Estimated Response Time</p>
                  <p className="font-bold text-xl text-slate-800">
                    {tripStatus === 'Emergency Response' ? 'Calculating...' : 'Patient Arrived'}
                  </p>
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 shadow-xl">
              <OngoingTripDetails />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OngoingTrip;