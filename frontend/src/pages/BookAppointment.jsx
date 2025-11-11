import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "./BookAppointment.css";

function BookAppointment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const doctorId = state?.doctorId;
  const doctorName = state?.doctorName || "Doctor";

  const [formData, setFormData] = useState({ date: "", time: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("/appointments/book", {
        doctorId,
        date: formData.date,
        time: formData.time,
      });

      setMessage("✅ Appointment booked successfully!");
      // Redirect to Patient Dashboard with appointment info
      setTimeout(() => {
        navigate("/patient-dashboard", {
          state: {
            appointment: res.data.appointment,
            successMsg: res.data.message,
          },
        });
      }, 1500);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || "Booking failed"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-container">
      <h2>Book Appointment with <span className="doctor-name">{doctorName}</span></h2>

      <form onSubmit={handleSubmit} className="book-form">
        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          min={new Date().toISOString().split("T")[0]}
        />

        <label>Time:</label>
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </form>

      {message && <p className="book-message">{message}</p>}
    </div>
  );
}

export default BookAppointment;
