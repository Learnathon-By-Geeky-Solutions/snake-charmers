import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: 0,
        name: '',
        email: '',
        mobile: '',
        role: '',
        rating: ''
    },
    reducers: {
        setUser: (state, action) => {
            state.id = action.payload.id || 0
            state.name = action.payload.name || '';
            state.email = action.payload.email || '';
            state.mobile = action.payload.mobile || '';
            state.role = action.payload.role || '';
        },
        deleteUser: (state) => {
            state.id = 0;
            state.name = '';
            state.email = '';
            state.mobile = '';
            state.role = '';
            state.rating = '';
        }
    },
});

export const { setUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;