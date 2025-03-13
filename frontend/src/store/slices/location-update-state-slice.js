import { createSlice } from '@reduxjs/toolkit';

const locationUpdateStateSlice = createSlice({
    name: 'locationUpateState',
    initialState: {
        isAdded: false
    },
    reducers: {
        setLocationUpdateState: (state, action) => {
           state.isAdded = true;
        },
        unsetLocationUpdateState: (state, action) => {
            state.isAdded = false;
        }
    
    },
});

export const { setLocationUpdateState, unsetLocationUpdateState } = locationUpdateStateSlice.actions;
export default locationUpdateStateSlice.reducer;