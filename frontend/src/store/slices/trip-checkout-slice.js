import { createSlice } from '@reduxjs/toolkit';

const tripCheckoutSlice = createSlice({
    name: 'tripCheckout',
    initialState: {
        req_id: 0,
        pickup_location: '',
        destination: '',
        fare: ''
    },
    reducers: {
        settripCheckout: (state, action) => {
            state.req_id =  action.payload.req_id;
            state.pickup_location = action.payload.pickup_location;
            state.destination = action.payload.destination;
            state.fare = action.payload.fare
        },
    },
});

export const { settripCheckout } = tripCheckoutSlice.actions;
export default tripCheckoutSlice.reducer;