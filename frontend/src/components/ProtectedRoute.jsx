import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ element: Component, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect if trying to access wrong dashboard
    if (role === "doctor") return <Navigate to="/doctor-dashboard" replace />;
    if (role === "patient") return <Navigate to="/patient-dashboard" replace />;
    if (role === "admin") return <Navigate to="/admin-dashboard" replace />;
  }

  return Component;
}

export default ProtectedRoute;
