import { configureStore } from '@reduxjs/toolkit';
import loginReducer from '../reducers/loginReducer';
import usernameReducer from '../reducers/usernameReducer';
import  adminloginReducer from '../reducers/adminloginReducer';
// Create the Redux store using configureStore
const store = configureStore({
  reducer: {
    login: loginReducer,
    username : usernameReducer,
    admin : adminloginReducer,
  },
});

// Subscribe to store updates to save login state to localStorage 
let previousUsername = JSON.stringify(store.getState().username.username);
let previousAdminUsername = JSON.stringify(store.getState().admin.adminUsername)

store.subscribe(() => {
  const currentUsername = JSON.stringify(store.getState().username.username);
  const currentAdminUsername = JSON.stringify(store.getState().admin.adminUsername);

 // for user login
  if (previousUsername !== currentUsername) {
    localStorage.setItem('username', currentUsername);
    previousUsername = currentUsername;
  }
  //for admin login
  if (previousAdminUsername !== currentAdminUsername) {
    localStorage.setItem('adminUsername', currentAdminUsername);
    previousUsername = currentUsername;
  }

  // Always update isLoggedIn as needed
  localStorage.setItem('isLoggedIn', JSON.stringify(store.getState().login.isLoggedIn));
  localStorage.setItem('isAdminLoggedIn', JSON.stringify(store.getState().admin.isAdminLoggedIn));
  
});


export default store;
