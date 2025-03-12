import { configureStore } from '@reduxjs/toolkit';
import user from './slices/user-slice.js';
import locationUpdateState from './slices/location-update-state-slice.js';

const store = configureStore({
    reducer: {
        user,
        locationUpdateState,
    },
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware({
    //         serializableCheck: false,
    //     }),
});
export default store;