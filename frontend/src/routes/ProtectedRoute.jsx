import React from "react";
import { Navigate } from "react-router-dom";

// Function to manually decode the JWT token
const decodeJwt = (token) => {
  const base64Url = token.split(".")[1]; // Extract the Payload part
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Base64Url to Base64

  const decodedData = JSON.parse(atob(base64)); // Decode and parse JSON
  return decodedData;
};

const ProtectedRoute = ({ children, roles }) => {
  const token = localStorage.getItem("token");

  // If no token is found, redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Decode the JWT token
  const decodedToken = decodeJwt(token);
  const userRole = decodedToken.role;

  // If the user role is not in the allowed roles, redirect to login
  if (!roles.includes(userRole)) {
    return <Navigate to="/login" />;
  }

  // If the token is valid and the role matches, render the children (protected page)
  return children;
};

export default ProtectedRoute;
