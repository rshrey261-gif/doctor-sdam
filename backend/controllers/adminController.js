// controllers/adminController.js
import User from "../models/userModel.js";
import Doctor from "../models/doctorModel.js";
import Patient from "../models/patientModel.js";
import Appointment from "../models/appointmentModel.js";
import Review from "../models/reviewModel.js";

// -------------------------------
// Verify Admin Role Middleware (manual check)
// -------------------------------
const verifyAdmin = async (userId) => {
  const user = await User.findById(userId);
  return user && user.role === "admin";
};

// -------------------------------
// Get all users (doctors + patients)
// -------------------------------
export const getAllUsers = async (req, res) => {
  try {
    if (!(await verifyAdmin(req.user._id)))
      return res.status(403).json({ message: "Not authorized as admin" });

    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------------
// Get all appointments
// -------------------------------
export const getAllAppointments = async (req, res) => {
  try {
    if (!(await verifyAdmin(req.user._id)))
      return res.status(403).json({ message: "Not authorized as admin" });

    const appointments = await Appointment.find()
      .populate("doctorId")
      .populate("patientId");
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------------
// Delete a user (doctor/patient)
// -------------------------------
export const deleteUser = async (req, res) => {
  try {
    if (!(await verifyAdmin(req.user._id)))
      return res.status(403).json({ message: "Not authorized as admin" });

    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await User.findByIdAndDelete(id);

    // Cascade delete doctor/patient record if exists
    await Doctor.findOneAndDelete({ userId: id });
    await Patient.findOneAndDelete({ userId: id });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------------
// Dashboard Stats
// -------------------------------
export const getDashboardStats = async (req, res) => {
  try {
    if (!(await verifyAdmin(req.user._id)))
      return res.status(403).json({ message: "Not authorized as admin" });

    const doctorCount = await Doctor.countDocuments();
    const patientCount = await Patient.countDocuments();
    const appointmentCount = await Appointment.countDocuments();
    const reviewCount = await Review.countDocuments();

    res.json({
      doctorCount,
      patientCount,
      appointmentCount,
      reviewCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
