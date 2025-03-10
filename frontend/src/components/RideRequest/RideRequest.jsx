import React from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";

const RideRequestPage = () => {
  const navigate = useNavigate(); // ✅ Hook for navigation

  const handleSearch = () => {
    navigate("/driver_search"); // ✅ Redirects to /driver_search
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      
      {/* Container for Form, Image, and Map */}
      <div className="flex flex-col items-center w-full max-w-4xl space-y-6">
        
        {/* Upper Section (Form + Image) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center w-full">
          
          {/* Left Side - Centered Ride Search Form */}
          <div className="flex justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 h-80 flex flex-col justify-center">
              <h2 className="text-2xl font-semibold mb-4 text-center">Get a Ride</h2>
              <div className="space-y-3">
                {/* Pickup Location */}
                <div className="flex items-center space-x-2 border border-gray-300 p-3 rounded-md">
                  <FaMapMarkerAlt className="text-blue-600" />
                  <input
                    type="text"
                    placeholder="Pickup location"
                    className="w-full focus:outline-none"
                  />
                </div>

                {/* Dropoff Location */}
                <div className="flex items-center space-x-2 border border-gray-300 p-3 rounded-md">
                  <FaMapMarkerAlt className="text-red-600" />
                  <input
                    type="text"
                    placeholder="Dropoff location"
                    className="w-full focus:outline-none"
                  />
                </div>

                {/* Search Button (Navigates to /driver_search) */}
                <button
                  onClick={handleSearch} // ✅ Calls handleSearch on click
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Ride Request Image */}
          <div className="flex justify-center">
            <img
              src="/src/assets/images/driverPageRequest 1.png"
              alt="Ride Request"
              className="w-80 h-80 rounded-lg shadow-lg"
            />
          </div>

        </div>

        {/* Google Map (Aligned with Image & Form) */}
        <div className="w-full flex justify-center">
          <iframe
            title="Google Map"
            width="90%"
            height="400"
            className="rounded-lg shadow-2xl"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3689.126991404184!2d91.807229414965!3d22.356851185285853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30ad27582ff5c2ef%3A0x3e696c9b6b4d962c!2sChittagong%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1649761307864!5m2!1sen!2sbd"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

      </div>
    </div>
  );
};

export default RideRequestPage;
