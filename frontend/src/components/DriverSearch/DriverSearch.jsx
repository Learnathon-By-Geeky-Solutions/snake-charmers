import React from "react";
import AlignDriverInfo from "../AlignDriverInfo/AlignDriverInfo";
import Fare from "../Fare/Fare";
import { PuffLoaderComponent } from "../PuffLoader/PuffLoader";

const DriverSearch = () => {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      {/* Central Wrapper to Align Everything */}
      <div className="flex flex-col items-center w-full max-w-5xl space-y-2">
        {/* Upper Section: Puff Loader (Left) and Image (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center w-full">
          {/* Left Side - Puff Loader in Styled Card */}
          <PuffLoaderComponent/>
          {/* Right Side - Ride Request Image */}
          <div className="flex justify-center">
            <img
              src="/src/assets/images/driverPageRequest 1.png"
              alt="Ride Request"
              className="w-96 h-96 rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Bottom Section - Map (Left) + Ride UI (Right) */}
        <div className="w-full mt-5 flex flex-col items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center w-full">
            {/* Left Side - Google Map (Aligned Properly with Left Margin) */}
            <div className="w-96 h-[550px] flex justify-center ml-14 mt-10">
              <iframe
                title="Google Map"
                width="100%"
                height="100%"
                className="rounded-lg shadow-2xl"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3689.126991404184!2d91.807229414965!3d22.356851185285853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30ad27582ff5c2ef%3A0x3e696c9b6b4d962c!2sChittagong%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1649761307864!5m2!1sen!2sbd"
                allowFullScreen=""
                              loading="lazy" 
              ></iframe>
            </div>

            {/* Right Side - Ash Colored Div (Aligned with Map & Left Margin) */}
            <div className="w-96 h-[550px] bg-gray-400 rounded-lg shadow-lg flex flex-col items-center justify-between p-3 ml-14 mt-10">
              {/* Driver Name Component (Top) */}
              <AlignDriverInfo name="Fazal" phone="0181231231" />

              {/* Fare Component (Bottom) */}
              <Fare currentFare={500} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverSearch;
