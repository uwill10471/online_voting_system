import React, { useEffect, useState } from 'react';
import axios from './axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleAdminLogin } from './reducers/adminloginReducer';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function    AdminRegister() {
  const [username, setUsernamee] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const isAdminLoggedIn = useSelector(state => state.admin.isAdminLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAdminLoggedIn) {
      navigate('/');
    }
  }, [isAdminLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const response = await axios.post("/api/admin/register", { username, password });

      dispatch(toggleAdminLogin({isAdminLoggedIn:true,adminUsername:response.data.username}))
      setUsernamee('');
      setPassword('');
      navigate('/');
    } catch (error) {
      console.error("Error in Register.jsx", error);
      setMessage("An error has occurred");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <form className="w-100" style={{ maxWidth: '400px' }} onSubmit={handleSubmit}>
        <h2 className="text-center mb-4"> Admin Register</h2>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username:</label>
          <input
            type="text"
            id="username"
            placeholder="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsernamee(e.target.value)}
            required
          />
        </div>
       
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Submit
        </button>
        {message && <p className="text-danger mt-3">{message}</p>}
      </form>
    </div>
  );
}

export default AdminRegister;
