import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./DoctorList.css";

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [filters, setFilters] = useState({
    specialty: "",
    location: "",
    name: "",
    sortBy: "rating",
  });

  const navigate = useNavigate();

  const fetchDoctors = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await axios.get(`/doctors/search?${query}`);
      setDoctors(res.data.results || []);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  return (
    <div className="doctorlist-container">
      <h2>Find Your Doctor 🩺</h2>

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

      <div className="doctor-grid">
        {doctors.length === 0 ? (
          <p>No doctors found.</p>
        ) : (
          doctors.map((doc) => (
            <div className="doctor-card" key={doc._id}>
              <h3>{doc.userId?.name}</h3>
              <p>
                <b>Specialty:</b> {doc.specialization}
              </p>
              <p>
                <b>Location:</b> {doc.location}
              </p>
              <p>
                <b>Experience:</b> {doc.experience} yrs
              </p>
              <p>
                <b>Rating:</b> ⭐ {doc.rating || "N/A"}
              </p>
              <button
                onClick={() =>
                  navigate("/book-appointment", {
                    state: { doctorId: doc._id, doctorName: doc.userId?.name },
                  })
                }
              >
                Book Appointment
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DoctorList;
