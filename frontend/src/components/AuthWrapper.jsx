import React from "react";
import { Navigate } from "react-router-dom";

const AuthWrapper = ({ children }) => {
  const token = localStorage.getItem("token"); // JWT token or Firebase login

  if (!token) {
    // Not logged in → redirect to login
    return <Navigate to="/login" />;
  }

  return children;
};

export default AuthWrapper;