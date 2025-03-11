import React from "react";
import TripDetails from "../TripDetails/TripDetails";

const ShowAvailableTrip = () => {
  return (
    <div className="bg-gray-300 p-4 rounded-lg shadow-lg flex flex-col space-y-4">
      <TripDetails tripNumber={1} />
      <TripDetails tripNumber={2} />
      <TripDetails tripNumber={3} />
    </div>
  );
};

export default ShowAvailableTrip;
