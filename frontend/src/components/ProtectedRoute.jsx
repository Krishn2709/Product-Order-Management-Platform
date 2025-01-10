import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // Store role on login
  if (!token || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
