import { createSlice } from "@reduxjs/toolkit";

const adminLoginSlice = createSlice({
    name: 'admin',
    initialState: {
        isAdminLoggedIn: false,
        adminUsername: '', // Add username to initial state
    },
    reducers: {
        toggleAdminLogin: (state, action) => {
            state.isAdminLoggedIn = action.payload.isAdminLoggedIn !== undefined ? action.payload.isAdminLoggedIn : !state.isAdminLoggedIn; 
            if (action.payload.adminUsername !== undefined) {
                state.adminUsername = action.payload.adminUsername;
            } else if (!state.isAdminLoggedIn) {
                state.username = '';
            }
        }
    }
});

export const { toggleAdminLogin } = adminLoginSlice.actions;

export default adminLoginSlice.reducer;
