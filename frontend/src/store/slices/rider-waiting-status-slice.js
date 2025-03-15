import { createSlice } from '@reduxjs/toolkit';

const riderWaitingStatusSlice = createSlice({
    name: 'riderWaitingStatus',
    initialState: {
        isWaiting: false,
    },
    reducers: {
        setRiderWaitingStatus: (state, action) => {
           state.isWaiting = action.payload?.isWaiting
        },
    },
});

export const { setRiderWaitingStatus } = riderWaitingStatusSlice.actions;
export default riderWaitingStatusSlice.reducer;