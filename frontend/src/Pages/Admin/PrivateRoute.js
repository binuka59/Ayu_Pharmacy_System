import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" />; // redirect to login

  try {
    const decoded = jwtDecode(token);

    // check role
    if (role && decoded.role !== role) {
      return <Navigate to="/" />;
    }

    return children;
  } catch (err) {
    localStorage.removeItem("token");
    return <Navigate to="/" />;
  }
};

export default PrivateRoute;
