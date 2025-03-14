import React, { useState } from "react";
import AlignDriverInfo from "../AlignDriverInfo/AlignDriverInfo";
import Fare from "../Fare/Fare";

export const DriverResponse = () => {
  // Sample state for drivers array - in a real app this would be passed as props or from context
  const [drivers, setDrivers] = useState([
    { id: 1, name: "Fazal", phone: "0181231231" },
    { id: 2, name: "Ahmed", phone: "0187654321" },
    { id: 3, name: "Sara", phone: "0183456789" },
    { id: 4, name: "John", phone: "0189876543" },
  ]);
  
  // State for current fare amount
  const [currentFare, setCurrentFare] = useState(700);
  
  // Handler for fare changes
  const handleFareChange = (newFare) => {
    setCurrentFare(newFare);
  };

  return (
    <div className="w-96 h-[550px] bg-gray-400 rounded-lg shadow-lg flex flex-col items-center overflow-hidden ml-14 mt-10">
      {/* Header section */}
      <div className="w-full bg-gray-600 text-white p-2 text-center">
        <p className="font-bold">Driver Responses</p>
      </div>
      
      {/* Scrollable area for driver responses */}
      <div className="w-full flex-1 overflow-y-auto p-2">
        {/* Driver responses sorted with most recent (highest ID in this example) first */}
        {[...drivers]
          .sort((a, b) => b.id - a.id)
          .map((driver) => (
            <div key={driver.id} className="mb-2">
              <AlignDriverInfo name={driver.name} phone={driver.phone} />
            </div>
          ))}
      </div>

      {/* Fixed Fare component at the bottom */}
      <div className="w-full bg-gray-700">
        <Fare currentFare={currentFare} onFareChange={handleFareChange} />
      </div>
    </div>
  );
};

export default DriverResponse;