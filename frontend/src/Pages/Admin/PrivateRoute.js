import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" />;

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.role;

    //  role missing → logout
    if (!userRole) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      return <Navigate to="/" />;
    }

    // support string or array roles
    if (role) {
      const allowedRoles = Array.isArray(role) ? role : [role];

      if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/" />;
      }
    }

    return children;
  } catch (err) {
    //  invalid token → logout
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    return <Navigate to="/" />;
  }
};

export default PrivateRoute;