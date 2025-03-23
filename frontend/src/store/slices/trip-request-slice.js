import { createSlice } from '@reduxjs/toolkit';

const tripRequestSlice = createSlice({
    name: 'tripRequests',
    initialState: [
        // {req_id: 2, pickup_location: 'x', destination: 'y', fare: 100},
        // {req_id: 2, pickup_location: 'x', destination: 'y', fare: 100},
    ],
    reducers: {
        addTripReq: (state, action) => {
            console.log('adding trip request');
            state.unshift(action.payload);
        },
        removeTripReq: (state, action) => {
            console.log('removing trip request');
            return state.filter(trip => trip.req_id !== action.payload);
        },
        clearTripReq: (state) => {
            console.log('clearing all trip request');
            return [];
        },
    },
});

export const { addTripReq, removeTripReq, clearTripReq } = tripRequestSlice.actions;
export default tripRequestSlice.reducer;