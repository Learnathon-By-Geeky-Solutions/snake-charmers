import { createSlice } from '@reduxjs/toolkit';

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState: {
        isCheckedOut: false,
    },
    reducers: {
        changeCheckoutStatus: (state) => {
            state.isCheckedOut = !state.isCheckedOut
        },
    },
});

export const { changeCheckoutStatus } = checkoutSlice.actions;
export default checkoutSlice.reducer;