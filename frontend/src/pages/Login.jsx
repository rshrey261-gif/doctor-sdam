import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    // ✅ Fixed typo: setFormDat1a → setFormData
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      if (res.data.role === "doctor") navigate("/doctor-dashboard");
      else if (res.data.role === "admin") navigate("/admin-dashboard");
      else navigate("/patient-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page login-page">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>
        </form>
        <p className="signup-link">
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
