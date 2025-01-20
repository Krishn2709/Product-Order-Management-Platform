import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom"; // For redirecting after login
import "../styles/login.css"; // Import the CSS file
import Navbar from "../components/Navbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error before trying to log in

    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      // Save token and user info
      dispatch(login({ user, token }));
      localStorage.setItem("token", token);

      // Navigate based on the role
      if (user.role === "Admin") {
        navigate("/admin/products");
      } else if (user.role === "Customer") {
        navigate("/products");
      } else {
        setError("Unknown user role");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Login</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>
            <button
              type="submit"
              className={`submit-btn ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
