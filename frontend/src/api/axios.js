import axios from "axios";

const API = axios.create({
  baseURL:
    window.location.hostname === "localhost"
      ? "http://localhost:5000/api" // ✅ Local backend (for dev)
      : "https://doctor-sdam.onrender.com/api", // ✅ Render backend (for production)
});

// ✅ Automatically attach JWT token if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
