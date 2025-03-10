import React from "react";
import DotLoader from "react-spinners/DotLoader";

const WaitingRiderReview = () => {
  return (
    <div className="bg-black text-white w-[300px] md:w-[400px] h-96 p-6 rounded-lg shadow-lg flex flex-col justify-center items-center ml-14">
      <p className="text-lg font-semibold mb-4 text-center">
        Waiting for rider review
      </p>
      <DotLoader size={80} color="#ffffff" />
    </div>
  );
};

export default WaitingRiderReview;
