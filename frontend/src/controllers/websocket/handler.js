import WebSocketController from "./ConnectionManger";
import { addTripReq, clearTripReq } from "../../store/slices/trip-request-slice";
import store from "../../store";
import { setRiderResponse } from "../../store/slices/rider-response-slice";
import { addDriverResponse } from "../../store/slices/driver-response-slice";
import { setRiderWaitingStatus } from "../../store/slices/rider-waiting-status-slice";
import { setOngoingTripDetails } from "../../store/slices/ongoing-trip-details-slice";
import { setIsOnATrip } from "../../store/slices/running-trip-indicator-slice";
import { changeCheckoutStatus } from "../../store/slices/checkout-status-slice";
import { setDriverLocation, unsetDriverLocation } from "../../store/slices/driver-location-slice";

const ConnectToserver = async(id, role) => {
    try{
        await WebSocketController.connect({
            logFunction: (message, type) => console.log(`[${type}] ${message}`),
            sendInitialMessage: true,
            initialMessage: { 
                name: "new-client", 
                data: {
                    id,
                    role
                }
             },
            onOpen: () => console.log('Connected successfully'),
            onClose: (event) => console.log('Connection closed', event),
            onError: (error) => console.error('Error occurred', error),
            onMessage: (message) => HandleIncomingMessage(message),
            // dispatch
        });
        // return connect;
    }catch(err){
        console.log(err);
    }
    
}

const DisconnectFromServer = async () =>{
    try{
        await WebSocketController.disconnect({
            logFunction: (message, type) => console.log(`[${type}] ${message}`),
            code: 1000,
            reason: 'User requested disconnect'
        });
    }catch(err){
        console.log(err);
    }
}

const SendMessage = async (msg) =>{
    let ok = false;
    try{
        ok = await WebSocketController.sendMessage(
            msg,
            { logFunction: (message, type) => console.log(`[${type}] ${message}`) }
        );
    }catch(err){
        console.log(err);
    }
    return ok;
}

function HandleIncomingMessage(message /*,dispatch*/) {
    // Process incoming messages
    console.log('Processing message:', message);
    const name = message.event;
    if(name == "new-trip-request"){
        console.log("Dispatching new trip request...")
        store.dispatch(addTripReq(message.data));
    }
    if(name == "bid-from-rider"){
        console.log("Dispatching bid from rider...")
        store.dispatch(setRiderResponse({fare: message.data.amount}))
    }
    if(name == "bid-from-driver"){
        console.log("Dispatching bid from driver...")
        store.dispatch(addDriverResponse(message.data));
        store.dispatch(setRiderWaitingStatus({isWaiting: false}))
    }
    if(name == "trip-confirmed"){
        console.log("trip confirmed", message.data);
        store.dispatch(setOngoingTripDetails(message.data));
        store.dispatch(setIsOnATrip({isOnATrip:true}));
        store.dispatch(clearTripReq());
        store.dispatch(changeCheckoutStatus());
    }
    if(name == "trip-ended"){
        store.dispatch(setIsOnATrip({isOnATrip:false}));
        store.dispatch(unsetDriverLocation());
    }
    if(name == "driver-location"){
        store.dispatch(setDriverLocation(message.data));
    }
}

export {ConnectToserver, DisconnectFromServer, SendMessage, HandleIncomingMessage}