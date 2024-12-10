import React, { useEffect, useState } from 'react';
import axios from './axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUsername } from './reducers/usernameReducer';
import { toggleLogin } from './reducers/loginReducer';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function Register() {
  const [username, setUsernamee] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const isLoggedIn = useSelector(state => state.login.isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const response = await axios.post("/api/register", { username, email, password });

      dispatch(setUsername(response.data.username));
      dispatch(toggleLogin(true));
      setEmail('');
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
        <h2 className="text-center mb-4">Register</h2>
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
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            id="email"
            placeholder="email@gmail.com"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

export default Register;
