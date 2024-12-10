import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';
import votingImg from './image/vote.jpeg'
import LinearProgress from './Loaders/LinearProgress'
import { useNavigate } from 'react-router-dom';
function HomePage() {
    const username = useSelector(state => state.username.username)
    const [isLoading, setIsLoading] = useState(true)
    const isAdminLoggedIn = useSelector(state => state.admin.isAdminLoggedIn)
    const navigate = useNavigate()
    useEffect(()=>{
         const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulate a 2-second loading time

    return () => clearTimeout(timer); // Cleanup the timer
    })
  useEffect(() => { if (isAdminLoggedIn) { navigate('/admin'); } }, [isAdminLoggedIn, navigate]);
  
    if (isLoading) { return <LinearProgress />; }
  
    
  return (
    <div className="container-fluid bg-light min-vh-100 d-flex flex-column align-items-center justify-content-center">
      <header className="text-center mb-5">
        <h1 className="display-4 text-primary">Welcome to Online Voting System</h1>
        <p className="lead text-muted">Secure, reliable, and easy voting process from the comfort of your home</p>
      </header>
      <main className="text-center">
        <div className="row justify-content-center mb-4">
          <div className="col-md-8">
            <img src={votingImg} alt="Voting Illustration" className="img-fluid mb-4" />
          </div>
        </div>
        <div className="row justify-content-center mb-4">
          <div className="col-md-6">
            <p className="text-muted mb-4">
              Our online voting system ensures a transparent and efficient voting process for all users. Whether you're at home, at work, or on the go, casting your vote has never been easier.
            </p>
            <Link to={`/user/${username}`} className="btn btn-primary btn-lg mr-2">Register to Vote</Link>
            <Link to="/login" className="btn btn-outline-primary btn-lg ml-2">Login</Link>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <br />
            <h3 className="text-primary mb-3">Benefits of Voting Online</h3>
            <ul className="list-group">
              <li className="list-group-item ">Convenience: Vote from anywhere, anytime.</li>
              <li className="list-group-item">Security: Advanced encryption to ensure your vote is secure.</li>
              <li className="list-group-item">Accessibility: Easy for everyone to participate, including those with disabilities.</li>
              <li className="list-group-item">Transparency: Instant results and transparency in the voting process.</li>
            </ul>
          </div>
        </div>
        <div className="row justify-content-center mt-5">
          <div className="col-md-6">
            <h4 className="text-muted">Explore More</h4>
            <Link to={`/candidate/register/${username}`} className="btn btn-secondary btn-lg m-2">Candidate Registration</Link>
            <Link to="/contact" className="btn btn-secondary btn-lg m-2">Contact Us</Link>
            <Link to="/election-news" className="btn btn-secondary btn-lg m-2">Latest News</Link>
          </div>
        </div>
      </main>
      <footer className="mt-auto text-center text-muted py-4">
        <p>&copy; {new Date().getFullYear()} Online Voting System. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
