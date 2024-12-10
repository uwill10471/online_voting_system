import axios from './axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; 
import { toggleLogin } from './reducers/loginReducer';
import { setUsername as setUsernameRedux } from './reducers/usernameReducer';
import LinearProgress from './Loaders/LinearProgress';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function Login() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const navigate = useNavigate();
  
  const isLoggedIn = useSelector(state => state.login.isLoggedIn);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post('/api/login', { username, email, password });
    //  console.log(response.data.username);
      
      dispatch(toggleLogin(true));
      dispatch(setUsernameRedux(response.data.username));
      setIsLoading(false);
      setEmail('');
      setUsername('');
      setPassword('');
      navigate('/');
    } catch (error) {
      console.error("Login error in Login.jsx", error);
      setMessage("An error occurred");
      setIsLoading(false);
      //
    }
  };

 
  const handelGuest = (e) => {
    e.preventDefault();
    setEmail(import.meta.env.VITE_GUEST_EMAIL);
    setUsername(import.meta.env.VITE_GUEST_USERNAME);
    setPassword(import.meta.env.VITE_GUEST_PASSWORD);
    setIsGuest(true);
  };

  useEffect(() => {
    if (isGuest && username && email && password) {
      handleSubmit(new Event('submit'));
      setIsGuest(false);
    }
  }, [isGuest, username, email, password]);

 


  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      {isLoading ? (
        <LinearProgress />
      ) : (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
          <form className="w-100" style={{ maxWidth: '400px' }} onSubmit={handleSubmit}>
            <h2 className="text-center mb-4">Login</h2>
            <div className="mb-3">
              <input 
                type="text" 
                value={username}
                name='username'
                placeholder='Username'
                className="form-control"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input 
                type="email" 
                value={email}
                name='email'
                placeholder='Email'
                className="form-control"
                onChange={(e) => setEmail(e.target.value)}
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
            
            <button onClick={handelGuest} className="btn btn-primary w-100 py-2">
              Login as Guest
            </button>

            <p className="text-center mt-3"> <a href="/admin/login" className="btn btn-link">Admin Login</a> </p>
            
            {message && <p className="text-danger mt-3">{message}</p>}
          </form>
          
        </div>
      )}
    </>
  );
}

export default Login;
