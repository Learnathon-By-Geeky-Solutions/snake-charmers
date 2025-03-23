import { createSlice } from '@reduxjs/toolkit';

const driverResponsesSlice = createSlice({
    name: 'driverResponses',
    initialState: [
        // { driver_id: 1, name: "Fazal", mobile: "0181231231", req_id: 2, amount: 400},
        // { driver_id: 2, name: "Ahmed", mobile: "01876543099", req_id: 3, amount: 700 },
        // { driver_id: 2, name: "Ahmed", mobile: "0187654321", req_id: 3, amount: 900},

    ],
    reducers: {
        addDriverResponse: (state, action) => {
            console.log('adding driver response');
            state.unshift(action.payload);
        },
        clearDriverResponses: (state) => {
            console.log('clearing all driver responses');
            return [];
        },
    },
});

export const { addDriverResponse, clearDriverResponses } = driverResponsesSlice.actions;
export default driverResponsesSlice.reducer;