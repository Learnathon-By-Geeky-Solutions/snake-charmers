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
  const {id, name, mobile} = useSelector(state => state.user);
  const { req_id } = useSelector(state => state.tripCheckout)
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
        amount: (type == "ask" ? parseInt(amount) : fare)
      }
    })
    // need to implement retry here if failed
  }; 

  const handleDecline = () =>{
    dispatch(changeCheckoutStatus());    
    dispatch(clearTripReq());
    SendMessage({
      name: 'decline-trip',
      data:{
        req_id,
        driver_id: id
      }
    })
  }


  return (
    <div className="bg-black text-white w-[300px] h-full md:w-full rounded-lg shadow-lg flex flex-col items-center justify-between">
      {/* Enhanced Trip details at the top */}
      
      {/* Current fare displayed prominently in the middle */}
      <div className="flex flex-col items-center justify-center flex-grow">
        {isWaiting ? 
           <WaitingRiderReview/> 
            :
            <>
             <p className="text-lg text-gray-300">Current Fare</p>
             <p className="text-5xl font-bold my-4">{fare} tk</p>
            </>
        }
      </div>
      
      {/* Fare offer and buttons at the bottom */}
      <div className="w-full">
        <p className="text-sm mb-1">Offer your fare</p>
        <input
          type="text"
          placeholder="Write amount"
          className="w-full p-2 rounded bg-gray-800 text-white mb-2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button 
          className="bg-purple-600 w-full py-2 rounded mb-4"
          onClick={() => {handleAskClick("ask")}}
        >
          Ask
        </button>
        
        {/* Confirm & Decline Buttons */}
        <div className="flex justify-between w-full">
          <button 
            className="bg-green-600 px-6 py-2 rounded-md w-[48%]"
            onClick={() => {handleAskClick("confirm")}}
          >
            Confirm
          </button>
          <button 
            className="bg-red-600 px-6 py-2 rounded-md w-[48%]"
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