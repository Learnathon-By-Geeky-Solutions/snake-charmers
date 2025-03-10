import React from "react";
import { useNavigate } from "react-router-dom";

const TripConfirmed = () => {
  const navigate = useNavigate(); // Hook to navigate

  const handleStartTrip = () => {
    navigate("/ongoing_trip"); // Redirects to OngoingTrip page
  };

  return (
    <div className="bg-green-600 text-white w-[300px] md:w-[400px] h-96 p-6 rounded-lg shadow-lg flex flex-col justify-center items-center ml-14">
      <p className="text-lg font-semibold mb-4 text-center">
        Trip Confirmed
      </p>
      <button
        onClick={handleStartTrip} // On Click, navigate to OngoingTrip
        className="bg-green-800 px-6 py-3 rounded-lg shadow-md text-white text-lg hover:bg-green-700 transition"
      >
        Start Trip
      </button>
    </div>
  );
};

export default TripConfirmed;
