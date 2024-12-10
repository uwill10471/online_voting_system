import { createSlice } from '@reduxjs/toolkit';

// Create a slice for login state
const loginSlice = createSlice({
  name: 'login',
  initialState: {
    isLoggedIn: false,
  },
  reducers: { toggleLogin: (state, action) => { 
    state.isLoggedIn = action.payload !== undefined ? action.payload : !state.isLoggedIn; 
  },
  },
});

export const { toggleLogin } = loginSlice.actions
export default loginSlice.reducer;
