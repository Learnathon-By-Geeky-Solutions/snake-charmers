import { configureStore } from '@reduxjs/toolkit';
import user from './slices/user-slice.js';
import locationUpdateState from './slices/location-update-state-slice.js';
import tripRequests from './slices/trip-request-slice.js';
import riderResponse from './slices/rider-response-slice.js';
import checkout from './slices/checkout-status-slice.js';
import tripCheckout from './slices/trip-checkout-slice.js';
import riderWaitingStatus from './slices/rider-waiting-status-slice.js';
import driverResponses from './slices/driver-response-slice.js';

const store = configureStore({
    reducer: {
        user,
        locationUpdateState,
        tripRequests,
        riderResponse,
        checkout,
        tripCheckout,
        riderWaitingStatus,
        driverResponses
    },
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware({
    //         serializableCheck: false,
    //     }),
});
export default store;