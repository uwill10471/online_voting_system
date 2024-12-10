import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LinearProgress from '../Loaders/LinearProgress';
import axios from '../axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const User = () => {
  const [isLoading, setIsLoading] = useState(false);
  const isLoggedIn = useSelector(state => state.login.isLoggedIn);
  const { username } = useParams();
  const navigate = useNavigate();

  const [FullName, setFullName] = useState("");
  const [Age, setAge] = useState("");
  const [DOB, setDOB] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [AadharNo, setAadharNo] = useState("");
  const [VoterID, setVoterID] = useState("");
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Simulate a 2-second loading time

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  useEffect(() => {
    
    
    if (isLoggedIn === false) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  if (isLoading) {
    return <LinearProgress />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/registertovote", { username, FullName, Age, DOB, PhoneNo, AadharNo, VoterID });

      if (response.data.success) {
        setMessage(response.data.message);
      } else {
        setMessage(response.data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        console.error("Server error:", error.response.data);
        setMessage(error.response.data.message || "An error occurred while processing your request.");
      } else if (error.request) {
        console.error("No response received:", error.request);
        setMessage("No response from the server. Please check your connection and try again.");
      } else {
        console.error("Error setting up request:", error.message);
        setMessage("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card w-100" style={{ maxWidth: '600px' }}>
        <div className="card-body">
          <h1 className="card-title text-center mb-4">Hi, {username}!</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="Username" className="form-label">Username:</label>
              <input 
                type="text" 
                id="Username" 
                className="form-control"
                value={username} 
                readOnly
                required 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">Full Name:</label>
              <input 
                type="text" 
                id="fullName" 
                className="form-control"
                value={FullName} 
                onChange={(e) => setFullName(e.target.value)} 
                required 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="age" className="form-label">Age:</label>
              <input 
                type="number" 
                id="age" 
                className="form-control"
                value={Age} 
                onChange={(e) => setAge(e.target.value)} 
                min="0" 
                required 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="dob" className="form-label">Date of Birth:</label>
              <input 
                type="date" 
                id="dob" 
                className="form-control"
                value={DOB} 
                onChange={(e) => setDOB(e.target.value)} 
                required 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phoneNo" className="form-label">Phone Number:</label>
              <input 
                type="tel" 
                id="phoneNo" 
                className="form-control"
                value={PhoneNo} 
                onChange={(e) => setPhoneNo(e.target.value)} 
                required 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="aadharNo" className="form-label">Aadhar Number:</label>
              <input 
                type="text" 
                id="aadharNo" 
                className="form-control"
                value={AadharNo} 
                onChange={(e) => setAadharNo(e.target.value)} 
                required 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="voterID" className="form-label">Voter ID:</label>
              <input 
                type="text" 
                id="voterID" 
                className="form-control"
                value={VoterID} 
                onChange={(e) => setVoterID(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Submit</button>
          </form>
          {message && <p className="text-danger mt-3">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default User;
