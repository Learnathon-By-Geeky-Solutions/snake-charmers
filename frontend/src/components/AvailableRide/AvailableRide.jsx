import React from "react";
import TripDetails from "../TripDetails/TripDetails";
import FareDetails from "../FareDetails/FareDetails";

const DriverPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      
      {/* Wrapper for all components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        
        {/* Left Side - Image */}
        <div className="flex justify-center">
          <img
            src="/src/assets/images/driverPage 1.png"
            alt="Driver at Work"
            className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-lg shadow-lg"
          />
        </div>

        {/* Right Side - Trip Details (Ash Div) */}
        <div className="bg-gray-300 p-4 rounded-lg shadow-lg flex flex-col space-y-4">
          <TripDetails tripNumber={1} />
          <TripDetails tripNumber={2} />
          <TripDetails tripNumber={3} />
        </div>

        {/* Left Side - Google Map */}
        <div className="flex justify-center">
          <iframe
            title="Google Map"
            width="400"
            height="600"
            className="rounded-lg shadow-lg"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.9025243794027!2d90.39945271538538!3d23.750895984589494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755bfe69b9a52e5%3A0x9c1a85a6d3f75823!2sDhaka!5e0!3m2!1sen!2sbd!4v1649757295978!5m2!1sen!2sbd"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        {/* Right Side - Fare Section (Ash Div) */}
        <div className="bg-gray-300 p-4 rounded-lg shadow-lg flex flex-col space-y-4">
          <FareDetails tripNumber={1} fareAmount={500} />
        </div>

      </div>
    </div>
  );
};

export default DriverPage;
