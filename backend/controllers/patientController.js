// controllers/patientController.js
import Patient from "../models/patientModel.js";
import User from "../models/userModel.js";

// @desc Register or update patient profile
// @route POST /api/patients/register
// @access Private (patient)
export const registerPatient = async (req, res) => {
  try {
    const { age, gender, medicalHistory } = req.body;

    const user = await User.findById(req.user._id);
    if (!user || user.role !== "patient") {
      return res.status(403).json({ message: "Not authorized as patient" });
    }

    let patient = await Patient.findOne({ userId: req.user._id });

    if (patient) {
      patient.age = age || patient.age;
      patient.gender = gender || patient.gender;
      patient.medicalHistory = medicalHistory || patient.medicalHistory;
      await patient.save();
      res.json({ message: "Patient profile updated", patient });
    } else {
      patient = await Patient.create({
        userId: req.user._id,
        age,
        gender,
        medicalHistory,
      });
      res.status(201).json({ message: "Patient profile created", patient });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get patient profile
// @route GET /api/patients/profile
// @access Private (patient)
export const getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) return res.status(404).json({ message: "Patient profile not found" });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
