import { createSlice } from '@reduxjs/toolkit';

const locationUpdateStateSlice = createSlice({
    name: 'locationUpateState',
    initialState: {
        isAdded: false
    },
    reducers: {
        setLocationUpdateState: (state, action) => {
           state.isAdded = true
        },
    
    },
});

export const { setLocationUpdateState } = locationUpdateStateSlice.actions;
export default locationUpdateStateSlice.reducer;