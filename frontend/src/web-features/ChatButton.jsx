import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../ChatButton.css';
import { MdChat } from 'react-icons/md'; // Importing the chat icon
import { useSelector } from 'react-redux';

const ChatButton = ({ onClick }) => {
  const isLoggedIn = useSelector(state => state.login.isLoggedIn);
  const isAdminLoggedIn = useSelector(state => state.admin.isAdminLoggedIn);

  if (!isAdminLoggedIn && !isLoggedIn) {
    return null;
  }

  return (
    <button
      className="btn btn-light fixed-bottom mb-4 mr-4 d-flex justify-content-center align-items-center rounded-circle"
      style={{ width: '60px', height: '60px' }}
      onClick={onClick}
    >
      <MdChat color="black" size={30} /> {/* Using the chat icon */}
    </button>
  );
};

export default ChatButton;
