import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if the user is logged in whenever the component mounts
  useEffect(() => {
    const checkAuthStatus = () => {
      const userToken = localStorage.getItem("authToken");
      setIsLoggedIn(!!userToken); // Update the state based on token existence
    };

    checkAuthStatus(); // Check the status initially

    // Listen for changes in localStorage (e.g., login/logout actions)
    window.addEventListener("storage", checkAuthStatus);

    // Cleanup listener when the component unmounts
    return () => {
      window.removeEventListener("storage", checkAuthStatus);
    };
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem("authToken", token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false); // Update the state to reflect logout
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          MedZon
        </Link>
        <ul className="navbar-links">
          <li>
            <Link to="/" className="navbar-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/cart" className="navbar-link">
              cart
            </Link>
          </li>
          <li>
            <Link to="/products" className="navbar-link">
              Products
            </Link>
          </li>
          <li>
            <Link to="/contact" className="navbar-link">
              Contact
            </Link>
          </li>
        </ul>
        <div className="navbar-actions">
          {isLoggedIn ? (
            <button className="action-btn logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/"
                className="action-btn login-btn"
                onClick={handleLogin}
              >
                Login
              </Link>
              <Link to="/signup" className="action-btn signup-btn">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
