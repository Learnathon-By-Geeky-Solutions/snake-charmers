import React from "react";
import WaitingRiderReview from "../WaitingRiderReview/WaitingRiderReview";

const RiderReview = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      
      {/* Central Wrapper to Align Everything */}
      <div className="flex flex-col items-center w-full max-w-5xl space-y-4">
        
        {/* Upper Section: WaitingRiderReview (Left) and Image (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center w-full">
          
          {/* Left Side - Waiting Rider Review Component */}
          <WaitingRiderReview />

          {/* Right Side - Driver Request Image */}
          <div className="flex justify-center">
            <img
              src="/src/assets/images/driverPage 1.png"
              alt="Driver at Work"
              className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-lg shadow-lg"
            />
          </div>

        </div>

        {/* Bottom Section - Google Map */}
        <div className="w-full flex justify-center">
          <iframe
            title="Google Map"
            width="90%"
            height="400"
            className="rounded-lg shadow-lg"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.9025243794027!2d90.39945271538538!3d23.750895984589494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755bfe69b9a52e5%3A0x9c1a85a6d3f75823!2sDhaka!5e0!3m2!1sen!2sbd!4v1649757295978!5m2!1sen!2sbd"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

      </div>
    </div>
  );
};

export default RiderReview;
