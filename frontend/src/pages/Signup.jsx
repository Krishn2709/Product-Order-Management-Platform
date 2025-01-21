import React, { useState } from "react";
import axiosInstance from "../api/axios";
import "../styles/login.css"; // Reusing the same CSS file
import Navbar from "../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //Signup Handler
  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); // Reset error before trying to sign up
    try {
      const response = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
      });

      // Show the success toast
      toast.success("User registered successfully!");

      // Wait for a short delay before navigating
      setTimeout(() => {
        navigate("/"); // Navigate to homepage after the toast message
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Sign Up</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field username"
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>
            <button type="submit" className="submit-btn">
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Signup;
