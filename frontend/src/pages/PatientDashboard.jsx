import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./Dashboard.css";

function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicalCard, setMedicalCard] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    specialty: "",
    location: "",
    sortBy: "rating",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const successMsg = location.state?.successMsg;

  // Fetch all patient data
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const [apptRes, presRes, cardRes] = await Promise.all([
          axios.get("/appointments/patient"),
          axios.get("/prescriptions/my"),
          axios.post("/medical/generate-card"),
        ]);

        setAppointments(apptRes.data || []);
        setPrescriptions(presRes.data || []);
        setMedicalCard(cardRes.data.id || "Generating...");
      } catch (err) {
        console.error("Error loading patient data", err);
      }
    };
    fetchPatientData();
  }, []);

  // Search doctors
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await axios.get(`/doctors/search?${query}`);
      setDoctors(res.data.results || []);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  // Separate appointments logically
  const now = new Date();
  const upcoming = appointments.filter((a) => {
    const date = new Date(a.date);
    return (
      (a.status === "pending" || a.status === "confirmed") &&
      date >= now
    );
  });

  const past = appointments.filter((a) => {
    const date = new Date(a.date);
    return (
      (a.status === "completed" || a.status === "cancelled") ||
      date < now
    );
  });

  // Match prescriptions to appointments
  const getPrescription = (appointmentId) =>
    prescriptions.find((p) => p.appointmentId === appointmentId);

  return (
    <div className="dashboard-container patient-dash">
      <h2>Welcome, Patient 👤</h2>

      {successMsg && (
        <div className="success-banner">
          <p>✅ {successMsg}</p>
        </div>
      )}

      {/* MEDICAL CARD */}
      <div className="dashboard-section card-section">
        <h3>🩺 Medical Card</h3>
        <p>
          Card ID: <b>{medicalCard}</b>
        </p>
        <button
          onClick={() => navigate("/medical-card")}
          className="secondary-btn"
        >
          View Full History
        </button>
      </div>

      {/* SEARCH DOCTORS */}
      <div className="dashboard-section search-section">
        <h3>Find Doctors</h3>
        <form onSubmit={handleSearch} className="filter-form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={filters.name}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="specialty"
            placeholder="Specialty"
            value={filters.specialty}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleFilterChange}
          />
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
          >
            <option value="rating">Sort by Rating</option>
            <option value="experience">Sort by Experience</option>
          </select>
          <button type="submit">Search</button>
        </form>

        {loading ? (
          <p>Loading doctors...</p>
        ) : (
          <div className="doctor-grid">
            {doctors.length === 0 ? (
              <p>No doctors found.</p>
            ) : (
              doctors.map((doc) => (
                <div className="doctor-card" key={doc._id}>
                  <h3>{doc.userId?.name}</h3>
                  <p><b>Specialty:</b> {doc.specialization || "N/A"}</p>
                  <p><b>Location:</b> {doc.location || "N/A"}</p>
                  <p><b>Experience:</b> {doc.experience || 0} yrs</p>
                  <p><b>Rating:</b> ⭐ {doc.rating || "N/A"}</p>
                  <div className="doctor-card-actions">
                    <button
                      onClick={() =>
                        navigate("/book-appointment", {
                          state: { doctorId: doc._id, doctorName: doc.userId?.name },
                        })
                      }
                    >
                      Book Appointment
                    </button>
                    <button
                      className="secondary-btn"
                      onClick={() =>
                        navigate("/doctor-reviews", {
                          state: { doctorId: doc._id, doctorName: doc.userId?.name },
                        })
                      }
                    >
                      View Reviews
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* UPCOMING APPOINTMENTS */}
      <div className="dashboard-section">
        <h3>📅 Upcoming Appointments</h3>
        {upcoming.length === 0 ? (
          <p>No upcoming appointments.</p>
        ) : (
          <div className="appointment-list">
            {upcoming.map((a) => (
              <div key={a._id} className="appointment-card">
                <p><b>Doctor:</b> {a.doctorId?.userId?.name}</p>
                <p><b>Date:</b> {a.date}</p>
                <p><b>Time:</b> {a.time}</p>
                <span className={`status-badge ${a.status}`}>
                  {a.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PAST APPOINTMENTS */}
      <div className="dashboard-section">
        <h3>🕒 Past Appointments & Prescriptions</h3>
        {past.length === 0 ? (
          <p>No past appointments.</p>
        ) : (
          <div className="appointment-list">
            {past.map((a) => {
              const p = getPrescription(a._id);
              return (
                <div key={a._id} className="appointment-card past">
                  <p><b>Doctor:</b> {a.doctorId?.userId?.name}</p>
                  <p><b>Date:</b> {a.date}</p>
                  <p><b>Status:</b> {a.status}</p>
                  <div className="appointment-actions">
                    {p?.pdfLink && (
                      <a
                        href={p.pdfLink}
                        target="_blank"
                        rel="noreferrer"
                        className="download-btn"
                      >
                        📄 Download Prescription
                      </a>
                    )}
                    <button
                      className="secondary-btn"
                      onClick={() => navigate("/medical-card")}
                    >
                      View Medical Card
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientDashboard;
