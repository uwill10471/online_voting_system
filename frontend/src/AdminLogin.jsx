import axios from './axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; 
import { toggleAdminLogin } from './reducers/adminloginReducer';
import LinearProgress from './Loaders/LinearProgress';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const navigate = useNavigate();
  
  const isAdminLoggedIn = useSelector(state => state.admin.isAdminLoggedIn);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post('/api/admin/login', { username, password });
    //  console.log(response.data.username);
      
      dispatch(toggleAdminLogin({ isAdminLoggedIn: true, adminUsername: response.data.username }));
      setIsLoading(false);
      setUsername('');
      setPassword('');
      navigate('/');
    } catch (error) {
      console.error("Login error in AdminLogin.jsx", error);
      setMessage("An error occurred");
      setIsLoading(false);
    }
  };
  
  const handleAdminGuest = (e) => {
    e.preventDefault();
    setUsername("admin22@gmail.com");
    setPassword(import.meta.env.VITE_GUEST_PASSWORD);
    setIsGuest(true);
  };

  useEffect(() => {
    if (isGuest && username && password) {
      handleSubmit(new Event('submit'));
      setIsGuest(false);
    }
  }, [isGuest, username, password]);

  useEffect(() => {
    if (isAdminLoggedIn) {
      navigate('/');
    }
  }, [isAdminLoggedIn, navigate]);

  return (
    <>
      {isLoading ? (
        <LinearProgress />
      ) : (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
          <form className="w-100" style={{ maxWidth: '400px' }} onSubmit={handleSubmit}>
            <h2 className="text-center mb-4">Admin Login</h2>
            <div className="mb-3">
              <input 
                type="email" 
                value={username}
                name='username'
                placeholder='Username'
                className="form-control"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="mb-3">
              <input 
                type="password" 
                value={password}
                name='password'
                placeholder='Password'
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 py-2 my-2">
              Submit
            </button>

            <button onClick={handleAdminGuest} className="btn btn-primary w-100 py-2">
              Login as Guest Admin
            </button>

            {message && <p className="text-danger mt-3">{message}</p>}
          </form>
        </div>
      )}
    </>
  );
}

export default AdminLogin;
