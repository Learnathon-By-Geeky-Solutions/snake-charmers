import React from "react";
import DotLoader from "react-spinners/DotLoader";

const WaitingRiderReview = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full py-5">
      <p className="text-lg font-medium mb-6 text-center text-gray-600">
        Awaiting patient confirmation
      </p>
      <DotLoader size={60} color="#2563eb" />
    </div>
  );
};

export default WaitingRiderReview;