import { createSlice } from '@reduxjs/toolkit';

const riderResponseSlice = createSlice({
    name: 'riderResponse',
    initialState: {
        isWaiting: false,
        fare: 0
    },
    reducers: {
        setRiderResponse: (state, action) => {
           state.isWaiting = action.payload?.isWaiting
           state.fare = action.payload?.fare;
        },
    },
});

export const { setRiderResponse } = riderResponseSlice.actions;
export default riderResponseSlice.reducer;