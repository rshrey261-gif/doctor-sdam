import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
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

  // Fetch patient data
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const res1 = await axios.get("/appointments/patient");
        const res2 = await axios.get("/prescriptions/my");
        const res3 = await axios.post("/medical/generate-card");
        setAppointments(res1.data);
        setPrescriptions(res2.data);
        setMedicalCard(res3.data.id);
      } catch (err) {
        console.error("Error loading patient data", err);
      }
    };
    fetchPatientData();
  }, []);

  // Fetch doctors based on filters
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await axios.get(`/doctors/search?${query}`);
      setDoctors(res.data.results || []);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  return (
    <div className="dashboard-container patient-dash">
      <h2>Welcome, Patient 👤</h2>

      {/* Medical Card */}
      <div className="dashboard-section card-section">
        <h3>Medical Card</h3>
        <p>Your Card ID: <b>{medicalCard || "Generating..."}</b></p>
      </div>

      {/* Search Doctors */}
      <div className="dashboard-section search-section">
        <h3>Find Doctors 🩺</h3>
        <form onSubmit={handleSearch} className="filter-form">
          <input
            type="text"
            name="name"
            placeholder="Search by name"
            value={filters.name}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="specialty"
            placeholder="Search by specialty"
            value={filters.specialty}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="location"
            placeholder="Search by location"
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
                  <p><b>Specialty:</b> {doc.specialization}</p>
                  <p><b>Location:</b> {doc.location}</p>
                  <p><b>Experience:</b> {doc.experience} yrs</p>
                  <p><b>Rating:</b> ⭐ {doc.rating || "N/A"}</p>
                  <div className="doctor-card-actions">
                    <button
                      onClick={() =>
                        navigate("/book-appointment", {
                          state: {
                            doctorId: doc._id,
                            doctorName: doc.userId?.name,
                          },
                        })
                      }
                    >
                      Book Appointment
                    </button>
                    <button
                      className="secondary-btn"
                      onClick={() =>
                        navigate("/doctor-reviews", {
                          state: {
                            doctorId: doc._id,
                            doctorName: doc.userId?.name,
                          },
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

      {/* Appointments */}
      <div className="dashboard-section">
        <h3>Upcoming Appointments</h3>
        {appointments.length === 0 ? (
          <p>No appointments yet.</p>
        ) : (
          <ul>
            {appointments.map((a) => (
              <li key={a._id}>
                {a.doctorId?.userId?.name} — {a.date} at {a.time} ({a.status})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Prescriptions */}
      <div className="dashboard-section">
        <h3>Prescriptions</h3>
        {prescriptions.length === 0 ? (
          <p>No prescriptions available.</p>
        ) : (
          <ul>
            {prescriptions.map((p) => (
              <li key={p._id}>
                <a href={p.pdfLink} target="_blank" rel="noreferrer">
                  Download Prescription
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PatientDashboard;
