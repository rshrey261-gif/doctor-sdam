import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import "./Dashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res1 = await axios.get("/admin/stats");
        const res2 = await axios.get("/admin/users");
        setStats(res1.data);
        setUsers(res2.data);
      } catch (err) {
        console.error("Error loading admin data", err);
      }
    };
    fetchAdminData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await axios.delete(`/admin/user/${id}`);
    setUsers(users.filter((u) => u._id !== id));
  };

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard 🛡️</h2>
      <div className="dashboard-section">
        <h3>System Stats</h3>
        <p>Doctors: {stats.doctorCount}</p>
        <p>Patients: {stats.patientCount}</p>
        <p>Appointments: {stats.appointmentCount}</p>
        <p>Reviews: {stats.reviewCount}</p>
      </div>

      <div className="dashboard-section">
        <h3>All Users</h3>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <ul>
            {users.map((u) => (
              <li key={u._id}>
                {u.name} — {u.role}
                <button onClick={() => handleDelete(u._id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
