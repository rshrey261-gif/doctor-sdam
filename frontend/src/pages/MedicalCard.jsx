import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import "./MedicalCard.css";

function MedicalCard() {
  const [medicalCard, setMedicalCard] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMedicalData = async () => {
      try {
        // Fetch patient medical card info
        const resCard = await axios.post("/medical/generate-card");
        // Fetch prescriptions linked to the patient
        const resPresc = await axios.get("/prescriptions/my");

        setMedicalCard(resCard.data);
        setPrescriptions(resPresc.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load medical data");
      } finally {
        setLoading(false);
      }
    };
    fetchMedicalData();
  }, []);

  if (loading)
    return (
      <div className="medical-card-page">
        <div className="medical-card-container">
          <p>Loading medical data...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="medical-card-page">
        <div className="medical-card-container">
          <p className="error">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="medical-card-page">
      <div className="medical-card-container">
        <h2>🩺 Your Medical Card</h2>

        {medicalCard ? (
          <div className="medical-info">
            <p><b>Card ID:</b> {medicalCard.id}</p>
            <p><b>Issued On:</b> {new Date(medicalCard.createdAt).toLocaleDateString()}</p>
          </div>
        ) : (
          <p>No medical card found.</p>
        )}

        <h3>📋 Medical History</h3>
        {medicalCard?.medicalHistory?.length > 0 ? (
          <ul className="history-list">
            {medicalCard.medicalHistory.map((entry, index) => (
              <li key={index}>
                <b>{entry.condition}</b> — {entry.treatment} ({entry.date})
              </li>
            ))}
          </ul>
        ) : (
          <p>No previous history found.</p>
        )}

        <h3>💊 Prescriptions</h3>
        {prescriptions.length === 0 ? (
          <p>No prescriptions yet.</p>
        ) : (
          <div className="prescription-grid">
            {prescriptions.map((p) => (
              <div key={p._id} className="prescription-card">
                <p><b>Doctor:</b> {p.doctorId?.userId?.name}</p>
                <p><b>Date:</b> {new Date(p.createdAt).toLocaleDateString()}</p>
                <a href={p.pdfLink} target="_blank" rel="noreferrer" className="download-btn">
                  Download Prescription
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MedicalCard;
