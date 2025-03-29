import { createSlice } from '@reduxjs/toolkit';

const driverLocationSlice = createSlice({
    name: 'driverLocation',
    initialState: {
        isSet: true,
        latitude: 0,
        longitude: 0,
        // latitude: 22.345663,
        // longitude: 91.82251
    },
    reducers: {
        setDriverLocation: (state, action) => {
            state.isSet = true;
            state.latitude = action.payload?.latitude ?? state.latitude;;
            state.longitude = action.payload?.longitude ?? state.longitude;
        },
        unsetDriverLocation: (state) => {
            state.isSet = false;
            state.latitude = 0;
            state.longitude = 0;
        }
    },
});

export const { setDriverLocation, unsetDriverLocation } = driverLocationSlice.actions;
export default driverLocationSlice.reducer;