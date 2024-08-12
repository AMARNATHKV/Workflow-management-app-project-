import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserType } from '../pages/LoginPage';
import { handleLogout } from './Logout'; // Import the logout function

const Navbar = () => {
  const userType = getUserType();
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-700 p-4">
      <div className="container mx-auto flex justify-between">
        <div className="text-white text-lg font-bold">TaskNest</div>
        <div className="flex space-x-4">
          <Link to="/" className="text-white">Home</Link>
          {userType === 'manager' && (
            <>
              <Link to="/manager-dashboard" className="text-white">Dashboard</Link>
              <Link to="/add-project" className="text-white">Add Project</Link>
            </>
          )}
          {userType === 'staff' && (
            <>
              <Link to="/staff-dashboard" className="text-white">Dashboard</Link>
            </>
          )}
          <Link to="/profile" className="text-white">Profile</Link>
          <Link 
            to="/login" 
            onClick={() => handleLogout(navigate)} 
            className="text-white"
          >
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
