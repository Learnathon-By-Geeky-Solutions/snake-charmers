import { createSlice } from '@reduxjs/toolkit';

const tripRequestSlice = createSlice({
    name: 'tripRequests',
    initialState: [],
    reducers: {
        addTripReq: (state, action) => {
            console.log("adding trip req..");
            state.unshift(action.payload);
        },
        removeTripReq: (state, action) => {
            return state.filter(trip => trip.req_id !== action.payload);
        },
    },
});

export const { addTripReq, removeTripReq } = tripRequestSlice.actions;
export default tripRequestSlice.reducer;