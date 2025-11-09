// controllers/medicalController.js
import Patient from "../models/patientModel.js";
import Doctor from "../models/doctorModel.js";
import Appointment from "../models/appointmentModel.js";
import { randomBytes } from "crypto";

// ------------------------------------------
// Generate Medical Card (once per patient)
// ------------------------------------------
export const generateMedicalCard = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient)
      return res.status(403).json({ message: "Not authorized as patient" });

    if (patient.medicalCardId)
      return res.json({ message: "Medical Card already exists", id: patient.medicalCardId });

    const cardId = "MC-" + randomBytes(4).toString("hex").toUpperCase();
    patient.medicalCardId = cardId;
    await patient.save();

    res.status(201).json({ message: "Medical Card created", id: cardId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------------------------------
// Patient updates their medical history
// ------------------------------------------
export const updateMedicalHistory = async (req, res) => {
  try {
    const { condition, treatment, date } = req.body;
    const patient = await Patient.findOne({ userId: req.user._id });

    if (!patient)
      return res.status(403).json({ message: "Not authorized as patient" });

    patient.medicalHistory.push({ condition, treatment, date });
    await patient.save();

    res.json({ message: "Medical history updated", medicalHistory: patient.medicalHistory });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------------------------------
// Doctor views a patient's medical history
// ------------------------------------------
export const viewPatientHistory = async (req, res) => {
  try {
    const { patientId } = req.params;

    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor)
      return res.status(403).json({ message: "Not authorized as doctor" });

    // Only allow if doctor has appointment with patient
    const hasAppointment = await Appointment.findOne({
      doctorId: doctor._id,
      patientId,
      status: { $in: ["confirmed", "completed"] },
    });

    if (!hasAppointment)
      return res.status(403).json({
        message: "Access denied. You don't have any appointment with this patient.",
      });

    const patient = await Patient.findById(patientId).populate("userId", "name email");
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    res.json({
      patient: {
        name: patient.userId.name,
        email: patient.userId.email,
        medicalCardId: patient.medicalCardId,
        medicalHistory: patient.medicalHistory,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
