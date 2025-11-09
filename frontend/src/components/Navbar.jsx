import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* ✅ Branding from second file */}
      <div className="navbar-logo">AuronX</div>

      <div className="navbar-links">
        {!token ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        ) : (
          <>
            {/* ✅ Role-based Dashboard Links */}
            {role === "doctor" && <Link to="/doctor-dashboard">Dashboard</Link>}
            {role === "patient" && <Link to="/patient-dashboard">Dashboard</Link>}
            {role === "admin" && <Link to="/admin-dashboard">Dashboard</Link>}

            {/* ✅ Logout */}
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
