import React from "react";
import FareDetails from "../FareDetails/FareDetails";

const DetailAvailableTrip = () => {
  return (
    <div className="bg-gray-300 p-4 rounded-lg shadow-lg flex flex-col space-y-4">
      <FareDetails tripNumber={1} fareAmount={500} />
    </div>
  );
};

export default DetailAvailableTrip;
