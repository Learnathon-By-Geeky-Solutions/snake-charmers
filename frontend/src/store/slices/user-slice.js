import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: 0,
        name: '',
        email: '',
        mobile: '',
        role: '',
        rating: '',
        latitude: 22.356851185285,
        longitude:  91.807229414965
    },
    reducers: {
        setUser: (state, action) => {
            state.id = action.payload?.id ?? state.id;
            state.name = action.payload?.name ?? state.name;
            state.email = action.payload?.email ?? state.email;
            state.mobile = action.payload?.mobile ?? state.mobile;
            state.role = action.payload?.role ?? state.role;
            state.latitude = action.payload?.latitude ?? state.latitude;
            state.longitude = action.payload?.longitude ?? state.longitude;
        },
        deleteUser: (state) => {
            state.id = 0;
            state.name = '';
            state.email = '';
            state.mobile = '';
            state.role = '';
            state.rating = '';
            state.latitude = 22.356851185285;
            state.longitude =  91.807229414965;
        }
    },
});

export const { setUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;