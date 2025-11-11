import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./DoctorDashboard.css";

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ date: "", time: "" });
  const [prescription, setPrescription] = useState({
    appointmentId: "",
    notes: "",
    medicines: [{ name: "", dosage: "", duration: "" }],
  });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all doctor data
  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      const [apptRes, slotRes, notifRes] = await Promise.all([
        axios.get("/appointments/doctor"),
        axios.get("/doctor/slots"),
        axios.get("/notifications"),
      ]);
      setAppointments(apptRes.data);
      setSlots(slotRes.data);
      setNotifications(notifRes.data || []);
    } catch (err) {
      toast.error("Error loading doctor data");
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDoctorData();
  }, []);

  // Update appointment status
  const updateStatus = async (id, status) => {
    try {
      await axios.put("/appointments/status", { appointmentId: id, status });
      toast.success(`Appointment ${status}`);
      fetchDoctorData();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // Add new slot
  const addSlot = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/doctor/slots", newSlot);
      toast.success(res.data.message || "Slot added");
      setNewSlot({ date: "", time: "" });
      fetchDoctorData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding slot");
    }
  };

  // Handle medicine input
  const handleMedicineChange = (index, e) => {
    const updated = [...prescription.medicines];
    updated[index][e.target.name] = e.target.value;
    setPrescription({ ...prescription, medicines: updated });
  };

  // Add new medicine row
  const addMedicineRow = () => {
    setPrescription({
      ...prescription,
      medicines: [...prescription.medicines, { name: "", dosage: "", duration: "" }],
    });
  };

  // Upload prescription
  const submitPrescription = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/prescriptions", prescription);
      toast.success(res.data.message || "Prescription added!");
      setPrescription({
        appointmentId: "",
        notes: "",
        medicines: [{ name: "", dosage: "", duration: "" }],
      });
      fetchDoctorData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error uploading prescription");
    }
  };

  return (
    <div className="doctor-dashboard-container">
      <ToastContainer position="top-right" autoClose={2000} />
      <h2>Welcome, Doctor 👨‍⚕️</h2>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <>
          {/* Notifications */}
          {notifications.length > 0 && (
            <div className="dashboard-section notifications">
              <h3>🔔 Notifications</h3>
              <ul>
                {notifications.map((n) => (
                  <li key={n._id} className={n.read ? "read" : "unread"}>
                    {n.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ✅ Updated Appointments Section */}
          <div className="dashboard-section">
            <h3>Your Appointments 📅</h3>
            {appointments.length === 0 ? (
              <p>No appointments yet.</p>
            ) : (
              <div className="appointment-grid">
                {appointments.map((a) => (
                  <div key={a._id} className={`appointment-card ${a.status}`}>
                    <p><b>Patient:</b> {a.patientId?.userId?.name}</p>
                    <p><b>Date:</b> {a.date}</p>
                    <p><b>Time:</b> {a.time}</p>
                    <span className={`status-badge ${a.status}`}>
                      {a.status.toUpperCase()}
                    </span>

                    {/* Pending → show action buttons */}
                    {a.status === "pending" && (
                      <div className="actions">
                        <button onClick={() => updateStatus(a._id, "confirmed")}>✅ Accept</button>
                        <button
                          className="reject-btn"
                          onClick={() => updateStatus(a._id, "cancelled")}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    )}

                    {/* Confirmed → inline prescription form */}
                    {a.status === "confirmed" && (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          setPrescription({
                            ...prescription,
                            appointmentId: a._id,
                          });
                          submitPrescription(e);
                        }}
                        className="inline-prescription-form"
                      >
                        <textarea
                          placeholder="Enter notes..."
                          name="notes"
                          value={
                            prescription.appointmentId === a._id
                              ? prescription.notes
                              : ""
                          }
                          onChange={(e) =>
                            setPrescription({
                              ...prescription,
                              notes: e.target.value,
                              appointmentId: a._id,
                            })
                          }
                          required
                        ></textarea>
                        <button type="submit">📄 Upload Prescription</button>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Availability Slots */}
          <div className="dashboard-section">
            <h3>Set Availability Slots 🕓</h3>
            <form onSubmit={addSlot} className="slot-form">
              <input
                type="date"
                name="date"
                value={newSlot.date}
                onChange={(e) =>
                  setNewSlot({ ...newSlot, [e.target.name]: e.target.value })
                }
                required
              />
              <input
                type="time"
                name="time"
                value={newSlot.time}
                onChange={(e) =>
                  setNewSlot({ ...newSlot, [e.target.name]: e.target.value })
                }
                required
              />
              <button type="submit">Add Slot</button>
            </form>

            {slots.length > 0 && (
              <ul className="slot-list">
                {slots.map((s) => (
                  <li key={s._id}>
                    {s.date} at {s.time}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Upload Prescription (global form, optional) */}
          <div className="dashboard-section">
            <h3>Upload Prescription 📜</h3>
            <form onSubmit={submitPrescription} className="prescription-form">
              <select
                name="appointmentId"
                value={prescription.appointmentId}
                onChange={(e) =>
                  setPrescription({ ...prescription, appointmentId: e.target.value })
                }
                required
              >
                <option value="">Select Appointment</option>
                {appointments
                  .filter((a) => a.status === "confirmed")
                  .map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.patientId?.userId?.name} — {a.date}
                    </option>
                  ))}
              </select>

              <h4>Medicines</h4>
              {prescription.medicines.map((m, i) => (
                <div key={i} className="medicine-row">
                  <input
                    name="name"
                    placeholder="Medicine name"
                    value={m.name}
                    onChange={(e) => handleMedicineChange(i, e)}
                    required
                  />
                  <input
                    name="dosage"
                    placeholder="Dosage"
                    value={m.dosage}
                    onChange={(e) => handleMedicineChange(i, e)}
                    required
                  />
                  <input
                    name="duration"
                    placeholder="Duration"
                    value={m.duration}
                    onChange={(e) => handleMedicineChange(i, e)}
                    required
                  />
                </div>
              ))}
              <button type="button" onClick={addMedicineRow} className="add-medicine-btn">
                ➕ Add Medicine
              </button>

              <textarea
                placeholder="Enter notes..."
                name="notes"
                value={prescription.notes}
                onChange={(e) =>
                  setPrescription({ ...prescription, [e.target.name]: e.target.value })
                }
                required
              ></textarea>

              <button type="submit">Submit Prescription</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default DoctorDashboard;
