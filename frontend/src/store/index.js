import { configureStore } from '@reduxjs/toolkit';
import user from './slices/user-slice.js';
import locationUpdateState from './slices/location-update-state-slice.js';
import tripRequests from './slices/trip-request-slice.js';

const store = configureStore({
    reducer: {
        user,
        locationUpdateState,
        tripRequests,
    },
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware({
    //         serializableCheck: false,
    //     }),
});
export default store;