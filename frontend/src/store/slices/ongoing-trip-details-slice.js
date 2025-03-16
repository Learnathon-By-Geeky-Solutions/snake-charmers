import { createSlice } from '@reduxjs/toolkit';

const ongoingTripDetailsSlice = createSlice({
    name: 'ongoingTripDetails',
    initialState: {
        trip_id: 0,
        pickup_location: '',
        destination: '',
        driver_id: 0,
        rider_id: 0,
        driver_name: '',
        rider_name: '',
        driver_mobile: '',
        rider_mobile: '',
        status: '',
        fare: 0
    },
    reducers: {
        setOngoingTripDetails: (state, action) => {
            state.pickup_location = action.payload?.pickup_location ?? state.pickup_location;
            state.destination = action.payload?.destination ?? state.destination;
            state.fare = action.payload?.fare ?? state.fare;
            state.trip_id = action.payload?.trip_id ?? state.trip_id;
            state.status = action.payload?.status ?? state.status;
            state.rider_id = action.payload?.rider_id ?? state.rider_id;
            state.driver_id = action.payload?.driver_id ?? state.driver_id;
            state.driver_name = action.payload?.driver_name ?? state.driver_name;
            state.rider_name = action.payload?.rider_name ?? state.rider_name;
            state.driver_mobile = action.payload?.driver_mobile ?? state.driver_mobile;
            state.rider_mobile = action.payload?.rider_mobile ?? state.rider_mobile;
        },
    },
});

export const { setOngoingTripDetails } = ongoingTripDetailsSlice.actions;
export default ongoingTripDetailsSlice.reducer;