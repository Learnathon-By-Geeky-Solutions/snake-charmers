import React from "react";
import { FaUserCircle } from "react-icons/fa";

const AlignDriverInfo = ({ name, phone }) => {
  return (
    <div className="bg-black text-white w-full p-2 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaUserCircle className="text-2xl" />
          <div>
            <p className="font-semibold text-sm">Name: {name}</p>
            <p className="text-sm">Phone no: {phone}</p>
          </div>
        </div>
        <p className="font-bold text-green-400 text-sm">Fair</p>
      </div>

      <div className="flex justify-between mt-2">
        <button className="bg-green-600 px-6 py-2 rounded-md text-sm hover:bg-green-500 transition duration-300">Accept</button>
        <button className="bg-red-600 px-6 py-2 rounded-md text-sm hover:bg-red-500 transition duration-300">Decline</button>
      </div>
    </div>
  );
};

export default AlignDriverInfo;
