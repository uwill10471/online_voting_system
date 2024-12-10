import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const Navbar = ({ handleLogout,handleAdminLogout }) => {
  const isLoggedIn = useSelector(state => state.login.isLoggedIn);
  const ParamUsername = useSelector(state => state.username.username);

  const isAdminLoggedIn = useSelector(state => state.admin.isAdminLoggedIn)
  const adminParamUsername = useSelector(state => state.admin.adminUsername)

  if(isAdminLoggedIn){
    handleLogout()
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Votely</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" activeclassname="active">
                Home
              </NavLink>
            </li>
            
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact" activeclassname="active">
                Contact
              </NavLink>
            </li>

            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to={`/user/${ParamUsername}`} activeclassname="active">
                    Register to Vote
                  </NavLink>
                </li>
                  <li className="nav-item">
                  <NavLink className="nav-link" to={`/vote/${ParamUsername}`} activeclassname="active">
                    Cast Vote
                  </NavLink>
                </li>
                
                <li className="nav-item">
                  <NavLink className="nav-link" to="/election-news" activeclassname="active">
                    Latest News
                  </NavLink>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger nav-link" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              
              </>
            ) : isAdminLoggedIn? (<>
              <li className="nav-item">
                  <NavLink className="nav-link" to={`/admin/${adminParamUsername}`} activeclassname="active">
                    Param Route
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/candidate/select" activeclassname="active">
                    Pending Approval's
                  </NavLink>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger nav-link" onClick={handleAdminLogout}>
                    Admin Logout
                  </button>
                </li>
              
              </>) :(
            
             <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login" activeclassname="active">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register" activeclassname="active">
                    Register
                  </NavLink>
                </li>
              </>
            )}

            {/* Admin navigatetion */}
            
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
