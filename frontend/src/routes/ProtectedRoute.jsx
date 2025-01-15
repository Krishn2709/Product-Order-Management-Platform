import React from "react";
import { Navigate } from "react-router-dom";
import { jwt_decode } from "jwt-decode";

const ProtectedRoute = ({ children, roles }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" />;
  }

  const decodedToken = jwt_decode(token);
  const userRole = decodedToken.role;

  if (!roles.includes(userRole)) {
    return <Navigate to="/login" />;
  }

  return children; // If token and role match, render the children (the page)
};

export default ProtectedRoute;
