import React, { useState } from "react";
import WaitingRiderReview from "../WaitingRiderReview/WaitingRiderReview";
import { useDispatch, useSelector } from "react-redux";
import { setRiderResponse } from "../../store/slices/rider-response-slice";
import { SendMessage } from "../../controllers/websocket/handler";
import { changeCheckoutStatus } from "../../store/slices/checkout-status-slice";
import { clearTripReq } from "../../store/slices/trip-request-slice";

const FareDetails = () => {
  const dispatch = useDispatch();
  const { fare, isWaiting } = useSelector(state => state.riderResponse);
  const { id, name, mobile } = useSelector(state => state.user);
  const { req_id } = useSelector(state => state.tripCheckout);
  const [amount, setAmount] = useState(0);

  const handleAskClick = (type) => {
    dispatch(setRiderResponse({ isWaiting: true }));
    SendMessage({
      name: 'place-bid-driver',
      data: {
        driver_id: id,
        req_id,
        name,
        mobile,
        amount: (type === "ask" ? parseInt(amount) : fare)
      }
    });
    // need to implement retry here if failed
  };

  const handleDecline = () => {
    dispatch(changeCheckoutStatus());
    dispatch(clearTripReq());
    SendMessage({
      name: 'decline-trip',
      data: {
        req_id,
        driver_id: id
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100 flex flex-col items-center justify-between w-full h-full">
      <div className="flex flex-col items-center justify-center flex-grow w-full">
        {isWaiting ? (
          <WaitingRiderReview />
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600 text-sm font-medium">TRANSPORT FEE</p>
            <p className="text-4xl font-bold my-4 text-blue-600">{fare} tk</p>
          </div>
        )}
      </div>
      
      <div className="w-full space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-600">PROPOSE ALTERNATE FEE</p>
          <input
            type="text"
            placeholder="Enter amount"
            className="w-full p-3 rounded-lg bg-blue-50 text-gray-800 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        
        <button 
          className="bg-blue-600 text-white w-full py-3 rounded-lg font-medium hover:bg-blue-700 transition-all"
          onClick={() => handleAskClick("ask")}
        >
          Submit Proposal
        </button>
        
        <div className="flex justify-between w-full gap-4">
          <button 
            className="bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-all flex-1"
            onClick={() => handleAskClick("confirm")}
          >
            Accept
          </button>
          <button 
            className="bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-all flex-1"
            onClick={handleDecline}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default FareDetails;