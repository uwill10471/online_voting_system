import { createSlice } from "@reduxjs/toolkit";

const usernameSlice  = createSlice({
 name: 'username',
 initialState: {
  username : "",
 },
 reducers: {
    setUsername: (state= initialState,action) => {
      
      state.username = action.payload
    },
 },

 
});

export const {setUsername} = usernameSlice.actions
export default usernameSlice.reducer
