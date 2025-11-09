import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import "./Dashboard.css";

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("/appointments/doctor");
        setAppointments(res.data);
      } catch (err) {
        console.error("Error loading doctor data", err);
      }
    };
    fetchAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put("/appointments/status", { appointmentId: id, status });
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
    } catch (err) {
      console.error("Error updating appointment", err);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome, Doctor 👨‍⚕️</h2>
      <div className="dashboard-section">
        <h3>Your Appointments</h3>
        {appointments.length === 0 ? (
          <p>No appointments yet.</p>
        ) : (
          <ul>
            {appointments.map((a) => (
              <li key={a._id}>
                {a.patientId?.userId?.name} — {a.date} at {a.time} ({a.status})
                <br />
                {a.status === "pending" && (
                  <>
                    <button onClick={() => updateStatus(a._id, "confirmed")}>
                      Accept
                    </button>
                    <button onClick={() => updateStatus(a._id, "rejected")}>
                      Reject
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DoctorDashboard;
