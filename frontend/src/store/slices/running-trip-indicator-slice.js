import { createSlice } from '@reduxjs/toolkit';

const isOnATripSlice = createSlice({
    name: 'isOnATrip',
    initialState: {
        // isOnATrip: false,
        isOnATrip: true,
    },
    reducers: {
        setIsOnATrip: (state, action) => {
           state.isOnATrip = action.payload?.isOnATrip
        },
    },
});

export const { setIsOnATrip } = isOnATripSlice.actions;
export default isOnATripSlice.reducer;