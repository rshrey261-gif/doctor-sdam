// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import DoctorList from "./pages/DoctorList";
import BookAppointment from "./pages/BookAppointment";

export default function App() {
  console.log("APP render start");

  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/doctors" element={<DoctorList />} />
<Route path="/book-appointment" element={<BookAppointment />} />


          {/* ✅ Protected Routes with allowedRoles */}
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute
                element={<DoctorDashboard />}
                allowedRoles={["doctor"]}
              />
            }
          />
          <Route
            path="/patient-dashboard"
            element={
              <ProtectedRoute
                element={<PatientDashboard />}
                allowedRoles={["patient"]}
              />
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute
                element={<AdminDashboard />}
                allowedRoles={["admin"]}
              />
            }
          />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}
