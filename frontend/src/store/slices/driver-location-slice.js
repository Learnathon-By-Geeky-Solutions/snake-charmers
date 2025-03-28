import { createSlice } from '@reduxjs/toolkit';

const driverLocationSlice = createSlice({
    name: 'driverLocation',
    initialState: {
        isSet: true,
        latitude: 22.345663,
        longitude: 91.82251
    },
    reducers: {
        setDriverLocation: (state, action) => {
            state.isSet = true;
            state.latitude = action.payload?.latitude ?? state.latitude;;
            state.longitude = action.payload?.longitude ?? state.longitude;
        },
    },
});

export const { setDriverLocation } = driverLocationSlice.actions;
export default driverLocationSlice.reducer;