import { configureStore } from '@reduxjs/toolkit';
import user from './slices/user-slice.js';

const store = configureStore({
    reducer: {
        user,
    },
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware({
    //         serializableCheck: false,
    //     }),
});
export default store;