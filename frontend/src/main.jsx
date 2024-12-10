import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Correct import
import Navbar from './Navbar.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { toggleLogin } from './reducers/loginReducer.js';
import { setUsername } from './reducers/usernameReducer.js';
import store from './store/Store.js';
import axios from 'axios';
import UserPage from './web-features/RegisterToVote.jsx';
import News from './web-features/News.jsx';
import HomePage from './HomePage.jsx';
import ContactPage from './Contact.jsx';
import CandidatePage from './web-features/CandidatePage.jsx';
import CandidateGallery from './web-features/CandidateGallery.jsx';
import ChatButton from './web-features/ChatButton.jsx';
import ChatWidget from './web-features/ChatWidget.jsx';
import AdminLogin from './AdminLogin.jsx';
import AdminRegister from './AdminRegister.jsx';
import AdminHomePage from './AdminHomePage.jsx';
import VotingPage from './web-features/VotingPage.jsx';

const RootComponent = () => {
  const dispatch = useDispatch();
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn')) || false;
    dispatch(toggleLogin(isLoggedIn));
    const ParamUsername = JSON.parse(localStorage.getItem('username')) || 'meow';
   // console.log(ParamUsername);
    dispatch(setUsername(ParamUsername));
  }, [dispatch]);

  const handleChatButtonClick = () => { setIsChatOpen(!isChatOpen); };

  // User logout
  const handleLogout = async () => {
    try {
      await axios.get('/logout');
      dispatch({ type: 'login/toggleLogin', payload: false });
      dispatch({ type: 'username/setUsername', payload: null });
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
    } catch (error) {
      console.error("Logout error in main.jsx", error);
    }
  };

  // Admin logout
  const handleAdminLogout = async () => {
    try {
      await axios.get('/admin/logout');
      dispatch({ type: 'admin/toggleAdminLogin', payload: { isAdminLoggedIn: false, adminUsername: null } });
      localStorage.removeItem('isAdminLoggedIn');
      localStorage.removeItem('adminUsername');
    } catch (error) {
      console.error("Admin Logout error in main.jsx", error);
    }
  };

  return (
    <Router>
      <App />
      <Navbar handleLogout={handleLogout} handleAdminLogout={handleAdminLogout} />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/vote/:username' element={<VotingPage/>}/>
        <Route path='/register' element={<Register />} />
        <Route path="/user/:username" element={<UserPage />} />
        <Route path='/election-news' element={<News />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/candidate/register/:username' element={<CandidatePage />} />
        <Route path='/admin' element={<AdminHomePage />} />
        <Route path='/admin/candidate/select' element={<CandidateGallery />} />
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin/register' element={<AdminRegister />} />
      </Routes>
      <ChatButton onClick={handleChatButtonClick} />
      {isChatOpen && <ChatWidget Click={handleChatButtonClick} />}
    </Router>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RootComponent />
    </Provider>
  </StrictMode>
);
