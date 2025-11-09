import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "./BookAppointment.css";

function BookAppointment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const doctorId = state?.doctorId;
  const doctorName = state?.doctorName;
  const [formData, setFormData] = useState({ date: "", time: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/appointments/book", {
        doctorId,
        date: formData.date,
        time: formData.time,
      });
      setMessage(res.data.message);
      setTimeout(() => navigate("/patient-dashboard"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="book-container">
      <h2>Book Appointment with {doctorName || "Doctor"}</h2>
      <form onSubmit={handleSubmit} className="book-form">
        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <label>Time:</label>
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />
        <button type="submit">Confirm Booking</button>
      </form>
      {message && <p className="book-message">{message}</p>}
    </div>
  );
}

export default BookAppointment;
